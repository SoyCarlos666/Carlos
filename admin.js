(() => {
  const base = window.PORTFOLIO_CONFIG;
  const key = "hades_portfolio_config";
  const saved = localStorage.getItem(key);
  let data = saved ? JSON.parse(saved) : structuredClone(base);
  const $ = id => document.getElementById(id);

  $("name").value=data.name; $("eyebrow").value=data.eyebrow; $("avatar").value=data.avatar;
  $("description").value=data.description;
  $("aboutTitle").value=data.about.title; $("aboutText").value=data.about.text;
  $("focus").value=data.about.focus.join("\n");
  $("discord").value=data.contact.discord; $("email").value=data.contact.email;

  function input(value, cls="") { return `<input class="${cls}" value="${esc(value)}">`; }
  function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

  $("statsEditor").innerHTML = data.stats.map((s,i)=>`<div class="editor stat-ed" data-i="${i}"><div class="editor-grid">${input(s.value,"v")}${input(s.label,"l")}<button type="button" class="remove">ELIMINAR</button></div></div>`).join("");
  $("serversEditor").innerHTML = data.servers.map((s,i)=>`<div class="editor server-ed" data-i="${i}">
    <div class="editor-grid">${input(s.name,"name")}${input(s.role,"role")}${input(s.players,"players")}</div>
    <label>Descripción<textarea class="desc">${esc(s.description)}</textarea></label>
    <label>Tags separados por coma<input class="tags" value="${esc(s.tags.join(", "))}"></label>
    <button type="button" class="remove">ELIMINAR</button></div>`).join("");
  $("skillsEditor").innerHTML = data.skills.map((s,i)=>`<div class="editor skill-ed" data-i="${i}"><div class="editor-grid">${input(s.icon,"icon")}${input(s.title,"title")}${input(s.text,"text")}<button type="button" class="remove">ELIMINAR</button></div></div>`).join("");

  document.querySelectorAll(".remove").forEach(b=>b.onclick=()=>b.closest(".editor").remove());

  $("save").onclick=()=>{
    data.name=$("name").value.trim();
    data.eyebrow=$("eyebrow").value.trim();
    data.avatar=$("avatar").value.trim();
    data.description=$("description").value.trim();
    data.about.title=$("aboutTitle").value.trim();
    data.about.text=$("aboutText").value.trim();
    data.about.focus=$("focus").value.split("\n").map(x=>x.trim()).filter(Boolean);
    data.contact.discord=$("discord").value.trim();
    data.contact.email=$("email").value.trim();

    data.stats=[...document.querySelectorAll(".stat-ed")].map(e=>({value:e.querySelector(".v").value,label:e.querySelector(".l").value}));
    data.servers=[...document.querySelectorAll(".server-ed")].map(e=>({
      name:e.querySelector(".name").value,role:e.querySelector(".role").value,players:e.querySelector(".players").value,
      description:e.querySelector(".desc").value,tags:e.querySelector(".tags").value.split(",").map(x=>x.trim()).filter(Boolean)
    }));
    data.skills=[...document.querySelectorAll(".skill-ed")].map(e=>({icon:e.querySelector(".icon").value,title:e.querySelector(".title").value,text:e.querySelector(".text").value}));
    localStorage.setItem(key,JSON.stringify(data));
    $("result").textContent="✓ Cambios guardados en este navegador.";
  };

  $("reset").onclick=()=>{
    if(confirm("¿Restaurar la configuración original?")){
      localStorage.removeItem(key); location.reload();
    }
  };
})();