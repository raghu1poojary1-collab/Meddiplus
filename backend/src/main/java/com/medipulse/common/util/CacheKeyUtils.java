package com.medipulse.common.util;

import java.util.Locale;

/**
 * Normalizes cache keys for the Caffeine cache to ensure consistent cache hits
 * regardless of casing, leading/trailing whitespace, or null values.
 */
public final class CacheKeyUtils {

    private CacheKeyUtils() {
    }

    /**
     * Generates a normalized cache key for search results.
     * Format: {resourceType}:{normalizedQuery}:{normalizedCity}
     */
    public static String generateSearchKey(String resourceType, String query, String city) {
        String safeType = (resourceType != null) ? resourceType.trim().toUpperCase(Locale.ROOT) : "ALL";
        String safeQuery = (query != null) ? query.trim().toLowerCase(Locale.ROOT) : "*";
        String safeCity = (city != null) ? city.trim().toLowerCase(Locale.ROOT) : "all";
        return safeType + ":" + safeQuery + ":" + safeCity;
    }
}
