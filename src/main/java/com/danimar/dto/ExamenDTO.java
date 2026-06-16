package com.danimar.dto;

import java.math.BigDecimal;

public record ExamenDTO(Long id, String nombre, String muestra, BigDecimal costo, Long idGrupo) {
}
