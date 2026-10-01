package com.medipulse.common.event;

import java.time.LocalDateTime;

/**
 * Domain event dispatched whenever a hospital resource (Doctor, Medicine, Vaccine)
 * is updated by an administrator.
 *
 * Decoupled listeners use this event to:
 * 1. Persist audit logs
 * 2. Evaluate restock alerts for registered patient interests
 * 3. Broadcast real-time WebSocket state changes to connected patients
 * 4. Evict search results from the Caffeine cache
 */
public class HospitalDataChangedEvent {

    private final Long hospitalId;
    private final String hospitalName;
    private final String city;
    private final Long adminId;
    private final String adminUsername;
    private final String resourceType; // "DOCTOR", "MEDICINE", "VACCINE"
    private final Long resourceId;
    private final String resourceName;
    private final String action;
    private final String oldValue;
    private final String newValue;
    private final boolean restockedFromZero;
    private final LocalDateTime timestamp;

    public HospitalDataChangedEvent(Long hospitalId, String hospitalName, String city,
                                    Long adminId, String adminUsername,
                                    String resourceType, Long resourceId, String resourceName,
                                    String action, String oldValue, String newValue,
                                    boolean restockedFromZero) {
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.city = city;
        this.adminId = adminId;
        this.adminUsername = adminUsername;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.action = action;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.restockedFromZero = restockedFromZero;
        this.timestamp = LocalDateTime.now();
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public String getCity() {
        return city;
    }

    public Long getAdminId() {
        return adminId;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public String getResourceType() {
        return resourceType;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getAction() {
        return action;
    }

    public String getOldValue() {
        return oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public boolean isRestockedFromZero() {
        return restockedFromZero;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
