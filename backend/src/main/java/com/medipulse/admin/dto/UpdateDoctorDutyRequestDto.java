package com.medipulse.admin.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateDoctorDutyRequestDto {

    @NotNull(message = "onDuty flag is required")
    private Boolean onDuty;

    private String consultingHours;

    public UpdateDoctorDutyRequestDto() {
    }

    public UpdateDoctorDutyRequestDto(Boolean onDuty, String consultingHours) {
        this.onDuty = onDuty;
        this.consultingHours = consultingHours;
    }

    public Boolean getOnDuty() {
        return onDuty;
    }

    public void setOnDuty(Boolean onDuty) {
        this.onDuty = onDuty;
    }

    public String getConsultingHours() {
        return consultingHours;
    }

    public void setConsultingHours(String consultingHours) {
        this.consultingHours = consultingHours;
    }
}
