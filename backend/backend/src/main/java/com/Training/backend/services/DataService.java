package com.Training.backend.services;

import com.Training.backend.dtos.EditRequest;
import com.Training.backend.entity.Db1Entity;
import com.Training.backend.entity.Db2Entity;
import com.Training.backend.entity.GeneralInfoEntity;
import com.Training.backend.repository.Db1Repository;
import com.Training.backend.repository.Db2Repository;
import com.Training.backend.repository.GeneralInfoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataService {

    @Autowired
    private Db1Repository db1Repo;

    @Autowired
    private Db2Repository db2Repo;

    @Autowired
    private GeneralInfoRepository generalInfoRepo;

    private static Date toDate(LocalDate localDate) {
        if (localDate == null) return null;
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    /**
     * Checks if data exists in DB2 for the given date range.
     * If not, copies all data from DB1 to DB2 with that date range.
     * If yes, updates the updatedAt field to current date/time.
     */
    @Transactional
    public List<Db2Entity> checkDates(LocalDate startDate, LocalDate endDate) {
        Date start = toDate(startDate);
        Date end = toDate(endDate);
        Date now = new Date();

        List<Db2Entity> existingData = db2Repo.findByStartDateAndEndDate(start, end);

        if (!existingData.isEmpty()) {
            // Update updatedAt on existing records
            existingData.forEach(entity -> {
                entity.setUpdatedAt(now);
            });
            db2Repo.saveAll(existingData);
            return existingData;
        }

        List<Db1Entity> sourceData = db1Repo.findAll();

        List<Db2Entity> newData = sourceData.stream()
            .map(db1Item -> Db2Entity.builder()
                .serialNumber(db1Item.getSerialNumber())
                .consumerType(db1Item.getConsumerType())
                .consumerCategory(db1Item.getConsumerCategory())
                .voltageDescription(db1Item.getVoltageDescription())
                .remarks(db1Item.getRemarks())
                .startDate(start)
                .endDate(end)
                //.createdBy("Saptadeep Das")  // or any default creator
                .createdAt(now)
                .updatedAt(now)
                .build())
            .collect(Collectors.toList());

        return db2Repo.saveAll(newData);
    }

    /**
     * Save user edits to DB2 entities.
     * @param edits List of edits from frontend
     * @param updatedByName The user name fetched from session to set in updatedBy field
     */
    @Transactional
    public void saveEdits(List<EditRequest> edits, String updatedByName) {
        Date now = new Date();

        edits.forEach(edit -> {
            Db2Entity entity = db2Repo.findById(edit.getId())
                .orElseThrow(() -> new RuntimeException("Data not found for id: " + edit.getId()));

            entity.setConsumerCount(edit.getConsumerCount());
            entity.setTotalConsumption(edit.getTotalConsumption());
            if (updatedByName != null && !updatedByName.isEmpty()) {
                entity.setUpdatedBy(updatedByName);
            }
            entity.setUpdatedAt(now);

            db2Repo.save(entity);
        });
    }

    public List<GeneralInfoEntity> getAllGeneralInfo() {
        return generalInfoRepo.findAll();
    }
}
