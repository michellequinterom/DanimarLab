package com.danimar.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "parametro")
public class Parametro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_parametro")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_examen", nullable = false)
    private Examen examen;

    @Column(name = "nombre", nullable = false, length = 80)
    private String nombre;

    @Column(name = "unidad", length = 30)
    private String unidad;

    @Column(name = "valor_referencia", columnDefinition = "TEXT")
    private String valorReferencia;
}
