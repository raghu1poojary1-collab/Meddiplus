package com.medipulse.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateMedicineStockRequestDto {

    @NotNull(message = "Stock level is required")
    @Min(value = 0, message = "Stock level cannot be negative")
    private Integer stockLevel;

    private String price;

    public UpdateMedicineStockRequestDto() {
    }

    public UpdateMedicineStockRequestDto(Integer stockLevel, String price) {
        this.stockLevel = stockLevel;
        this.price = price;
    }

    public Integer getStockLevel() {
        return stockLevel;
    }

    public void setStockLevel(Integer stockLevel) {
        this.stockLevel = stockLevel;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }
}
