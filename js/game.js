function defaultProgress(){ return { stars:0, streak:0, bestStreak:0, maxPhaseReached:0, phaseStars:Array(PHASE_TOTAL).fill(0), currentPhase:0, currentLevel:1, currentQuestion:0 }; }
const LS = {
  get(k,d){ try{ const v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const Store = {
  async getProgress(){
    try{
      const snap = await FB.progressRef().get();
      if(snap.exists) return Object.assign(defaultProgress(), snap.data());
      const def = defaultProgress(); await FB.progressRef().set(def); return def;
    }catch(e){ return LS.get("pm_progress", defaultProgress()); }
  },
  async saveProgress(p){
    LS.set("pm_progress", p);
    try{ await FB.progressRef().set(p, {merge:true}); }catch(e){}
  },
  async getConfig(){
    const def = {enabled:Array(PHASE_TOTAL).fill(true)};
    try{
      const snap = await FB.configRef().get();
      if(snap.exists) return Object.assign(def, snap.data());
      await FB.configRef().set(def); return def;
    }catch(e){ return LS.get("pm_config", def); }
  },
  async addHistory(doc){
    doc.ts = Date.now();
    try{ await FB.historyCol().add(doc); }catch(e){
      const list = LS.get("pm_history",[]); list.unshift(doc); LS.set("pm_history", list.slice(0,300));
    }
  },
  async setLive(doc){
    try{ await FB.liveRef().set(doc); FB.liveRef().onDisconnect().update({online:false}); }catch(e){}
  },
  async createSession(){
    const s = {start:Date.now(), end:null};
    try{ const ref = await FB.sessionsCol().add(s); return ref.id; }catch(e){
      const list = LS.get("pm_sessions",[]); const id="local_"+Date.now();
      list.push(Object.assign({id},s)); LS.set("pm_sessions",list); return id;
    }
  },
  async closeSession(id){
    try{ await FB.sessionsCol().doc(id).update({end:Date.now()}); }catch(e){
      const list = LS.get("pm_sessions",[]); const it=list.find(x=>x.id===id);
      if(it) it.end=Date.now(); LS.set("pm_sessions",list);
    }
  }
};

const AVATARS = {
  luanna: "img/avatar_l.png",
  papa:   "img/avatar_p.png"
};

let P=null, CFG=null, sessionId=null;
const runtime = { ex:null, answered:false, scored:false, firstResult:null, phaseCorrect:0, phaseWrong:0 };
let liveTimer=null;
let lifecycleBound=false;

function isEnabled(i){
  return !CFG?.enabled || CFG.enabled[i] !== false;
}
  
function isUnlocked(i){
  return isEnabled(i);
}

function $(sel){ return document.querySelector(sel); }
function scr(){ return document.getElementById("screen"); }
function setPlayMode(on){ document.body.classList.toggle("is-playing", !!on); }
function setLoginMode(on){ document.body.classList.toggle("is-login", !!on); }
function showToast(msg){
  let t=document.getElementById("app-toast");
  if(!t){
    t=document.createElement("div");
    t.id="app-toast";
    t.className="toast";
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer=setTimeout(()=>t.classList.remove("show"),1800);
}

function renderWelcome(){
  setLoginMode(true);
  setPlayMode(false);
  scr().className = "phone-screen";
  scr().innerHTML = `
    <div class="welcome-wrap">
      <div class="login-sky-deco" aria-hidden="true">
        <span class="float-star s1">★</span>
        <span class="float-star s2">✦</span>
        <span class="float-star s3">★</span>
        <span class="float-star s4">✦</span>
        <span class="math-mark m1">+</span>
        <span class="math-mark m2">=</span>
        <span class="math-mark m3">8</span>
        <span class="math-mark m4">−</span>
        <span class="cloud c1"></span>
        <span class="cloud c2"></span>
        <span class="cloud c3"></span>
      </div>
      <div class="login-card">
        <div class="welcome-logo" aria-hidden="true">
          <span class="logo-plus">+</span>
          <span class="logo-book"></span>
          <span class="logo-star">★</span>
          <span class="logo-face"></span>
          <span class="logo-minus">−</span>
        </div>
        <div class="title-row"><span>★</span><div class="welcome-title">Matemáticas</div><span>★</span></div>
        <div class="welcome-sub">Suma y resta con problemas reales jugando</div>
        <div class="welcome-prompt"><span></span><b>Elige tu modo para comenzar</b><span></span></div>
      <div class="profile-card" id="prof-luanna">
        <span class="profile-spark sp-a" aria-hidden="true">✧</span>
        <span class="profile-spark sp-b" aria-hidden="true">★</span>
        <span class="profile-spark sp-c" aria-hidden="true">✦</span>
        <div class="profile-emoji luanna"><img src="${AVATARS.luanna}" alt="Luanna" onerror="this.replaceWith(document.createTextNode('Luanna'))"></div>
        <div class="profile-copy"><div class="profile-name">Luanna</div><div class="profile-desc">Jugar y practicar</div></div>
        <div class="profile-badge" aria-hidden="true">★</div>
        <div class="profile-arrow">›</div>
      </div>
      <div class="profile-card" id="prof-papa">
        <span class="profile-spark sp-a" aria-hidden="true">✦</span>
        <span class="profile-spark sp-b" aria-hidden="true">✧</span>
        <span class="profile-spark sp-c" aria-hidden="true">★</span>
        <div class="profile-emoji papa"><img src="${AVATARS.papa}" alt="Papá" onerror="this.replaceWith(document.createTextNode('Papá'))"></div>
        <div class="profile-copy"><div class="profile-name">Papá</div><div class="profile-desc">Panel de control</div></div>
        <div class="profile-badge shield" aria-hidden="true">★</div>
        <div class="profile-arrow">›</div>
      </div>
      <a class="info-btn" id="btn-info" href="guia.html" target="_blank" rel="noopener">ℹ️ Información</a>
      </div>
    </div>`;
  $("#prof-luanna").onclick = openLuannaModal;
  $("#prof-papa").onclick = openAdminModal;
  const info=$("#btn-info");
  if(info) info.onclick=(e)=>{ e.preventDefault(); window.open("guia.html","guiaMatematicas","width=960,height=900,scrollbars=yes,resizable=yes"); };
}

function openLuannaModal(){
const ov = document.createElement("div");
ov.className = "modal-overlay";
ov.innerHTML = `
<div class="modal-box">
  <h3>🔐 Acceso de Luanna</h3>
  <p>Ingresa tu PIN para jugar.</p>
  <input type="password" class="modal-input" id="luanna-pin" placeholder="PIN" inputmode="numeric" maxlength="4" autocomplete="off">
  <div class="modal-error" id="luanna-err"></div>
  <div class="modal-actions">
    <button class="modal-btn ghost" id="luanna-cancel">Cancelar</button>
    <button class="modal-btn primary" id="luanna-ok">Entrar</button>
  </div>
</div>`;

document.body.appendChild(ov);

const inp = ov.querySelector("#luanna-pin");
inp.focus();

ov.querySelector("#luanna-cancel").onclick = ()=>ov.remove();

const tryLogin = ()=>{
if(inp.value === window.LUANNA_PIN){
ov.remove();
loginLuanna();
}else{
ov.querySelector("#luanna-err").textContent = "PIN incorrecto";
}
};

ov.querySelector("#luanna-ok").onclick = tryLogin;

inp.onkeydown = (e)=>{
if(e.key === "Enter") tryLogin();
};
}

function openAdminModal(){
const ov = document.createElement("div");
ov.className = "modal-overlay";
ov.innerHTML = `
<div class="modal-box">
  <h3>🔐 Acceso de papá</h3>
  <p>Ingresa el PIN para acceder al panel.</p>
  <input type="password" class="modal-input" id="admin-pass" placeholder="PIN" inputmode="numeric" maxlength="4" autocomplete="off">
  <div class="modal-error" id="admin-err"></div>
  <div class="modal-actions">
    <button class="modal-btn ghost" id="admin-cancel">Cancelar</button>
    <button class="modal-btn primary" id="admin-ok">Entrar</button>
  </div>
</div>`;

document.body.appendChild(ov);

const inp = ov.querySelector("#admin-pass");
inp.focus();

ov.querySelector("#admin-cancel").onclick = ()=>ov.remove();

const tryLogin = ()=>{
if(inp.value === window.ADMIN_PIN){
sessionStorage.setItem("pm_admin_auth", "ok");
window.location.href = "admin.html";
}else{
ov.querySelector("#admin-err").textContent = "PIN incorrecto";
}
};

ov.querySelector("#admin-ok").onclick = tryLogin;

inp.onkeydown = (e)=>{
if(e.key === "Enter") tryLogin();
};
}

// ── Reanudar ejercicio tras recargar la página (no cuenta como abandono) ──
function saveResume(){
  try{
    sessionStorage.setItem("pm_resume", JSON.stringify({
      ex:runtime.ex,
      answered:runtime.answered,
      scored:runtime.scored,
      firstResult:runtime.firstResult,
      chosen:runtime.chosen,
      wrongChoices:runtime.wrongChoices ? Array.from(runtime.wrongChoices) : [],
      phaseCorrect:runtime.phaseCorrect,
      phaseWrong:runtime.phaseWrong,
      phase:P?.currentPhase,
      level:P?.currentLevel
    }));
  }catch(e){}
}
function clearResume(){ try{ sessionStorage.removeItem("pm_resume"); }catch(e){} }

async function loginLuanna(){
  setLoginMode(false);
  setPlayMode(false);
  scr().className = "phone-screen";
  sessionStorage.setItem("pm_active","luanna");
  scr().innerHTML = `<div class="lock-screen"><div class="lock-icon">⏳</div><div class="end-sub">Cargando tu progreso...</div></div>`;
  [P, CFG] = await Promise.all([Store.getProgress(), Store.getConfig()]);
  if(!isEnabled(P.currentPhase)){
    const first = CFG.enabled.findIndex(v=>v!==false);
    if(first>=0) P.currentPhase = first;
  }
  sessionId = await Store.createSession();
  bindLifecycle();
  renderPhaseSelect();
}

async function resumeSession(){
  setLoginMode(false);
  setPlayMode(false);
  scr().className = "phone-screen";
  scr().innerHTML = `<div class="lock-screen"><div class="lock-icon">⏳</div><div class="end-sub">Cargando tu progreso...</div></div>`;
  [P, CFG] = await Promise.all([Store.getProgress(), Store.getConfig()]);
  if(!isEnabled(P.currentPhase)){
    const first = CFG.enabled.findIndex(v=>v!==false);
    if(first>=0) P.currentPhase = first;
  }
  sessionId = await Store.createSession();
  bindLifecycle();
  const raw = sessionStorage.getItem("pm_resume");
  if(raw){
    try{
      const saved = JSON.parse(raw);
      const state = saved && saved.ex ? saved : {ex:saved};
      renderPlay(state.ex,state);
      return;
    }catch(e){}
  }
  renderPhaseSelect();
}

function isUnlocked(i){
  return isEnabled(i);
}

function headerHTML(opts){
  opts=opts||{};
  const phaseName=opts.phase||(PHASE_META[P.currentPhase]?PHASE_META[P.currentPhase].name:"");
  const phaseNum=(opts.phaseNum!=null)?opts.phaseNum:(P.currentPhase+1);
  let prog="";
  if(opts.showProgress!==false){
    const qi=opts.qIndex||0;
    const progressLabel = opts.progressLabel || `Fase ${phaseNum} · Nivel ${opts.level||1}`;
    const segs=Array.from({length:10},(_,i)=>`<div class="seg ${i<qi?"on":"off"}"></div>`).join("");
    prog=`<div class="progress-row">
      <div class="nivel-tag">${progressLabel}</div>
      <div class="segments">${segs}</div>
      <div class="pct-text">${Math.round((qi/10)*100)}%</div>
      <div class="q-pill">${qi+1}/10</div>
    </div>`;
  }
  const closeBtn = opts.close
    ? `<button class="hdr-close" id="hdr-close" title="Cerrar sesión (elegir usuario)">×</button>` : "";
  const backBtn = opts.back
    ? `<button class="hdr-back" id="hdr-back" data-target="${opts.back}" title="${opts.back==='welcome'?'Volver a elegir usuario':'Volver a las fases'}">‹</button>` : "";
  return `<div class="header">
    <div class="header-left">
      <div class="avatar"><img src="${AVATARS.luanna}" alt="Luanna" onerror="this.replaceWith(document.createTextNode('🦄'))"></div>
      <div><div class="user-name">Luanna</div><div class="user-sub">${phaseName}</div></div>
    </div>
    <div class="header-right">
      <div class="badge"><span class="badge-icon">⭐</span><span class="badge-text">${P.stars}</span></div>
      <div class="badge badge-racha"><span class="badge-icon">🔥</span><span class="badge-text">${P.streak}</span></div>
      ${closeBtn}
      ${backBtn}
    </div>
  </div>${prog}`;
}
function bindHeader(){
  const b=$("#hdr-back");
  if(b) b.onclick=async()=>{
    if(b.dataset.target==="welcome"){ await logout(); }
    else { await flushAbandonedIfPending(); clearResume(); renderPhaseSelect(); }
  };
  const c=$("#hdr-close");
  if(c) c.onclick=async()=>{ await logout(); };
}

function renderPhaseSelect(){
  setLoginMode(false);
  setPlayMode(false);
  scr().className = "phone-screen";
  clearResume();
  const cards=PHASE_META.map((m,i)=>{
    const unlocked=isUnlocked(i);
    const current=i===P.currentPhase;
    return `<div class="phase-card ${unlocked?"":"locked"} ${current&&unlocked?"current":""}" data-i="${i}">
      <div class="phase-num">Fase ${i+1}</div>
      <div class="phase-name">${m.name}</div>
      <div class="phase-stars">${unlocked?"⭐ "+(P.phaseStars[i]||0):"🔒"}</div>
    </div>`;
  }).join("");
  scr().innerHTML=`
    ${headerHTML({phase:"Elige una fase",showProgress:false,back:"welcome"})}
    <div class="phase-grid">${cards}</div>`;
  bindHeader();
  scr().querySelectorAll(".phase-card").forEach(c=>{
    c.onclick=()=>{ const i=+c.dataset.i; if(isUnlocked(i)) enterPhase(i); };
  });
}

function enterPhase(i){
  if(i!==P.currentPhase){ P.currentPhase=i; P.currentLevel=1; P.currentQuestion=0; Store.saveProgress(P); }
  runtime.phaseCorrect=0; runtime.phaseWrong=0;
  renderPlay();
}

const MOTS=["¡Tú puedes! 💪","¡Vas genial! ✨","¡Sigue así! 🌟","¡Excelente! 🎉","¡Ánimo! 🚀"];
function renderPlay(resumeEx,resumeState){
  setLoginMode(false);
  setPlayMode(true);
  scr().className = "phone-screen play-screen";
  runtime.ex=resumeEx||generateExercise(P.currentPhase);
  runtime.answered=false;
  runtime.scored=false;
  runtime.firstResult=null;
  runtime.wrongChoices=new Set();
  runtime.chosen=null;
  if(resumeState){
    runtime.phaseCorrect=Number(resumeState.phaseCorrect)||0;
    runtime.phaseWrong=Number(resumeState.phaseWrong)||0;
    runtime.answered=!!resumeState.answered;
    runtime.scored=!!resumeState.scored;
    runtime.firstResult=resumeState.firstResult||null;
    runtime.chosen=resumeState.chosen==null?null:Number(resumeState.chosen);
    runtime.wrongChoices=new Set((resumeState.wrongChoices||[]).map(Number));
  }
  saveResume();
  const phaseName=PHASE_META[P.currentPhase]?PHASE_META[P.currentPhase].name:"Reto";
  scr().innerHTML=`
    ${headerHTML({progressLabel:`Problema ${P.currentLevel} de ${LEVELS_PER_PHASE}`,qIndex:P.currentLevel-1,phaseNum:P.currentPhase+1,back:"phases",close:true})}
    <div class="game-hero">
      <div class="mascot-card">
        <img src="${AVATARS.luanna}" alt="Luanna" onerror="this.replaceWith(document.createTextNode('⭐'))">
      </div>
      <div class="hero-bubble">
        <span class="hero-kicker">Fase ${P.currentPhase+1} — ${phaseName}</span>
        <strong>¡Sigue así!</strong>
      </div>
      <div class="reward-card">
        <span>⭐</span>
        <b>+10</b>
      </div>
    </div>
    <div class="content" id="content">
      <div class="q-card">
        <div class="icon-wrap ${IC_BG[runtime.ex.parts[0].col]}">${icon(runtime.ex.parts[0].icon,28,runtime.ex.parts[0].col)}</div>
        <div class="q-text">${runtime.ex.qHTML}</div>
      </div>
      <div class="bars-card" id="bars-card"></div>
      <div id="canvas-slot"></div>
      <div class="feedback visible warn idle" id="feedback">Primero escribe o dibuja en la pizarra.</div>
      <div class="opts" id="opts"></div>
      <div class="content-end"></div>
    </div>
    <div class="bottom-bar">
      <button class="sig-btn next-only" id="sig-btn">Siguiente</button>
    </div>`;
  bindHeader();
  renderBars(false);
  renderOpts();
  Pizarra.mount($("#canvas-slot"));
  restoreAnswerState();
  $("#sig-btn").onclick=()=>{ if(runtime.answered) nextQuestion(); };
  scheduleLiveUpdate(180);
}

function renderBars(revealed){
  const ex=runtime.ex;
  const maxVal=Math.max(ex.totalValue, ...ex.parts.map(p=>p.value));
  const rows=ex.parts.map(p=>{
    const show=p.shown||revealed;
    const pct=show?Math.max(4,Math.round((p.value/maxVal)*100)):0;
    return `<div class="bar-row">
      <div class="bar-ico ${IC_BG[p.col]}">${icon(p.icon,18,p.col)}</div>
      <div class="bar-lbl">${p.name}</div>
      ${show
        ?`<div class="track"><div class="fill ${FILL_C[p.col]}" data-pct="${pct}" style="width:0%"></div></div><div class="bar-val ${BV_C[p.col]}">${fmtPlain(p.value, ex.unit)}</div>`
        :`<div class="track-dashed"><span class="q-glyph">?</span></div><div class="bar-val ${BV_C[p.col]}">?</div>`}
    </div>`;
  }).join("");
  const totalShow=ex.totalShown||revealed;
  const totalPct=Math.max(4,Math.round((ex.totalValue/maxVal)*100));
  const totalRow=`<div class="bar-row">
    <div class="bar-ico ${IC_BG.t}">${icon("box",18,"t")}</div>
    <div class="bar-lbl">Total</div>
    ${totalShow
      ?`<div class="track"><div class="fill ${FILL_C.t}" data-pct="${totalPct}" style="width:0%"></div></div><div class="bar-val ${BV_C.t}">${fmtPlain(ex.totalValue, ex.unit)}</div>`
      :`<div class="track-dashed"><span class="q-glyph">?</span></div><div class="bar-val ${BV_C.t}">?</div>`}
  </div>`;
  $("#bars-card").innerHTML=rows+totalRow;
  // Animación: llenado orgánico desde 0 hasta el porcentaje objetivo
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelectorAll("#bars-card .fill[data-pct]").forEach(f=>{ f.style.width=f.dataset.pct+"%"; });
  }));
}

function renderOpts(){
  const letters=["A","B","C","D"];
  $("#opts").innerHTML=runtime.ex.opts.map((v,i)=>`
    <button class="opt" data-i="${i}">
      <div class="letter">${letters[i]}</div>
      <div class="opt-label">${fmtPlain(v, runtime.ex.unit)}</div>
    </button>`).join("");
  scr().querySelectorAll(".opt").forEach(b=>{ b.onclick=()=>pick(+b.dataset.i); });
}

function restoreAnswerState(){
  if(runtime.answered && runtime.chosen!=null){
    applyAnswered(runtime.chosen);
    return;
  }
  if(runtime.wrongChoices && runtime.wrongChoices.size){
    runtime.wrongChoices.forEach(i=>{
      const btn=scr().querySelector(`.opt[data-i="${i}"]`);
      if(btn){ btn.disabled=true; btn.classList.add("state-wrong"); }
    });
    const fb=$("#feedback");
    if(fb){ fb.className="feedback visible bad"; fb.innerHTML="âŒ Casi... revisa tu pizarra y prueba otra opciÃ³n."; }
  }
}

// Aplica la vista de "ya respondido" (sin volver a puntuar). Reutilizable al reanudar.
function applyAnswered(i){
  const ex=runtime.ex;
  const correct=i===ex.ci;
  scr().querySelectorAll(".opt").forEach((b,idx)=>{
    b.disabled=true;
    if(idx===ex.ci) b.classList.add("state-correct");
    else if(idx===i) b.classList.add("state-wrong");
  });
  renderBars(true);
  const fb=$("#feedback");
  if(fb){ fb.className="feedback visible "+(correct?"ok":"bad"); fb.innerHTML=(correct?"✅ ¡Correcto! ":"❌ Casi... ")+ex.explain; }
  const sb=$("#sig-btn"); if(sb) sb.classList.add("ready");
}

async function pick(i){
  if(runtime.answered) return;
  if(runtime.wrongChoices && runtime.wrongChoices.has(i)) return;
  if(!Pizarra.hasContent()){
    const fb=$("#feedback");
    if(fb){ fb.className="feedback visible warn"; fb.innerHTML="Primero escribe o dibuja en la pizarra."; }
    scheduleLiveUpdate(80);
    return;
  }
  const ex=runtime.ex;
  const correct=i===ex.ci;
  if(!correct){
    if(runtime.wrongChoices) runtime.wrongChoices.add(i);
    const btn=scr().querySelector(`.opt[data-i="${i}"]`);
    if(btn){ btn.disabled=true; btn.classList.add("state-wrong"); }
    const fb=$("#feedback");
    if(fb){ fb.className="feedback visible bad"; fb.innerHTML="❌ Casi... revisa tu pizarra y prueba otra opción."; }
    if(!runtime.scored){
      runtime.scored=true;
      runtime.firstResult="incorrecta";
      P.streak=0;
      runtime.phaseWrong++;
      await recordHistory("incorrecta",i);
    }
    try{Sound.wrong();}catch(e){}
    saveResume();
    await Store.saveProgress(P);
    scheduleLiveUpdate(80);
    return;
  }
  runtime.answered=true;
  runtime.chosen=i;
  applyAnswered(i);
  if(!runtime.scored){
    runtime.scored=true;
    runtime.firstResult="correcta";
    P.stars++;
    P.streak++;
    if(P.streak>P.bestStreak) P.bestStreak=P.streak;
    runtime.phaseCorrect++;
    await recordHistory("correcta",i);
  }
  try{Sound.correct();}catch(e){}
  saveResume();            // conserva la respuesta elegida si se recarga la página
  await Store.saveProgress(P);
  scheduleLiveUpdate(120);
}

async function nextQuestion(){

  P.currentLevel++;

  if(P.currentLevel > LEVELS_PER_PHASE){
    await finishPhase();
    return;
  }

  await Store.saveProgress(P);
  renderPlay();
}

async function finishPhase(){
  setPlayMode(false);
  scr().className = "phone-screen";
  const total=runtime.phaseCorrect+runtime.phaseWrong;
  const pct=total?Math.round((runtime.phaseCorrect/total)*100):0;
  const grade=pct>=90?"AD":pct>=75?"A":pct>=50?"B":"C";
  P.phaseStars[P.currentPhase]=(P.phaseStars[P.currentPhase]||0)+runtime.phaseCorrect;
  const nextIdx=P.currentPhase+1;
  if(nextIdx<PHASE_TOTAL && nextIdx>P.maxPhaseReached) P.maxPhaseReached=nextIdx;
  P.currentLevel=1; P.currentQuestion=0;
  clearResume();
  await Store.saveProgress(P);
  try{ Sound.victory(); }catch(e){}
  renderEndPhase({correct:runtime.phaseCorrect,wrong:runtime.phaseWrong,pct,grade,stars:runtime.phaseCorrect});
}

function confettiHTML(){
  const cols=["#6350E0","#00B49A","#E08A2B","#E0508C","#2B8EFF"];
  let h="";
  for(let i=0;i<14;i++){
    const left=randInt(2,96),delay=(Math.random()*0.5).toFixed(2),c=cols[Math.floor(Math.random()*cols.length)];
    h+=`<div class="cfp" style="left:${left}%;background:${c};"></div>`;
  }
  return h;
}

function renderEndPhase(s){
  setPlayMode(false);

  const nextPhase = P.currentPhase + 1;
  const hasNext = nextPhase < PHASE_TOTAL;
  const canContinue = hasNext && isEnabled(nextPhase);
  const phaseName = PHASE_META[P.currentPhase].name;
  const completionMsg = s.pct >= 90
    ? `Dominaste esta fase: ${phaseName}.`
    : s.pct >= 75
      ? `Buen avance en esta fase. Puedes seguir reforzando ${phaseName.toLowerCase()}.`
      : `Conviene practicar un poco más esta habilidad antes de avanzar.`;

  scr().innerHTML=`
    <div class="end-screen">
      <div class="confetti-zone">${confettiHTML()}</div>

      <span class="trophy-emoji">🏆</span>

      <div class="end-title">¡Fase completada!</div>

      <div class="end-sub">${completionMsg}</div>

      <div class="score-pill">⭐ +${s.stars} estrellas</div>

      <div class="end-stats">
        <div class="end-stat">
          <b>${s.correct}</b>
          <span>Correctas</span>
        </div>

        <div class="end-stat">
          <b>${s.wrong}</b>
          <span>Incorrectas</span>
        </div>
      </div>

      <div class="grade-section">
        <div class="grade-label">Calificación</div>
        <div class="grade-badge grade-${s.grade}">
          ${s.grade}
        </div>
      </div>

      <div class="end-actions">

        ${hasNext
          ? `<button
                class="continue-btn ${canContinue ? "" : "disabled"}"
                id="end-continue"
                ${canContinue ? "" : "disabled"}>
                Continuar ›
             </button>`
          : ""
        }

        <button class="exit-btn" id="end-exit">
          Salir
        </button>

      </div>

      ${hasNext && !canContinue
        ? `<div style="
              margin-top:16px;
              text-align:center;
              color:#666;
              font-size:14px;">
              🔒 La siguiente fase está bloqueada por Papá
           </div>`
        : ""
      }

      ${!hasNext
        ? `<div style="
              margin-top:16px;
              text-align:center;
              font-weight:700;">
              🎉 ¡Has completado todas las fases!
           </div>`
        : ""
      }

    </div>`;

  $("#end-exit").onclick = ()=>renderPhaseSelect();

  const c=$("#end-continue");

  if(c && canContinue){
    c.onclick = ()=>enterPhase(nextPhase);
  }
}

async function logout(){
  await flushAbandonedIfPending();
  clearResume();
  sessionStorage.removeItem("pm_active");
  if(sessionId) await Store.closeSession(sessionId);
  try{ FB.liveRef().set({online:false}); }catch(e){}
  renderWelcome();
}

async function recordHistory(result,chosenIndex){
  const ex=runtime.ex;
  const qText=ex.qHTML.replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
  await Store.addHistory({
    phase:P.currentPhase, level:P.currentLevel, qIndex:P.currentQuestion,
    question:qText, options:ex.opts, correctIndex:ex.ci, chosenIndex:chosenIndex==null?null:chosenIndex,
    result, canvas:Pizarra.hasContent()?Pizarra.exportPNG(480):null
  });
}

function updateLiveSafe(){
  if(!P||!runtime.ex) return;
  const qText=runtime.ex.qHTML.replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
  const screen=scr();
  const rect=screen?screen.getBoundingClientRect():null;
  const canvasPNG=getLiveCanvasPNG(760);
  Store.setLive({
    online:true,
    phase:P.currentPhase,
    level:P.currentLevel,
    qIndex:P.currentQuestion,
    stars:P.stars,
    streak:P.streak,
    question:qText,
    screenHTML:buildLiveScreenHTML(),
    canvasPNG,
    screenWidth:rect?Math.round(rect.width):390,
    screenHeight:rect?Math.round(rect.height):760,
    nextReady:!!document.querySelector("#sig-btn.ready"),
    answered:runtime.answered,
    scored:runtime.scored,
    updatedAt:Date.now()
  });
}

function getLiveCanvasPNG(maxW){
  try{ return Pizarra.exportPNG(maxW||760); }catch(e){ return ""; }
}

function scheduleLiveUpdate(delay){
  clearTimeout(liveTimer);
  liveTimer=setTimeout(updateLiveSafe, delay==null?120:delay);
}

function buildLiveScreenHTML(){
  const source=scr();
  if(!source||!source.classList.contains("play-screen")) return "";
  const clone=source.cloneNode(true);
  clone.classList.add("live-screen-copy");

  const srcInputs=[...source.querySelectorAll("input,textarea,select")];
  const dstInputs=[...clone.querySelectorAll("input,textarea,select")];
  srcInputs.forEach((src,i)=>{
    const dst=dstInputs[i];
    if(!dst) return;
    if(src.type==="checkbox"||src.type==="radio"){
      if(src.checked) dst.setAttribute("checked","checked");
      else dst.removeAttribute("checked");
    }else{
      dst.setAttribute("value",src.value);
    }
  });

  const cloneCanvas=clone.querySelector("#pz-canvas");
  if(cloneCanvas){
    const img=document.createElement("img");
    img.className="live-canvas-img";
    img.alt="Pizarra de Luanna";
    img.setAttribute("data-live-canvas","1");
    cloneCanvas.replaceWith(img);
  }

  clone.querySelectorAll("button,input,select,textarea,a").forEach(el=>{
    el.setAttribute("tabindex","-1");
    el.setAttribute("aria-disabled","true");
    if(el.tagName==="A") el.removeAttribute("href");
  });
  clone.querySelectorAll("script").forEach(el=>el.remove());
  return clone.outerHTML;
}

let flushing=false;
async function flushAbandonedIfPending(){
  if(flushing||!runtime.ex||runtime.answered) return;
  flushing=true;
  if(!runtime.scored) P.streak=0;
  await Store.saveProgress(P);
  runtime.answered=true; flushing=false;
}

function bindLifecycle(){
  if(lifecycleBound) return;
  lifecycleBound=true;
  // Recargar la página NO cuenta como abandono: el ejercicio se reanuda (ver resumeSession).
  // El abandono solo se registra al salir a propósito (volver a fases o cerrar sesión).
  window.addEventListener("beforeunload",()=>{ try{ FB.liveRef().update({online:false}); }catch(e){} });
  window.addEventListener("pizarra:change",()=>scheduleLiveUpdate(160));
}

document.addEventListener("DOMContentLoaded",()=>{
  if(!document.getElementById("screen")) return;
  if(sessionStorage.getItem("pm_active")==="luanna") resumeSession();
  else renderWelcome();
});
