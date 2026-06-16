package com.danimar.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "resultado")
public class Resultado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden_examen", nullable = false)
    private OrdenExamen ordenExamen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_parametro", nullable = false)
    private Parametro parametro;

    @Column(name = "valor", length = 120)
    private String valor;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}
