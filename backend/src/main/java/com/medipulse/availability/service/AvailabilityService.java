package com.medipulse.availability.service;

import com.medipulse.availability.domain.Doctor;
import com.medipulse.availability.domain.Medicine;
import com.medipulse.availability.domain.Vaccine;
import com.medipulse.availability.dto.SearchResultDto;
import com.medipulse.common.dto.AlternateHospitalDto;

import java.util.List;

public interface AvailabilityService {

    /**
     * Searches healthcare resources (Doctors, Medicines, Vaccines) and ranks
     * them using the Freshness-Weighted Ranking Algorithm.
     */
    List<SearchResultDto> search(String type, String query, String city, Double userLat, Double userLng);

    /**
     * Discovers alternative hospitals offering the requested resource when the primary target
     * is out of stock or suffered an optimistic locking conflict.
     */
    List<AlternateHospitalDto> findAlternates(String resourceType, String resourceName, Long excludeHospitalId, Double userLat, Double userLng);

    /**
     * Calculates composite trust score combining proximity and data freshness.
     * score = (1 / (1 + distanceKm)) * distanceWeight + (1 / (1 + minutesSinceUpdate)) * freshnessWeight
     */
    double calculateCompositeScore(double distanceKm, long minutesSinceUpdate);

    // Module boundary methods for Booking & Admin modules
    Doctor getDoctorById(Long id);
    Medicine getMedicineById(Long id);
    Vaccine getVaccineById(Long id);

    Doctor saveDoctor(Doctor doctor);
    Medicine saveMedicine(Medicine medicine);
    Vaccine saveVaccine(Vaccine vaccine);
}
