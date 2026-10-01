package com.medipulse.admin.repository;

import com.medipulse.admin.domain.SearchInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchInterestRepository extends JpaRepository<SearchInterest, Long> {
    List<SearchInterest> findByHospitalIdAndResourceTypeAndResourceNameIgnoreCase(
            Long hospitalId, String resourceType, String resourceName);
}
