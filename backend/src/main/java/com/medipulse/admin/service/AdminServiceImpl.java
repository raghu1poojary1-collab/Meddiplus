package com.medipulse.admin.service;

import com.medipulse.admin.domain.Admin;
import com.medipulse.admin.domain.AuditLog;
import com.medipulse.admin.domain.SearchInterest;
import com.medipulse.admin.dto.LoginRequestDto;
import com.medipulse.admin.dto.LoginResponseDto;
import com.medipulse.admin.dto.UpdateDoctorDutyRequestDto;
import com.medipulse.admin.dto.UpdateMedicineStockRequestDto;
import com.medipulse.admin.dto.UpdateVaccineRequestDto;
import com.medipulse.admin.repository.AdminRepository;
import com.medipulse.admin.repository.AuditLogRepository;
import com.medipulse.admin.repository.SearchInterestRepository;
import com.medipulse.availability.domain.Doctor;
import com.medipulse.availability.domain.Medicine;
import com.medipulse.availability.domain.Vaccine;
import com.medipulse.availability.service.AvailabilityService;
import com.medipulse.common.domain.Hospital;
import com.medipulse.common.domain.Patient;
import com.medipulse.common.event.HospitalDataChangedEvent;
import com.medipulse.common.exception.ResourceNotFoundException;
import com.medipulse.common.exception.UnauthorizedHospitalAccessException;
import com.medipulse.common.repository.HospitalRepository;
import com.medipulse.common.repository.PatientRepository;
import com.medipulse.common.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final AdminRepository adminRepository;
    private final AuditLogRepository auditLogRepository;
    private final SearchInterestRepository searchInterestRepository;
    private final AvailabilityService availabilityService;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final ApplicationEventPublisher eventPublisher;

    public AdminServiceImpl(
            AdminRepository adminRepository,
            AuditLogRepository auditLogRepository,
            SearchInterestRepository searchInterestRepository,
            AvailabilityService availabilityService,
            HospitalRepository hospitalRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            ApplicationEventPublisher eventPublisher) {
        this.adminRepository = adminRepository;
        this.auditLogRepository = auditLogRepository;
        this.searchInterestRepository = searchInterestRepository;
        this.availabilityService = availabilityService;
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtTokenProvider.generateToken(
                admin.getUsername(),
                admin.getHospital().getId(),
                admin.getRole()
        );

        return new LoginResponseDto(
                token,
                admin.getUsername(),
                admin.getFullName(),
                admin.getHospital().getId(),
                admin.getHospital().getName(),
                admin.getRole()
        );
    }

    @Override
    public Admin getAdminByUsername(String username) {
        return adminRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));
    }

    @Override
    @Transactional
    public Doctor updateDoctorDuty(String adminUsername, Long hospitalId, Long doctorId, UpdateDoctorDutyRequestDto request) {
        Admin admin = getAdminByUsername(adminUsername);
        validateHospitalAccess(admin, hospitalId);

        Doctor doctor = availabilityService.getDoctorById(doctorId);
        if (!doctor.getHospital().getId().equals(hospitalId)) {
            throw new IllegalArgumentException("Doctor ID " + doctorId + " does not belong to hospital " + hospitalId);
        }

        Boolean oldStatus = doctor.getOnDuty();
        doctor.setOnDuty(request.getOnDuty());
        if (request.getConsultingHours() != null) {
            doctor.setConsultingHours(request.getConsultingHours());
        }
        doctor.setLastUpdated(LocalDateTime.now());
        Doctor savedDoctor = availabilityService.saveDoctor(doctor);

        Hospital hosp = doctor.getHospital();
        boolean restockedFromZero = !Boolean.TRUE.equals(oldStatus) && Boolean.TRUE.equals(request.getOnDuty());

        // Publish decoupled domain event
        eventPublisher.publishEvent(new HospitalDataChangedEvent(
                hosp.getId(), hosp.getName(), hosp.getCity(),
                admin.getId(), admin.getUsername(),
                "DOCTOR", doctor.getId(), doctor.getName(),
                "UPDATE_DOCTOR_DUTY",
                String.valueOf(oldStatus), String.valueOf(request.getOnDuty()),
                restockedFromZero
        ));

        log.info("Admin '{}' toggled duty status for Doctor '{}' at '{}' from {} to {}",
                adminUsername, doctor.getName(), hosp.getName(), oldStatus, request.getOnDuty());

        return savedDoctor;
    }

    @Override
    @Transactional
    public Medicine updateMedicineStock(String adminUsername, Long hospitalId, Long medicineId, UpdateMedicineStockRequestDto request) {
        Admin admin = getAdminByUsername(adminUsername);
        validateHospitalAccess(admin, hospitalId);

        Medicine medicine = availabilityService.getMedicineById(medicineId);
        if (!medicine.getHospital().getId().equals(hospitalId)) {
            throw new IllegalArgumentException("Medicine ID " + medicineId + " does not belong to hospital " + hospitalId);
        }

        int oldStock = medicine.getStockLevel();
        medicine.setStockLevel(request.getStockLevel());
        if (request.getPrice() != null) {
            medicine.setPrice(request.getPrice());
        }
        medicine.setLastRestocked(LocalDateTime.now());
        Medicine savedMedicine = availabilityService.saveMedicine(medicine);

        Hospital hosp = medicine.getHospital();
        boolean restockedFromZero = (oldStock == 0 && request.getStockLevel() > 0);

        // Publish decoupled domain event
        eventPublisher.publishEvent(new HospitalDataChangedEvent(
                hosp.getId(), hosp.getName(), hosp.getCity(),
                admin.getId(), admin.getUsername(),
                "MEDICINE", medicine.getId(), medicine.getName(),
                "UPDATE_MEDICINE_STOCK",
                String.valueOf(oldStock), String.valueOf(request.getStockLevel()),
                restockedFromZero
        ));

        log.info("Admin '{}' updated stock for Medicine '{}' at '{}' from {} to {}",
                adminUsername, medicine.getName(), hosp.getName(), oldStock, request.getStockLevel());

        return savedMedicine;
    }

    @Override
    @Transactional
    public Vaccine updateVaccineStatus(String adminUsername, Long hospitalId, Long vaccineId, UpdateVaccineRequestDto request) {
        Admin admin = getAdminByUsername(adminUsername);
        validateHospitalAccess(admin, hospitalId);

        Vaccine vaccine = availabilityService.getVaccineById(vaccineId);
        if (!vaccine.getHospital().getId().equals(hospitalId)) {
            throw new IllegalArgumentException("Vaccine ID " + vaccineId + " does not belong to hospital " + hospitalId);
        }

        int oldDoses = vaccine.getDosesAvailable();
        vaccine.setDosesAvailable(request.getDosesAvailable());
        if (request.getColdChainStatus() != null) {
            vaccine.setColdChainStatus(request.getColdChainStatus());
        }
        vaccine.setLastUpdated(LocalDateTime.now());
        Vaccine savedVaccine = availabilityService.saveVaccine(vaccine);

        Hospital hosp = vaccine.getHospital();
        boolean restockedFromZero = (oldDoses == 0 && request.getDosesAvailable() > 0);

        // Publish decoupled domain event
        eventPublisher.publishEvent(new HospitalDataChangedEvent(
                hosp.getId(), hosp.getName(), hosp.getCity(),
                admin.getId(), admin.getUsername(),
                "VACCINE", vaccine.getId(), vaccine.getName(),
                "UPDATE_VACCINE_STATUS",
                String.valueOf(oldDoses), String.valueOf(request.getDosesAvailable()),
                restockedFromZero
        ));

        log.info("Admin '{}' updated vaccine '{}' at '{}' doses from {} to {}, cold-chain={}",
                adminUsername, vaccine.getName(), hosp.getName(), oldDoses, request.getDosesAvailable(), request.getColdChainStatus());

        return savedVaccine;
    }

    @Override
    @Transactional
    public void registerSearchInterest(Long patientId, Long hospitalId, String resourceType, String resourceName) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found: " + hospitalId));

        SearchInterest interest = new SearchInterest(patient, hospital, resourceType.toUpperCase(), resourceName);
        searchInterestRepository.save(interest);
        log.info("Registered restock search interest for patient {} on {} '{}' at hospital '{}'",
                patient.getName(), resourceType, resourceName, hospital.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogs(int page, int size) {
        return auditLogRepository.findByOrderByChangedAtDesc(PageRequest.of(page, size));
    }

    private void validateHospitalAccess(Admin admin, Long targetHospitalId) {
        if ("ROLE_SUPER_ADMIN".equalsIgnoreCase(admin.getRole())) {
            return;
        }
        if (!admin.getHospital().getId().equals(targetHospitalId)) {
            log.warn("Access violation: Admin '{}' (hospital {}) attempted mutating hospital {}",
                    admin.getUsername(), admin.getHospital().getId(), targetHospitalId);
            throw new UnauthorizedHospitalAccessException(
                    "Unauthorized: You can only update resources for your assigned hospital (" + admin.getHospital().getName() + ")");
        }
    }
}
