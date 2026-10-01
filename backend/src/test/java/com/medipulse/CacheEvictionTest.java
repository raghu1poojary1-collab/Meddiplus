package com.medipulse;

import com.medipulse.admin.dto.UpdateMedicineStockRequestDto;
import com.medipulse.admin.service.AdminService;
import com.medipulse.availability.controller.AvailabilityController;
import com.medipulse.availability.dto.SearchResultDto;
import com.medipulse.common.util.CacheKeyUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
@ActiveProfiles("test")
class CacheEvictionTest {

    @Autowired
    private AvailabilityController availabilityController;

    @Autowired
    private AdminService adminService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    @DisplayName("Caffeine cache caches search results and evicts them immediately on admin inventory update")
    void testSearchCacheAndEviction() {
        String resourceType = "MEDICINE";
        String query = "Paracetamol";
        String city = "Moodbidri";
        String cacheKey = CacheKeyUtils.generateSearchKey(resourceType, query, city);

        Cache cache = cacheManager.getCache("hospitalSearchResults");
        assertNotNull(cache, "Caffeine cache 'hospitalSearchResults' must be configured");

        // Clear cache prior to test
        cache.clear();

        // 1. Initial search - should populate the cache
        ResponseEntity<List<SearchResultDto>> initialResponse = availabilityController.search(
                resourceType, query, city, null, null);
        assertNotNull(initialResponse.getBody());

        // Verify cache contains the entry
        Cache.ValueWrapper cachedWrapper = cache.get(cacheKey);
        assertNotNull(cachedWrapper, "Cache must contain entry for key: " + cacheKey);

        // 2. Admin performs an inventory update on Medicine ID=1 (Hospital ID=1, admin: alvas_admin)
        int newStock = 450;
        adminService.updateMedicineStock("alvas_admin", 1L, 1L, new UpdateMedicineStockRequestDto(newStock, "₹18/strip"));

        // 3. Verify cache eviction: cache was invalidated by CacheEvictionEventListener
        Cache.ValueWrapper postEvictionWrapper = cache.get(cacheKey);
        assertNull(postEvictionWrapper, "Cache entry MUST be evicted immediately following admin update");

        // 4. Repeat search - fresh query retrieves the new stock
        ResponseEntity<List<SearchResultDto>> freshResponse = availabilityController.search(
                resourceType, query, city, null, null);
        assertNotNull(freshResponse.getBody());

        SearchResultDto updatedItem = freshResponse.getBody().stream()
                .filter(item -> item.getResourceId().equals(1L))
                .findFirst()
                .orElse(null);

        assertNotNull(updatedItem, "Updated medicine must be present in search results");
        assertEquals(newStock, updatedItem.getAvailableQuantity(), "Search must immediately reflect fresh updated stock");
    }
}
