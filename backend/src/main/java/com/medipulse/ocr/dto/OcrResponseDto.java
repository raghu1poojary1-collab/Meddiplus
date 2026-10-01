package com.medipulse.ocr.dto;

import java.util.ArrayList;
import java.util.List;

public class OcrResponseDto {

    private boolean success;
    private boolean fallback;
    private String message;
    private List<String> extractedMedicines = new ArrayList<>();
    private Double confidenceScore;

    public OcrResponseDto() {
    }

    public OcrResponseDto(boolean success, boolean fallback, String message,
                          List<String> extractedMedicines, Double confidenceScore) {
        this.success = success;
        this.fallback = fallback;
        this.message = message;
        this.extractedMedicines = extractedMedicines != null ? extractedMedicines : new ArrayList<>();
        this.confidenceScore = confidenceScore;
    }

    public static OcrResponseDto fallback(String reason) {
        return new OcrResponseDto(
                false,
                true,
                "Image search is temporarily unavailable — please type the medicine name instead.",
                new ArrayList<>(),
                0.0
        );
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isFallback() {
        return fallback;
    }

    public void setFallback(boolean fallback) {
        this.fallback = fallback;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getExtractedMedicines() {
        return extractedMedicines;
    }

    public void setExtractedMedicines(List<String> extractedMedicines) {
        this.extractedMedicines = extractedMedicines;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
