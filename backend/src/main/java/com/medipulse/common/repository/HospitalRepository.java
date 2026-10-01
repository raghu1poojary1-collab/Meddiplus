package com.medipulse.common.repository;

import com.medipulse.common.domain.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByCityIgnoreCase(String city);
}
