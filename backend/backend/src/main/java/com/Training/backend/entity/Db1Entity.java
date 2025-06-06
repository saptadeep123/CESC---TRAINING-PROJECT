package com.Training.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "EA_CONS_CNSP_HDR")
@Data
public class Db1Entity {

    @Id
    @Column(name = "SRL_NO", length = 10)
    private String serialNumber;

    @Column(name = "CONS_TYPE", length = 200)
    private String consumerType;

    @Column(name = "CONS_CATEG_LH_MKR", length = 10)
    private String consumerCategory;

    @Column(name = "VOLTAGE_DESC", length = 50)
    private String voltageDescription;

    @Column(name = "REMARKS", length = 300)
    private String remarks;

    @Column(name = "CRT_BY", length = 50)
    private String createdBy;

    @Column(name = "CRT_DT")
    @Temporal(TemporalType.DATE)
    private Date createdDate;
}
