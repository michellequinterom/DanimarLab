package com.danimar.controller;

import com.danimar.model.Paciente;
import com.danimar.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteRepository repo;

    @GetMapping
    public List<Paciente> listar(@RequestParam(value = "q", required = false) String q) {
        if (q != null && !q.isBlank()) {
            return repo.findByCedulaContainingIgnoreCaseOrNombreCompletoContainingIgnoreCase(q, q);
        }
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtener(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Paciente crear(@RequestBody Paciente p) {
        if (p.getFechaRegistro() == null) p.setFechaRegistro(LocalDate.now());
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizar(@PathVariable Long id, @RequestBody Paciente datos) {
        return repo.findById(id).map(p -> {
            p.setCedula(datos.getCedula());
            p.setNombreCompleto(datos.getNombreCompleto());
            p.setEdad(datos.getEdad());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
