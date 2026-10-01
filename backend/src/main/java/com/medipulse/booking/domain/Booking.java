package com.medipulse.booking.domain;

import com.medipulse.common.domain.Hospital;
import com.medipulse.common.domain.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 64)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType; // DOCTOR, MEDICINE, VACCINE

    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    @Column(name = "resource_name", nullable = false)
    private String resourceName;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false, length = 50)
    private String status = "CONFIRMED";

    @Column(name = "booked_at")
    private LocalDateTime bookedAt;

    public Booking() {
    }

    public Booking(String bookingReference, Patient patient, Hospital hospital,
                   String resourceType, Long resourceId, String resourceName,
                   Integer quantity, String status, LocalDateTime bookedAt) {
        this.bookingReference = bookingReference;
        this.patient = patient;
        this.hospital = hospital;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.quantity = quantity;
        this.status = status;
        this.bookedAt = bookedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }
}
