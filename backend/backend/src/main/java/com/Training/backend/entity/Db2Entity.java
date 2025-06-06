package com.Training.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.math.BigDecimal;

@Entity
@Table(name = "EA_CONS_CNSP_DTL")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Db2Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date range (immutable once set)
    @Column(name = "QTR_STRT", updatable = false)
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "QTR_END", updatable = false)
    @Temporal(TemporalType.DATE)
    private Date endDate;

    // Read-only fields (copied from db1)
    @Column(name = "SRL_NO", length = 10, updatable = false)
    private String serialNumber;

    @Column(name = "CONS_TYPE", length = 200, updatable = false)
    private String consumerType;

    @Column(name = "CONS_CATEG_LH_MKR", length = 10, updatable = false)
    private String consumerCategory;

    @Column(name = "VOLTAGE_DESC", length = 50, updatable = false)
    private String voltageDescription;

    @Column(name = "REMARKS", length = 300, updatable = false)
    private String remarks;

    // Editable fields
    @Column(name = "CONS_CNT")
    private Integer consumerCount;

    @Column(name = "CNSP", precision = 15, scale = 2)
    private BigDecimal totalConsumption;

    // Metadata fields
    @Column(name = "CRT_BY", length = 50, updatable = false)
    private String createdBy;

    @Column(name = "CRT_DT", updatable = false)
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @Column(name = "UPD_BY", length = 50)
    private String updatedBy;

    @Column(name = "UPD_DT")
    @Temporal(TemporalType.DATE)
    private Date updatedAt;
}
