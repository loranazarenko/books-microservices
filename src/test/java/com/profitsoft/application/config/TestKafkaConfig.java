package com.profitsoft.application.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import com.profitsoft.application.messaging.EmailKafkaProducer;
import com.profitsoft.application.messaging.EmailNotificationService;
import static org.mockito.Mockito.mock;

@TestConfiguration
public class TestKafkaConfig {

    @Bean
    public EmailKafkaProducer emailKafkaProducer() {
        return mock(EmailKafkaProducer.class);
    }

    @Bean
    public EmailNotificationService emailNotificationService() {
        return mock(EmailNotificationService.class);
    }
}