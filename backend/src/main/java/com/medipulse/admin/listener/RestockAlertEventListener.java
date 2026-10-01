package com.medipulse.admin.listener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medipulse.admin.domain.SearchInterest;
import com.medipulse.admin.repository.SearchInterestRepository;
import com.medipulse.common.domain.Patient;
import com.medipulse.common.event.HospitalDataChangedEvent;
import com.medipulse.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class RestockAlertEventListener {

    private static final Logger log = LoggerFactory.getLogger(RestockAlertEventListener.class);

    private final SearchInterestRepository searchInterestRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public RestockAlertEventListener(
            SearchInterestRepository searchInterestRepository,
            NotificationService notificationService,
            ObjectMapper objectMapper) {
        this.searchInterestRepository = searchInterestRepository;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    /**
     * Checks if a resource was restocked from 0 to >0. If true, queues instant
     * restock alerts in the transactional outbox for all waiting patients.
     */
    @EventListener
    @Transactional
    public void handleRestockAlert(HospitalDataChangedEvent event) {
        if (!event.isRestockedFromZero()) {
            return;
        }

        log.info("📢 Detected restock from 0 for {} '{}' at hospital ID={}. Checking registered patient alerts...",
                event.getResourceType(), event.getResourceName(), event.getHospitalId());

        List<SearchInterest> waitingPatients = searchInterestRepository
                .findByHospitalIdAndResourceTypeAndResourceNameIgnoreCase(
                        event.getHospitalId(), event.getResourceType(), event.getResourceName());

        if (waitingPatients.isEmpty()) {
            log.debug("No patient search interests found for restocked item '{}'", event.getResourceName());
            return;
        }

        log.info("Found {} waiting patients for restocked item '{}'. Writing RESTOCK_ALERT outbox events.",
                waitingPatients.size(), event.getResourceName());

        for (SearchInterest interest : waitingPatients) {
            Patient patient = interest.getPatient();
            Map<String, Object> payloadMap = new HashMap<>();
            payloadMap.put("patientId", patient.getId());
            payloadMap.put("patientName", patient.getName());
            payloadMap.put("patientPhone", patient.getPhone());
            payloadMap.put("patientEmail", patient.getEmail());
            payloadMap.put("hospitalId", event.getHospitalId());
            payloadMap.put("hospitalName", event.getHospitalName());
            payloadMap.put("resourceType", event.getResourceType());
            payloadMap.put("resourceName", event.getResourceName());
            payloadMap.put("newStockLevel", event.getNewValue());
            payloadMap.put("message", "Good news! " + event.getResourceName() + " is now back in stock at " + event.getHospitalName() + ".");

            try {
                String payloadJson = objectMapper.writeValueAsString(payloadMap);
                notificationService.createOutboxEvent(
                        "RESTOCK_ALERT",
                        interest.getId(),
                        "RESTOCK_ALERT",
                        payloadJson
                );
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize restock alert payload for interest ID={}", interest.getId(), e);
            }
        }
    }
}
