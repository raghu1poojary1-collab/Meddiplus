package com.medipulse.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateVaccineRequestDto {

    @NotNull(message = "Doses available is required")
    @Min(value = 0, message = "Doses available cannot be negative")
    private Integer dosesAvailable;

    private String coldChainStatus;

    public UpdateVaccineRequestDto() {
    }

    public UpdateVaccineRequestDto(Integer dosesAvailable, String coldChainStatus) {
        this.dosesAvailable = dosesAvailable;
        this.coldChainStatus = coldChainStatus;
    }

    public Integer getDosesAvailable() {
        return dosesAvailable;
    }

    public void setDosesAvailable(Integer dosesAvailable) {
        this.dosesAvailable = dosesAvailable;
    }

    public String getColdChainStatus() {
        return coldChainStatus;
    }

    public void setColdChainStatus(String coldChainStatus) {
        this.coldChainStatus = coldChainStatus;
    }
}
