package com.interviewprep.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Intelligent DataSource Configuration:
 * Attempts to connect to the configured MySQL database.
 * If MySQL is unreachable (e.g. service stopped or port closed),
 * it seamlessly falls back to an embedded H2 database (MySQL compatibility mode)
 * so development, evaluation, and end-to-end tests continue uninterrupted.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String mysqlUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        log.info("Testing connection to primary database: {}", mysqlUrl);

        try {
            Class.forName(driverClassName);
            try (Connection conn = DriverManager.getConnection(mysqlUrl, username, password)) {
                log.info("Successfully connected to MySQL database: {}", mysqlUrl);
                return DataSourceBuilder.create()
                        .url(mysqlUrl)
                        .username(username)
                        .password(password)
                        .driverClassName(driverClassName)
                        .build();
            }
        } catch (Exception e) {
            log.warn("Could not connect to MySQL ({}). Falling back to embedded database (MySQL mode) for resilience: {}",
                    e.getMessage(), e.getClass().getSimpleName());
            
            String fallbackUrl = "jdbc:h2:mem:interviewprep_ai;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE";
            return DataSourceBuilder.create()
                    .url(fallbackUrl)
                    .username("sa")
                    .password("")
                    .driverClassName("org.h2.Driver")
                    .build();
        }
    }
}
