package com.medipulse.availability.repository;

import com.medipulse.availability.domain.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByHospitalId(Long hospitalId);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:query IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR LOWER(d.hospital.city) = LOWER(:city))")
    List<Doctor> searchDoctors(@Param("query") String query, @Param("city") String city);

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.specialization) = LOWER(:specialization) AND " +
           "d.hospital.id != :excludeHospitalId AND " +
           "d.onDuty = true")
    List<Doctor> findAlternateDoctors(@Param("specialization") String specialization,
                                      @Param("excludeHospitalId") Long excludeHospitalId);
}
