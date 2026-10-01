package com.medipulse.admin.service;

import com.medipulse.admin.domain.Admin;
import com.medipulse.admin.domain.AuditLog;
import com.medipulse.admin.dto.LoginRequestDto;
import com.medipulse.admin.dto.LoginResponseDto;
import com.medipulse.admin.dto.UpdateDoctorDutyRequestDto;
import com.medipulse.admin.dto.UpdateMedicineStockRequestDto;
import com.medipulse.admin.dto.UpdateVaccineRequestDto;
import com.medipulse.availability.domain.Doctor;
import com.medipulse.availability.domain.Medicine;
import com.medipulse.availability.domain.Vaccine;

import java.util.List;

public interface AdminService {

    LoginResponseDto login(LoginRequestDto request);

    Admin getAdminByUsername(String username);

    Doctor updateDoctorDuty(String adminUsername, Long hospitalId, Long doctorId, UpdateDoctorDutyRequestDto request);

    Medicine updateMedicineStock(String adminUsername, Long hospitalId, Long medicineId, UpdateMedicineStockRequestDto request);

    Vaccine updateVaccineStatus(String adminUsername, Long hospitalId, Long vaccineId, UpdateVaccineRequestDto request);

    void registerSearchInterest(Long patientId, Long hospitalId, String resourceType, String resourceName);

    List<AuditLog> getAuditLogs(int page, int size);
}
