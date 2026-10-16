/* Val Gelish — lógica de la web */
(function () {
  const CFG = window.VG_CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toLocaleString("es-MX");

  const state = {
    servicios: new Set(),
    colores: [],          // nombres en orden de selección
    esmaltes: [],
    filtro: "Todos",
    horario: "",
    largo: ""
  };

  /* ---------- Persistencia ligera (por navegador) ---------- */
  const STORE = "vg-cita";
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        servicios: [...state.servicios], colores: state.colores,
        horario: state.horario, largo: state.largo,
        nombre: $("#fNombre").value, fecha: $("#fFecha").value, notas: $("#fNotas").value
      }));
    } catch (e) {}
  }
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE) || "null");
      if (!d) return;
      (d.servicios || []).forEach(id => CFG.servicios.some(s => s.id === id) && state.servicios.add(id));
      state.colores = d.colores || [];
      state.horario = d.horario || ""; state.largo = d.largo || "";
      $("#fNombre").value = d.nombre || ""; $("#fFecha").value = d.fecha || ""; $("#fNotas").value = d.notas || "";
    } catch (e) {}
  }

  /* ---------- Links fijos ---------- */
  // api.whatsapp.com directo: el redirect de wa.me rompe los emojis
  const waBase = "https://api.whatsapp.com/send?phone=" + CFG.whatsapp;
  const waHola = waBase + "&text=" + encodeURIComponent("¡Hola Val! 💅 Vi tu página y quiero información para agendar una cita.");
  $("#waFloat").href = waHola;
  $("#footWa").href = waHola;
  $("#igLink").href = CFG.instagram;
  $("#footIg").href = CFG.instagram;
  $("#year").textContent = new Date().getFullYear();
  $("#maxColoresTxt").textContent = CFG.maxColores;
  const hoy = new Date(); hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  $("#fFecha").min = hoy.toISOString().slice(0, 10);

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $(".nav__toggle").addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    $(".nav__toggle").setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".nav__links a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open"); document.body.style.overflow = "";
    $(".nav__toggle").setAttribute("aria-expanded", "false");
  }));

  /* ---------- Hero video (si existe assets/hero.mp4) ---------- */
  const video = $("#heroVideo");
  const hero = $(".hero");
  const showVideo = () => hero.classList.add("has-video");
  if (video.readyState >= 3) showVideo();
  video.addEventListener("canplay", showVideo, { once: true });
  video.querySelector("source").addEventListener("error", () => video.remove());

  /* ---------- Servicios ---------- */
  function renderServicios() {
    const mk = s => `
      <li><button type="button" class="svc" data-id="${s.id}" aria-pressed="${state.servicios.has(s.id)}">
        <span class="svc__check"></span>
        <span><span class="svc__name">${s.nombre}</span><span class="svc__desc">${s.desc}</span></span>
        <span class="svc__price">${s.tipo === "extra" ? "<small>+</small>" : ""}${money(s.precio)}</span>
      </button></li>`;
    $("#serviciosBase").innerHTML = CFG.servicios.filter(s => s.tipo === "base").map(mk).join("");
    $("#serviciosExtra").innerHTML = CFG.servicios.filter(s => s.tipo !== "base").map(mk).join("");
  }
  document.addEventListener("click", e => {
    const b = e.target.closest(".svc");
    if (!b) return;
    const id = b.dataset.id;
    state.servicios.has(id) ? state.servicios.delete(id) : state.servicios.add(id);
    b.setAttribute("aria-pressed", state.servicios.has(id));
    update();
  });

  /* ---------- Esmaltes ---------- */
  function parseCSV(text) {
    const rows = []; let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); rows.push(row); row = []; cur = "";
      } else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }
  function normaliza(list) {
    return list
      .filter(e => e.nombre && e.nombre.trim())
      .map(e => {
        let color = String(e.color || "").trim();
        if (color && !color.startsWith("#")) color = "#" + color;
        const disp = typeof e.disponible === "boolean" ? e.disponible : !/^n/i.test(String(e.disponible || "").trim());
        return { nombre: e.nombre.trim(), color: color || "#DDD", familia: (e.familia || "Otros").trim(), disponible: disp, foto: (e.foto || "").trim() };
      });
  }
  async function cargarEsmaltes() {
    if (CFG.sheetId) {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${CFG.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(CFG.sheetName || "")}&_=${Date.now()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status);
        const text = await res.text();
        if (text.trim().startsWith("<")) throw new Error("hoja no pública");
        const [head, ...rows] = parseCSV(text);
        const keys = head.map(h => h.trim().toLowerCase());
        const list = normaliza(rows.map(r => Object.fromEntries(keys.map((k, i) => [k, r[i] || ""]))));
        if (list.length) return list;
      } catch (err) {
        console.warn("[Val Gelish] Usando lista de respaldo de esmaltes:", err.message);
      }
    }
    return normaliza(window.VG_ESMALTES_RESPALDO || []);
  }

  function esClaro(hex) {
    const h = hex.replace("#", "");
    if (h.length < 6) return false;
    const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
    return (r * 299 + g * 587 + b * 114) / 1000 > 235;
  }

  function renderFiltros() {
    const fams = ["Todos", ...new Set(state.esmaltes.map(e => e.familia))];
    $("#filtros").innerHTML = fams.map(f =>
      `<button type="button" class="chip" role="tab" data-f="${f}" aria-selected="${f === state.filtro}">${f}</button>`).join("");
  }
  $("#filtros").addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    state.filtro = c.dataset.f;
    renderFiltros(); renderSwatches();
  });

  function renderSwatches() {
    const list = state.esmaltes
      .filter(e => state.filtro === "Todos" || e.familia === state.filtro)
      .sort((a, b) => b.disponible - a.disponible);
    if (!list.length) { $("#swatches").innerHTML = `<p class="swatches__loading">Pronto habrá colores aquí ✨</p>`; return; }
    $("#swatches").innerHTML = list.map((e, i) => {
      const idx = state.colores.indexOf(e.nombre);
      const cls = ["sw", /ojo de gato/i.test(e.familia + e.nombre) ? "sw--cat" : "", esClaro(e.color) ? "sw--white" : ""].join(" ");
      return `<button type="button" class="${cls}" style="--c:${e.color};animation-delay:${Math.min(i, 16) * 30}ms"
          data-n="${e.nombre.replace(/"/g, "&quot;")}" aria-pressed="${idx > -1}" ${e.disponible ? "" : "disabled"}
          aria-label="${e.nombre}${e.disponible ? "" : " (agotado)"}">
        <span class="sw__badge">${idx > -1 ? idx + 1 : ""}</span>
        <span class="sw__nail">${e.foto ? `<img src="${e.foto}" alt="" loading="lazy">` : ""}</span>
        <span class="sw__name">${e.nombre}</span>
        <span class="sw__fam">${e.disponible ? e.familia : '<span class="sw__out">Agotado</span>'}</span>
      </button>`;
    }).join("");
  }
  $("#swatches").addEventListener("click", e => {
    const b = e.target.closest(".sw"); if (!b || b.disabled) return;
    const n = b.dataset.n;
    const i = state.colores.indexOf(n);
    if (i > -1) state.colores.splice(i, 1);
    else {
      if (state.colores.length >= CFG.maxColores) { toast(`Puedes elegir hasta ${CFG.maxColores} colores 💅`); return; }
      state.colores.push(n);
    }
    renderSwatches(); update();
  });

  /* ---------- Segmentos ---------- */
  function seg(id, key) {
    const el = $(id);
    const paint = () => $$("button", el).forEach(b => b.setAttribute("aria-checked", b.dataset.v === state[key]));
    el.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      state[key] = state[key] === b.dataset.v ? "" : b.dataset.v;
      paint(); save();
    });
    paint();
  }

  /* ---------- Resumen ---------- */
  function seleccion() {
    const svcs = CFG.servicios.filter(s => state.servicios.has(s.id));
    const total = svcs.reduce((t, s) => t + s.precio, 0);
    const cols = state.colores.map(n => state.esmaltes.find(e => e.nombre === n)).filter(Boolean);
    return { svcs, total, cols };
  }
  function update() {
    // quita colores que ya no existen o se agotaron
    if (state.esmaltes.length) state.colores = state.colores.filter(n => state.esmaltes.some(e => e.nombre === n && e.disponible));
    const { svcs, total, cols } = seleccion();
    $("#tServicios").innerHTML = svcs.length
      ? svcs.map(s => `<li><span>${s.nombre}</span><span>${money(s.precio)}</span></li>`).join("")
      : `<li class="muted">Aún no eliges servicio</li>`;
    $("#tColores").innerHTML = cols.length
      ? cols.map(c => `<span class="tc"><i style="--c:${c.color}"></i>${c.nombre}</span>`).join("")
      : `<span class="muted">Aún no eliges color</span>`;
    $("#tTotal").textContent = money(total);
    const count = svcs.length + cols.length;
    $("#dockCount").textContent = count;
    $("#dockTotal").textContent = money(total);
    const dock = $("#dock");
    dock.hidden = false;
    dock.classList.toggle("is-on", count > 0 && !inView($("#cita")));
    save();
  }
  function inView(el) { const r = el.getBoundingClientRect(); return r.top < innerHeight * .8 && r.bottom > 0; }
  window.addEventListener("scroll", () => {
    const { svcs, cols } = seleccion();
    $("#dock").classList.toggle("is-on", svcs.length + cols.length > 0 && !inView($("#cita")));
  }, { passive: true });
  ["#fNombre", "#fFecha", "#fNotas"].forEach(s => $(s).addEventListener("input", save));

  /* ---------- WhatsApp ---------- */
  function fechaBonita(v) {
    if (!v) return "";
    const d = new Date(v + "T12:00:00");
    return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
  }
  function mensaje() {
    const { svcs, total, cols } = seleccion();
    const nombre = $("#fNombre").value.trim();
    const L = [];
    L.push(`¡Hola Val! 💅 ${nombre ? "Soy " + nombre + ". " : ""}Vi tu página y quiero agendar una cita.`);
    L.push("");
    if (svcs.length) {
      L.push("*Servicios:*");
      svcs.forEach(s => L.push(`• ${s.nombre} — ${money(s.precio)}`));
      L.push("");
    }
    if (cols.length) {
      L.push("*Colores que me gustaron:*");
      cols.forEach((c, i) => L.push(`${i + 1}. ${c.nombre}`));
      L.push("");
    }
    const fecha = fechaBonita($("#fFecha").value);
    if (fecha) L.push(`*Día:* ${fecha}`);
    if (state.horario) L.push(`*Horario:* ${state.horario}`);
    if (state.largo) L.push(`*Largo de uña:* ${state.largo}`);
    const notas = $("#fNotas").value.trim();
    if (notas) L.push(`*Notas:* ${notas}`);
    if (svcs.length) { L.push(""); L.push(`Total estimado: *${money(total)}*`); }
    L.push(""); L.push("¿Qué disponibilidad tienes? ✨");
    return L.join("\n");
  }
  $("#btnWhatsApp").addEventListener("click", () => {
    if (!state.servicios.size) {
      toast("Elige al menos un servicio ✨");
      $("#servicios").scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.open(waBase + "&text=" + encodeURIComponent(mensaje()), "_blank", "noopener");
  });

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ---------- Reveal ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { threshold: .12 }) : null;
  $$(".section__head, .services, .g, .booking").forEach(el => {
    if (!io) return; el.classList.add("reveal"); io.observe(el);
  });

  /* ---------- Init ---------- */
  load();
  renderServicios();
  seg("#fHorario", "horario");
  seg("#fLargo", "largo");
  update();
  cargarEsmaltes().then(list => {
    state.esmaltes = list;
    renderFiltros(); renderSwatches(); update();
  });

  // para depurar desde consola
  window.VG = { state, mensaje };
})();
