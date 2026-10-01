package com.medipulse.admin.controller;

import com.medipulse.admin.domain.AuditLog;
import com.medipulse.admin.dto.UpdateDoctorDutyRequestDto;
import com.medipulse.admin.dto.UpdateMedicineStockRequestDto;
import com.medipulse.admin.dto.UpdateVaccineRequestDto;
import com.medipulse.admin.service.AdminService;
import com.medipulse.availability.domain.Doctor;
import com.medipulse.availability.domain.Medicine;
import com.medipulse.availability.domain.Vaccine;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminHospitalController {

    private final AdminService adminService;

    public AdminHospitalController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Updates doctor on-duty status and consulting hours.
     * Enforces hospital-scoped authorization.
     */
    @PutMapping("/hospitals/{hospitalId}/doctors/{doctorId}")
    @PreAuthorize("hasAnyRole('HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Doctor> updateDoctorDuty(
            @PathVariable Long hospitalId,
            @PathVariable Long doctorId,
            @Valid @RequestBody UpdateDoctorDutyRequestDto request,
            Authentication authentication) {

        String username = authentication != null ? authentication.getName() : "system";
        Doctor updated = adminService.updateDoctorDuty(username, hospitalId, doctorId, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Updates medicine inventory stock level and price.
     * Enforces hospital-scoped authorization.
     */
    @PutMapping("/hospitals/{hospitalId}/medicines/{medicineId}")
    @PreAuthorize("hasAnyRole('HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Medicine> updateMedicineStock(
            @PathVariable Long hospitalId,
            @PathVariable Long medicineId,
            @Valid @RequestBody UpdateMedicineStockRequestDto request,
            Authentication authentication) {

        String username = authentication != null ? authentication.getName() : "system";
        Medicine updated = adminService.updateMedicineStock(username, hospitalId, medicineId, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Updates vaccine cold-chain status and available doses.
     * Enforces hospital-scoped authorization.
     */
    @PutMapping("/hospitals/{hospitalId}/vaccines/{vaccineId}")
    @PreAuthorize("hasAnyRole('HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Vaccine> updateVaccineStatus(
            @PathVariable Long hospitalId,
            @PathVariable Long vaccineId,
            @Valid @RequestBody UpdateVaccineRequestDto request,
            Authentication authentication) {

        String username = authentication != null ? authentication.getName() : "system";
        Vaccine updated = adminService.updateVaccineStatus(username, hospitalId, vaccineId, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Registers patient interest in a currently exhausted item for automatic restock notification.
     */
    @PostMapping("/interests")
    public ResponseEntity<Map<String, Object>> registerInterest(@RequestBody Map<String, Object> payload) {
        Long patientId = Long.valueOf(payload.get("patientId").toString());
        Long hospitalId = Long.valueOf(payload.get("hospitalId").toString());
        String resourceType = payload.get("resourceType").toString();
        String resourceName = payload.get("resourceName").toString();

        adminService.registerSearchInterest(patientId, hospitalId, resourceType, resourceName);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Restock alert subscription confirmed for " + resourceName
        ));
    }

    /**
     * Retrieves audit trail records.
     */
    @GetMapping("/audit-logs")
    @PreAuthorize("hasAnyRole('HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAuditLogs(page, size));
    }
}
