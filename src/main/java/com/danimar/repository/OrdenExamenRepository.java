package com.danimar.repository;

import com.danimar.model.OrdenExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenExamenRepository extends JpaRepository<OrdenExamen, Long> {
    List<OrdenExamen> findByOrdenId(Long idOrden);
}
