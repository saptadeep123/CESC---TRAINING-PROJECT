package com.Training.backend.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class EditRequest {
    @NotNull(message = "ID is required")
    private Long id;

    @PositiveOrZero(message = "Consumer count cannot be negative")
    private Integer consumerCount;

    @PositiveOrZero(message = "Total consumption cannot be negative")
    private BigDecimal totalConsumption;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getConsumerCount() { return consumerCount; }
    public void setConsumerCount(Integer consumerCount) { this.consumerCount = consumerCount; }

    public BigDecimal getTotalConsumption() { return totalConsumption; }
    public void setTotalConsumption(BigDecimal totalConsumption) { this.totalConsumption = totalConsumption; }
}
