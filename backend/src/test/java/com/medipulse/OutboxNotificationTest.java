package com.medipulse;

import com.medipulse.booking.dto.BookingRequestDto;
import com.medipulse.booking.dto.BookingResponseDto;
import com.medipulse.booking.service.BookingService;
import com.medipulse.notification.domain.OutboxEvent;
import com.medipulse.notification.repository.OutboxEventRepository;
import com.medipulse.notification.service.NotificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class OutboxNotificationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Test
    @DisplayName("Transactional Outbox: Booking atomically writes PENDING event, background poller delivers and marks SENT")
    void testOutboxEventLifecycle() {
        long initialSentCount = outboxEventRepository.findByStatus("SENT").size();

        // 1. Create a booking for Paracetamol (Medicine ID 1 at Hospital 1)
        BookingRequestDto request = new BookingRequestDto();
        request.setPatientName("Kavitha Rai");
        request.setPatientPhone("+919741234567");
        request.setPatientEmail("kavitha.rai@example.com");
        request.setHospitalId(1L);
        request.setResourceType("MEDICINE");
        request.setResourceId(1L);
        request.setQuantity(2);

        BookingResponseDto bookingResponse = bookingService.createBooking(request);
        assertNotNull(bookingResponse.getBookingReference());

        // 2. Verify that an OutboxEvent was written with status PENDING in the same transaction
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatus("PENDING");
        assertTrue(pendingEvents.stream().anyMatch(e ->
                        "BOOKING".equals(e.getAggregateType()) &&
                        "BOOKING_CONFIRMED".equals(e.getEventType()) &&
                        e.getPayload().contains(bookingResponse.getBookingReference())),
                "Outbox table MUST contain PENDING notification event for the new booking");

        // 3. Trigger the outbox poller process
        notificationService.processPendingOutboxEvents();

        // 4. Verify the event status was updated to SENT
        List<OutboxEvent> sentEvents = outboxEventRepository.findByStatus("SENT");
        assertTrue(sentEvents.size() > initialSentCount, "Event must transition from PENDING to SENT");

        OutboxEvent processedEvent = sentEvents.stream()
                .filter(e -> e.getPayload().contains(bookingResponse.getBookingReference()))
                .findFirst()
                .orElse(null);

        assertNotNull(processedEvent);
        assertEquals("SENT", processedEvent.getStatus());
        assertNotNull(processedEvent.getProcessedAt(), "Processed timestamp must be set upon delivery");
    }
}
