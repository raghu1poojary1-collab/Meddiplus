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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vaccine")
public class Vaccine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(nullable = false)
    private String name;

    @Column(name = "batch_no", nullable = false, length = 100)
    private String batchNo;

    @Column(name = "doses_available", nullable = false)
    private Integer dosesAvailable = 0;

    @Column(name = "eligible_age_min", nullable = false)
    private Integer eligibleAgeMin = 0;

    @Column(name = "eligible_age_max", nullable = false)
    private Integer eligibleAgeMax = 120;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "cold_chain_status", length = 100)
    private String coldChainStatus = "Normal (3.5°C)";

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    /**
     * JPA Optimistic Lock Version. Prevents race conditions during concurrent dose booking.
     */
    @Version
    @Column(nullable = false)
    private Long version = 0L;

    public Vaccine() {
    }

    public Vaccine(Hospital hospital, String name, String batchNo, Integer dosesAvailable,
                   Integer eligibleAgeMin, Integer eligibleAgeMax, LocalDate expiryDate,
                   String coldChainStatus, LocalDateTime lastUpdated) {
        this.hospital = hospital;
        this.name = name;
        this.batchNo = batchNo;
        this.dosesAvailable = dosesAvailable;
        this.eligibleAgeMin = eligibleAgeMin;
        this.eligibleAgeMax = eligibleAgeMax;
        this.expiryDate = expiryDate;
        this.coldChainStatus = coldChainStatus;
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

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public Integer getDosesAvailable() {
        return dosesAvailable;
    }

    public void setDosesAvailable(Integer dosesAvailable) {
        this.dosesAvailable = dosesAvailable;
    }

    public Integer getEligibleAgeMin() {
        return eligibleAgeMin;
    }

    public void setEligibleAgeMin(Integer eligibleAgeMin) {
        this.eligibleAgeMin = eligibleAgeMin;
    }

    public Integer getEligibleAgeMax() {
        return eligibleAgeMax;
    }

    public void setEligibleAgeMax(Integer eligibleAgeMax) {
        this.eligibleAgeMax = eligibleAgeMax;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
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

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
