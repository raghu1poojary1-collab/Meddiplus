package com.medipulse.common.util;

/**
 * Utility class for computing great-circle distances between points on Earth
 * using the Haversine formula.
 */
public final class HaversineDistanceCalculator {

    private static final double EARTH_RADIUS_KM = 6371.0;

    private HaversineDistanceCalculator() {
        // Utility class
    }

    /**
     * Calculates distance in kilometers between two GPS coordinates.
     *
     * @param lat1 Latitude of point 1 in decimal degrees
     * @param lon1 Longitude of point 1 in decimal degrees
     * @param lat2 Latitude of point 2 in decimal degrees
     * @param lon2 Longitude of point 2 in decimal degrees
     * @return Distance in kilometers rounded to 2 decimal places
     */
    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double originLatRad = Math.toRadians(lat1);
        double targetLatRad = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0)
                + Math.cos(originLatRad) * Math.cos(targetLatRad)
                * Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);

        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        double distance = EARTH_RADIUS_KM * c;

        return Math.round(distance * 100.0) / 100.0;
    }
}
