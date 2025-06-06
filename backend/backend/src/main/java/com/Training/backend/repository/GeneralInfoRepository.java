package com.Training.backend.repository;

import com.Training.backend.entity.GeneralInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneralInfoRepository extends JpaRepository<GeneralInfoEntity, Long> {
    // Remove the method with periodStart and periodEnd
}
