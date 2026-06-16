// ============================================================
// Cargar resultados de una orden + estado de pago.
// ============================================================
const idOrden = new URLSearchParams(location.search).get("id");
const $ficha = document.getElementById("ficha");
const $examenes = document.getElementById("examenes");

function fechaTxt(iso) { if (!iso) return ""; const [a,m,d]=iso.split("-"); return `${d}/${m}/${a}`; }

async function cargar() {
  if (!idOrden) { $ficha.textContent = "Falta el identificador de la orden."; return; }
  const rep = await (await fetch(`${API_BASE}/ordenes/${idOrden}/reporte`)).json();

  $ficha.innerHTML = `<strong>${rep.paciente}</strong> &nbsp;·&nbsp; Cédula: ${rep.cedula}
     &nbsp;·&nbsp; Fecha: ${fechaTxt(rep.fecha)} &nbsp;·&nbsp; Total: Bs. ${fmt(rep.costoTotal)}`;

  $examenes.innerHTML = rep.examenes.map(ex => `
    <div class="panel">
      <h2>${ex.nombreExamen}</h2>
      <table class="tabla campos-tabla">
        <thead><tr><th style="width:40%">Parámetro</th><th>Resultado</th><th>Unidad</th><th>Referencia</th></tr></thead>
        <tbody>
          ${ex.campos.map(c => `
            <tr>
              <td>${c.nombre}</td>
              <td><input type="text" class="campo-rep" data-oe="${ex.idOrdenExamen}" data-param="${c.idParametro}" value="${c.valor || ""}"></td>
              <td class="rep-ref">${c.unidad || ""}</td>
              <td class="rep-ref">${(c.valorReferencia || "").replace(/\n/g,"<br>")}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`).join("");

  // Estado de pago actual
  document.getElementById("estado").value = rep.estadoPago || "pendiente";
  document.getElementById("abonado").value = rep.montoAbonado || 0;
}

function fmt(n){ return Number(n||0).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}); }

document.getElementById("btn-guardar").addEventListener("click", async () => {
  const items = [...document.querySelectorAll("input[data-param]")].map(i => ({
    idOrdenExamen: Number(i.dataset.oe), idParametro: Number(i.dataset.param), valor: i.value
  }));
  const res = await fetch(`${API_BASE}/ordenes/${idOrden}/resultados`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(items)
  });
  alert(res.ok ? "Resultados guardados." : "No se pudieron guardar.");
});

document.getElementById("btn-pago").addEventListener("click", async () => {
  const body = { estadoPago: document.getElementById("estado").value, montoAbonado: Number(document.getElementById("abonado").value || 0) };
  const res = await fetch(`${API_BASE}/ordenes/${idOrden}/pago`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  alert(res.ok ? "Estado de pago guardado." : "No se pudo guardar el pago.");
});

document.getElementById("btn-ver").addEventListener("click", () => location.href = `reporte.html?id=${idOrden}`);

cargar();
