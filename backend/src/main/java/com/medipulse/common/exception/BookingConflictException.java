package com.medipulse.common.exception;

import com.medipulse.common.dto.AlternateHospitalDto;
import java.util.Collections;
import java.util.List;

public class BookingConflictException extends RuntimeException {

    private final List<AlternateHospitalDto> alternateHospitals;

    public BookingConflictException(String message) {
        super(message);
        this.alternateHospitals = Collections.emptyList();
    }

    public BookingConflictException(String message, List<AlternateHospitalDto> alternateHospitals) {
        super(message);
        this.alternateHospitals = alternateHospitals != null ? alternateHospitals : Collections.emptyList();
    }

    public List<AlternateHospitalDto> getAlternateHospitals() {
        return alternateHospitals;
    }
}
