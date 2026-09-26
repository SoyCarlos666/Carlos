(() => {
  "use strict";

  const base = window.PORTFOLIO_CONFIG;
  const KEY = "hades_portfolio_config";
  const $ = id => document.getElementById(id);

  if (!base) {
    $("result").textContent = "ERROR: config.js no se cargó.";
    return;
  }

  const clone = obj => JSON.parse(JSON.stringify(obj));

  function loadData() {
    let data = clone(base);
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) data = merge(data, JSON.parse(saved));
    } catch {}
    return data;
  }

  function merge(baseObj, extra) {
    if (!extra || typeof extra !== "object") return baseObj;
    Object.keys(extra).forEach(key => {
      if (
        extra[key] && typeof extra[key] === "object" &&
        !Array.isArray(extra[key]) &&
        baseObj[key] && typeof baseObj[key] === "object" &&
        !Array.isArray(baseObj[key])
      ) merge(baseObj[key], extra[key]);
      else baseObj[key] = extra[key];
    });
    return baseObj;
  }

  let data = loadData();

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  function input(cls, value, placeholder = "") {
    return `<input class="${cls}" value="${esc(value)}" placeholder="${esc(placeholder)}">`;
  }

  function renderBasic() {
    $("name").value = data.name || "";
    $("eyebrow").value = data.eyebrow || "";
    $("avatar").value = data.avatar || "";
    $("discordId").value = data.discord?.userId || "";
    $("description").value = data.description || "";

    $("aboutTitle").value = data.about?.title || "";
    $("aboutText").value = data.about?.text || "";
    $("focus").value = (data.about?.focus || []).join("\n");

    $("experienceTitle").value = data.experience?.title || "";
    $("experienceText").value = data.experience?.text || "";

    $("discord").value = data.contact?.discord || "";
    $("email").value = data.contact?.email || "";
    $("contactLink").value = data.contactLink || "";
  }

  function renderStats() {
    $("statsEditor").innerHTML = (data.stats || []).map((s, i) => `
      <div class="editor stat-ed">
        <div class="editor-grid">
          ${input("value", s.value)}
          ${input("label", s.label)}
          <button type="button" class="remove">ELIMINAR</button>
        </div>
      </div>
    `).join("");
  }

  function renderServers() {
    $("serversEditor").innerHTML = (data.servers || []).map(s => `
      <div class="editor server-ed">
        <div class="editor-grid">
          ${input("name", s.name)}
          ${input("role", s.role)}
          ${input("players", s.players)}
        </div>
        <label>Descripción<textarea class="desc">${esc(s.description)}</textarea></label>
        <label>Tags separados por coma<input class="tags" value="${esc((s.tags || []).join(", "))}"></label>
        <button type="button" class="remove">ELIMINAR</button>
      </div>
    `).join("");
  }

  function renderSkills() {
    $("skillsEditor").innerHTML = (data.skills || []).map(s => `
      <div class="editor skill-ed">
        <div class="editor-grid">
          ${input("icon", s.icon)}
          ${input("title", s.title)}
          ${input("text", s.text)}
          <button type="button" class="remove">ELIMINAR</button>
        </div>
      </div>
    `).join("");
  }

  function bindRemove() {
    document.querySelectorAll(".remove").forEach(button => {
      button.onclick = () => button.closest(".editor").remove();
    });
  }

  function render() {
    renderBasic();
    renderStats();
    renderServers();
    renderSkills();
    bindRemove();
  }

  function collect() {
    data.name = $("name").value.trim();
    data.eyebrow = $("eyebrow").value.trim();
    data.avatar = $("avatar").value.trim();
    data.description = $("description").value.trim();

    data.discord.userId = $("discordId").value.trim();
    data.contactLink = $("contactLink").value.trim();

    data.about.title = $("aboutTitle").value.trim();
    data.about.text = $("aboutText").value.trim();
    data.about.focus = $("focus").value.split("\n").map(x => x.trim()).filter(Boolean);

    data.experience.title = $("experienceTitle").value.trim();
    data.experience.text = $("experienceText").value.trim();

    data.contact.discord = $("discord").value.trim();
    data.contact.email = $("email").value.trim();

    data.stats = [...document.querySelectorAll(".stat-ed")].map(e => ({
      value: e.querySelector(".value").value.trim(),
      label: e.querySelector(".label").value.trim()
    }));

    data.servers = [...document.querySelectorAll(".server-ed")].map(e => ({
      name: e.querySelector(".name").value.trim(),
      role: e.querySelector(".role").value.trim(),
      players: e.querySelector(".players").value.trim(),
      description: e.querySelector(".desc").value.trim(),
      tags: e.querySelector(".tags").value.split(",").map(x => x.trim()).filter(Boolean)
    }));

    data.skills = [...document.querySelectorAll(".skill-ed")].map(e => ({
      icon: e.querySelector(".icon").value.trim(),
      title: e.querySelector(".title").value.trim(),
      text: e.querySelector(".text").value.trim()
    }));

    return data;
  }

  $("addServer").onclick = () => {
    data.servers.push({
      name: "NUEVO SERVIDOR",
      role: "Cargo",
      players: "0+ Jugadores",
      description: "Describe aquí tu experiencia.",
      tags: ["Gestión"]
    });
    renderServers();
    bindRemove();
  };

  $("addSkill").onclick = () => {
    data.skills.push({
      icon: "✦",
      title: "NUEVA HABILIDAD",
      text: "Describe aquí esta habilidad."
    });
    renderSkills();
    bindRemove();
  };

  $("save").onclick = () => {
    try {
      const finalData = collect();
      localStorage.setItem(KEY, JSON.stringify(finalData));
      data = finalData;
      $("result").textContent = "✓ Cambios guardados correctamente en este navegador.";
      setTimeout(() => $("result").textContent = "", 3000);
    } catch (error) {
      $("result").textContent = "No se pudieron guardar los cambios.";
      console.error(error);
    }
  };

  $("reset").onclick = () => {
    if (!confirm("¿Restaurar toda la configuración original?")) return;
    localStorage.removeItem(KEY);
    data = clone(base);
    render();
    $("result").textContent = "✓ Configuración restaurada.";
  };

  render();
})();
