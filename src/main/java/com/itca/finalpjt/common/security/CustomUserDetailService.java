package com.itca.finalpjt.common.security;

import com.itca.finalpjt.domain.account.repository.MemberRepository;
import com.itca.finalpjt.ssonets.NetsCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws AuthenticationException {
        var member = memberRepository.findByMemberId(username)
                .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 아이디입니다. exception : " + username));

        if (!member.isUseYn()) {
            throw new DisabledException("계정 사용이 중지 되었습니다. 관리자에 확인 바랍니다.");
        }

        if (member.isLockYn()) {
            throw new LockedException("오랫 동안 사용하지 않은 계정이 사용 중지 되었습니다. 관리자에게 문의 바랍니다.");
        }

        return new NetsCredentials(member.getMemberId(), member.getPassword(), member.getEmail(),
                member.getMemberName(),
                member.getMemberCnName(), member.getMemberEnName(),
                member.getCompanyCode(), member.getCompanyKrName(), member.getCompanyCnName(),
                member.getCompanyEnName(), member.getDivisionKrName(), member.getDivisionCnName(),
                member.getDivisionEnName(), member.getPosition(), member.getPhotoFile(),
                true, true, true, member.getCodeMemberType(), member.getCodeLanguage(), member.getTimeZone());
    }
}
