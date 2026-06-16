// ============================================================
// Generar reporte: elegir paciente + exámenes y crear la orden.
// ============================================================
const $paciente = document.getElementById("paciente");
const $zona = document.getElementById("zona-examenes");
const $chips = document.getElementById("chips");
const $total = document.getElementById("total");
const seleccion = new Map();   // idExamen -> {nombre, costo}

const fmt = n => Number(n || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function cargarPacientes() {
  const ps = await (await fetch(`${API_BASE}/pacientes`)).json();
  $paciente.innerHTML = `<option value="">— Selecciona un paciente —</option>` +
    ps.map(p => `<option value="${p.id}">${p.nombreCompleto} — ${p.cedula}</option>`).join("");
}

async function cargarExamenes() {
  const cats = await (await fetch(`${API_BASE}/categorias`)).json();
  let html = "";
  for (const c of cats) {
    const exs = await (await fetch(`${API_BASE}/examenes/categoria/${c.id}`)).json();
    if (exs.length === 0) continue;
    html += `<div style="grid-column:1/-1;font-weight:700;color:#0d2952;margin-top:6px">${c.nombre}</div>`;
    html += exs.map(e => `
      <label class="check-examen">
        <input type="checkbox" value="${e.id}" data-nombre="${e.nombre}" data-costo="${e.costo || 0}">
        <span class="cx-nombre">${e.nombre}</span>
        <span class="cx-costo">Bs. ${fmt(e.costo)}</span>
      </label>`).join("");
  }
  $zona.innerHTML = html || `<p class="vacio-examenes">Sin exámenes.</p>`;
  $zona.querySelectorAll("input[type=checkbox]").forEach(c => c.addEventListener("change", onCheck));
}

function onCheck(e) {
  const id = Number(e.target.value);
  if (e.target.checked) seleccion.set(id, { nombre: e.target.dataset.nombre, costo: Number(e.target.dataset.costo) });
  else seleccion.delete(id);
  pintarChips();
}

function pintarChips() {
  if (seleccion.size === 0) {
    $chips.innerHTML = `<span class="sel-vacio">Ninguno todavía.</span>`;
  } else {
    $chips.innerHTML = [...seleccion.entries()].map(([id, x]) =>
      `<span class="chip-ex">${x.nombre}<button onclick="quitar(${id})">✕</button></span>`).join("");
  }
  let t = 0; seleccion.forEach(x => t += x.costo);
  $total.textContent = fmt(t);
}

function quitar(id) {
  seleccion.delete(id);
  const chk = $zona.querySelector(`input[value="${id}"]`);
  if (chk) chk.checked = false;
  pintarChips();
}

document.getElementById("btn-generar").addEventListener("click", async () => {
  const idPaciente = Number($paciente.value);
  if (!idPaciente) { alert("Selecciona un paciente."); return; }
  if (seleccion.size === 0) { alert("Selecciona al menos un examen."); return; }
  const body = {
    idPaciente,
    observaciones: document.getElementById("observaciones").value,
    idExamenes: [...seleccion.keys()]
  };
  const btn = document.getElementById("btn-generar");
  btn.disabled = true;
  try {
    const rep = await (await fetch(`${API_BASE}/ordenes`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    })).json();
    window.location.href = `resultados.html?id=${rep.idOrden}`;
  } catch (e) {
    alert("No se pudo crear la orden.");
    btn.disabled = false;
  }
});

cargarPacientes();
cargarExamenes();
