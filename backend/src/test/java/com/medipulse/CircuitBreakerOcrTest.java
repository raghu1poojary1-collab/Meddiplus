package com.medipulse;

import com.medipulse.ocr.dto.OcrResponseDto;
import com.medipulse.ocr.service.PrescriptionOcrService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class CircuitBreakerOcrTest {

    @Autowired
    private PrescriptionOcrService ocrService;

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;

    @Test
    @DisplayName("Circuit breaker opens after consecutive OCR failures and returns graceful fallback response")
    void testOcrCircuitBreakerStateTransition() {
        CircuitBreaker cb = circuitBreakerRegistry.circuitBreaker("ocrService");
        assertNotNull(cb, "Resilience4j 'ocrService' circuit breaker must be registered");

        // Reset to initial CLOSED state
        cb.reset();
        assertEquals(CircuitBreaker.State.CLOSED, cb.getState(), "Initial state must be CLOSED");

        MockMultipartFile validImage = new MockMultipartFile(
                "image", "prescription.jpg", "image/jpeg", "fake image data".getBytes());

        // 1. Initial healthy call
        OcrResponseDto healthyResponse = ocrService.extractMedicines(validImage, false);
        assertTrue(healthyResponse.isSuccess());
        assertEquals("CLOSED", cb.getState().name());

        // 2. Trigger consecutive failures to exceed failureRateThreshold (50%)
        for (int i = 0; i < 4; i++) {
            OcrResponseDto failedResponse = ocrService.extractMedicines(validImage, true);
            assertTrue(failedResponse.isFallback(), "Fallback must be triggered on failure");
        }

        // 3. Verify Circuit is now OPEN
        assertEquals(CircuitBreaker.State.OPEN, cb.getState(),
                "Circuit Breaker state MUST transition to OPEN after repeated failures");

        // 4. While OPEN, subsequent valid calls get immediate graceful fallback without executing OCR
        OcrResponseDto openResponse = ocrService.extractMedicines(validImage, false);
        assertTrue(openResponse.isFallback(), "Calls while circuit is OPEN must return graceful fallback");
        assertTrue(openResponse.getMessage().contains("temporarily unavailable"),
                "Expected user-friendly message directing to manual text search");
    }
}
