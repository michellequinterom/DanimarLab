// ============================================================
// Layout común (barra lateral + topbar) para todas las páginas.
// Reproduce el diseño de Danimar 1.
// ============================================================
const API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? (location.port === "8080" ? "/api" : "http://localhost:8080/api")
  : "/api";

// Candado de sesión: si no hay sesión iniciada, va al login.
if (!localStorage.getItem("danimar_login")) {
  location.href = "login.html";
}

const ICON = {
  logo: '<path d="M3 12h4l2 5 4-12 2 7h6"/>',
  pacientes: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  examen: '<path d="M9 2v6L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8V2"/><path d="M8 2h8"/><path d="M7 14h10"/>',
  precios: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  reportes: '<path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1z"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  auditoria: '<path d="M12 1l9 4v6c0 5-3.5 9-9 11-5.5-2-9-6-9-11V5l9-4z"/><path d="M9 12l2 2 4-4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'
};

function svg(paths, w) {
  return `<svg viewBox="0 0 24 24" width="${w||20}" height="${w||20}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// Módulos de la barra lateral. "listo:false" = aún en construcción (otra etapa).
const NAV = [
  { key: "pacientes", href: "pacientes.html",       txt: "Pacientes",        icon: "pacientes", listo: true  },
  { key: "examen",    href: "generar-reporte.html", txt: "Generar Reporte",  icon: "examen",    listo: true  },
  { key: "precios",   href: "precios.html",         txt: "Lista de Precios", icon: "precios",   listo: true  },
  { key: "reportes",  href: "reportes.html",        txt: "Reportes",         icon: "reportes",  listo: true  },
  { key: "auditoria", href: "auditoria.html",       txt: "Auditoría",        icon: "auditoria", listo: true  },
];

function montarLayout(activo) {
  const items = NAV.map(n => {
    const cls = n.key === activo ? "activo" : "";
    const href = n.listo ? n.href : "#";
    const onclick = n.listo ? "" : `onclick="alert('Este módulo se construye en la próxima etapa.');return false;"`;
    return `<a href="${href}" class="${cls}" ${onclick}>${svg(ICON[n.icon])}${n.txt}</a>`;
  }).join("");

  const aside = document.createElement("aside");
  aside.className = "sidebar";
  aside.innerHTML = `
    <div class="sidebar-logo">
      <span class="logo-icon">${svg(ICON.logo, 22)}</span>
      <div class="logo-text"><small>LABORATORIO CLÍNICO</small><h2>DANIMAR</h2></div>
    </div>
    <p class="nav-label">MÓDULOS</p>
    <nav>${items}</nav>
    <a href="#" class="logout-link" onclick="localStorage.removeItem('danimar_login');location.href='login.html';return false;">
      ${svg(ICON.logout, 18)} Cerrar sesión
    </a>`;

  const layout = document.querySelector(".layout");
  layout.insertBefore(aside, layout.firstChild);
}
