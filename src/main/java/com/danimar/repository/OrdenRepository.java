package com.danimar.repository;

import com.danimar.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByPacienteId(Long idPaciente);
}
