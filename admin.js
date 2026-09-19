(() => {
  const KEY="managerPortfolioConfig";
  const base=window.PORTFOLIO_CONFIG||{};
  const clone=o=>JSON.parse(JSON.stringify(o));
  let cfg;
  try{cfg=JSON.parse(localStorage.getItem(KEY))||clone(base)}catch{cfg=clone(base)}

  const $=id=>document.getElementById(id);
  const get=(obj,path)=>path.split(".").reduce((a,k)=>a?.[k],obj);
  const set=(obj,path,val)=>{const p=path.split(".");let cur=obj;for(let i=0;i<p.length-1;i++){if(!cur[p[i]])cur[p[i]]={};cur=cur[p[i]]}cur[p.at(-1)]=val};

  const simple=["brand.name","brand.role","brand.logo","brand.profileName","brand.profileRole","brand.experience","brand.availability","brand.location","hero.eyebrow","hero.title","hero.text","hero.primary","hero.secondary","presentation.title","presentation.text","presentation.quote","presentation.quoteBy","about.title","about.text","contact.title","contact.text","contact.discord","contact.email","colors.accent","colors.accent2"];
  simple.forEach(path=>{const el=$(path);if(el)el.value=get(cfg,path)??""});
  $("brand.tags").value=(cfg.brand.tags||[]).join(", ");

  function field(label,path,value,area=false){
    const d=document.createElement("div");d.className="field";
    d.innerHTML=`<label>${label}</label>${area?`<textarea data-path="${path}"></textarea>`:`<input data-path="${path}">`}`;
    const e=d.querySelector("[data-path]");e.value=value??"";return d;
  }
  function renderArray(id,key,labels,addFn){
    const box=$(id);box.innerHTML="";
    (cfg[key]||[]).forEach((item,i)=>{
      const wrap=document.createElement("div");wrap.className="item";
      const head=document.createElement("div");head.className="item-head";head.innerHTML=`<b>${key.toUpperCase()} ${String(i+1).padStart(2,"0")}</b>`;
      const rm=document.createElement("button");rm.textContent="Eliminar";rm.className="remove";rm.onclick=()=>{cfg[key].splice(i,1);renderAll()};
      head.appendChild(rm);wrap.appendChild(head);
      labels.forEach((l,j)=>wrap.appendChild(field(l,item[j],false)));
      box.appendChild(wrap);
    });
  }

  function arrayEditor(id,key,labels){
    const box=$(id);box.innerHTML="";
    (cfg[key]||[]).forEach((item,i)=>{
      const wrap=document.createElement("div");wrap.className="item";
      const head=document.createElement("div");head.className="item-head";
      const b=document.createElement("b");b.textContent=`${key.toUpperCase()} ${String(i+1).padStart(2,"0")}`;
      const rm=document.createElement("button");rm.textContent="Eliminar";rm.className="remove";rm.onclick=()=>{cfg[key].splice(i,1);renderAll()};
      head.append(b,rm);wrap.appendChild(head);
      item.forEach((v,j)=>{const f=document.createElement("div");f.className="field";f.style.marginBottom="8px";const tag=j===item.length-1?"textarea":"input";f.innerHTML=`<label>${labels[j]||("CAMPO "+(j+1))}</label><${tag} data-key="${key}" data-i="${i}" data-j="${j}">${tag==="textarea"?escape(v):""}</${tag}>`;if(tag==="input")f.querySelector("input").value=v??"";wrap.appendChild(f)});
      box.appendChild(wrap);
    });
  }
  function escape(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}

  function renderAll(){
    renderPoints();arrayEditor("services","services",["NÚMERO","TÍTULO","DESCRIPCIÓN"]);arrayEditor("stats","stats",["VALOR","ETIQUETA"]);arrayEditor("projects","projects",["NÚMERO","NOMBRE","ROL","DESCRIPCIÓN","BADGE"]);arrayEditor("process","process",["NÚMERO","TÍTULO","DESCRIPCIÓN"]);arrayEditor("testimonials","testimonials",["TEXTO","AUTOR"]);
  }
  function renderPoints(){
    const box=$("aboutPoints");box.innerHTML="";
    (cfg.about.points||[]).forEach((p,i)=>{
      const wrap=document.createElement("div");wrap.className="item";
      wrap.innerHTML=`<div class="item-head"><b>PUNTO ${i+1}</b></div>`;
      const f1=field("TÍTULO","",p[0]);const f2=field("DESCRIPCIÓN","",p[1],true);
      const rm=document.createElement("button");rm.textContent="Eliminar";rm.className="remove";rm.onclick=()=>{cfg.about.points.splice(i,1);renderPoints()};
      wrap.append(f1,f2,rm);box.appendChild(wrap);
      wrap.querySelectorAll("input,textarea").forEach((e,j)=>e.oninput=()=>cfg.about.points[i][j]=e.value);
    });
  }

  document.addEventListener("input",e=>{
    const p=e.target.dataset.path;
    if(p)set(cfg,p,e.target.value);
    const k=e.target.dataset.key;
    if(k)cfg[k][+e.target.dataset.i][+e.target.dataset.j]=e.target.value;
  });

  $("addPoint").onclick=()=>{cfg.about.points=cfg.about.points||[];cfg.about.points.push(["Nuevo punto","Descripción del punto."]);renderPoints()};
  $("addService").onclick=()=>{cfg.services=cfg.services||[];cfg.services.push([String(cfg.services.length+1).padStart(2,"0"),"Nueva función","Describe esta función."]);renderAll()};
  $("addStat").onclick=()=>{cfg.stats=cfg.stats||[];cfg.stats.push(["0+","Nueva estadística"]);renderAll()};
  $("addProject").onclick=()=>{cfg.projects=cfg.projects||[];cfg.projects.push([String(cfg.projects.length+1).padStart(2,"0"),"Nuevo proyecto","Staff Manager","Descripción del proyecto.","Próximamente"]);renderAll()};
  $("addProcess").onclick=()=>{cfg.process=cfg.process||[];cfg.process.push([String(cfg.process.length+1).padStart(2,"0"),"Nuevo paso","Describe el paso."]);renderAll()};
  $("addTestimonial").onclick=()=>{cfg.testimonials=cfg.testimonials||[];cfg.testimonials.push(["Nueva referencia.","Autor"]);renderAll()};

  function toast(t){const x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
  $("save").onclick=()=>{localStorage.setItem(KEY,JSON.stringify(cfg));toast("Cambios guardados. Abre el portfolio para verlos.")};
  $("reset").onclick=()=>{if(confirm("¿Restaurar la configuración original?")){cfg=clone(base);localStorage.removeItem(KEY);location.reload()}};
  $("export").onclick=()=>{const blob=new Blob([JSON.stringify(cfg,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="portfolio-config.json";a.click();URL.revokeObjectURL(a.href);toast("Configuración exportada")};
  $("import").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{cfg=JSON.parse(r.result);localStorage.setItem(KEY,JSON.stringify(cfg));location.reload()}catch{toast("JSON inválido")}};r.readAsText(f)};

  renderAll();
})();