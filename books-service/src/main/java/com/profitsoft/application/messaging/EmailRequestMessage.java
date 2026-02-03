package com.profitsoft.application.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequestMessage implements Serializable {
    private String subject;
    private String content;
    private List<String> recipients;
    private String sourceSystem;
    private String entityId;
    private String entityType;
}
