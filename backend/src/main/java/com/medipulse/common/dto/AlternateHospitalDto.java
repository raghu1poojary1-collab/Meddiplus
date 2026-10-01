package com.medipulse.common.dto;

import java.time.LocalDateTime;

/**
 * Lightweight DTO representing an alternative hospital suggestion
 * when a target facility is out of stock or booked concurrently.
 */
public class AlternateHospitalDto {

    private Long hospitalId;
    private String hospitalName;
    private String city;
    private String contactNumber;
    private double distanceKm;
    private long minutesSinceUpdate;
    private double compositeScore;
    private String resourceName;
    private int availableQuantity;
    private String status;

    public AlternateHospitalDto() {
    }

    public AlternateHospitalDto(Long hospitalId, String hospitalName, String city, String contactNumber,
                                double distanceKm, long minutesSinceUpdate, double compositeScore,
                                String resourceName, int availableQuantity, String status) {
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.city = city;
        this.contactNumber = contactNumber;
        this.distanceKm = distanceKm;
        this.minutesSinceUpdate = minutesSinceUpdate;
        this.compositeScore = compositeScore;
        this.resourceName = resourceName;
        this.availableQuantity = availableQuantity;
        this.status = status;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public long getMinutesSinceUpdate() {
        return minutesSinceUpdate;
    }

    public void setMinutesSinceUpdate(long minutesSinceUpdate) {
        this.minutesSinceUpdate = minutesSinceUpdate;
    }

    public double getCompositeScore() {
        return compositeScore;
    }

    public void setCompositeScore(double compositeScore) {
        this.compositeScore = compositeScore;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
