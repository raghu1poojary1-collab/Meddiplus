package com.medipulse.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequestDto {

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Patient contact phone number is required")
    private String patientPhone;

    private String patientEmail;

    @NotNull(message = "Hospital ID is required")
    private Long hospitalId;

    @NotBlank(message = "Resource type (DOCTOR, MEDICINE, VACCINE) is required")
    private String resourceType;

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    // Optional GPS coordinates for accurate alternate suggestions if booking conflicts
    private Double userLat;
    private Double userLng;

    public BookingRequestDto() {
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUserLat() {
        return userLat;
    }

    public void setUserLat(Double userLat) {
        this.userLat = userLat;
    }

    public Double getUserLng() {
        return userLng;
    }

    public void setUserLng(Double userLng) {
        this.userLng = userLng;
    }
}
