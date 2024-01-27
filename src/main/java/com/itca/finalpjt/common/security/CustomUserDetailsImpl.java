package com.itca.finalpjt.common.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


public class CustomUserDetailsImpl extends User {
    private static final String ROLE_PREFIX = "ROLE_";

    public CustomUserDetailsImpl(String memberId, String password, boolean useYn, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLooked, String codeMemberType) {
        super(memberId, password, useYn, accountNonExpired, credentialsNonExpired, accountNonLooked, getAuthorities(codeMemberType));
    }

    private static Collection<? extends GrantedAuthority> getAuthorities(String codeMemberType) {
        return getGrantedAuthorities(getRoles(codeMemberType));
    }

    private static List<GrantedAuthority> getGrantedAuthorities(List<String> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role))
                .collect(Collectors.toList());
    }

    private static List<String> getRoles(String codeMemberType) {
        List<String> roles = new ArrayList<>();
        roles.add(codeMemberType);
        return roles;
    }

}
