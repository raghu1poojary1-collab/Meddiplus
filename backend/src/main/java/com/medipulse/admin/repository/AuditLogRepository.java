package com.medipulse.admin.repository;

import com.medipulse.admin.domain.AuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByOrderByChangedAtDesc(Pageable pageable);
    List<AuditLog> findByTargetTableAndTargetIdOrderByChangedAtDesc(String targetTable, Long targetId);
}
