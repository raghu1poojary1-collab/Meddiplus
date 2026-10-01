package com.medipulse.availability.repository;

import com.medipulse.availability.domain.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByHospitalId(Long hospitalId);

    Optional<Medicine> findByHospitalIdAndNameIgnoreCase(Long hospitalId, String name);

    @Query("SELECT m FROM Medicine m WHERE " +
           "(:query IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR LOWER(m.hospital.city) = LOWER(:city))")
    List<Medicine> searchMedicines(@Param("query") String query, @Param("city") String city);

    @Query("SELECT m FROM Medicine m WHERE " +
           "LOWER(m.name) = LOWER(:name) AND " +
           "m.hospital.id != :excludeHospitalId AND " +
           "m.stockLevel > 0")
    List<Medicine> findAlternateMedicines(@Param("name") String name,
                                         @Param("excludeHospitalId") Long excludeHospitalId);
}
