package com.medipulse.admin.dto;

public class LoginResponseDto {

    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    private Long hospitalId;
    private String hospitalName;
    private String role;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String token, String username, String fullName,
                            Long hospitalId, String hospitalName, String role) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
