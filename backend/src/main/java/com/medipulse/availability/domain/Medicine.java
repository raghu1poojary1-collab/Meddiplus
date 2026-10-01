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
@Table(name = "medicine")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(nullable = false)
    private String name;

    @Column(length = 150)
    private String category;

    @Column(name = "stock_level", nullable = false)
    private Integer stockLevel = 0;

    @Column(name = "stock_status", nullable = false, length = 50)
    private String stockStatus = "AVAILABLE";

    @Column(nullable = false, length = 50)
    private String unit = "strips";

    @Column(length = 100)
    private String price;

    @Column(nullable = false)
    private Integer threshold = 10;

    @Column(name = "last_restocked")
    private LocalDateTime lastRestocked;

    /**
     * JPA Optimistic Lock Version. Ensures concurrent bookings on the last doses
     * or parallel inventory adjustments cleanly fail with OptimisticLockException
     * rather than deadlocking or suffering phantom inventory decreases.
     */
    @Version
    @Column(nullable = false)
    private Long version = 0L;

    public Medicine() {
    }

    public Medicine(Hospital hospital, String name, String category, Integer stockLevel,
                    String stockStatus, String unit, String price, Integer threshold,
                    LocalDateTime lastRestocked) {
        this.hospital = hospital;
        this.name = name;
        this.category = category;
        this.stockLevel = stockLevel;
        this.stockStatus = stockStatus;
        this.unit = unit;
        this.price = price;
        this.threshold = threshold;
        this.lastRestocked = lastRestocked;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getStockLevel() {
        return stockLevel;
    }

    public void setStockLevel(Integer stockLevel) {
        this.stockLevel = stockLevel;
        if (stockLevel <= 0) {
            this.stockStatus = "OUT_OF_STOCK";
        } else if (stockLevel <= threshold) {
            this.stockStatus = "LIMITED";
        } else {
            this.stockStatus = "AVAILABLE";
        }
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Integer getThreshold() {
        return threshold;
    }

    public void setThreshold(Integer threshold) {
        this.threshold = threshold;
    }

    public LocalDateTime getLastRestocked() {
        return lastRestocked;
    }

    public void setLastRestocked(LocalDateTime lastRestocked) {
        this.lastRestocked = lastRestocked;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
