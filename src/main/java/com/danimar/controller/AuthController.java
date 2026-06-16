package com.danimar.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * Inicio de sesión sencillo (un solo usuario, como en Danimar 1).
 * Nota: para un proyecto académico; en producción se usaría Spring Security.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    public static final String USUARIO = "licenciada";
    public static final String CLAVE = "danimar2026";
    public static final String CLAVE_AUDITORIA = "auditoria2026";

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        boolean ok = USUARIO.equals(body.get("usuario")) && CLAVE.equals(body.get("clave"));
        return Map.of("ok", ok);
    }
}
