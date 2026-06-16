// ============================================================
// Reportes: estadísticas + listado con filtros.
// ============================================================
const $stats = document.getElementById("stats");
const $tabla = document.getElementById("tabla-reportes");

const fmt = n => Number(n || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function fechaTxt(iso) { if (!iso) return ""; const [a,m,d]=iso.split("-"); return `${d}/${m}/${a}`; }

const BADGE = {
  pago: ['<span class="badge-pago badge-pago-ok">Pago</span>'],
  parcial: ['<span class="badge-pago badge-pago-parcial">Parcial</span>'],
  pendiente: ['<span class="badge-pago badge-pago-pend">Pendiente</span>']
};

async function cargarStats() {
  const s = await (await fetch(`${API_BASE}/ordenes/estadisticas`)).json();
  $stats.innerHTML = `
    <div class="stat-card"><small>REPORTES</small><strong>${s.total}</strong></div>
    <div class="stat-card"><small>COBRADO</small><strong>Bs. ${fmt(s.cobrado)}</strong></div>
    <div class="stat-card stat-pend"><small>POR COBRAR</small><strong>Bs. ${fmt(s.porCobrar)}</strong></div>
    <div class="stat-card"><small>PENDIENTES</small><strong>${s.pendientes}</strong></div>
    <div class="stat-card"><small>PARCIALES</small><strong>${s.parciales}</strong></div>
    <div class="stat-card"><small>PAGADOS</small><strong>${s.pagados}</strong></div>`;
}

async function cargarLista() {
  const q = document.getElementById("q").value.trim();
  const estado = document.getElementById("estado").value;
  const desde = document.getElementById("desde").value;
  const hasta = document.getElementById("hasta").value;
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (estado) params.append("estado", estado);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);

  const lista = await (await fetch(`${API_BASE}/ordenes?${params.toString()}`)).json();
  if (lista.length === 0) {
    $tabla.innerHTML = `<tr><td colspan="7" class="vacio">No hay reportes que mostrar.</td></tr>`;
    return;
  }
  $tabla.innerHTML = lista.map(o => `
    <tr>
      <td>#${o.num}</td>
      <td>${fechaTxt(o.fecha)}</td>
      <td>${o.cedula}</td>
      <td>${o.paciente}</td>
      <td>Bs. ${fmt(o.costoTotal)}</td>
      <td>${(BADGE[o.estadoPago] || BADGE.pendiente)[0]}</td>
      <td class="acciones">
        <a class="btn-accion" href="reporte.html?id=${o.idOrden}" target="_blank">Ver</a>
        <a class="btn-accion" href="resultados.html?id=${o.idOrden}">Editar</a>
        <button class="btn-accion btn-accion-danger" onclick="eliminar(${o.idOrden})">Borrar</button>
      </td>
    </tr>`).join("");
}

async function eliminar(id) {
  if (!confirm("¿Borrar este reporte y sus resultados?")) return;
  const res = await fetch(`${API_BASE}/ordenes/${id}`, { method: "DELETE" });
  if (res.ok) { cargarStats(); cargarLista(); }
  else alert("No se pudo borrar.");
}

document.getElementById("btn-filtrar").addEventListener("click", cargarLista);
document.getElementById("btn-limpiar").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("q").value = "";
  document.getElementById("estado").value = "";
  document.getElementById("desde").value = "";
  document.getElementById("hasta").value = "";
  cargarLista();
});

cargarStats();
cargarLista();
