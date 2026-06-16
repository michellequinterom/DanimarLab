package com.danimar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "auditoria")
public class Auditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Long id;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();

    @Column(name = "usuario", length = 60)
    private String usuario;

    @Column(name = "accion", length = 60)
    private String accion;

    @Column(name = "detalle", columnDefinition = "TEXT")
    private String detalle;
}
