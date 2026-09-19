(() => {
  const KEY = "managerPortfolioConfig";
  const base = window.PORTFOLIO_CONFIG || {};
  let cfg;
  try { cfg = JSON.parse(localStorage.getItem(KEY)) || base; } catch { cfg = base; }

  const $ = id => document.getElementById(id);
  const set = (id, value, html=false) => { const el=$(id); if(el) html ? el.innerHTML=value : el.textContent=value; };
  const img = (id, src) => { const el=$(id); if(el) el.src=src || ""; };

  set("brandName", cfg.brand.name); set("brandRole", cfg.brand.role); img("brandLogo", cfg.brand.logo);
  set("heroEyebrow", cfg.hero.eyebrow); set("heroTitle", cfg.hero.title, true); set("heroText", cfg.hero.text);
  set("heroPrimary", cfg.hero.primary); set("heroSecondary", cfg.hero.secondary);
  set("availability", cfg.brand.availability); set("heroLocation", cfg.brand.location);
  img("heroLogo", cfg.brand.logo); set("profileName", cfg.brand.profileName); set("profileRole", cfg.brand.profileRole);
  set("profileExperience", cfg.brand.experience);
  $("profileTags").innerHTML=(cfg.brand.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");

  set("presentationTitle", cfg.presentation.title); set("presentationText", cfg.presentation.text);
  set("presentationQuote", cfg.presentation.quote); set("presentationQuoteBy", cfg.presentation.quoteBy);
  set("aboutTitle", cfg.about.title); set("aboutText", cfg.about.text);
  $("aboutPoints").innerHTML=(cfg.about.points||[]).map((p,i)=>`<div class="about-point"><div><b>${escapeHtml(p[0])}</b><span>${escapeHtml(p[1])}</span></div></div>`).join("");

  set("servicesTitle", cfg.servicesTitle);
  $("servicesGrid").innerHTML=(cfg.services||[]).map(s=>`<article class="service-card reveal"><div class="service-icon">${escapeHtml(s[0])}</div><h3>${escapeHtml(s[1])}</h3><p>${escapeHtml(s[2])}</p></article>`).join("");

  $("statsGrid").innerHTML=(cfg.stats||[]).map(s=>`<div class="stat reveal"><strong>${escapeHtml(s[0])}</strong><span>${escapeHtml(s[1])}</span></div>`).join("");
  set("experienceTitle", cfg.experienceTitle);
  $("projectsGrid").innerHTML=(cfg.projects||[]).map(p=>`<article class="project reveal"><span class="num">${escapeHtml(p[0])}</span><span class="project-badge">${escapeHtml(p[4]||"Proyecto")}</span><h3>${escapeHtml(p[1])}</h3><p><b>${escapeHtml(p[2])}</b><br>${escapeHtml(p[3])}</p></article>`).join("");

  $("processGrid").innerHTML=(cfg.process||[]).map(p=>`<article class="step reveal"><b>${escapeHtml(p[0])}</b><h3>${escapeHtml(p[1])}</h3><p>${escapeHtml(p[2])}</p></article>`).join("");
  $("testimonialsGrid").innerHTML=(cfg.testimonials||[]).map(t=>`<article class="testimonial reveal"><p>${escapeHtml(t[0])}</p><footer>${escapeHtml(t[1])}</footer></article>`).join("");

  set("contactTitle", cfg.contact.title); set("contactText", cfg.contact.text);
  $("discordBtn").href=cfg.contact.discord || "#"; $("emailBtn").href=cfg.contact.email || "#";
  set("footerName", cfg.brand.name); set("year", new Date().getFullYear());

  const accent = cfg.colors?.accent;
  if(accent) document.documentElement.style.setProperty("--accent", accent);
  const accent2 = cfg.colors?.accent2;
  if(accent2) document.documentElement.style.setProperty("--accent2", accent2);

  function escapeHtml(v){ return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }});
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  // Active navigation
  const sections=[...document.querySelectorAll("main section[id]")];
  const links=[...document.querySelectorAll("nav a")];
  window.addEventListener("scroll",()=>{
    let current="inicio";
    sections.forEach(s=>{ if(scrollY >= s.offsetTop-220) current=s.id; });
    links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
  },{passive:true});

  // Mouse glow
  const glow=document.querySelector(".cursor-glow");
  window.addEventListener("pointermove",e=>{ if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";} });

  // Particles
  const box=$("particles");
  for(let i=0;i<45;i++){
    const p=document.createElement("span"); p.className="particle";
    p.style.left=Math.random()*100+"%"; p.style.top=Math.random()*100+"%";
    p.style.animationDelay=(Math.random()*7)+"s"; p.style.animationDuration=(5+Math.random()*7)+"s";
    box.appendChild(p);
  }
})();