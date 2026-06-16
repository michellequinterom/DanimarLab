package com.danimar.dto;

import java.math.BigDecimal;

public record PagoRequest(String estadoPago, BigDecimal montoAbonado) {
}
