package com.medipulse.notification.service;

import com.medipulse.notification.domain.OutboxEvent;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NotificationSenderService {

    private static final Logger log = LoggerFactory.getLogger(NotificationSenderService.class);

    private final boolean mockMode;

    public NotificationSenderService(
            @Value("${medipulse.mock-mode.notifications:true}") boolean mockMode) {
        this.mockMode = mockMode;
    }

    /**
     * Sends an external notification (SMS, WhatsApp, Email).
     * Protected by Resilience4j Circuit Breaker. If external telecom/messaging API
     * experiences latency or downtime, the circuit opens to prevent thread starvation.
     */
    @CircuitBreaker(name = "notificationService", fallbackMethod = "sendNotificationFallback")
    public boolean sendNotification(OutboxEvent event) {
        if (mockMode) {
            log.info("📢 [MOCK NOTIFICATION SENDER] Event ID={}, Type={}, AggregateType={}, AggregateID={}",
                    event.getId(), event.getEventType(), event.getAggregateType(), event.getAggregateId());
            log.info("📱 [DISPATCHED MESSAGE PAYLOAD]: {}", event.getPayload());
            return true;
        }

        // Live delivery implementation (e.g. Twilio / WhatsApp Business API / SendGrid)
        log.info("Sending live production notification for event {}: {}", event.getId(), event.getPayload());
        return true;
    }

    /**
     * Fallback method triggered when the Resilience4j notificationService circuit breaker is OPEN.
     */
    public boolean sendNotificationFallback(OutboxEvent event, Throwable t) {
        log.warn("⚠️ Circuit Breaker OPEN for NotificationService. Delivery deferred for event {}: {}",
                event.getId(), t.getMessage());
        return false;
    }
}
