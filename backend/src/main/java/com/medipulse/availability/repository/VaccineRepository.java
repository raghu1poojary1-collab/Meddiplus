package com.medipulse.availability.repository;

import com.medipulse.availability.domain.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {

    List<Vaccine> findByHospitalId(Long hospitalId);

    Optional<Vaccine> findByHospitalIdAndNameIgnoreCase(Long hospitalId, String name);

    @Query("SELECT v FROM Vaccine v WHERE " +
           "(:query IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.batchNo) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR LOWER(v.hospital.city) = LOWER(:city))")
    List<Vaccine> searchVaccines(@Param("query") String query, @Param("city") String city);

    @Query("SELECT v FROM Vaccine v WHERE " +
           "LOWER(v.name) = LOWER(:name) AND " +
           "v.hospital.id != :excludeHospitalId AND " +
           "v.dosesAvailable > 0")
    List<Vaccine> findAlternateVaccines(@Param("name") String name,
                                       @Param("excludeHospitalId") Long excludeHospitalId);
}
