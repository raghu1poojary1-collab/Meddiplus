package com.medipulse.realtime.service;

import com.medipulse.realtime.dto.AvailabilityUpdateMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RealtimeBroadcaster {

    private static final Logger log = LoggerFactory.getLogger(RealtimeBroadcaster.class);

    private final SimpMessagingTemplate messagingTemplate;

    public RealtimeBroadcaster(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Broadcasts live availability update to hospital-specific and global topics.
     */
    public void broadcastAvailabilityUpdate(AvailabilityUpdateMessage message) {
        String hospitalTopic = "/topic/hospital/" + message.getHospitalId() + "/availability";
        String globalTopic = "/topic/availability";

        log.info("Broadcasting real-time availability update for hospital {} to {} and {}: {} {}",
                message.getHospitalId(), hospitalTopic, globalTopic, message.getResourceName(), message.getStatus());

        messagingTemplate.convertAndSend(hospitalTopic, message);
        messagingTemplate.convertAndSend(globalTopic, message);
    }
}
