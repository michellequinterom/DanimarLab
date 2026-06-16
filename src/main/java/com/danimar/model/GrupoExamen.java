package com.danimar.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "grupo_examen")
public class GrupoExamen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo")
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true, length = 60)
    private String nombre;
}
