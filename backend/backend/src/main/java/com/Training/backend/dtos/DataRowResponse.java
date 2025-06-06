package com.Training.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DataRowResponse {
    private LocalDate startDate;
    private LocalDate endDate;

    private Long id;
    private String serialNumber;        // String as before
    private String consumerType;
    private String consumerCategory;    // Renamed from category
    private String voltageDescription;  // Renamed from voltageLevel
    private Integer consumerCount;
    private BigDecimal totalConsumption;  // Changed to BigDecimal
    private String remarks;
    private boolean editable;  // true if user can edit this row, false if locked

    // Constructor
    public DataRowResponse(LocalDate startDate, LocalDate endDate,
                           Long id, String serialNumber, String consumerType, String consumerCategory,
                           String voltageDescription, Integer consumerCount, BigDecimal totalConsumption,
                           String remarks, boolean editable) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
        this.serialNumber = serialNumber;
        this.consumerType = consumerType;
        this.consumerCategory = consumerCategory;
        this.voltageDescription = voltageDescription;
        this.consumerCount = consumerCount;
        this.totalConsumption = totalConsumption;
        this.remarks = remarks;
        this.editable = editable;
    }

    // Getters and setters

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getConsumerType() {
        return consumerType;
    }

    public void setConsumerType(String consumerType) {
        this.consumerType = consumerType;
    }

    public String getConsumerCategory() {
        return consumerCategory;
    }

    public void setConsumerCategory(String consumerCategory) {
        this.consumerCategory = consumerCategory;
    }

    public String getVoltageDescription() {
        return voltageDescription;
    }

    public void setVoltageDescription(String voltageDescription) {
        this.voltageDescription = voltageDescription;
    }

    public Integer getConsumerCount() {
        return consumerCount;
    }

    public void setConsumerCount(Integer consumerCount) {
        this.consumerCount = consumerCount;
    }

    public BigDecimal getTotalConsumption() {
        return totalConsumption;
    }

    public void setTotalConsumption(BigDecimal totalConsumption) {
        this.totalConsumption = totalConsumption;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }
}
