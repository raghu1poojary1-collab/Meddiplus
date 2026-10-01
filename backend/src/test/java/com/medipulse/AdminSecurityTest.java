package com.medipulse;

import com.medipulse.admin.dto.LoginRequestDto;
import com.medipulse.admin.dto.LoginResponseDto;
import com.medipulse.admin.dto.UpdateDoctorDutyRequestDto;
import com.medipulse.admin.service.AdminService;
import com.medipulse.common.exception.UnauthorizedHospitalAccessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class AdminSecurityTest {

    @Autowired
    private AdminService adminService;

    @Test
    @DisplayName("Hospital admin authenticates, receives JWT, and is blocked from modifying another hospital's records")
    void testHospitalScopedSecurity() {
        // 1. Authenticate alvas_admin (Hospital 1)
        LoginResponseDto login = adminService.login(new LoginRequestDto("alvas_admin", "admin123"));
        assertNotNull(login.getToken());
        assertEquals(1L, login.getHospitalId());

        // 2. Attempt unauthorized mutation on Hospital 2 (Government CHC) -> Must throw UnauthorizedHospitalAccessException
        assertThrows(UnauthorizedHospitalAccessException.class, () ->
                adminService.updateDoctorDuty("alvas_admin", 2L, 4L, new UpdateDoctorDutyRequestDto(false, "09:00 - 13:00")),
                "Admin from Hospital 1 must NOT be allowed to mutate Hospital 2 records");

        // 3. Authorized mutation on Hospital 1 -> Must succeed
        assertDoesNotThrow(() ->
                adminService.updateDoctorDuty("alvas_admin", 1L, 1L, new UpdateDoctorDutyRequestDto(true, "08:00 - 17:00")));
    }
}
