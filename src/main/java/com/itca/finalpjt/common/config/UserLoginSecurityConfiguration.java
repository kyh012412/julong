package com.itca.finalpjt.common.config;

import com.itca.finalpjt.common.security.CustomUserDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.http.Cookie;

@Slf4j
@Configuration
@Order(2)
@EnableWebSecurity
public class UserLoginSecurityConfiguration extends SpringSecurityConfiguration {


    private final CustomUserDetailService userDetailService;

    public UserLoginSecurityConfiguration(ApplicationContext context, CustomUserDetailService userDetailService) {
        super(context, userDetailService);
        this.userDetailService = userDetailService;
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailService).passwordEncoder(passwordEncoder())
        ;
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web
                .ignoring()
                .antMatchers("/assets/**", "/css/**", "/favicon/**", "/fonts/**", "/images/**", "/js/**", "/lib/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        .headers()
        .contentSecurityPolicy(
            "default-src 'self' 'unsafe-inline'; "
            + "script-src 'self' *.xtrmsales.com 10.11.3.126:8081 *.highcharts.com *.cloudflare.com 'unsafe-inline' 'unsafe-eval'; "
            + "object-src 'none'; "
            + "base-uri 'none'; "
            + "img-src img.stibee.com 'self' data:; "
            + "connect-src *; "
            );

        http
                .csrf().disable()
                .cors().disable()
                .antMatcher("/**")
                .authorizeRequests()
                .antMatchers("/logonService", "/logoffService").permitAll()
                .antMatchers("/price/**").permitAll()
                .antMatchers("/css/**", "/assets/**", "/favicon/**", "/fonts/**", "/images/**", "/js/**", "/lib/**", "/favicon.ico").permitAll()
                .antMatchers("/sso/**").permitAll()
                .antMatchers("/api/search/analysis/personal/**").permitAll()
                .antMatchers("/api/voc/**").permitAll()
                .antMatchers("/account/**", "/member/**", "/api/member/**").permitAll()
                .antMatchers("/api/newsletter/board-download").permitAll() //파일다운로드는 권한없이 접근 가능
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/account/login")
                .loginProcessingUrl("/account/loginProcess")
                .failureUrl("/account/error?error=true")
                .defaultSuccessUrl("/collecting/dashboard")
                .successHandler(customLoginSuccessHandler())
                .failureHandler(customLoginFailureHandler())
                .permitAll()
                .and()
                .rememberMe()
                .key("rememberKey")
                .tokenValiditySeconds(2419200)
                .and()
                .logout()
                .logoutUrl("/account/logout")
                .logoutRequestMatcher(new AntPathRequestMatcher("/account/logout"))
                .addLogoutHandler((request, response, auth) -> {
                    for (Cookie cookie : request.getCookies()) {
                        String cookieName = cookie.getName();
                        Cookie cookieToDelete = new Cookie(cookieName, null);
                        cookieToDelete.setMaxAge(0);
                        response.addCookie(cookieToDelete);
                    }
                })
                .logoutSuccessHandler(customLogoutSuccessHandler())
                .invalidateHttpSession(true).deleteCookies("JSESSIONID")
               // .deleteCookies("JSESSIONID")
                .and()
                .exceptionHandling().accessDeniedHandler(accessDeniedHandler())

        ;

        http.sessionManagement()
                .maximumSessions(43200)
                //.expiredUrl("/account/error?error=false");
		.expiredUrl("/account/ssonewsign?error=false");
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        log.info("ABCDEFG   DaoAuthenticationProvider 1");
        var authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        log.info("ABCDEFG   DaoAuthenticationProvider 2");
        return authenticationProvider;
    }

}