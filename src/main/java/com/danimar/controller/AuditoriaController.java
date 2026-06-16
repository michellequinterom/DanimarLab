package com.danimar.controller;

import com.danimar.model.Auditoria;
import com.danimar.repository.AuditoriaRepository;
import com.danimar.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    @Autowired private AuditoriaRepository repo;
    @Autowired private AuditoriaService audit;

    @GetMapping
    public List<Auditoria> listar() {
        return repo.findAllByOrderByFechaHoraDesc();
    }

    /** Limpia el historial; requiere la contraseña de auditoría (distinta a la de la sesión). */
    @DeleteMapping
    public ResponseEntity<?> limpiar(@RequestBody Map<String, String> body) {
        if (!AuthController.CLAVE_AUDITORIA.equals(body.get("clave"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Contraseña de auditoría incorrecta."));
        }
        repo.deleteAll();
        audit.registrar("limpiar_auditoria", "Se limpió el historial de auditoría.");
        return ResponseEntity.ok().build();
    }
}
