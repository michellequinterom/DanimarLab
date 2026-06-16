// ============================================================
// Módulo Pacientes (consume /api/pacientes).
// ============================================================
const $tabla = document.getElementById("tabla-pacientes");
const $conteo = document.getElementById("conteo-pac");

function verTab(tab) {
  document.getElementById("tab-registrar").style.display = (tab === "registrar") ? "block" : "none";
  document.getElementById("tab-consultar").style.display = (tab === "consultar") ? "block" : "none";
  document.querySelectorAll(".tab-pac").forEach(b => b.classList.toggle("activo", b.dataset.tab === tab));
  if (tab === "consultar") cargar();
}

async function cargar(q) {
  const url = q ? `${API_BASE}/pacientes?q=${encodeURIComponent(q)}` : `${API_BASE}/pacientes`;
  try {
    const lista = await (await fetch(url)).json();
    $conteo.textContent = `${lista.length} paciente(s) registrado(s)`;
    if (lista.length === 0) {
      $tabla.innerHTML = `<tr><td colspan="5" class="vacio">No hay pacientes que mostrar.</td></tr>`;
      return;
    }
    $tabla.innerHTML = lista.map(p => `
      <tr>
        <td>${p.cedula}</td>
        <td>${p.nombreCompleto}</td>
        <td>${p.edad ?? "-"}</td>
        <td>${p.fechaRegistro ? formatoFecha(p.fechaRegistro) : "-"}</td>
        <td class="acciones">
          <button class="btn-accion btn-accion-danger" onclick="eliminar(${p.id})">Borrar</button>
        </td>
      </tr>`).join("");
  } catch (e) {
    $tabla.innerHTML = `<tr><td colspan="5" class="vacio">No se pudo conectar con el servidor.</td></tr>`;
  }
}

function formatoFecha(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

document.getElementById("btn-guardar").addEventListener("click", async () => {
  const cedula = document.getElementById("cedula").value.trim();
  const nombreCompleto = document.getElementById("nombre").value.trim();
  const edadVal = document.getElementById("edad").value;
  if (!cedula || !nombreCompleto) { alert("Completa la cédula y el nombre."); return; }
  const body = { cedula, nombreCompleto, edad: edadVal ? Number(edadVal) : null };
  const res = await fetch(`${API_BASE}/pacientes`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  if (res.ok) {
    document.getElementById("cedula").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("edad").value = "";
    alert("Paciente registrado.");
    verTab("consultar");
  } else {
    alert("No se pudo guardar. ¿La cédula ya existe?");
  }
});

async function eliminar(id) {
  if (!confirm("¿Eliminar este paciente?")) return;
  const res = await fetch(`${API_BASE}/pacientes/${id}`, { method: "DELETE" });
  if (res.ok) cargar();
  else alert("No se pudo eliminar (puede tener reportes asociados).");
}

document.getElementById("btn-buscar").addEventListener("click", () => cargar(document.getElementById("busqueda").value.trim()));
document.getElementById("busqueda").addEventListener("keydown", e => { if (e.key === "Enter") cargar(e.target.value.trim()); });
document.getElementById("btn-limpiar").addEventListener("click", e => { e.preventDefault(); document.getElementById("busqueda").value = ""; cargar(); });
