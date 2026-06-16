package com.danimar.dto;

import java.math.BigDecimal;
import java.util.List;

public record CrearExamenRequest(
        Long idGrupo,
        String nombre,
        String muestra,
        BigDecimal costo,
        List<ParamReq> parametros) {

    public record ParamReq(String nombre, String unidad, String valorReferencia) {
    }
}
