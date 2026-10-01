package com.medipulse.availability.controller;

import com.medipulse.availability.dto.SearchResultDto;
import com.medipulse.availability.service.AvailabilityService;
import com.medipulse.common.util.CacheKeyUtils;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class AvailabilityController {

    private static final Logger log = LoggerFactory.getLogger(AvailabilityController.class);

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    /**
     * Searches healthcare resources and ranks results by the Freshness-Weighted Ranking Algorithm.
     * Protected by Resilience4j RateLimiter (30 req/min).
     * Cached via Caffeine with short TTL (15s) keyed by (resourceType, normalizedQuery, city).
     */
    @GetMapping
    @RateLimiter(name = "searchRateLimiter")
    @Cacheable(value = "hospitalSearchResults", key = "T(com.medipulse.common.util.CacheKeyUtils).generateSearchKey(#type, #query, #city)")
    public ResponseEntity<List<SearchResultDto>> search(
            @RequestParam(required = false, defaultValue = "ALL") String type,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "all") String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {

        log.debug("Cache miss or fresh evaluation for key={}", CacheKeyUtils.generateSearchKey(type, query, city));
        List<SearchResultDto> results = availabilityService.search(type, query, city, lat, lng);
        return ResponseEntity.ok(results);
    }
}
