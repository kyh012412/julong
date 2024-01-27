package com.itca.finalpjt.common.config;

import com.itca.finalpjt.common.exception.RequestValidException;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.modelmapper.ModelMapper;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.reactive.function.client.WebClient;

import javax.persistence.EntityManager;
import java.util.Map;

@Configuration
public class ApplicationConfiguration {

    @Bean
    public JPAQueryFactory jpaQueryFactory(EntityManager em){
        return new JPAQueryFactory(em);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public WebClient webClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder.build();
    }

    @Bean
    public ErrorAttributes errorAttributes() {
        return new DefaultErrorAttributes() {
            @Override
            public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
                Map<String, Object> errorAttributes = super.getErrorAttributes(webRequest, options);
                Throwable error = getError(webRequest);
                if (error instanceof RequestValidException) {
                    errorAttributes.put("errors", ((RequestValidException) error).getErrors());
                }
                return errorAttributes;
            }
        };
    }

}

