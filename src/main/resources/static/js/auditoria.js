// ============================================================
// Auditoría: historial de acciones + limpieza con contraseña.
// ============================================================
const $tabla = document.getElementById("tabla-auditoria");

const ACCION = {
  borrar_reporte: "Borrar reporte",
  agregar_examen: "Agregar examen",
  editar_examen: "Editar examen",
  borrar_examen: "Borrar examen",
  limpiar_auditoria: "Limpiar auditoría"
};

function fechaHora(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("es-VE");
}

async function cargar() {
  try {
    const regs = await (await fetch(`${API_BASE}/auditoria`)).json();
    if (regs.length === 0) {
      $tabla.innerHTML = `<tr><td colspan="4" class="vacio">Sin registros todavía.</td></tr>`;
      return;
    }
    $tabla.innerHTML = regs.map(r => `
      <tr>
        <td>${fechaHora(r.fechaHora)}</td>
        <td>${r.usuario || ""}</td>
        <td>${ACCION[r.accion] || r.accion}</td>
        <td>${r.detalle || ""}</td>
      </tr>`).join("");
  } catch (e) {
    $tabla.innerHTML = `<tr><td colspan="4" class="vacio">No se pudo conectar con el servidor.</td></tr>`;
  }
}

document.getElementById("btn-limpiar").addEventListener("click", async () => {
  const clave = document.getElementById("clave-audit").value;
  if (!clave) { alert("Ingresa la contraseña de auditoría."); return; }
  if (!confirm("¿Borrar todo el historial de auditoría?")) return;
  const res = await fetch(`${API_BASE}/auditoria`, {
    method: "DELETE", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clave })
  });
  if (res.ok) { document.getElementById("clave-audit").value = ""; cargar(); }
  else alert("Contraseña de auditoría incorrecta. El historial no se borró.");
});

cargar();
