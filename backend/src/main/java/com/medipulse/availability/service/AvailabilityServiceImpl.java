package com.medipulse.availability.service;

import com.medipulse.availability.domain.Doctor;
import com.medipulse.availability.domain.Medicine;
import com.medipulse.availability.domain.Vaccine;
import com.medipulse.availability.dto.SearchResultDto;
import com.medipulse.availability.repository.DoctorRepository;
import com.medipulse.availability.repository.MedicineRepository;
import com.medipulse.availability.repository.VaccineRepository;
import com.medipulse.common.domain.Hospital;
import com.medipulse.common.dto.AlternateHospitalDto;
import com.medipulse.common.exception.ResourceNotFoundException;
import com.medipulse.common.util.HaversineDistanceCalculator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Service providing healthcare resource search and ranking.
 *
 * <h3>Freshness-Weighted Ranking Algorithm Rationale:</h3>
 * <p>
 * In emergency and rural healthcare (such as rural Karnataka/South India), geographical
 * proximity alone is a dangerously misleading metric. A facility located 500 meters away whose
 * stock levels or doctor on-duty status have not been verified for 6 hours is far more likely
 * to result in a wasted, potentially fatal trip than a facility 2.5 kilometers away that
 * confirmed active medicine stock or doctor presence 90 seconds ago.
 * </p>
 * <p>
 * MediPulse directly addresses this trust deficit by scoring each facility as:
 * <pre>
 *   score = (1 / (1 + distanceKm)) * distanceWeight + (1 / (1 + minutesSinceUpdate)) * freshnessWeight
 * </pre>
 * where {@code distanceWeight} and {@code freshnessWeight} are dynamically configurable.
 * By ranking facilities in descending order of this composite score, the system rewards
 * high-fidelity, recently synchronized healthcare data, protecting patients from false reassurance.
 * </p>
 */
@Service
@Transactional(readOnly = true)
public class AvailabilityServiceImpl implements AvailabilityService {

    private static final Logger log = LoggerFactory.getLogger(AvailabilityServiceImpl.class);

    private static final double DEFAULT_MOODBIDRI_LAT = 13.0733;
    private static final double DEFAULT_MOODBIDRI_LNG = 74.9958;

    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;
    private final VaccineRepository vaccineRepository;

    private final double distanceWeight;
    private final double freshnessWeight;

    public AvailabilityServiceImpl(
            DoctorRepository doctorRepository,
            MedicineRepository medicineRepository,
            VaccineRepository vaccineRepository,
            @Value("${medipulse.ranking.distance-weight:0.6}") double distanceWeight,
            @Value("${medipulse.ranking.freshness-weight:0.4}") double freshnessWeight) {
        this.doctorRepository = doctorRepository;
        this.medicineRepository = medicineRepository;
        this.vaccineRepository = vaccineRepository;
        this.distanceWeight = distanceWeight;
        this.freshnessWeight = freshnessWeight;
    }

    @Override
    public List<SearchResultDto> search(String type, String query, String city, Double userLat, Double userLng) {
        double currentLat = (userLat != null) ? userLat : DEFAULT_MOODBIDRI_LAT;
        double currentLng = (userLng != null) ? userLng : DEFAULT_MOODBIDRI_LNG;

        String safeType = (type != null) ? type.trim().toUpperCase() : "ALL";
        String safeQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String safeCity = (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) ? city.trim() : null;

        List<SearchResultDto> results = new ArrayList<>();

        if ("ALL".equals(safeType) || "DOCTOR".equals(safeType)) {
            List<Doctor> doctors = doctorRepository.searchDoctors(safeQuery, safeCity);
            for (Doctor doc : doctors) {
                results.add(mapDoctorToResult(doc, currentLat, currentLng));
            }
        }

        if ("ALL".equals(safeType) || "MEDICINE".equals(safeType)) {
            List<Medicine> medicines = medicineRepository.searchMedicines(safeQuery, safeCity);
            for (Medicine med : medicines) {
                results.add(mapMedicineToResult(med, currentLat, currentLng));
            }
        }

        if ("ALL".equals(safeType) || "VACCINE".equals(safeType)) {
            List<Vaccine> vaccines = vaccineRepository.searchVaccines(safeQuery, safeCity);
            for (Vaccine vac : vaccines) {
                results.add(mapVaccineToResult(vac, currentLat, currentLng));
            }
        }

        // Sort descending by composite score (highest trust & proximity first)
        results.sort(Comparator.comparingDouble(SearchResultDto::getCompositeScore).reversed());

        log.debug("Found and ranked {} healthcare resources for query='{}', city='{}', type='{}'",
                results.size(), safeQuery, safeCity, safeType);

        return results;
    }

    @Override
    public List<AlternateHospitalDto> findAlternates(String resourceType, String resourceName,
                                                     Long excludeHospitalId, Double userLat, Double userLng) {
        double currentLat = (userLat != null) ? userLat : DEFAULT_MOODBIDRI_LAT;
        double currentLng = (userLng != null) ? userLng : DEFAULT_MOODBIDRI_LNG;

        List<AlternateHospitalDto> alternates = new ArrayList<>();
        String safeType = (resourceType != null) ? resourceType.trim().toUpperCase() : "MEDICINE";

        if ("MEDICINE".equals(safeType)) {
            List<Medicine> altMeds = medicineRepository.findAlternateMedicines(resourceName, excludeHospitalId);
            for (Medicine med : altMeds) {
                Hospital h = med.getHospital();
                double dist = HaversineDistanceCalculator.calculateDistanceKm(currentLat, currentLng, h.getLatitude(), h.getLongitude());
                long minutes = calculateMinutesSince(med.getLastRestocked());
                double score = calculateCompositeScore(dist, minutes);

                alternates.add(new AlternateHospitalDto(
                        h.getId(), h.getName(), h.getCity(), h.getContactNumber(),
                        dist, minutes, score, med.getName(), med.getStockLevel(), med.getStockStatus()
                ));
            }
        } else if ("VACCINE".equals(safeType)) {
            List<Vaccine> altVacs = vaccineRepository.findAlternateVaccines(resourceName, excludeHospitalId);
            for (Vaccine vac : altVacs) {
                Hospital h = vac.getHospital();
                double dist = HaversineDistanceCalculator.calculateDistanceKm(currentLat, currentLng, h.getLatitude(), h.getLongitude());
                long minutes = calculateMinutesSince(vac.getLastUpdated());
                double score = calculateCompositeScore(dist, minutes);

                alternates.add(new AlternateHospitalDto(
                        h.getId(), h.getName(), h.getCity(), h.getContactNumber(),
                        dist, minutes, score, vac.getName(), vac.getDosesAvailable(), "AVAILABLE"
                ));
            }
        } else if ("DOCTOR".equals(safeType)) {
            List<Doctor> altDocs = doctorRepository.findAlternateDoctors(resourceName, excludeHospitalId);
            for (Doctor doc : altDocs) {
                Hospital h = doc.getHospital();
                double dist = HaversineDistanceCalculator.calculateDistanceKm(currentLat, currentLng, h.getLatitude(), h.getLongitude());
                long minutes = calculateMinutesSince(doc.getLastUpdated());
                double score = calculateCompositeScore(dist, minutes);

                alternates.add(new AlternateHospitalDto(
                        h.getId(), h.getName(), h.getCity(), h.getContactNumber(),
                        dist, minutes, score, doc.getName() + " (" + doc.getSpecialization() + ")",
                        doc.getQueueCount(), "ON_DUTY"
                ));
            }
        }

        // Sort alternates descending by composite trust score
        alternates.sort(Comparator.comparingDouble(AlternateHospitalDto::getCompositeScore).reversed());
        return alternates;
    }

    @Override
    public double calculateCompositeScore(double distanceKm, long minutesSinceUpdate) {
        double distScore = (1.0 / (1.0 + Math.max(0.0, distanceKm))) * distanceWeight;
        double freshScore = (1.0 / (1.0 + Math.max(0.0, minutesSinceUpdate))) * freshnessWeight;
        return Math.round((distScore + freshScore) * 10000.0) / 10000.0;
    }

    private SearchResultDto mapDoctorToResult(Doctor doc, double userLat, double userLng) {
        SearchResultDto dto = new SearchResultDto();
        Hospital h = doc.getHospital();

        dto.setHospitalId(h.getId());
        dto.setHospitalName(h.getName());
        dto.setHospitalAddress(h.getAddress());
        dto.setCity(h.getCity());
        dto.setLatitude(h.getLatitude());
        dto.setLongitude(h.getLongitude());
        dto.setContactNumber(h.getContactNumber());

        dto.setResourceType("DOCTOR");
        dto.setResourceId(doc.getId());
        dto.setResourceName(doc.getName());
        dto.setStatus(doc.getOnDuty() ? "ON_DUTY" : "OFF_DUTY");
        dto.setCategoryOrSpecialization(doc.getSpecialization());
        dto.setAvailableQuantity(doc.getQueueCount());
        dto.setUnitOrConsultingHours(doc.getConsultingHours());
        dto.setLastUpdated(doc.getLastUpdated());

        populateMetrics(dto, h.getLatitude(), h.getLongitude(), doc.getLastUpdated(), userLat, userLng);
        return dto;
    }

    private SearchResultDto mapMedicineToResult(Medicine med, double userLat, double userLng) {
        SearchResultDto dto = new SearchResultDto();
        Hospital h = med.getHospital();

        dto.setHospitalId(h.getId());
        dto.setHospitalName(h.getName());
        dto.setHospitalAddress(h.getAddress());
        dto.setCity(h.getCity());
        dto.setLatitude(h.getLatitude());
        dto.setLongitude(h.getLongitude());
        dto.setContactNumber(h.getContactNumber());

        dto.setResourceType("MEDICINE");
        dto.setResourceId(med.getId());
        dto.setResourceName(med.getName());
        dto.setStatus(med.getStockStatus());
        dto.setCategoryOrSpecialization(med.getCategory());
        dto.setAvailableQuantity(med.getStockLevel());
        dto.setUnitOrConsultingHours(med.getUnit());
        dto.setPriceOrBatchNo(med.getPrice());
        dto.setLastUpdated(med.getLastRestocked());

        populateMetrics(dto, h.getLatitude(), h.getLongitude(), med.getLastRestocked(), userLat, userLng);
        return dto;
    }

    private SearchResultDto mapVaccineToResult(Vaccine vac, double userLat, double userLng) {
        SearchResultDto dto = new SearchResultDto();
        Hospital h = vac.getHospital();

        dto.setHospitalId(h.getId());
        dto.setHospitalName(h.getName());
        dto.setHospitalAddress(h.getAddress());
        dto.setCity(h.getCity());
        dto.setLatitude(h.getLatitude());
        dto.setLongitude(h.getLongitude());
        dto.setContactNumber(h.getContactNumber());

        dto.setResourceType("VACCINE");
        dto.setResourceId(vac.getId());
        dto.setResourceName(vac.getName());
        dto.setStatus(vac.getDosesAvailable() > 0 ? "AVAILABLE" : "OUT_OF_STOCK");
        dto.setCategoryOrSpecialization("Age: " + vac.getEligibleAgeMin() + "-" + vac.getEligibleAgeMax() + " yrs");
        dto.setAvailableQuantity(vac.getDosesAvailable());
        dto.setPriceOrBatchNo(vac.getBatchNo());
        dto.setColdChainStatus(vac.getColdChainStatus());
        dto.setLastUpdated(vac.getLastUpdated());

        populateMetrics(dto, h.getLatitude(), h.getLongitude(), vac.getLastUpdated(), userLat, userLng);
        return dto;
    }

    private void populateMetrics(SearchResultDto dto, double hospLat, double hospLng,
                                 LocalDateTime lastUpdated, double userLat, double userLng) {
        double dist = HaversineDistanceCalculator.calculateDistanceKm(userLat, userLng, hospLat, hospLng);
        long minutes = calculateMinutesSince(lastUpdated);

        double distScore = (1.0 / (1.0 + Math.max(0.0, dist))) * distanceWeight;
        double freshScore = (1.0 / (1.0 + Math.max(0.0, minutes))) * freshnessWeight;
        double totalScore = Math.round((distScore + freshScore) * 10000.0) / 10000.0;

        dto.setDistanceKm(dist);
        dto.setMinutesSinceUpdate(minutes);
        dto.setDistanceScore(Math.round(distScore * 10000.0) / 10000.0);
        dto.setFreshnessScore(Math.round(freshScore * 10000.0) / 10000.0);
        dto.setCompositeScore(totalScore);
    }

    private long calculateMinutesSince(LocalDateTime timestamp) {
        if (timestamp == null) {
            return 1440L; // default 24 hours stale if timestamp absent
        }
        long minutes = Duration.between(timestamp, LocalDateTime.now()).toMinutes();
        return Math.max(0L, minutes);
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
    }

    @Override
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));
    }

    @Override
    public Vaccine getVaccineById(Long id) {
        return vaccineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with ID: " + id));
    }

    @Override
    @Transactional
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    @Transactional
    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @Override
    @Transactional
    public Vaccine saveVaccine(Vaccine vaccine) {
        return vaccineRepository.save(vaccine);
    }
}
