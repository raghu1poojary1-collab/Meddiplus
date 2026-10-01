package com.medipulse.availability.domain;

import com.medipulse.common.domain.Hospital;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 150)
    private String specialization;

    @Column(name = "on_duty", nullable = false)
    private Boolean onDuty = true;

    @Column(name = "queue_count", nullable = false)
    private Integer queueCount = 0;

    @Column(name = "consulting_hours", length = 100)
    private String consultingHours;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    /**
     * JPA Optimistic Lock Version. Prevents race conditions during duty status changes
     * or queue increments.
     */
    @Version
    @Column(nullable = false)
    private Long version = 0L;

    public Doctor() {
    }

    public Doctor(Hospital hospital, String name, String specialization, Boolean onDuty,
                  Integer queueCount, String consultingHours, LocalDateTime lastUpdated) {
        this.hospital = hospital;
        this.name = name;
        this.specialization = specialization;
        this.onDuty = onDuty;
        this.queueCount = queueCount;
        this.consultingHours = consultingHours;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Boolean getOnDuty() {
        return onDuty;
    }

    public void setOnDuty(Boolean onDuty) {
        this.onDuty = onDuty;
    }

    public Integer getQueueCount() {
        return queueCount;
    }

    public void setQueueCount(Integer queueCount) {
        this.queueCount = queueCount;
    }

    public String getConsultingHours() {
        return consultingHours;
    }

    public void setConsultingHours(String consultingHours) {
        this.consultingHours = consultingHours;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
