package com.danimar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "orden")
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "fecha_analisis")
    private LocalDate fechaAnalisis = LocalDate.now();

    // pendiente / pago / parcial
    @Column(name = "estado_pago", length = 10)
    private String estadoPago = "pendiente";

    @Column(name = "monto_abonado", precision = 10, scale = 2)
    private BigDecimal montoAbonado = BigDecimal.ZERO;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}
