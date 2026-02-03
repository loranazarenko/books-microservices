package com.profitsoft.application.messaging;


import com.profitsoft.application.entities.Book;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationService {
    private final EmailKafkaProducer emailKafkaProducer;

    public void notifyBookCreated(Book book) {
        EmailRequestMessage message = EmailRequestMessage.builder()
                .subject("New Book Added: " + book.getTitle())
                .content("A new book has been added to the library: " + book.getTitle())
                .recipients(List.of("admin@profitsoft.ua"))
                .sourceSystem("BOOK_SERVICE")
                .entityId(String.valueOf(book.getId()))
                .entityType("BOOK")
                .build();

        emailKafkaProducer.sendEmailRequest(message);
        log.info("Email notification sent for book: {}", book.getId());
    }

    public void notifyAuthorCreated(String authorName) {
        EmailRequestMessage message = EmailRequestMessage.builder()
                .subject("New Author Added: " + authorName)
                .content("A new author has been added: " + authorName)
                .recipients(List.of("admin@profitsoft.ua"))
                .sourceSystem("BOOK_SERVICE")
                .entityType("AUTHOR")
                .build();

        emailKafkaProducer.sendEmailRequest(message);
        log.info("Email notification sent for author: {}", authorName);
    }
}
