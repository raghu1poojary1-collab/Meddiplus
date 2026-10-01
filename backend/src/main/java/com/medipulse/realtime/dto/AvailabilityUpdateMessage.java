package com.medipulse.realtime.dto;

import java.time.LocalDateTime;

public class AvailabilityUpdateMessage {

    private Long hospitalId;
    private String hospitalName;
    private String resourceType;
    private Long resourceId;
    private String resourceName;
    private String action;
    private String status;
    private Integer availableQuantity;
    private LocalDateTime timestamp;

    public AvailabilityUpdateMessage() {
    }

    public AvailabilityUpdateMessage(Long hospitalId, String hospitalName, String resourceType,
                                     Long resourceId, String resourceName, String action,
                                     String status, Integer availableQuantity) {
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.action = action;
        this.status = status;
        this.availableQuantity = availableQuantity;
        this.timestamp = LocalDateTime.now();
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
