package com.itca.finalpjt.domain.account.service;

import com.itca.finalpjt.common.util.common.FileUploader;
import com.itca.finalpjt.domain.account.dto.MemberRequest;
import com.itca.finalpjt.domain.account.dto.MemberResponse;
import com.itca.finalpjt.domain.account.dto.MyInfoRequest;
import com.itca.finalpjt.domain.account.dto.UpPassword;
import com.itca.finalpjt.domain.account.entity.Member;
import com.itca.finalpjt.domain.account.exception.UserAlreadyExistException;
import com.itca.finalpjt.domain.account.exception.UserNotFoundException;
import com.itca.finalpjt.domain.account.repository.MemberQueryRepository;
import com.itca.finalpjt.domain.account.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final MemberQueryRepository memberQueryRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FileUploader fileUploader;
    public static final String INQUIRYRIGHTKEYWORD = "inquiryRightKeyword";
    public static final String INQUIRYRIGHTPU = "inquiryRightPu";

    @Transactional
    public Member signUp(MemberRequest request) {
        boolean result = memberRepository.existsByMemberId(request.getMemberId());
        if (result) {
            throw new UserAlreadyExistException("사용 불가능한 아이디입니다. : " + request.getMemberId());
        }
        var member = memberQueryRepository.signUp(request);
        if (member == null) {
            throw new IllegalArgumentException("회원가입을 실패했습니다.");
        }
        return member;
    }

    @Transactional
    public Member updateLastLoginDatetimeAndLanguage(String memberId, String language) {
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new UserNotFoundException("회원 정보를 다시 확인해주세요."));

        if (Objects.nonNull(language) && !language.isBlank()) {
            member.updateCodeLanguage(language);
        }
        return memberQueryRepository.updateLastLoginDatetime(member);
    }

    /*************************************
     * 회원정보 조회
     */
    public Optional<Member> readByMemberId(String memberId) {
        return memberRepository.findByMemberId(memberId);
    }

    public MemberResponse getResponseByMemberId(String memberId) {
        return new MemberResponse(memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new UserNotFoundException("회원 정보를 다시 확인해주세요.")));
    }

    /*************************************
     * 내정보 수정
     */
    public Map<String, Object> readMyInfo(String memberId) {
        var myInfoRequest = memberQueryRepository.readMyInfo(memberId)
                .orElseThrow(() -> new UserNotFoundException("회원 정보를 다시 확인해주세요."));
        var languageList = memberQueryRepository.readLanguageList();

        // timezone 1
        var timezoneList_1 = memberQueryRepository.readTimezoneList_1();
        var timezoneList_2 = memberQueryRepository.readTimezoneList_2();

        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put("myInfo", myInfoRequest);
        returnMap.put("languageList", languageList);
        returnMap.put("timezoneList_1", timezoneList_1);
        returnMap.put("timezoneList_2", timezoneList_2);
        return returnMap;
    }

    @Transactional
    public void updateMyinfo(MyInfoRequest request, MultipartFile file, String memberId) {
        if (!request.getNewPassword().isBlank())
            updatePassword(request);
        if (nonNull(file) && file.getSize() != 0) {
            updateProfilePhoto(request.getMemberKey(), file);
        }
        boolean updateResult = memberQueryRepository.updateMyInfo(request, memberId);
        if (!updateResult) {
            throw new IllegalArgumentException("변경사항을 저장하는데 실패했습니다.");
        }
    }

    @Transactional
    public String excelUpload(MultipartFile file) {
        String changeFilename = "";
        if (nonNull(file) && file.getSize() != 0) {
            changeFilename = userexcelFile(file);
        } else {
            throw new IllegalArgumentException("첨부파일 추가해 주시기 바랍니다.");
        }

        return changeFilename;
    }

    public boolean chkPassword(MyInfoRequest request) {
        if (!"".equals(request.getNewPassword())) {
            if (request.getPassword().isBlank())
                return false;
        }

        if ("".equals(request.getPassword())) {
            return true;
        }

        String oriPassword = request.getPassword().trim();

        MyInfoRequest myInfoPassword = memberQueryRepository.readPassword(request.getMemberKey());
        if (!bCryptPasswordEncoder.matches(oriPassword, myInfoPassword.getPassword())) {
            return false;
        }

        return true;
    }

    private void updatePassword(MyInfoRequest request) {
        if (request.getPassword().isBlank() || request.getNewPassword().isBlank())
            return;

        String oriPassword = request.getPassword().trim();
        String newPassword = request.getNewPassword().trim();

        MyInfoRequest myInfoPassword = memberQueryRepository.readPassword(request.getMemberKey());
        if (!bCryptPasswordEncoder.matches(oriPassword, myInfoPassword.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }
        if (bCryptPasswordEncoder.matches(newPassword, myInfoPassword.getPassword())) {
            throw new IllegalArgumentException("새로운 비밀번호는 기존 비밀번호와 일치하지 않아야 합니다.");
        }

        boolean updateResult = memberQueryRepository.updatePassword(newPassword, request.getMemberKey());
        if (!updateResult) {
            throw new IllegalArgumentException("변경사항을 저장하는데 실패했습니다.");
        }
    }

    private void updateProfilePhoto(int memberKey, MultipartFile file) {
        String changeFilename = fileUploader.userUploadFile(memberKey, file);
        boolean updateResult = memberQueryRepository.updateProfilePhoto(changeFilename, memberKey);
        if (!updateResult) {
            throw new IllegalArgumentException("파일을 업로드하는데 실패했습니다.");
        }
    }

    private String userexcelFile(MultipartFile file) {
        String changeFilename = fileUploader.userexcelFile(file);
        return changeFilename;
    }

    public List<Member> passwordChk(int memberkey) {
        List<Member> member = memberQueryRepository.passwordChk(memberkey);
        return member;
    }

    @Transactional
    public boolean updatePasswordto(UpPassword upPassword) {

        int memchk = upPassword.getMemberkey();
        String oriPassword = upPassword.getOriginpw();

        List<Member> pwdaychk = passwordChk(memchk);

        if (!bCryptPasswordEncoder.matches(oriPassword, pwdaychk.get(0).getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }

        if (bCryptPasswordEncoder.matches(upPassword.getNewpw(), pwdaychk.get(0).getPassword())) {
            throw new IllegalArgumentException("새로운 비밀번호는 기존 비밀번호와 일치하지 않아야 합니다.");
        }
        boolean member = memberQueryRepository.updatePasswordto(upPassword);

        return member;
    }
}
