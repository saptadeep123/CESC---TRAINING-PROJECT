package com.Training.backend.repository;

import com.Training.backend.entity.Db1Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Db1Repository extends JpaRepository<Db1Entity, String> {
    // Now uses String as the ID type, matching Db1Entity's serialNumber
}
