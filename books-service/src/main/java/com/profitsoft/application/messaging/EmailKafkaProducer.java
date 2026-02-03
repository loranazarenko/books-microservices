package com.profitsoft.application.messaging;

import org.springframework.kafka.core.KafkaTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailKafkaProducer {
    private final KafkaTemplate<String, EmailRequestMessage> kafkaTemplate;

    public void sendEmailRequest(EmailRequestMessage message) {
        kafkaTemplate.send("email-requests", message);
        log.info("Email request sent to Kafka: {}", message.getSubject());
    }
}
