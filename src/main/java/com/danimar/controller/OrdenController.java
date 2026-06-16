package com.danimar.controller;

import com.danimar.dto.*;
import com.danimar.model.*;
import com.danimar.repository.*;
import com.danimar.service.ReporteService;
import com.danimar.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired private OrdenRepository ordenRepo;
    @Autowired private OrdenExamenRepository ordenExamenRepo;
    @Autowired private ResultadoRepository resultadoRepo;
    @Autowired private ParametroRepository parametroRepo;
    @Autowired private ExamenRepository examenRepo;
    @Autowired private PacienteRepository pacienteRepo;
    @Autowired private ReporteService reporteService;
    @Autowired private AuditoriaService audit;

    /** Crea una orden para un paciente con los exámenes seleccionados. */
    @PostMapping
    @Transactional
    public ReporteDTO crear(@RequestBody CrearOrdenRequest req) {
        Paciente paciente = pacienteRepo.findById(req.idPaciente()).orElseThrow();
        Orden orden = new Orden();
        orden.setPaciente(paciente);
        orden.setFechaAnalisis(LocalDate.now());
        orden.setEstadoPago("pendiente");
        orden.setMontoAbonado(BigDecimal.ZERO);
        orden.setObservaciones(req.observaciones());
        orden = ordenRepo.save(orden);

        if (req.idExamenes() != null) {
            for (Long idEx : req.idExamenes()) {
                Examen e = examenRepo.findById(idEx).orElseThrow();
                OrdenExamen oe = new OrdenExamen();
                oe.setOrden(orden);
                oe.setExamen(e);
                oe.setCosto(e.getCosto());
                ordenExamenRepo.save(oe);
            }
        }
        return reporteService.armarReporte(orden.getId());
    }

    /** Lista las órdenes con número consecutivo y filtros opcionales. */
    @GetMapping
    @Transactional(readOnly = true)
    public List<OrdenResumenDTO> listar(@RequestParam(required = false) String q,
                                        @RequestParam(required = false) String desde,
                                        @RequestParam(required = false) String hasta,
                                        @RequestParam(required = false) String estado) {
        // Orden global ascendente para asignar el número consecutivo.
        List<Orden> todas = new ArrayList<>(ordenRepo.findAll());
        todas.sort(Comparator.comparing(Orden::getFechaAnalisis).thenComparing(Orden::getId));

        List<OrdenResumenDTO> lista = new ArrayList<>();
        int num = 0;
        for (Orden o : todas) {
            num++;
            Paciente p = o.getPaciente();
            // Filtros
            if (q != null && !q.isBlank()) {
                String s = q.toLowerCase();
                if (!p.getCedula().toLowerCase().contains(s) && !p.getNombreCompleto().toLowerCase().contains(s)) continue;
            }
            if (desde != null && !desde.isBlank() && o.getFechaAnalisis().isBefore(LocalDate.parse(desde))) continue;
            if (hasta != null && !hasta.isBlank() && o.getFechaAnalisis().isAfter(LocalDate.parse(hasta))) continue;
            if (estado != null && !estado.isBlank() && !estado.equals(o.getEstadoPago())) continue;

            lista.add(new OrdenResumenDTO(o.getId(), num, o.getFechaAnalisis(),
                    p.getCedula(), p.getNombreCompleto(), reporteService.costoTotal(o.getId()),
                    o.getEstadoPago(), o.getMontoAbonado()));
        }
        // Mostrar de la más reciente a la más antigua.
        lista.sort(Comparator.comparing(OrdenResumenDTO::idOrden).reversed());
        return lista;
    }

    /** Estadísticas globales (no dependen del filtro). */
    @GetMapping("/estadisticas")
    @Transactional(readOnly = true)
    public EstadisticasDTO estadisticas() {
        long total = 0, pend = 0, parc = 0, pag = 0;
        BigDecimal cobrado = BigDecimal.ZERO, porCobrar = BigDecimal.ZERO;
        for (Orden o : ordenRepo.findAll()) {
            total++;
            BigDecimal costo = reporteService.costoTotal(o.getId());
            BigDecimal abonado = o.getMontoAbonado() != null ? o.getMontoAbonado() : BigDecimal.ZERO;
            switch (o.getEstadoPago()) {
                case "pago" -> { pag++; cobrado = cobrado.add(costo); }
                case "parcial" -> { parc++; cobrado = cobrado.add(abonado); porCobrar = porCobrar.add(costo.subtract(abonado)); }
                default -> { pend++; porCobrar = porCobrar.add(costo); }
            }
        }
        return new EstadisticasDTO(total, pend, parc, pag, cobrado, porCobrar);
    }

    @GetMapping("/{id}/reporte")
    public ReporteDTO reporte(@PathVariable Long id) {
        return reporteService.armarReporte(id);
    }

    /** Guarda (o actualiza) los valores de los resultados de la orden. */
    @PostMapping("/{id}/resultados")
    @Transactional
    public ResponseEntity<?> guardarResultados(@PathVariable Long id, @RequestBody List<ResultadoItem> items) {
        for (ResultadoItem it : items) {
            if (it.valor() == null || it.valor().isBlank()) continue;
            OrdenExamen oe = ordenExamenRepo.findById(it.idOrdenExamen()).orElseThrow();
            Parametro pa = parametroRepo.findById(it.idParametro()).orElseThrow();
            Resultado res = resultadoRepo.findByOrdenExamenId(oe.getId()).stream()
                    .filter(r -> r.getParametro().getId().equals(pa.getId()))
                    .findFirst().orElseGet(Resultado::new);
            res.setOrdenExamen(oe);
            res.setParametro(pa);
            res.setValor(it.valor());
            resultadoRepo.save(res);
        }
        return ResponseEntity.ok().build();
    }

    /** Actualiza el estado de pago de la orden. */
    @PutMapping("/{id}/pago")
    @Transactional
    public ResponseEntity<?> actualizarPago(@PathVariable Long id, @RequestBody PagoRequest req) {
        Orden o = ordenRepo.findById(id).orElseThrow();
        o.setEstadoPago(req.estadoPago());
        o.setMontoAbonado(req.montoAbonado() != null ? req.montoAbonado() : BigDecimal.ZERO);
        ordenRepo.save(o);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Orden o = ordenRepo.findById(id).orElseThrow();
        String detalle = "Reporte de " + o.getPaciente().getNombreCompleto() + " (orden " + id + ")";
        for (OrdenExamen oe : ordenExamenRepo.findByOrdenId(id)) {
            for (Resultado r : resultadoRepo.findByOrdenExamenId(oe.getId())) resultadoRepo.delete(r);
            ordenExamenRepo.delete(oe);
        }
        ordenRepo.deleteById(id);
        audit.registrar("borrar_reporte", detalle);
        return ResponseEntity.ok().build();
    }
}
