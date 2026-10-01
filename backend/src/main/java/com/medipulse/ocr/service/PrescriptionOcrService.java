package com.medipulse.ocr.service;

import com.medipulse.ocr.dto.OcrResponseDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PrescriptionOcrService {

    private static final Logger log = LoggerFactory.getLogger(PrescriptionOcrService.class);

    /**
     * Extracts prescribed medicines from an uploaded image.
     * Wrapped with Resilience4j CircuitBreaker 'ocrService'.
     * If native OCR processing or external vision API fails repeatedly,
     * the circuit opens to prevent request thread starvation.
     */
    @CircuitBreaker(name = "ocrService", fallbackMethod = "extractMedicinesFallback")
    public OcrResponseDto extractMedicines(MultipartFile file, boolean forceFailure) {
        if (forceFailure) {
            log.error("Forced failure triggered for OCR engine stress testing.");
            throw new IllegalStateException("OCR engine connection timed out or process crashed");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No prescription image uploaded");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (originalFilename.contains("corrupt") || originalFilename.contains("error")) {
            log.error("Corrupted image stream received in OCR engine: {}", originalFilename);
            throw new IllegalStateException("Corrupt image buffer: Unable to decode bitmap headers");
        }

        log.info("Processing prescription image OCR: name={}, size={} bytes", file.getOriginalFilename(), file.getSize());

        // Extract medicines (simulated realistic handwriting extraction matching catalog)
        List<String> detected = new ArrayList<>(Arrays.asList("Paracetamol 650mg", "Amoxicillin 500mg", "Cetirizine 10mg"));

        return new OcrResponseDto(
                true,
                false,
                "Prescription scanned successfully.",
                detected,
                0.94
        );
    }

    /**
     * Circuit breaker fallback method executed when the 'ocrService' circuit is OPEN
     * or when an uncaught exception is thrown.
     */
    public OcrResponseDto extractMedicinesFallback(MultipartFile file, boolean forceFailure, Throwable t) {
        log.warn("⚠️ OCR Circuit Breaker intercepted failure or circuit is OPEN: {}. Serving graceful fallback.",
                t.getMessage());
        return OcrResponseDto.fallback(t.getMessage());
    }
}
