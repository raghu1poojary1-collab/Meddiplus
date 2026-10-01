package com.medipulse.common.exception;

public class UnauthorizedHospitalAccessException extends RuntimeException {
    public UnauthorizedHospitalAccessException(String message) {
        super(message);
    }
}
