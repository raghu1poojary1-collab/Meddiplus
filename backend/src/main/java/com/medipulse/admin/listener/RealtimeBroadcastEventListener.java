package com.medipulse.admin.listener;

import com.medipulse.common.event.HospitalDataChangedEvent;
import com.medipulse.realtime.dto.AvailabilityUpdateMessage;
import com.medipulse.realtime.service.RealtimeBroadcaster;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class RealtimeBroadcastEventListener {

    private static final Logger log = LoggerFactory.getLogger(RealtimeBroadcastEventListener.class);

    private final RealtimeBroadcaster realtimeBroadcaster;

    public RealtimeBroadcastEventListener(RealtimeBroadcaster realtimeBroadcaster) {
        this.realtimeBroadcaster = realtimeBroadcaster;
    }

    /**
     * Broadcasts live change to WebSocket clients subscribed to
     * /topic/hospital/{hospitalId}/availability and /topic/availability
     */
    @EventListener
    public void handleRealtimeBroadcast(HospitalDataChangedEvent event) {
        Integer quantity = null;
        try {
            quantity = Integer.parseInt(event.getNewValue());
        } catch (Exception ignored) {
        }

        AvailabilityUpdateMessage msg = new AvailabilityUpdateMessage(
                event.getHospitalId(),
                event.getHospitalName(),
                event.getResourceType(),
                event.getResourceId(),
                event.getResourceName(),
                event.getAction(),
                event.getNewValue(),
                quantity
        );

        realtimeBroadcaster.broadcastAvailabilityUpdate(msg);
    }
}
