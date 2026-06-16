package com.danimar.repository;

import com.danimar.model.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamenRepository extends JpaRepository<Examen, Long> {
    List<Examen> findByGrupoIdOrderByNombre(Long idGrupo);
}
