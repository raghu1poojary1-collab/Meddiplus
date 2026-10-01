package com.medipulse;

import com.medipulse.admin.dto.UpdateMedicineStockRequestDto;
import com.medipulse.admin.service.AdminService;
import com.medipulse.notification.domain.OutboxEvent;
import com.medipulse.notification.repository.OutboxEventRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class RestockAlertEventTest {

    @Autowired
    private AdminService adminService;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Test
    @DisplayName("Admin restocking item from 0 to >0 dispatches domain event creating RESTOCK_ALERT outbox events for registered patients")
    void testRestockFromZeroGeneratesAlerts() {
        // Metformin 500mg at CHC Moodbidri (Hospital 2, Medicine 9) has stock = 0 in seed data
        // Patients 1 & 2 have registered search interests for this medicine at Hospital 2
        Long hospitalId = 2L;
        Long medicineId = 9L;
        String adminUsername = "chc_admin";

        // Admin restocks 120 strips
        adminService.updateMedicineStock(adminUsername, hospitalId, medicineId,
                new UpdateMedicineStockRequestDto(120, "Free (Govt Supply)"));

        // Verify RESTOCK_ALERT outbox events were created
        List<OutboxEvent> restockEvents = outboxEventRepository.findByStatus("PENDING").stream()
                .filter(e -> "RESTOCK_ALERT".equals(e.getEventType()))
                .toList();

        assertFalse(restockEvents.isEmpty(), "Restock from 0 MUST automatically generate RESTOCK_ALERT outbox events");
        assertTrue(restockEvents.stream().anyMatch(e -> e.getPayload().contains("Metformin 500mg")),
                "Payload must contain the restocked item name");
    }
}
