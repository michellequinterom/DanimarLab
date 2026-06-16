package com.danimar.repository;

import com.danimar.model.Parametro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParametroRepository extends JpaRepository<Parametro, Long> {
    List<Parametro> findByExamenIdOrderById(Long idExamen);
}
