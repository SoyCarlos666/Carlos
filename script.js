(() => {
  "use strict";

  const C = window.PORTFOLIO_CONFIG;
  const STORAGE_KEY = "hades_portfolio_config";

  const $ = id => document.getElementById(id);

  if (!C) {
    document.body.classList.add("config-error");
    console.error("No se encontró PORTFOLIO_CONFIG. Revisa que config.js esté antes de script.js.");
    return;
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function merge(base, extra) {
    if (!extra || typeof extra !== "object") return base;
    Object.keys(extra).forEach(key => {
      if (
        extra[key] &&
        typeof extra[key] === "object" &&
        !Array.isArray(extra[key]) &&
        base[key] &&
        typeof base[key] === "object" &&
        !Array.isArray(base[key])
      ) {
        merge(base[key], extra[key]);
      } else {
        base[key] = extra[key];
      }
    });
    return base;
  }

  let data = clone(C);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) data = merge(data, JSON.parse(saved));
  } catch (error) {
    console.warn("No se pudo leer la configuración local.", error);
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function render() {
    $("navName").textContent = data.name;
    $("footerName").textContent = data.name;
    $("heroName").textContent = data.name;
    $("heroEyebrow").textContent = data.eyebrow;
    $("heroDescription").textContent = data.description;
    $("navAvatar").textContent = (data.name.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, "").slice(0, 1) || "H").toUpperCase();

    $("heroAvatar").src = data.avatar;
    $("aboutTitle").textContent = data.about.title;
    $("aboutText").textContent = data.about.text;
    $("experienceTitle").textContent = data.experience.title;
    $("experienceText").textContent = data.experience.text;
    $("contactTitle").textContent = data.contact.title;
    $("contactText").textContent = data.contact.text;
    $("discordName").textContent = data.contact.discord;
    $("email").textContent = data.contact.email;

    $("focusList").innerHTML = data.about.focus.map((item, i) =>
      `<div><span>${String(i + 1).padStart(2, "0")}</span><b>${esc(item)}</b></div>`
    ).join("");

    $("stats").innerHTML = data.stats.map(item =>
      `<article class="stat reveal"><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span></article>`
    ).join("");

    $("servers").innerHTML = data.servers.map(item =>
      `<article class="server-card reveal">
        <div class="timeline-dot"></div>
        <div class="server-top">
          <div><small>${esc(item.name)}</small><h3>${esc(item.role)}</h3></div>
          <b>${esc(item.players)}</b>
        </div>
        <p>${esc(item.description)}</p>
        <div class="tags">${item.tags.map(tag => `<span>#${esc(tag)}</span>`).join("")}</div>
      </article>`
    ).join("");

    $("skills").innerHTML = data.skills.map(item =>
      `<article class="skill reveal">
        <div class="skill-icon">${esc(item.icon)}</div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </article>`
    ).join("");

    setupReveal();
  }

  function setupReveal() {
    const elements = document.querySelectorAll(".reveal:not(.reveal-ready)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(el => el.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      el.classList.add("reveal-ready");
      observer.observe(el);
    });
  }

  render();

  // Loader: siempre termina, incluso si una API externa falla.
  let progress = 0;
  const bar = $("loaderBar");
  const percent = $("loaderPercent");

  const loaderTimer = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderTimer);
      setTimeout(() => document.body.classList.add("loaded"), 450);
    }
    bar.style.width = progress + "%";
    percent.textContent = progress + "%";
  }, 90);

  // Failsafe para nunca dejar la pantalla bloqueada.
  setTimeout(() => document.body.classList.add("loaded"), 4500);

  // Menú móvil.
  $("menuBtn").addEventListener("click", () => {
    $("navLinks").classList.toggle("open");
  });

  document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", () => $("navLinks").classList.remove("open"));
  });

  // Copiar datos.
  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const value = $(button.dataset.copy).textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
        const old = button.textContent;
        button.textContent = "COPIADO";
        setTimeout(() => button.textContent = old, 1200);
      } catch {
        alert("No se pudo copiar automáticamente.");
      }
    });
  });

  // Formulario: abre el perfil de Discord y copia el mensaje.
  $("contactForm").addEventListener("submit", async event => {
    event.preventDefault();

    const message =
      `Hola, soy ${$("formName").value}. ` +
      `Discord: ${$("formDiscord").value}. ` +
      `Proyecto: ${$("formServer").value || "No indicado"}. ` +
      `Necesito: ${$("formMessage").value}`;

    try {
      await navigator.clipboard.writeText(message);
    } catch {}

    window.open(
      data.contactLink || `https://discord.com/users/${data.discord.userId}`,
      "_blank",
      "noopener"
    );
  });

  // Presencia de Discord mediante Lanyard.
  // Lanyard no necesita token en el frontend, pero el usuario debe estar
  // visible para el servicio de presencia.
  async function updatePresence() {
    const dot = $("statusDot");
    const text = $("statusText");
    const presence = $("discordPresence");
    const uid = data.discord?.userId;

    if (!uid) {
      text.textContent = "ID no configurado";
      dot.className = "status-dot offline";
      presence.querySelector("span:last-child").textContent = "Discord: sin ID";
      return;
    }

    try {
      const response = await fetch(
        data.discord.presenceEndpoint + encodeURIComponent(uid),
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("HTTP " + response.status);

      const result = await response.json();
      if (!result.success || !result.data) throw new Error("Sin presencia");

      const status = result.data.discord_status || "offline";
      const labels = {
        online: ["En línea", "online"],
        idle: ["Ausente", "idle"],
        dnd: ["No molestar", "dnd"],
        offline: ["Desconectado", "offline"]
      };

      const [label, className] = labels[status] || labels.offline;
      text.textContent = label;
      dot.className = "status-dot " + className;
      presence.querySelector("span:last-child").textContent = "Discord: " + label;
    } catch (error) {
      text.textContent = "No disponible";
      dot.className = "status-dot offline";
      presence.querySelector("span:last-child").textContent = "Discord: no disponible";
      console.warn("Discord/Lanyard:", error);
    }
  }

  updatePresence();
  setInterval(updatePresence, 30000);
})();
