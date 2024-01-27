package com.itca.finalpjt.common.security;

import com.itca.finalpjt.domain.account.exception.RoleNotFoundException;
import com.itca.finalpjt.domain.commoncode.entity.CommonCode;
import com.itca.finalpjt.domain.commoncode.repository.CommonCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
@RequiredArgsConstructor
public class CustomAuthorizationChecker {
    private final CommonCodeRepository commonCodeRepository;
    private final static String ROLE_TYPE_CODE_NO = "X008";
    private final static String ROLE_PREFIX = "ROLE_";
    private final static String ROLE_PREFIX_BLANK = "";

    /**
     * 해당 URL 에 대한 권한이 있는지 체크
     *
     * @param request        // session
     * @param authentication // 인증 권한
     * @return boolean
     */
    public boolean check(HttpServletRequest request, Authentication authentication) {
        Object principal = authentication.getPrincipal();
        System.out.println(request.getRequestURI());
        if (!(principal instanceof User)) {

//            if (new AntPathMatcher().match("/account/**", request.getRequestURI()))
//                return true;
//            else
//                return false;

            return true;
        }
        User user = (User) authentication.getPrincipal();
        for (GrantedAuthority authority : user.getAuthorities()) {
            String _role = authority.getAuthority().replace(ROLE_PREFIX, ROLE_PREFIX_BLANK).trim();
            CommonCode commonCode = commonCodeRepository.findByCodeNoAndCodeAndUseYnTrue(ROLE_TYPE_CODE_NO, _role)
                    .orElseThrow(() -> new RoleNotFoundException("존재하지 않는 권한입니다."));
        }
        return true;
    }
}
