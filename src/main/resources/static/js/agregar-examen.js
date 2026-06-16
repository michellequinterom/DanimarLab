// ============================================================
// Agregar examen al catálogo (con sus parámetros).
// ============================================================
const $grupo = document.getElementById("grupo");
const $params = document.getElementById("params");

async function cargarGrupos() {
  const cats = await (await fetch(`${API_BASE}/categorias`)).json();
  $grupo.innerHTML = cats.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
}

function filaParam() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" class="p-nombre" placeholder="Ej. Hematocrito"></td>
    <td><input type="text" class="p-unidad" placeholder="%"></td>
    <td><input type="text" class="p-ref" placeholder="37-47"></td>
    <td class="td-quitar"><button type="button" class="btn-quitar">✕</button></td>`;
  tr.querySelector(".btn-quitar").addEventListener("click", () => tr.remove());
  $params.appendChild(tr);
}

document.getElementById("btn-add-param").addEventListener("click", filaParam);

document.getElementById("btn-guardar").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) { alert("Escribe el nombre del examen."); return; }
  const parametros = [...$params.querySelectorAll("tr")].map(tr => ({
    nombre: tr.querySelector(".p-nombre").value.trim(),
    unidad: tr.querySelector(".p-unidad").value.trim(),
    valorReferencia: tr.querySelector(".p-ref").value.trim()
  })).filter(p => p.nombre);

  const body = {
    idGrupo: Number($grupo.value),
    nombre,
    muestra: document.getElementById("muestra").value.trim(),
    costo: Number(document.getElementById("costo").value || 0),
    parametros
  };
  const res = await fetch(`${API_BASE}/examenes`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  if (res.ok) { alert("Examen agregado."); location.href = "precios.html"; }
  else alert("No se pudo guardar el examen.");
});

cargarGrupos();
filaParam();   // empieza con una fila
