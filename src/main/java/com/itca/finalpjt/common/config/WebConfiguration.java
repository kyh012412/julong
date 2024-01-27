package com.itca.finalpjt.common.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itca.finalpjt.common.interceptor.LoginUserAuthenticationInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

import javax.servlet.SessionCookieConfig;
import javax.servlet.SessionTrackingMode;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

import static java.util.Locale.KOREA;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Value("${spring.profiles.active}")
    private String activeProfile;
    @Value("${file.resource.location.businessCard}")
    private String resourceLocationBusinessCard;
    @Value("${file.resource.path.businessCard}")
    private String resourcePathBusinessCard;
    @Value("${file.resource.location.profile}")
    private String resourceLocationProfile;
    @Value("${file.resource.path.profile}")
    private String resourcePathProfile;
    @Value("${file.resource.location.crawling}")
    private String resourceLocationCrawling;
    @Value("${file.resource.path.crawling}")
    private String resourcePathCrawling;
    @Value("${server.cors.origins}")
    private String[] origins;
    @Value("${file.resource.location.sharedata}")
    private String resourceLocationsharedata;
    @Value("${file.resource.path.sharedata}")
    private String resourcePathsharedata;

    @Value("${file.upload.path}")
    private String resourceSummernote;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(resourcePathBusinessCard)
                .addResourceLocations(resourceLocationBusinessCard);
        registry.addResourceHandler(resourcePathProfile)
                .addResourceLocations(resourceLocationProfile);
        registry.addResourceHandler(resourcePathCrawling)
                .addResourceLocations(resourceLocationCrawling);

        registry.addResourceHandler("/summernote/resources/fileupload/**")
                .addResourceLocations("file:///C:/dev/file/");


        if ("local".equals(activeProfile)) {
            // local test 용
            // =====
            String dirName = resourcePathsharedata;
            Path uploadDir = Paths.get(resourcePathsharedata);
            String uploadPath = uploadDir.toFile().getAbsolutePath();
            registry.addResourceHandler("/" + dirName + "/**").addResourceLocations("file:/" + uploadPath + "/");
            // =====
        } else {
            registry.addResourceHandler(resourcePathsharedata)
                    .addResourceLocations(resourceLocationsharedata);
        }
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(escapingConverter());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor()).addPathPatterns("/**");
        registry.addInterceptor(new LoginUserAuthenticationInterceptor()).addPathPatterns("/**");
    }

    @Bean
    public HttpMessageConverter<?> escapingConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        MappingJackson2HttpMessageConverter escapingConverter = new MappingJackson2HttpMessageConverter();
        escapingConverter.setObjectMapper(objectMapper);

        return escapingConverter;
    }

    @Bean
    public LocaleResolver localeResolver() {
        var localeResolver = new CookieLocaleResolver();
        localeResolver.setCookieName("locale");
        localeResolver.setCookieSecure(true);
        localeResolver.setDefaultLocale(KOREA);
        localeResolver.setCookiePath("/");
        return localeResolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        var localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        return localeChangeInterceptor;
    }

    @Bean
    public ServletContextInitializer clearJSession() {
        return servletContext -> {
            servletContext.setSessionTrackingModes(Collections.singleton(SessionTrackingMode.COOKIE));
            SessionCookieConfig sessionCookieConfig = servletContext.getSessionCookieConfig();
            sessionCookieConfig.setHttpOnly(true);
        };
    }

}
