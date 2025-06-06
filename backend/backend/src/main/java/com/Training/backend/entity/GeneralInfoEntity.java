package com.Training.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "general_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneralInfoEntity {

    @Id
    private Long id;

    @Column(name = "discom_name")
    private String discomName;

    @Column(name = "year_of_establishment")
    private Integer yearOfEstablishment;

    private String city;
    private String district;
    private String state;
    private String pin;
    private String telephone;

    @Column(name = "chief_exec_name")
    private String chiefExecName;

    @Column(name = "chief_exec_designation")
    private String chiefExecDesignation;

    @Column(name = "reg_office_address")
    private String regOfficeAddress;

    @Column(name = "reg_office_city")
    private String regOfficeCity;

    @Column(name = "reg_office_district")
    private String regOfficeDistrict;

    @Column(name = "reg_office_state")
    private String regOfficeState;

    @Column(name = "reg_office_pin")
    private String regOfficePin;

    @Column(name = "nodal_officer_name")
    private String nodalOfficerName;

    @Column(name = "nodal_officer_designation")
    private String nodalOfficerDesignation;

    @Column(name = "nodal_officer_address")
    private String nodalOfficerAddress;

    @Column(name = "nodal_officer_city")
    private String nodalOfficerCity;

    @Column(name = "nodal_officer_district")
    private String nodalOfficerDistrict;

    @Column(name = "nodal_officer_state")
    private String nodalOfficerState;

    @Column(name = "nodal_officer_pin")
    private String nodalOfficerPin;

    @Column(name = "energy_manager_name")
    private String energyManagerName;

    @Column(name = "energy_manager_designation")
    private String energyManagerDesignation;

    @Column(name = "energy_manager_type")
    private String energyManagerType;

    @Column(name = "energy_manager_reg_no")
    private String energyManagerRegNo;

    @Column(name = "energy_manager_mobile")
    private String energyManagerMobile;

    @Column(name = "energy_manager_email")
    private String energyManagerEmail;

}
