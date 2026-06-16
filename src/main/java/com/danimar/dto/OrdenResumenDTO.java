package com.danimar.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OrdenResumenDTO(
        Long idOrden,
        Integer num,
        LocalDate fecha,
        String cedula,
        String paciente,
        BigDecimal costoTotal,
        String estadoPago,
        BigDecimal montoAbonado) {
}
