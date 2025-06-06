package com.Training.backend.controllers;

import com.Training.backend.dtos.DateRangeRequest;
import com.Training.backend.dtos.DataRowResponse;
import com.Training.backend.dtos.EditRequest;
import com.Training.backend.entity.Db2Entity;
import com.Training.backend.entity.GeneralInfoEntity;
import com.Training.backend.services.DataService;
import com.Training.backend.auth.LoginSession;
import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DataService dataService;

    @PostMapping("/fetch")
    public ResponseEntity<List<DataRowResponse>> fetchData(
            @Valid @RequestBody DateRangeRequest dateRangeRequest
    ) {
        LocalDate startDate = dateRangeRequest.getStartDate();
        LocalDate endDate = dateRangeRequest.getEndDate();

        // Fetch data for given date range
        List<Db2Entity> entities = dataService.checkDates(startDate, endDate);

        // Map to DTO response
        List<DataRowResponse> response = entities.stream()
                .map(e -> new DataRowResponse(
                        startDate,
                        endDate,
                        e.getId(),
                        e.getSerialNumber(),
                        e.getConsumerType(),
                        e.getConsumerCategory(),    // corrected field name
                        e.getVoltageDescription(),  // corrected field name
                        e.getConsumerCount(),
                        e.getTotalConsumption(),
                        e.getRemarks(),
                        false                       // editable flag (adjust as needed)
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

 @PostMapping("/edit")
public ResponseEntity<Void> saveEdits(@Valid @RequestBody List<EditRequest> edits) {
    String email = LoginSession.currentUserEmail;
    if (email == null) {
        email = "unknown"; // or return unauthorized if needed
    }

    dataService.saveEdits(edits, email);
    return ResponseEntity.ok().build();
}
    @GetMapping("/general-info")
    public ResponseEntity<List<GeneralInfoEntity>> fetchAllGeneralInfo() {
        List<GeneralInfoEntity> allInfo = dataService.getAllGeneralInfo();

        if (allInfo.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(allInfo);
    }
}
