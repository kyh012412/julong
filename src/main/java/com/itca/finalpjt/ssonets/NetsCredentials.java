package com.itca.finalpjt.ssonets;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toList;

@Getter
@EqualsAndHashCode(callSuper = true)
public class NetsCredentials extends User {
    private static final long serialVersionUID = 4137563285037683312L;
    private static final String ROLE_PREFIX = "ROLE_";

    private final String email;
    private final String memberName;
    private final String memberCnName;
    private final String memberEnName;
    private final String company;
    private final String companyKrName;
    private final String companyCnName;
    private final String companyEnName;
    private final String divisionKrName;
    private final String divisionCnName;
    private final String divisionEnName;
    private final String position;
    private final String photoFile;
    private final String codeLanguage;
    private final String timeZone;
    private final String codeMemberType;

    public NetsCredentials(String username, String password, String email, String memberName, String memberCnName,
                           String memberEnName,
                           String company, String companyKrName, String companyCnName, String companyEnName, String divisionKrName,
                           String divisionCnName, String divisionEnName, String position, String photoFile, boolean useYn,
                           boolean accountNonExpired, boolean credentialsExpired, String codeMemberType, String codeLanguage,
                           String timeZone) {
        super(username, password, useYn, accountNonExpired, credentialsExpired, accountNonExpired,
                getAuthorities(codeMemberType));
        this.email = email;
        this.memberName = memberName;

        if (memberCnName == null || "".equals(memberCnName))
            this.memberCnName = memberName;
        else
            this.memberCnName = memberCnName;
        if (memberEnName == null || "".equals(memberEnName))
            this.memberEnName = memberName;
        else
            this.memberEnName = memberEnName;
        this.company = company;
        this.companyKrName = companyKrName;
        if (companyCnName == null || "".equals(companyCnName))
            this.companyCnName = companyKrName;
        else
            this.companyCnName = companyCnName;
        if (companyEnName == null || "".equals(companyEnName))
            this.companyEnName = companyKrName;
        else
            this.companyEnName = companyEnName;
        this.divisionKrName = divisionKrName;
        if (divisionCnName == null || "".equals(divisionCnName))
            this.divisionCnName = divisionKrName;
        else
            this.divisionCnName = divisionCnName;
        if (divisionEnName == null || "".equals(divisionEnName))
            this.divisionEnName = divisionKrName;
        else
            this.divisionEnName = divisionEnName;
        this.position = position;
        this.photoFile = nonNull(photoFile) ? photoFile : "";
        this.codeLanguage = codeLanguage;
        this.timeZone = timeZone;
        this.codeMemberType = codeMemberType;
    }

    private static Collection<? extends GrantedAuthority> getAuthorities(String codeMemberType) {
        return getGrantedAuthorities(getRoles(codeMemberType));
    }

    private static List<GrantedAuthority> getGrantedAuthorities(List<String> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role))
                .collect(toList());
    }

    private static List<String> getRoles(String codeMemberType) {
        List<String> roles = new ArrayList<>();
        roles.add(codeMemberType);
        return roles;
    }

}
