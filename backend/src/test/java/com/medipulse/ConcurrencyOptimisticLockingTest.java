package com.medipulse;

import com.medipulse.availability.domain.Vaccine;
import com.medipulse.availability.service.AvailabilityService;
import com.medipulse.booking.dto.BookingRequestDto;
import com.medipulse.booking.dto.BookingResponseDto;
import com.medipulse.booking.service.BookingService;
import com.medipulse.common.exception.BookingConflictException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class ConcurrencyOptimisticLockingTest {

    private static final Logger log = LoggerFactory.getLogger(ConcurrencyOptimisticLockingTest.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AvailabilityService availabilityService;

    @Test
    @DisplayName("20 simultaneous threads competing for 1 vaccine dose: exactly 1 succeeds, 19 receive 409 conflict with alternates")
    void testConcurrentBookingOnSingleDose() throws InterruptedException {
        // Vaccine ID 3 in seed data is 'Single Dose Concurrency Demo Vaccine' with dosesAvailable = 1
        Long vaccineId = 3L;
        Vaccine initialVaccine = availabilityService.getVaccineById(vaccineId);
        assertEquals(1, initialVaccine.getDosesAvailable(), "Test precondition: exactly 1 dose must be available");

        int threadCount = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch readyLatch = new CountDownLatch(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                readyLatch.countDown();
                try {
                    startLatch.await(); // Synchronize all 20 threads to fire simultaneously

                    BookingRequestDto request = new BookingRequestDto();
                    request.setPatientName("Concurrent Patient #" + index);
                    request.setPatientPhone("+919900" + String.format("%06d", index));
                    request.setHospitalId(1L);
                    request.setResourceType("VACCINE");
                    request.setResourceId(vaccineId);
                    request.setQuantity(1);

                    BookingResponseDto response = bookingService.createBooking(request);
                    if (response != null && "CONFIRMED".equals(response.getStatus())) {
                        successCount.incrementAndGet();
                        log.info("✅ Thread #{} WON the race! Booking token: {}", index, response.getBookingReference());
                    }
                } catch (BookingConflictException ex) {
                    conflictCount.incrementAndGet();
                    log.info("⛔ Thread #{} cleanly intercepted with Conflict: {}. Alternate hospitals provided: {}",
                            index, ex.getMessage(), ex.getAlternateHospitals().size());
                } catch (Exception ex) {
                    log.error("Thread #{} encountered unexpected exception: ", index, ex);
                }
            }, executor);

            futures.add(future);
        }

        readyLatch.await(); // Wait for all threads to get into position
        startLatch.countDown(); // FIRE ALL 20 THREADS CONCURRENTLY!

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executor.shutdown();

        log.info("══════════════════════════════════════════════════════════════");
        log.info("CONCURRENCY TEST RESULT: Successes = {}, Conflicts = {}", successCount.get(), conflictCount.get());
        log.info("══════════════════════════════════════════════════════════════");

        // Assert that optimistic locking guaranteed single winner semantics
        assertEquals(1, successCount.get(), "Optimistic locking MUST guarantee exactly ONE successful booking");
        assertEquals(19, conflictCount.get(), "The remaining 19 concurrent requests MUST receive conflict exceptions");

        // Verify remaining doses is 0
        Vaccine finalVaccine = availabilityService.getVaccineById(vaccineId);
        assertEquals(0, finalVaccine.getDosesAvailable(), "Remaining vaccine inventory must be exactly 0");
    }
}
