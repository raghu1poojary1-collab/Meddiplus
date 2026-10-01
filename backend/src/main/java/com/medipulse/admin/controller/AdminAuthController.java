package com.medipulse.admin.controller;

import com.medipulse.admin.dto.LoginRequestDto;
import com.medipulse.admin.dto.LoginResponseDto;
import com.medipulse.admin.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminService adminService;

    public AdminAuthController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Authenticates hospital staff admin credentials and issues a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        LoginResponseDto response = adminService.login(request);
        return ResponseEntity.ok(response);
    }
}
