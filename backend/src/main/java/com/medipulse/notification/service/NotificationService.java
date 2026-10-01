package com.medipulse.notification.service;

import com.medipulse.notification.domain.OutboxEvent;

public interface NotificationService {

    /**
     * Writes an outbox event inside the active caller transaction.
     * Guarantees event intent is saved atomically with business data.
     */
    OutboxEvent createOutboxEvent(String aggregateType, Long aggregateId, String eventType, String payload);

    /**
     * Polls and processes pending outbox events asynchronously.
     */
    void processPendingOutboxEvents();
}
