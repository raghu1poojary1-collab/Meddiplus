package com.medipulse.notification.repository;

import com.medipulse.notification.domain.OutboxEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    List<OutboxEvent> findByStatusOrderByCreatedAtAsc(String status, Pageable pageable);

    List<OutboxEvent> findByStatus(String status);

    long countByStatus(String status);
}
