package com.danimar.repository;

import com.danimar.model.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultadoRepository extends JpaRepository<Resultado, Long> {
    List<Resultado> findByOrdenExamenId(Long idOrdenExamen);
}
