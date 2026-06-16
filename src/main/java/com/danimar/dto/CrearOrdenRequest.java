package com.danimar.dto;

import java.util.List;

public record CrearOrdenRequest(Long idPaciente, String observaciones, List<Long> idExamenes) {
}
