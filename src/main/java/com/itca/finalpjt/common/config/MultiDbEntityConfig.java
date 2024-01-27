package com.itca.finalpjt.common.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Configuration
public class MultiDbEntityConfig {

    /* JPA 관련 설정 */
    @PersistenceContext(unitName = "masterEntityManagers")
    private EntityManager masterEntityManager;



    /* QueryDsl 관련 설정 */
    @Primary // ⭐
    @Bean
    public JPAQueryFactory masterQueryFactory() {
        return new JPAQueryFactory(masterEntityManager);
    }

}
