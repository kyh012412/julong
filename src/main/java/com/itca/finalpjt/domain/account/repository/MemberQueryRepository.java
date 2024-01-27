package com.itca.finalpjt.domain.account.repository;

import com.itca.finalpjt.domain.account.dto.MemberRequest;
import com.itca.finalpjt.domain.account.dto.MyInfoRequest;
import com.itca.finalpjt.domain.account.dto.UpPassword;
import com.itca.finalpjt.domain.account.entity.Member;
import com.itca.finalpjt.domain.account.entity.QMember;

import com.itca.finalpjt.domain.admin.entity.QUserdataAuth;
import com.itca.finalpjt.domain.commoncode.dto.CommonCodeResponse;
import com.itca.finalpjt.domain.commoncode.entity.QCommonCode;
import com.itca.finalpjt.domain.commoncode.enums.CodeLanguage;
import com.itca.finalpjt.domain.commoncode.enums.CodeMemberType;
import com.itca.finalpjt.domain.commoncode.enums.CodeSso;
import com.itca.finalpjt.domain.commoncode.enums.CommonCodeType;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MemberQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Value("${file.upload.path.profile}")
    private String fileUploadPathProfile;

    public Member signUp(MemberRequest request) {
        Member member = Member.builder()
                .memberId(request.getMemberId().trim())
                .password(passwordEncoder(request.getPassword().trim()))
                .codeMemberType(CodeMemberType.NEWBIE.code()) // 신규가입 회원구분코드: NEWBIE, 관리자가 권한부여해줘야 이용가능
                .memberName(request.getMemberName().trim())
                .email(request.getEmail().trim())
                .phoneNo(request.getPhoneNo().trim())
                .telNo("")
                .companyCode("")
                .divisionCode("")
                .divisionKrName("")
                .position("")
                .job("")
                .rank("")
                .employeeNo("")
                .createId(request.getMemberId().trim())
                .updateId(request.getMemberId().trim())
                .codeSso(CodeSso.NONE.code())
                .photoPath("")
                .photoFile("")
                .useYn(true)
                .lockYn(false)
                .codeLanguage(CodeLanguage.KO.code())
                .build();
        return memberRepository.saveAndFlush(member);
    }

    private String passwordEncoder(String password) {
        return bCryptPasswordEncoder.encode(password);
    }

    public Member updateLastLoginDatetime(Member member) {
        member.updateLastLoginDatetime(LocalDateTime.now());
        return memberRepository.saveAndFlush(member);
    }

    /****************************************
     * 내정보 수정
     */
    public List<CommonCodeResponse> readLanguageList() {
        QCommonCode commonCode = new QCommonCode("commonCode");
        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class, commonCode.code, commonCode.codeName,
                        commonCode.refTxt02))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.LANGUAGE.codeNo())
                        .and(commonCode.code.gt("$"))
                        .and(commonCode.useYn.eq(true))
                        .and(commonCode.refTxt01.eq("1")))
                .orderBy(commonCode.codeName.asc())
                .fetch();
    }

    // Timezone
    public List<CommonCodeResponse> readTimezoneList_1() {
        QCommonCode commonCode = new QCommonCode("commonCode");
        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class, commonCode.refTxt02.as("code"),
                        commonCode.refTxt02.as("codeName")))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.TIMEZONE.codeNo())
                        .and(commonCode.code.gt("$"))
                        .and(commonCode.useYn.eq(true)))
                .groupBy(commonCode.refTxt02)
                .orderBy(commonCode.refTxt02.asc())
                .fetch();
    }

    public List<CommonCodeResponse> readTimezoneList_2() {
        QCommonCode commonCode = new QCommonCode("commonCode");
        return jpaQueryFactory
                .select(Projections.fields(CommonCodeResponse.class, commonCode.code, commonCode.codeName,
                        commonCode.refTxt02,
                        commonCode.refTxt02.concat("|").concat(commonCode.codeName).as("codeNameT")))
                .from(commonCode)
                .where(commonCode.codeNo.eq(CommonCodeType.TIMEZONE.codeNo())
                        .and(commonCode.code.gt("$"))
                        .and(commonCode.useYn.eq(true)))
                .orderBy(commonCode.codeName.asc())
                .fetch();
    }

    public Optional<MyInfoRequest> readMyInfo(String memberId) {
        QMember member = QMember.member;
        QUserdataAuth userdataAuth = QUserdataAuth.userdataAuth;

        return Optional.ofNullable(jpaQueryFactory
                .select(Projections
                        .fields(MyInfoRequest.class, member.memberKey, member.memberId,
                                member.employeeNo.coalesce("").as("employeeNo"),
                                member.codeLanguage.coalesce("").as("codeLanguage"),
                                member.memberName.coalesce("").as("memberName"), new CaseBuilder()
                                        .when(member.memberCnName.coalesce("").eq(""))
                                        .then(member.memberName.coalesce(""))
                                        .otherwise(member.memberCnName).as("memberCnName"),
                                new CaseBuilder()
                                        .when(member.memberEnName.coalesce("").eq(""))
                                        .then(member.memberName.coalesce(""))
                                        .otherwise(member.memberEnName).as("memberEnName"),
                                member.telNo.coalesce("").as("telNo"), member.phoneNo.coalesce("").as("phoneNo"),
                                member.email.coalesce("").as("email"), member.codeLanguage, member.divisionCode,
                                member.divisionKrName.coalesce("").as("divisionKrName"), new CaseBuilder()
                                        .when(member.divisionCnName.coalesce("").eq(""))
                                        .then(member.divisionKrName.coalesce(""))
                                        .otherwise(member.divisionCnName).as("divisionCnName"),
                                new CaseBuilder()
                                        .when(member.divisionEnName.coalesce("").eq(""))
                                        .then(member.divisionKrName.coalesce(""))
                                        .otherwise(member.divisionEnName).as("divisionEnName"),
                                member.companyKrName.coalesce("").as("companyKrName"), member.companyCode,
                                new CaseBuilder()
                                        .when(member.companyCnName.coalesce("").eq(""))
                                        .then(member.companyKrName.coalesce(""))
                                        .otherwise(member.companyCnName).as("companyCnName"),
                                new CaseBuilder()
                                        .when(member.companyEnName.coalesce("").eq(""))
                                        .then(member.companyKrName.coalesce(""))
                                        .otherwise(member.companyEnName).as("companyEnName"),
                                member.photoPath, member.photoFile, member.timeZone.coalesce("").as("timeZone"),
                                member.codeMemberType
                                // , roleTypemng.codeMemberType
                                , userdataAuth.memberinquiryright.coalesce("").as("memberinquiryright"),
                                userdataAuth.memberpuinquiryright.coalesce("").as("memberpuinquiryright")
                        /*
                         * , pukeywordMng01.pukeyword.coalesce("").as("pukeyword01")
                         * , pukeywordMng02.pukeyword.coalesce("").as("pukeyword02")
                         * , pukeywordMng03.pukeyword.coalesce("").as("pukeyword03")
                         * , pukeywordMng04.pukeyword.coalesce("").as("pukeyword04")
                         * 
                         */

                        ))
                .from(member)
                // .leftJoin(roleTypemng).on(member.memberKey.eq(roleTypemng.memberKey))
                .leftJoin(userdataAuth).on(member.memberKey.eq(userdataAuth.memberKey))
                /*
                 * .leftJoin(pukeywordMng01).on(
                 * member.puCode.eq(pukeywordMng01.pucode)
                 * .and(pukeywordMng01.pukeywordcode.eq("01"))
                 * )
                 * .leftJoin(pukeywordMng02).on(
                 * member.puCode.eq(pukeywordMng02.pucode)
                 * .and(pukeywordMng02.pukeywordcode.eq("02"))
                 * )
                 * .leftJoin(pukeywordMng03).on(
                 * member.puCode.eq(pukeywordMng03.pucode)
                 * .and(pukeywordMng03.pukeywordcode.eq("03"))
                 * )
                 * .leftJoin(pukeywordMng04).on(
                 * member.puCode.eq(pukeywordMng04.pucode)
                 * .and(pukeywordMng04.pukeywordcode.eq("04"))
                 * )
                 * 
                 */
                .where(member.memberId.eq(memberId)
                        .and(member.useYn.eq(true))
                        .and(member.lockYn.eq(false)))
                .fetchOne());
    }

    public MyInfoRequest readPassword(int memberKey) {
        QMember member = QMember.member;
        return jpaQueryFactory
                .select(Projections.fields(MyInfoRequest.class, member.password))
                .from(member)
                .where(member.memberKey.eq(memberKey)
                        .and(member.useYn.eq(true))
                        .and(member.lockYn.eq(false)))
                .fetchOne();
    }

    public boolean updatePassword(String newPassword, int memberKey) {
        QMember member = QMember.member;
        return jpaQueryFactory
                .update(member)
                .set(member.password, passwordEncoder(newPassword))
                .where(member.memberKey.eq(memberKey)
                        .and(member.useYn.eq(true))
                        .and(member.lockYn.eq(false)))
                .execute() > 0;
    }

    public boolean updatePasswordto(UpPassword upPassword) {
        QMember member = QMember.member;
        return jpaQueryFactory
                .update(member)
                .set(member.password, passwordEncoder(upPassword.getNewpw()))
                .set(member.pwdupdatedatetime, LocalDateTime.now())
                .where(member.memberKey.eq(upPassword.getMemberkey()))
                .execute() > 0;
    }

    public boolean updateMyInfo(MyInfoRequest request, String memberId) {
        QMember member = QMember.member;

        if (request.getCodeLanguage().equals("KO")) {
            return jpaQueryFactory
                    .update(member)
                    .set(member.telNo, request.getTelNo().trim())
                    .set(member.phoneNo, request.getPhoneNo().trim())
                    // .set(member.email, request.getEmail())
                    // .set(member.divisionKrName, request.getDivisionName().trim())
                    .set(member.codeLanguage, request.getCodeLanguage())
                    .set(member.updateId, memberId)
                    .set(member.updateDatetime, LocalDateTime.now())
                    .set(member.timeZone, request.getTimeZone())
                    .where(member.memberKey.eq(request.getMemberKey())
                            .and(member.useYn.eq(true))
                            .and(member.lockYn.eq(false)))
                    .execute() > 0;
        } else if (request.getCodeLanguage().equals("ZH")) {
            return jpaQueryFactory
                    .update(member)
                    .set(member.telNo, request.getTelNo().trim())
                    .set(member.phoneNo, request.getPhoneNo().trim())
                    // .set(member.email, request.getEmail())
                    // .set(member.divisionCnName, request.getDivisionName().trim())
                    .set(member.codeLanguage, request.getCodeLanguage())
                    .set(member.updateId, memberId)
                    .set(member.updateDatetime, LocalDateTime.now())
                    .set(member.timeZone, request.getTimeZone())
                    .where(member.memberKey.eq(request.getMemberKey())
                            .and(member.useYn.eq(true))
                            .and(member.lockYn.eq(false)))
                    .execute() > 0;
        } else if (request.getCodeLanguage().equals("EN")) {
            return jpaQueryFactory
                    .update(member)
                    .set(member.telNo, request.getTelNo().trim())
                    .set(member.phoneNo, request.getPhoneNo().trim())
                    // .set(member.email, request.getEmail())
                    // .set(member.divisionEnName, request.getDivisionName().trim())
                    .set(member.codeLanguage, request.getCodeLanguage())
                    .set(member.updateId, memberId)
                    .set(member.updateDatetime, LocalDateTime.now())
                    .set(member.timeZone, request.getTimeZone())
                    .where(member.memberKey.eq(request.getMemberKey())
                            .and(member.useYn.eq(true))
                            .and(member.lockYn.eq(false)))
                    .execute() > 0;
        } else
            return false;
    }

    public boolean updateProfilePhoto(String uploadFileName, int memberKey) {
        QMember member = QMember.member;
        return jpaQueryFactory
                .update(member)
                .set(member.photoFile, uploadFileName)
                .set(member.photoPath, fileUploadPathProfile)
                .where(member.memberKey.eq(memberKey)
                // .and(member.useYn.eq(true))
                // .and(member.lockYn.eq(false))
                )
                .execute() > 0;
    }

    // 맴버테이블 조회 스케줄러용
    public List<Member> passwordChk(int memberKey) {
        QMember member = new QMember("member1");
        return jpaQueryFactory
                .select(Projections.fields(Member.class, member.memberKey, member.memberId, member.password,
                        member.codeMemberType, member.useYn, member.lockYn, member.pwdupdatedatetime))
                .from(member)
                .where(member.memberKey.eq(memberKey))
                .fetch();
    }
}
