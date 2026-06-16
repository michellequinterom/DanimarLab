package com.danimar.service;

import com.danimar.model.Auditoria;
import com.danimar.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/** Registra acciones sensibles en el historial de auditoría. */
@Service
public class AuditoriaService {

    @Autowired private AuditoriaRepository repo;

    public void registrar(String accion, String detalle) {
        try {
            Auditoria a = new Auditoria();
            a.setFechaHora(LocalDateTime.now());
            a.setUsuario("licenciada");
            a.setAccion(accion);
            a.setDetalle(detalle);
            repo.save(a);
        } catch (Exception ignored) {
            // La auditoría nunca debe interrumpir la operación principal.
        }
    }
}
