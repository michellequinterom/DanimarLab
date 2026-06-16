package com.danimar.repository;

import com.danimar.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    List<Paciente> findByCedulaContainingIgnoreCaseOrNombreCompletoContainingIgnoreCase(String cedula, String nombre);
}
