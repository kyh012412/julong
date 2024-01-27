package com.itca.finalpjt.common.config;

import com.itca.finalpjt.common.security.*;
import com.itca.finalpjt.domain.account.service.MemberService;
import com.itca.finalpjt.domain.admin.service.ProgramMngService;
import com.itca.finalpjt.domain.admin.service.UserdataAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.thymeleaf.extras.springsecurity5.dialect.SpringSecurityDialect;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {
    private final ApplicationContext context;
    private final CustomUserDetailService userDetailService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

    @Bean
    public AuthenticationSuccessHandler customLoginSuccessHandler() {
        return new CustomLoginSuccessHandler(
                context.getBean(MemberService.class), context.getBean(UserdataAuthService.class),
                context.getBean(ProgramMngService.class));
    }

    @Bean
    public AuthenticationFailureHandler customLoginFailureHandler() {
        return new CustomLoginFailureHandler(context.getBean(MessageSource.class));
    }

    @Bean
    public CustomLogoutSuccessHandler customLogoutSuccessHandler() {
        return new CustomLogoutSuccessHandler();
    }

    @Bean
    public SpringSecurityDialect springSecurityDialect() {
        return new SpringSecurityDialect();
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setDefaultEncoding("UTF-8"); // 파일 인코딩 설정
        multipartResolver.setMaxUploadSizePerFile(100 * 1024 * 1024); // 파일당 업로드 크기 제한 (100MB)
        return multipartResolver;
    }
}
