package com.medipulse.notification.service;

import com.medipulse.notification.domain.OutboxEvent;
import com.medipulse.notification.repository.OutboxEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final OutboxEventRepository outboxEventRepository;
    private final NotificationSenderService notificationSenderService;
    private final int batchSize;
    private final int maxRetries;

    public NotificationServiceImpl(
            OutboxEventRepository outboxEventRepository,
            NotificationSenderService notificationSenderService,
            @Value("${medipulse.outbox.batch-size:10}") int batchSize,
            @Value("${medipulse.outbox.max-retries:3}") int maxRetries) {
        this.outboxEventRepository = outboxEventRepository;
        this.notificationSenderService = notificationSenderService;
        this.batchSize = batchSize;
        this.maxRetries = maxRetries;
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public OutboxEvent createOutboxEvent(String aggregateType, Long aggregateId, String eventType, String payload) {
        OutboxEvent event = new OutboxEvent(aggregateType, aggregateId, eventType, payload);
        OutboxEvent saved = outboxEventRepository.save(event);
        log.debug("Created outbox event ID={}, type={} within active transaction", saved.getId(), eventType);
        return saved;
    }

    /**
     * Periodic background poller implementing the Transactional Outbox Pattern.
     * Decouples the primary booking transaction from external notification gateways.
     */
    @Override
    @Scheduled(fixedDelayString = "${medipulse.outbox.fixed-delay-ms:2500}")
    @Transactional
    public void processPendingOutboxEvents() {
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatusOrderByCreatedAtAsc(
                "PENDING", PageRequest.of(0, batchSize));

        if (pendingEvents.isEmpty()) {
            return;
        }

        log.debug("Outbox poller processing {} pending notification events", pendingEvents.size());

        for (OutboxEvent event : pendingEvents) {
            try {
                boolean sent = notificationSenderService.sendNotification(event);
                if (sent) {
                    event.setStatus("SENT");
                    event.setProcessedAt(LocalDateTime.now());
                    log.info("Outbox event ID={} successfully delivered via notification sender", event.getId());
                } else {
                    handleFailure(event, "Delivery reported non-success");
                }
            } catch (Exception ex) {
                handleFailure(event, ex.getMessage());
            }
            outboxEventRepository.save(event);
        }
    }

    private void handleFailure(OutboxEvent event, String reason) {
        int nextRetry = event.getRetryCount() + 1;
        event.setRetryCount(nextRetry);
        if (nextRetry >= maxRetries) {
            event.setStatus("FAILED");
            event.setProcessedAt(LocalDateTime.now());
            log.error("Outbox event ID={} marked as FAILED after {} retries. Reason: {}",
                    event.getId(), nextRetry, reason);
        } else {
            event.setStatus("PENDING"); // keep pending for next polling cycle
            log.warn("Outbox event ID={} failed attempt {}/{}. Will retry next cycle. Reason: {}",
                    event.getId(), nextRetry, maxRetries, reason);
        }
    }
}
