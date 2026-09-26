(() => {
  const C = window.PORTFOLIO_CONFIG;
  const $ = (id) => document.getElementById(id);

  // Admin puede guardar una copia local del contenido.
  const saved = localStorage.getItem("hades_portfolio_config");
  let data = C;
  if (saved) {
    try { data = deepMerge(structuredClone(C), JSON.parse(saved)); } catch {}
  }

  function deepMerge(base, extra) {
    if (!extra || typeof extra !== "object") return base;
    for (const key of Object.keys(extra)) {
      if (extra[key] && typeof extra[key] === "object" && !Array.isArray(extra[key])) {
        base[key] = deepMerge(base[key] || {}, extra[key]);
      } else base[key] = extra[key];
    }
    return base;
  }

  $("navName").textContent = data.name;
  $("footerName").textContent = data.name;
  $("heroName").textContent = data.name;
  $("heroEyebrow").textContent = data.eyebrow;
  $("heroDescription").textContent = data.description;
  $("navAvatar").textContent = data.name.replace(/[^A-Za-z]/g, "").slice(0,1) || "H";
  $("heroAvatar").src = data.avatar;
  $("aboutTitle").textContent = data.about.title;
  $("aboutText").textContent = data.about.text;
  $("experienceTitle").textContent = data.experience.title;
  $("experienceText").textContent = data.experience.text;
  $("contactTitle").textContent = data.contact.title;
  $("contactText").textContent = data.contact.text;
  $("discordName").textContent = data.contact.discord;
  $("email").textContent = data.contact.email;

  $("focusList").innerHTML = data.about.focus.map((x,i) =>
    `<div><span>0${i+1}</span><b>${escapeHTML(x)}</b></div>`).join("");

  $("stats").innerHTML = data.stats.map(s =>
    `<article class="stat reveal"><strong>${escapeHTML(s.value)}</strong><span>${escapeHTML(s.label)}</span></article>`).join("");

  $("servers").innerHTML = data.servers.map((s,i) =>
    `<article class="server-card reveal">
      <div class="timeline-dot"></div>
      <div class="server-top"><div><small>${escapeHTML(s.name)}</small><h3>${escapeHTML(s.role)}</h3></div><b>${escapeHTML(s.players)}</b></div>
      <p>${escapeHTML(s.description)}</p>
      <div class="tags">${s.tags.map(t=>`<span>#${escapeHTML(t)}</span>`).join("")}</div>
    </article>`).join("");

  $("skills").innerHTML = data.skills.map(s =>
    `<article class="skill reveal"><div class="skill-icon">${escapeHTML(s.icon)}</div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.text)}</p></article>`).join("");

  function escapeHTML(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  // Loader
  let p = 0;
  const bar = $("loaderBar"), pct = $("loaderPercent");
  const timer = setInterval(() => {
    p += Math.floor(Math.random()*13)+5;
    if (p >= 100) { p = 100; clearInterval(timer); setTimeout(()=>document.body.classList.add("loaded"), 350); }
    bar.style.width = p + "%"; pct.textContent = p + "%";
  }, 100);

  // Mobile menu
  $("menuBtn").addEventListener("click", () => $("navLinks").classList.toggle("open"));
  document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click",()=> $("navLinks").classList.remove("open")));

  // Reveal
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  }), {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

  // Copy buttons
  document.querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    const value = $(btn.dataset.copy).textContent.trim();
    try { await navigator.clipboard.writeText(value); btn.textContent = "COPIADO"; setTimeout(()=>btn.textContent="COPIAR",1200); } catch {}
  }));

  // Contacto -> abre Discord con el texto preparado
  $("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const msg = `Hola, soy ${$("formName").value}. Discord: ${$("formDiscord").value}. Proyecto: ${$("formServer").value || "No indicado"}. Necesito: ${$("formMessage").value}`;
    const url = data.contactLink || `https://discord.com/users/${data.discord.userId}`;
    navigator.clipboard?.writeText(msg);
    window.open(url, "_blank", "noopener");
  });

  // Discord presence via Lanyard
  async function updatePresence() {
    const box = $("discordPresence"), dot = $("statusDot"), text = $("statusText");
    const uid = data.discord?.userId;
    if (!uid) { text.textContent = "ID no configurado"; return; }
    try {
      const r = await fetch(data.discord.presenceEndpoint + encodeURIComponent(uid), {cache:"no-store"});
      const j = await r.json();
      if (!j.success || !j.data) throw new Error("No presence");
      const status = j.data.discord_status || "offline";
      const map = {online:["En línea","online"], idle:["Ausente","idle"], dnd:["No molestar","dnd"], offline:["Desconectado","offline"]};
      const [label, cls] = map[status] || map.offline;
      text.textContent = label;
      dot.className = "status-dot " + cls;
      box.querySelector("span:last-child").textContent = "Discord: " + label;
    } catch {
      text.textContent = "No disponible";
      box.querySelector("span:last-child").textContent = "Discord: no disponible";
      dot.className = "status-dot offline";
    }
  }
  updatePresence();
  setInterval(updatePresence, 30000);
})();