package com.danimar.dto;

import java.math.BigDecimal;

public record EstadisticasDTO(
        long total,
        long pendientes,
        long parciales,
        long pagados,
        BigDecimal cobrado,
        BigDecimal porCobrar) {
}
