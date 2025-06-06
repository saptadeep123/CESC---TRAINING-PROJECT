package com.Training.backend.repository;

import com.Training.backend.entity.Db2Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import java.util.List;

public interface Db2Repository extends JpaRepository<Db2Entity, Long> {
    List<Db2Entity> findByStartDateAndEndDate(Date startDate, Date endDate);
}
