package com.danimar.service;

import com.danimar.dto.ReporteDTO;
import com.danimar.model.*;
import com.danimar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class ReporteService {

    @Autowired private OrdenRepository ordenRepo;
    @Autowired private OrdenExamenRepository ordenExamenRepo;
    @Autowired private ParametroRepository parametroRepo;
    @Autowired private ResultadoRepository resultadoRepo;

    /** Costo total de una orden = suma del costo de sus exámenes. */
    @Transactional(readOnly = true)
    public BigDecimal costoTotal(Long idOrden) {
        BigDecimal total = BigDecimal.ZERO;
        for (OrdenExamen oe : ordenExamenRepo.findByOrdenId(idOrden)) {
            total = total.add(oe.getCosto() != null ? oe.getCosto() : BigDecimal.ZERO);
        }
        return total;
    }

    /** Arma el reporte completo de una orden. */
    @Transactional(readOnly = true)
    public ReporteDTO armarReporte(Long idOrden) {
        Orden orden = ordenRepo.findById(idOrden).orElseThrow();
        BigDecimal total = BigDecimal.ZERO;
        List<ReporteDTO.ExamenReporte> examenes = new ArrayList<>();

        for (OrdenExamen oe : ordenExamenRepo.findByOrdenId(idOrden)) {
            Examen e = oe.getExamen();
            BigDecimal costo = oe.getCosto() != null ? oe.getCosto() : BigDecimal.ZERO;
            total = total.add(costo);

            Map<Long, String> valores = new HashMap<>();
            for (Resultado r : resultadoRepo.findByOrdenExamenId(oe.getId())) {
                valores.put(r.getParametro().getId(), r.getValor());
            }

            List<ReporteDTO.CampoReporte> campos = new ArrayList<>();
            for (Parametro p : parametroRepo.findByExamenIdOrderById(e.getId())) {
                campos.add(new ReporteDTO.CampoReporte(
                        p.getId(), p.getNombre(), p.getUnidad(), p.getValorReferencia(),
                        valores.get(p.getId())));
            }
            examenes.add(new ReporteDTO.ExamenReporte(
                    oe.getId(), e.getId(), e.getNombre(), e.getMuestra(), costo, campos));
        }

        Paciente p = orden.getPaciente();
        return new ReporteDTO(
                orden.getId(), p.getCedula(), p.getNombreCompleto(), p.getEdad(),
                orden.getFechaAnalisis(), orden.getEstadoPago(), orden.getMontoAbonado(),
                orden.getObservaciones(), total, examenes);
    }
}
