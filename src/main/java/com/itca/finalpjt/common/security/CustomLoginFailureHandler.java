package com.itca.finalpjt.common.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Log4j2
@RequiredArgsConstructor
public class CustomLoginFailureHandler implements AuthenticationFailureHandler {
    private static final String ACCOUNT_PERMISSION_URL = "/account/permission";

    private final MessageSource messageSource;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException auth) throws IOException, ServletException {

        String errorMsg = null;
        var locale = LocaleContextHolder.getLocale();


        if (auth instanceof BadCredentialsException) {
            errorMsg = messageSource.getMessage("error.BadCredentials", null, locale);
            loginFailRedirect(request, response, "/account/login", errorMsg);
        } else if (auth instanceof InternalAuthenticationServiceException) {
            errorMsg = messageSource.getMessage("error.BadCredentialsId", null, locale);
            // 시스템 문제로 내부 인증 관련 처리 요청을 할 수 없는 경우
            loginFailRedirect(request, response, "/account/error", errorMsg);
        } else if (auth instanceof DisabledException) {
            errorMsg = messageSource.getMessage("error.Disabled", null, locale);
            // 인증 거부 : 계정 비활성화
            loginFailRedirect(request, response, ACCOUNT_PERMISSION_URL, errorMsg);
        } else if (auth instanceof CredentialsExpiredException) {
            errorMsg = messageSource.getMessage("error.CredentialsExpired", null, locale);
            // 인증 거부 : 비밀번호 유효 기간 만료
            loginFailRedirect(request, response, ACCOUNT_PERMISSION_URL, errorMsg);
        } else if (auth instanceof AccountExpiredException) {
            errorMsg = messageSource.getMessage("error.AccountExpired", null, locale);
            // 인증 거부 : 잠긴 계정일 경우
            loginFailRedirect(request, response, ACCOUNT_PERMISSION_URL, errorMsg);
        } else if (auth instanceof LockedException) {
            errorMsg = messageSource.getMessage("error.Locked", null, locale);
            // 인증 거부 : 비밀번호 유효 기간 만료
            loginFailRedirect(request, response, ACCOUNT_PERMISSION_URL, errorMsg);
        } else if (auth instanceof AuthenticationServiceException) {
            errorMsg = messageSource.getMessage("error.AuthenticationService", null, locale);
            // 인증 거부 : 비밀번호 유효 기간 만료
            loginFailRedirect(request, response, ACCOUNT_PERMISSION_URL, errorMsg);
        }
    }

    private void loginFailRedirect(HttpServletRequest request, HttpServletResponse response,
                                   String location, String errorMsg) throws IOException {
        log.info(request.getParameter("memberId") + " - " + errorMsg);

        request.getSession().setAttribute("errMsg", errorMsg);
        response.sendRedirect(location);
    }
}
