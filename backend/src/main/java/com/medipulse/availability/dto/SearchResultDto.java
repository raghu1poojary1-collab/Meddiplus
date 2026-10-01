package com.medipulse.availability.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Data transfer object representing a ranked search result item.
 * Evaluated and ranked using the Freshness-Weighted Ranking Algorithm.
 */
public class SearchResultDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long hospitalId;
    private String hospitalName;
    private String hospitalAddress;
    private String city;
    private Double latitude;
    private Double longitude;
    private String contactNumber;

    private String resourceType; // DOCTOR, MEDICINE, VACCINE
    private Long resourceId;
    private String resourceName;
    private String status; // ON_DUTY, OFF_DUTY, AVAILABLE, LIMITED, OUT_OF_STOCK

    // Detailed resource metadata
    private String categoryOrSpecialization;
    private Integer availableQuantity; // stockLevel or dosesAvailable or queueCount
    private String unitOrConsultingHours;
    private String priceOrBatchNo;
    private String coldChainStatus;
    private LocalDateTime lastUpdated;

    // Freshness-Weighted Ranking Algorithm Metrics
    private double distanceKm;
    private long minutesSinceUpdate;
    private double compositeScore;
    private double distanceScore;
    private double freshnessScore;

    public SearchResultDto() {
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

    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
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

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategoryOrSpecialization() {
        return categoryOrSpecialization;
    }

    public void setCategoryOrSpecialization(String categoryOrSpecialization) {
        this.categoryOrSpecialization = categoryOrSpecialization;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getUnitOrConsultingHours() {
        return unitOrConsultingHours;
    }

    public void setUnitOrConsultingHours(String unitOrConsultingHours) {
        this.unitOrConsultingHours = unitOrConsultingHours;
    }

    public String getPriceOrBatchNo() {
        return priceOrBatchNo;
    }

    public void setPriceOrBatchNo(String priceOrBatchNo) {
        this.priceOrBatchNo = priceOrBatchNo;
    }

    public String getColdChainStatus() {
        return coldChainStatus;
    }

    public void setColdChainStatus(String coldChainStatus) {
        this.coldChainStatus = coldChainStatus;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
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

    public double getDistanceScore() {
        return distanceScore;
    }

    public void setDistanceScore(double distanceScore) {
        this.distanceScore = distanceScore;
    }

    public double getFreshnessScore() {
        return freshnessScore;
    }

    public void setFreshnessScore(double freshnessScore) {
        this.freshnessScore = freshnessScore;
    }
}
