package com.itca.finalpjt.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
public class CustomLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (authentication != null && authentication.getDetails() != null) {
            request.getSession().invalidate();
        }
        response.setStatus(HttpServletResponse.SC_OK);
        response.sendRedirect("/account/sessionOut");
        super.onLogoutSuccess(request, response, authentication);
    }
}
