package com.itca.finalpjt.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final CustomUserDetailService userDetailService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        var username = (String) authentication.getPrincipal();

        var netsCredentials = userDetailService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(netsCredentials, netsCredentials, netsCredentials.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
