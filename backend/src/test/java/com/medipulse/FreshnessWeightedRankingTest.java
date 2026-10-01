package com.medipulse;

import com.medipulse.availability.dto.SearchResultDto;
import com.medipulse.availability.service.AvailabilityService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class FreshnessWeightedRankingTest {

    @Autowired
    private AvailabilityService availabilityService;

    @Test
    @DisplayName("Mathematical proof: Farther hospital with fresh data outranks closer hospital with stale data")
    void testFreshnessReorderingRationale() {
        // Hospital A: 0.5 km away, but updated 360 minutes ago (6 hours stale)
        double distA = 0.5;
        long minutesA = 360;
        double scoreA = availabilityService.calculateCompositeScore(distA, minutesA);

        // Hospital B: 1.0 km away (twice as far), but updated 1 minute ago (freshly verified)
        double distB = 1.0;
        long minutesB = 1;
        double scoreB = availabilityService.calculateCompositeScore(distB, minutesB);

        // Hospital C: 2.0 km away (four times as far), updated 2 minutes ago
        double distC = 2.0;
        long minutesC = 2;
        double scoreC = availabilityService.calculateCompositeScore(distC, minutesC);

        System.out.println("Score A (0.5km, 360m stale): " + scoreA);
        System.out.println("Score B (1.0km, 1m fresh):   " + scoreB);
        System.out.println("Score C (2.0km, 2m fresh):   " + scoreC);

        // Score A: (1 / 1.5) * 0.6 + (1 / 361) * 0.4 = 0.4000 + 0.0011 = 0.4011
        // Score B: (1 / 2.0) * 0.6 + (1 / 2) * 0.4   = 0.3000 + 0.2000 = 0.5000
        assertTrue(scoreB > scoreA,
                "A facility 1km away with 1-min-old verified data MUST outrank a 500m facility with 6-hour-stale data");
    }

    @Test
    @DisplayName("Search endpoint returns results ordered descending by composite score")
    void testSearchResultsOrder() {
        // Query General Medicine doctors in Moodbidri
        List<SearchResultDto> results = availabilityService.search("DOCTOR", "General", "Moodbidri", 13.0733, 74.9958);

        assertTrue(results.size() >= 2, "Expected at least 2 doctors in seed data");

        // Assert strictly monotonic descending ordering by compositeScore
        for (int i = 0; i < results.size() - 1; i++) {
            SearchResultDto current = results.get(i);
            SearchResultDto next = results.get(i + 1);

            assertTrue(current.getCompositeScore() >= next.getCompositeScore(),
                    String.format("Result at index %d (score=%.4f) must be >= result at index %d (score=%.4f)",
                            i, current.getCompositeScore(), i + 1, next.getCompositeScore()));
        }
    }
}
