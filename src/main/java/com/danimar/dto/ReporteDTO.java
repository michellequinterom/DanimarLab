package com.danimar.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ReporteDTO(
        Long idOrden,
        String cedula,
        String paciente,
        Integer edad,
        LocalDate fecha,
        String estadoPago,
        BigDecimal montoAbonado,
        String observaciones,
        BigDecimal costoTotal,
        List<ExamenReporte> examenes) {

    public record ExamenReporte(
            Long idOrdenExamen,
            Long idExamen,
            String nombreExamen,
            String muestra,
            BigDecimal costo,
            List<CampoReporte> campos) {
    }

    public record CampoReporte(
            Long idParametro,
            String nombre,
            String unidad,
            String valorReferencia,
            String valor) {
    }
}
