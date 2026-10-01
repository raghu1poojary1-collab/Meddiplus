package com.medipulse.admin.listener;

import com.medipulse.admin.domain.Admin;
import com.medipulse.admin.domain.AuditLog;
import com.medipulse.admin.repository.AdminRepository;
import com.medipulse.admin.repository.AuditLogRepository;
import com.medipulse.common.event.HospitalDataChangedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AuditLogEventListener {

    private static final Logger log = LoggerFactory.getLogger(AuditLogEventListener.class);

    private final AuditLogRepository auditLogRepository;
    private final AdminRepository adminRepository;

    public AuditLogEventListener(AuditLogRepository auditLogRepository, AdminRepository adminRepository) {
        this.auditLogRepository = auditLogRepository;
        this.adminRepository = adminRepository;
    }

    /**
     * Persists immutable audit trail for every hospital inventory/status alteration.
     */
    @EventListener
    public void handleHospitalDataChanged(HospitalDataChangedEvent event) {
        log.info("Auditing action '{}' on {} ID={} by admin '{}'",
                event.getAction(), event.getResourceType(), event.getResourceId(), event.getAdminUsername());

        Admin admin = null;
        if (event.getAdminId() != null) {
            admin = adminRepository.findById(event.getAdminId()).orElse(null);
        }

        String metadata = String.format("{\"from\":\"%s\",\"to\":\"%s\",\"hospitalName\":\"%s\"}",
                event.getOldValue(), event.getNewValue(), event.getHospitalName());

        AuditLog auditLog = new AuditLog(
                admin,
                event.getAdminUsername(),
                event.getAction(),
                event.getResourceType().toLowerCase(),
                event.getResourceId(),
                metadata
        );

        auditLogRepository.save(auditLog);
    }
}
