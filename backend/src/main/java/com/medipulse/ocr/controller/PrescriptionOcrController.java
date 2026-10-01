package com.medipulse.ocr.controller;

import com.medipulse.ocr.dto.OcrResponseDto;
import com.medipulse.ocr.service.PrescriptionOcrService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ocr")
public class PrescriptionOcrController {

    private final PrescriptionOcrService ocrService;

    public PrescriptionOcrController(PrescriptionOcrService ocrService) {
        this.ocrService = ocrService;
    }

    /**
     * Extracts prescribed medicines from an uploaded image.
     * Protected by Resilience4j Circuit Breaker.
     */
    @PostMapping(value = "/extract-medicines", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OcrResponseDto> extractMedicines(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "forceFailure", required = false, defaultValue = "false") boolean forceFailure) {

        MultipartFile target = image != null ? image : file;
        OcrResponseDto response = ocrService.extractMedicines(target, forceFailure);
        return ResponseEntity.ok(response);
    }
}
