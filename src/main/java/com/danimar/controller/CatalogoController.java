package com.danimar.controller;

import com.danimar.dto.CrearExamenRequest;
import com.danimar.dto.ExamenDTO;
import com.danimar.dto.ParametroDTO;
import com.danimar.model.Examen;
import com.danimar.model.GrupoExamen;
import com.danimar.model.Parametro;
import com.danimar.repository.ExamenRepository;
import com.danimar.repository.GrupoExamenRepository;
import com.danimar.repository.ParametroRepository;
import com.danimar.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CatalogoController {

    @Autowired private GrupoExamenRepository grupoRepo;
    @Autowired private ExamenRepository examenRepo;
    @Autowired private ParametroRepository parametroRepo;
    @Autowired private AuditoriaService audit;

    // ---------- Lectura ----------
    @GetMapping("/categorias")
    public List<GrupoExamen> categorias() {
        return grupoRepo.findAll();
    }

    @GetMapping("/examenes")
    public List<ExamenDTO> examenes() {
        return examenRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/examenes/categoria/{idGrupo}")
    public List<ExamenDTO> examenesPorCategoria(@PathVariable Long idGrupo) {
        return examenRepo.findByGrupoIdOrderByNombre(idGrupo).stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/parametros/examen/{idExamen}")
    public List<ParametroDTO> parametros(@PathVariable Long idExamen) {
        return parametroRepo.findByExamenIdOrderById(idExamen).stream()
                .map(p -> new ParametroDTO(p.getId(), p.getNombre(), p.getUnidad(), p.getValorReferencia()))
                .collect(Collectors.toList());
    }

    // ---------- Edición del catálogo ----------
    @PostMapping("/examenes")
    @Transactional
    public ExamenDTO crearExamen(@RequestBody CrearExamenRequest req) {
        GrupoExamen grupo = grupoRepo.findById(req.idGrupo()).orElseThrow();
        Examen e = new Examen();
        e.setGrupo(grupo);
        e.setNombre(req.nombre());
        e.setMuestra(req.muestra());
        e.setCosto(req.costo() != null ? req.costo() : BigDecimal.ZERO);
        e = examenRepo.save(e);
        if (req.parametros() != null) {
            for (CrearExamenRequest.ParamReq pr : req.parametros()) {
                if (pr.nombre() == null || pr.nombre().isBlank()) continue;
                Parametro p = new Parametro();
                p.setExamen(e);
                p.setNombre(pr.nombre());
                p.setUnidad(pr.unidad());
                p.setValorReferencia(pr.valorReferencia());
                parametroRepo.save(p);
            }
        }
        audit.registrar("agregar_examen", "Examen: " + e.getNombre());
        return toDto(e);
    }

    @PutMapping("/examenes/{id}")
    @Transactional
    public ResponseEntity<?> editarExamen(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Examen e = examenRepo.findById(id).orElseThrow();
        if (body.get("nombre") != null) e.setNombre(body.get("nombre").toString());
        if (body.get("muestra") != null) e.setMuestra(body.get("muestra").toString());
        if (body.get("costo") != null) e.setCosto(new BigDecimal(body.get("costo").toString()));
        examenRepo.save(e);
        audit.registrar("editar_examen", "Examen: " + e.getNombre());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/examenes/{id}")
    @Transactional
    public ResponseEntity<?> borrarExamen(@PathVariable Long id) {
        Examen e = examenRepo.findById(id).orElseThrow();
        String nombre = e.getNombre();
        try {
            for (Parametro p : parametroRepo.findByExamenIdOrderById(id)) parametroRepo.delete(p);
            examenRepo.delete(e);
        } catch (Exception ex) {
            return ResponseEntity.status(409).body(Map.of("error", "No se puede borrar: el examen tiene reportes asociados."));
        }
        audit.registrar("borrar_examen", "Examen: " + nombre);
        return ResponseEntity.ok().build();
    }

    private ExamenDTO toDto(Examen e) {
        Long idGrupo = (e.getGrupo() != null) ? e.getGrupo().getId() : null;
        return new ExamenDTO(e.getId(), e.getNombre(), e.getMuestra(), e.getCosto(), idGrupo);
    }
}
