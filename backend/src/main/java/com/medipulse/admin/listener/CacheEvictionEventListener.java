package com.medipulse.admin.listener;

import com.medipulse.common.event.HospitalDataChangedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CacheEvictionEventListener {

    private static final Logger log = LoggerFactory.getLogger(CacheEvictionEventListener.class);

    private final CacheManager cacheManager;

    public CacheEvictionEventListener(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    /**
     * Evicts cached hospital search results on any admin update event.
     * Prevents stale search results from being returned past an update.
     */
    @EventListener
    public void handleCacheEviction(HospitalDataChangedEvent event) {
        Cache cache = cacheManager.getCache("hospitalSearchResults");
        if (cache != null) {
            cache.clear();
            log.info("🧹 Caffeine Cache 'hospitalSearchResults' invalidated due to admin update at hospital '{}' in city '{}'",
                    event.getHospitalName(), event.getCity());
        }
    }
}
