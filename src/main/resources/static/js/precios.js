// ============================================================
// Lista de Precios: catálogo real, con edición de costo y borrado.
// ============================================================
const $cat = document.getElementById("catalogo");
let DATOS = [];

async function cargar() {
  try {
    const categorias = await (await fetch(`${API_BASE}/categorias`)).json();
    DATOS = [];
    for (const c of categorias) {
      const examenes = await (await fetch(`${API_BASE}/examenes/categoria/${c.id}`)).json();
      DATOS.push({ categoria: c.nombre, examenes });
    }
    render(DATOS);
  } catch (e) {
    $cat.innerHTML = `<div class="panel"><p class="vacio">No se pudo conectar con el servidor.</p></div>`;
  }
}

function fmt(n) { return Number(n || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function render(datos) {
  $cat.innerHTML = datos.map(g => {
    if (g.examenes.length === 0) return "";
    const filas = g.examenes.map(e => `
      <tr>
        <td>${e.nombre}</td>
        <td>${e.muestra || "-"}</td>
        <td><div class="campo-precio"><span>Bs.</span><input type="number" min="0" step="0.01" value="${e.costo || 0}" id="costo-${e.id}"></div></td>
        <td class="acciones">
          <button class="btn-accion" onclick="guardar(${e.id})">Guardar</button>
          <button class="btn-accion btn-accion-danger" onclick="borrar(${e.id}, '${e.nombre.replace(/'/g,"\\'")}')">Borrar</button>
        </td>
      </tr>`).join("");
    return `
      <div class="panel">
        <h2>${g.categoria}</h2>
        <table class="tabla">
          <thead><tr><th>Examen</th><th>Muestra</th><th style="width:170px">Costo</th><th style="width:170px">Acciones</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }).join("") || `<div class="panel"><p class="vacio">Sin resultados.</p></div>`;
}

async function guardar(id) {
  const costo = Number(document.getElementById(`costo-${id}`).value || 0);
  const res = await fetch(`${API_BASE}/examenes/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ costo })
  });
  alert(res.ok ? "Costo actualizado." : "No se pudo guardar.");
}

async function borrar(id, nombre) {
  if (!confirm(`¿Borrar el examen "${nombre}" del catálogo?`)) return;
  const res = await fetch(`${API_BASE}/examenes/${id}`, { method: "DELETE" });
  if (res.ok) cargar();
  else { const j = await res.json().catch(() => ({})); alert(j.error || "No se pudo borrar."); }
}

document.getElementById("busqueda").addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { render(DATOS); return; }
  render(DATOS.map(g => ({ categoria: g.categoria, examenes: g.examenes.filter(ex => ex.nombre.toLowerCase().includes(q)) })));
});

cargar();
