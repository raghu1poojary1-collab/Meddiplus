package com.medipulse.booking.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medipulse.availability.domain.Doctor;
import com.medipulse.availability.domain.Medicine;
import com.medipulse.availability.domain.Vaccine;
import com.medipulse.availability.service.AvailabilityService;
import com.medipulse.booking.domain.Booking;
import com.medipulse.booking.dto.BookingRequestDto;
import com.medipulse.booking.dto.BookingResponseDto;
import com.medipulse.booking.repository.BookingRepository;
import com.medipulse.common.domain.Hospital;
import com.medipulse.common.domain.Patient;
import com.medipulse.common.dto.AlternateHospitalDto;
import com.medipulse.common.exception.BookingConflictException;
import com.medipulse.common.exception.ResourceNotFoundException;
import com.medipulse.common.repository.HospitalRepository;
import com.medipulse.common.repository.PatientRepository;
import com.medipulse.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final AvailabilityService availabilityService;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            PatientRepository patientRepository,
            HospitalRepository hospitalRepository,
            AvailabilityService availabilityService,
            NotificationService notificationService,
            ObjectMapper objectMapper) {
        this.bookingRepository = bookingRepository;
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
        this.availabilityService = availabilityService;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        log.info("Initiating reservation for patient {} on {} ID={} at hospital ID={}",
                request.getPatientPhone(), request.getResourceType(), request.getResourceId(), request.getHospitalId());

        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with ID: " + request.getHospitalId()));

        String resourceName;
        int qty = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;
        String type = request.getResourceType().toUpperCase();

        try {
            switch (type) {
                case "MEDICINE" -> {
                    Medicine medicine = availabilityService.getMedicineById(request.getResourceId());
                    resourceName = medicine.getName();

                    if (medicine.getStockLevel() < qty) {
                        List<AlternateHospitalDto> alternates = availabilityService.findAlternates(
                                "MEDICINE", resourceName, hospital.getId(), request.getUserLat(), request.getUserLng());
                        throw new BookingConflictException(
                                "Stock exhausted! " + resourceName + " has only " + medicine.getStockLevel() + " units remaining.",
                                alternates);
                    }

                    // Decrement stock level
                    medicine.setStockLevel(medicine.getStockLevel() - qty);
                    medicine.setLastRestocked(LocalDateTime.now());
                    availabilityService.saveMedicine(medicine);
                }
                case "VACCINE" -> {
                    Vaccine vaccine = availabilityService.getVaccineById(request.getResourceId());
                    resourceName = vaccine.getName();

                    if (vaccine.getDosesAvailable() < qty) {
                        List<AlternateHospitalDto> alternates = availabilityService.findAlternates(
                                "VACCINE", resourceName, hospital.getId(), request.getUserLat(), request.getUserLng());
                        throw new BookingConflictException(
                                "Vaccine doses exhausted! " + resourceName + " has only " + vaccine.getDosesAvailable() + " doses remaining.",
                                alternates);
                    }

                    // Decrement available doses
                    vaccine.setDosesAvailable(vaccine.getDosesAvailable() - qty);
                    vaccine.setLastUpdated(LocalDateTime.now());
                    availabilityService.saveVaccine(vaccine);
                }
                case "DOCTOR" -> {
                    Doctor doctor = availabilityService.getDoctorById(request.getResourceId());
                    resourceName = doctor.getName();

                    if (!Boolean.TRUE.equals(doctor.getOnDuty())) {
                        List<AlternateHospitalDto> alternates = availabilityService.findAlternates(
                                "DOCTOR", doctor.getSpecialization(), hospital.getId(), request.getUserLat(), request.getUserLng());
                        throw new BookingConflictException(
                                "Doctor " + doctor.getName() + " is currently off-duty.", alternates);
                    }

                    // Increment queue count for token reservation
                    doctor.setQueueCount(doctor.getQueueCount() + qty);
                    doctor.setLastUpdated(LocalDateTime.now());
                    availabilityService.saveDoctor(doctor);
                }
                default -> throw new IllegalArgumentException("Unsupported resource type: " + type);
            }
        } catch (OptimisticLockingFailureException ex) {
            log.warn("Optimistic lock failure caught for {} ID={}. Finding alternate hospitals...",
                    type, request.getResourceId());
            List<AlternateHospitalDto> alternates = availabilityService.findAlternates(
                    type, request.getResourceType(), hospital.getId(), request.getUserLat(), request.getUserLng());
            throw new BookingConflictException(
                    "The last available unit was just booked by another concurrent patient. Here are immediate alternative facilities.",
                    alternates);
        }

        // Find or create patient
        Patient patient = patientRepository.findByPhone(request.getPatientPhone())
                .orElseGet(() -> {
                    Patient newPatient = new Patient(request.getPatientName(), request.getPatientPhone(), request.getPatientEmail());
                    return patientRepository.save(newPatient);
                });

        // Generate unique, readable booking token
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String shortId = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String bookingReference = "MP-" + datePrefix + "-" + shortId;

        // Persist Booking
        Booking booking = new Booking(
                bookingReference,
                patient,
                hospital,
                type,
                request.getResourceId(),
                resourceName,
                qty,
                "CONFIRMED",
                LocalDateTime.now()
        );
        Booking savedBooking = bookingRepository.save(booking);

        // Transactional Outbox write in the exact SAME database transaction
        writeBookingConfirmationOutbox(savedBooking, patient, hospital);

        log.info("Booking {} successfully confirmed for patient {} at {}",
                bookingReference, patient.getName(), hospital.getName());

        return mapToDto(savedBooking, hospital, patient, "Confirmed reservation successfully generated.");
    }

    private void writeBookingConfirmationOutbox(Booking booking, Patient patient, Hospital hospital) {
        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("bookingReference", booking.getBookingReference());
        payloadMap.put("patientId", patient.getId());
        payloadMap.put("patientName", patient.getName());
        payloadMap.put("patientPhone", patient.getPhone());
        payloadMap.put("patientEmail", patient.getEmail());
        payloadMap.put("hospitalName", hospital.getName());
        payloadMap.put("hospitalAddress", hospital.getAddress());
        payloadMap.put("hospitalContact", hospital.getContactNumber());
        payloadMap.put("resourceType", booking.getResourceType());
        payloadMap.put("resourceName", booking.getResourceName());
        payloadMap.put("quantity", booking.getQuantity());
        payloadMap.put("bookedAt", booking.getBookedAt().toString());

        try {
            String payloadJson = objectMapper.writeValueAsString(payloadMap);
            notificationService.createOutboxEvent("BOOKING", booking.getId(), "BOOKING_CONFIRMED", payloadJson);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize booking outbox payload for booking ID={}", booking.getId(), e);
            throw new IllegalStateException("Failed to serialize outbox event payload", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingByReference(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingReference));
        return mapToDto(booking, booking.getHospital(), booking.getPatient(), "Booking record found.");
    }

    private BookingResponseDto mapToDto(Booking booking, Hospital hospital, Patient patient, String message) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setBookingReference(booking.getBookingReference());
        dto.setPatientName(patient.getName());
        dto.setPatientPhone(patient.getPhone());
        dto.setHospitalId(hospital.getId());
        dto.setHospitalName(hospital.getName());
        dto.setHospitalAddress(hospital.getAddress());
        dto.setResourceType(booking.getResourceType());
        dto.setResourceId(booking.getResourceId());
        dto.setResourceName(booking.getResourceName());
        dto.setQuantity(booking.getQuantity());
        dto.setStatus(booking.getStatus());
        dto.setBookedAt(booking.getBookedAt());
        dto.setMessage(message);
        return dto;
    }
}
