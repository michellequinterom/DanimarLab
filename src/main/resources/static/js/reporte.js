// ============================================================
// Reporte de resultados imprimible (diseño rediseñado de Danimar 1).
// ============================================================
const idOrden = new URLSearchParams(location.search).get("id");
const $rep = document.getElementById("rep");

const fmt = n => Number(n || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function fechaTxt(iso) { if (!iso) return ""; const [a,m,d]=iso.split("-"); return `${d}/${m}/${a}`; }

const PAGO = {
  pago: ["Pagado", "rep-pago-ok"],
  parcial: ["Parcial", "rep-pago-parcial"],
  pendiente: ["Pendiente", "rep-pago-pend"]
};

async function cargar() {
  if (!idOrden) { $rep.textContent = "Falta el identificador de la orden."; return; }
  const r = await (await fetch(`${API_BASE}/ordenes/${idOrden}/reporte`)).json();
  const pago = PAGO[r.estadoPago] || PAGO.pendiente;

  const examenes = r.examenes.map(ex => `
    <div class="rep-examen-titulo">${ex.nombreExamen}</div>
    <table class="rep-tabla">
      <thead><tr><th>Parámetro</th><th>Resultado</th><th>Unidad</th><th>Valor de referencia</th></tr></thead>
      <tbody>
        ${ex.campos.map(c => `
          <tr>
            <td>${c.nombre}</td>
            <td><strong>${c.valor || "—"}</strong></td>
            <td>${c.unidad || ""}</td>
            <td class="rep-ref">${(c.valorReferencia || "").replace(/\n/g,"<br>")}</td>
          </tr>`).join("")}
      </tbody>
    </table>`).join("");

  $rep.innerHTML = `
    <div class="rep-toolbar no-imprimir">
      <span class="rep-toolbar-title">Reporte de resultados</span>
      <span class="rep-toolbar-btns">
        <button class="rep-tbtn" onclick="window.print()">Imprimir</button>
        <a class="rep-tbtn" href="reportes.html">Volver</a>
      </span>
    </div>
    <div class="rep-header">
      <h1>Laboratorio Clínico Danimar</h1>
      <p class="rep-sub">Lic. Iraides M. Quintero R. · Análisis Clínicos</p>
    </div>
    <div class="rep-meta"><span>Reporte de resultados</span><span>${fechaTxt(r.fecha)}</span></div>
    <div class="rep-card">
      <div class="rep-card-head">DATOS DEL PACIENTE</div>
      <div class="rep-card-body">
        <div><small>PACIENTE</small><strong>${r.paciente}</strong></div>
        <div><small>CÉDULA</small><strong>${r.cedula}</strong></div>
        <div><small>EDAD</small><strong>${r.edad ?? "—"}</strong></div>
        <div><small>FECHA</small><strong>${fechaTxt(r.fecha)}</strong></div>
      </div>
    </div>
    ${examenes}
    ${r.observaciones ? `<div class="rep-obs"><strong>Observaciones:</strong> ${r.observaciones}</div>` : ""}
    <div class="rep-card" style="margin-top:22px">
      <div class="rep-card-head">COSTO</div>
      <div class="rep-card-body">
        <div><small>COSTO TOTAL</small><strong>Bs. ${fmt(r.costoTotal)}</strong></div>
        <div><small>ESTADO</small><strong class="${pago[1]}">${pago[0]}</strong></div>
      </div>
    </div>
    <div class="rep-firma">_______________________<br>Bioanalista</div>
    <div class="rep-volver"></div>`;
}

cargar();
