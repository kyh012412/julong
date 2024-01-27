package com.itca.finalpjt.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(entityManagerFactoryRef = "masterEntityManager", transactionManagerRef = "masterTransactionManager", basePackages = {
        "com.itca.finalpjt.domain.admin.repository" // master 데이터베이스가 담당할 레파지토리 경로
        , "com.itca.finalpjt.domain.account.repository", "com.itca.finalpjt.common.log.repository",
        "com.itca.finalpjt.domain.system.repository", "com.itca.finalpjt.infra.mail.log",
        "com.itca.finalpjt.domain.commoncode.repository", "com.itca.finalpjt.release.repository",
        "com.itca.finalpjt.domain.newsletter.repository"})
@RequiredArgsConstructor
public class MasterDatasourceConfig {

    private final Environment env;

    @Primary // 주 데이터베이스로 세팅
    @Bean
    public LocalContainerEntityManagerFactoryBean masterEntityManager() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(masterDataSource());
        em.setPackagesToScan(new String[] { "com.itca.finalpjt.domain.admin.entity" // master 데이터베이스가 담당할
                                                                                           // 엔티디(테이블객체) 경로
                , "com.itca.finalpjt.domain.account.entity", "com.itca.finalpjt.common.log.entity",
                "com.itca.finalpjt.domain.system.entity", "com.itca.finalpjt.infra.mail.log",
                "com.itca.finalpjt.domain.commoncode.entity", "com.itca.finalpjt.release.domain",
                "com.itca.finalpjt.domain.crawling.entity","com.itca.finalpjt.domain.newsletter.entity" });
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setPersistenceUnitName("masterEntityManagers");
        em.setJpaProperties(jpaProperties());
        return em;
    }

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.master") // 설정파일의 master데이터베이스의 연결 정보
    public DataSource masterDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean
    public PlatformTransactionManager masterTransactionManager() { // 트랜잭션 세팅
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(masterEntityManager().getObject());

        return transactionManager;
    }

    private Properties jpaProperties() {
        Properties properties = new Properties();
        properties.setProperty("hibernate.format_sql",
                env.getProperty("spring.jpa.properties.hibernate.format_sql"));
        properties.setProperty("hibernate.use_sql_comments",
                env.getProperty("spring.jpa.properties.hibernate.use_sql_comments"));
        properties.setProperty("hibernate.default_batch_fetch_size",
                env.getProperty("spring.jpa.properties.hibernate.default_batch_fetch_size"));
        return properties;
    }
}
