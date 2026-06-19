const AdminStore = {
  async getProgress(){
    try{ const s=await FB.progressRef().get(); return s.exists?s.data():null; }catch(e){ return JSON.parse(localStorage.getItem("pm_progress")||"null"); }
  },
  async getConfig(){
    try{ const s=await FB.configRef().get(); return s.exists?s.data():{enabled:Array(PHASE_TOTAL).fill(true)}; }catch(e){ return JSON.parse(localStorage.getItem("pm_config")||"null")||{enabled:Array(PHASE_TOTAL).fill(true)}; }
  },
  async saveConfig(cfg){
    try{ await FB.configRef().set(cfg,{merge:true}); }catch(e){ localStorage.setItem("pm_config",JSON.stringify(cfg)); }
  },
  async getHistory(limit){
    try{ const snap=await FB.historyCol().orderBy("ts","desc").limit(limit||200).get(); return snap.docs.map(d=>Object.assign({id:d.id},d.data())); }catch(e){ return JSON.parse(localStorage.getItem("pm_history")||"[]").slice(0,limit||200); }
  },
  async getSessions(){
    try{ const snap=await FB.sessionsCol().orderBy("start","desc").limit(100).get(); return snap.docs.map(d=>Object.assign({id:d.id},d.data())); }catch(e){ return JSON.parse(localStorage.getItem("pm_sessions")||"[]"); }
  },
  async resetAll(){
    try{
      const [hSnap,sSnap]=await Promise.all([FB.historyCol().limit(500).get(), FB.sessionsCol().limit(500).get()]);
      const batch=db.batch();
      hSnap.docs.forEach(d=>batch.delete(d.ref)); sSnap.docs.forEach(d=>batch.delete(d.ref));
      batch.delete(FB.progressRef()); batch.delete(FB.configRef()); await batch.commit();
    }catch(e){}
    ["pm_progress","pm_config","pm_history","pm_sessions","pm_live","pesomas_recent_sigs"].forEach(k=>localStorage.removeItem(k));
  }
};

let adminCFG=null, liveUnsub=null;

function $(s){ return document.querySelector(s); }
function fmtTS(ts){ if(!ts) return "—"; const d=new Date(ts); return d.toLocaleDateString("es-PE")+" "+d.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}); }
function elapsed(ms){ const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60); return h?h+"h "+( m%60)+"m":(m?m+"m "+( s%60)+"s":s+"s"); }

async function initAdmin(){
  const saved=sessionStorage.getItem("pm_admin_auth");
  if(saved!=="ok"){
    renderGate(); return;
  }
  renderShell();
  adminCFG=await AdminStore.getConfig();
  bindTabs();
  showTab("live");
}

function renderGate(){
  document.body.innerHTML=`
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f0f0ff">
      <div class="modal-box" style="max-width:340px;width:92%">
        <h3>🔐 Panel de Papá</h3>
        <p>Ingresa la contraseña de administrador.</p>
        <input type="password" id="gate-pass" class="modal-input" placeholder="Contraseña">
        <div class="modal-error" id="gate-err"></div>
        <div class="modal-actions"><button class="modal-btn primary" id="gate-ok">Entrar</button></div>
      </div>
    </div>`;
  const inp=$("#gate-pass");
  inp.focus();
  const tryG=()=>{
    if(inp.value===ADMIN_PASSWORD){ sessionStorage.setItem("pm_admin_auth","ok"); location.reload(); }
    else{ $("#gate-err").textContent="Contraseña incorrecta"; }
  };
  $("#gate-ok").onclick=tryG; inp.onkeydown=(e)=>{ if(e.key==="Enter") tryG(); };
}

function renderShell(){
  document.body.innerHTML=`
    <div class="admin-shell">
      <div class="admin-header">
        <span>⚖️ PesoMás — Panel de Papá</span>
        <div style="display:flex;gap:10px;align-items:center">
          <a href="index.html" class="modal-btn ghost" style="text-decoration:none;font-size:13px">‹ Juego</a>
          <button class="danger-btn" id="logout-btn" style="font-size:13px;padding:6px 12px">Salir</button>
        </div>
      </div>
      <div class="admin-tabs">
        <button class="tab-btn active" data-tab="live">En vivo</button>
        <button class="tab-btn" data-tab="history">Historial</button>
        <button class="tab-btn" data-tab="stats">Estadísticas</button>
        <button class="tab-btn" data-tab="phases">Fases</button>
      </div>
      <div class="admin-body" id="admin-body"></div>
    </div>`;
  $("#logout-btn").onclick=()=>{ sessionStorage.removeItem("pm_admin_auth"); location.href="index.html"; };
}

function bindTabs(){
  document.querySelectorAll(".tab-btn").forEach(b=>{
    b.onclick=()=>{ document.querySelectorAll(".tab-btn").forEach(x=>x.classList.remove("active")); b.classList.add("active"); showTab(b.dataset.tab); };
  });
}

function showTab(tab){
  liveUnsub = null;
  const body=$("#admin-body");
  if(tab==="live") renderLive(body);
  else if(tab==="history") renderHistory(body);
  else if(tab==="stats") renderStats(body);
  else if(tab==="phases") renderPhases(body);
}

function renderLive(body){
  body.innerHTML=`<div class="live-panel" id="live-panel"><div class="live-row"><span>Conectando...</span></div></div>`;
  try{
    liveUnsub=FB.liveRef().on("value",snap=>{
      const d=snap.val()||{};
      const panel=document.getElementById("live-panel");
      if(!panel) return;
      if(!d.online){ panel.innerHTML=`<div class="live-row"><span class="tag abandoned">Sin conexión</span></div>`; return; }
      const dur=d.updatedAt?elapsed(Date.now()-d.updatedAt):"—";
      panel.innerHTML=`
        <div class="live-row"><span>Estado</span><span class="tag ok">En línea</span></div>
        <div class="live-row"><span>Fase</span><b>${(PHASE_META[d.phase]||{name:"?"}).name} (${(d.phase||0)+1})</b></div>
        <div class="live-row"><span>Nivel</span><b>${d.level||"—"}</b></div>
        <div class="live-row"><span>Pregunta</span><b>${(d.qIndex||0)+1}/10</b></div>
        <div class="live-row"><span>Estrellas</span><b>⭐ ${d.stars||0}</b></div>
        <div class="live-row"><span>Racha</span><b>🔥 ${d.streak||0}</b></div>
        <div class="live-row"><span>Última actualización</span><b>hace ${dur}</b></div>
        <div class="live-row" style="flex-direction:column;align-items:flex-start;gap:4px">
          <span>Ejercicio actual</span>
          <div style="font-size:13px;color:#444;padding:6px 0;word-break:break-word">${d.question||"—"}</div>
        </div>`;
    });
  }catch(e){ body.innerHTML=`<div class="live-panel"><div class="live-row"><span>Sin datos en tiempo real (modo local).</span></div></div>`; }
}

async function renderHistory(body){
  body.innerHTML=`<div style="padding:20px;text-align:center">Cargando historial...</div>`;
  const list=await AdminStore.getHistory(200);
  if(!list.length){ body.innerHTML=`<div style="padding:20px;text-align:center;color:#888">Sin historial aún.</div>`; return; }
  const rows=list.map(h=>`<tr style="cursor:pointer" data-id="${h.id||""}" data-idx="${list.indexOf(h)}">
    <td>${fmtTS(h.ts)}</td>
    <td>Fase ${(h.phase||0)+1} · Niv ${h.level||1}</td>
    <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(h.question||"").substring(0,60)}</td>
    <td><span class="tag ${h.result==="correcta"?"ok":h.result==="abandonada"?"abandoned":"bad"}">${h.result||"?"}</span></td>
  </tr>`).join("");
  body.innerHTML=`
    <div style="overflow-x:auto">
      <table class="admin-table">
        <thead><tr><th>Fecha</th><th>Fase · Nivel</th><th>Pregunta</th><th>Resultado</th></tr></thead>
        <tbody id="hist-tbody">${rows}</tbody>
      </table>
    </div>`;
  body.querySelectorAll("tr[data-idx]").forEach(row=>{
    row.onclick=()=>openCanvasModal(list[+row.dataset.idx]);
  });
}

function openCanvasModal(h){
  const existing=document.getElementById("canvas-modal");
  if(existing) existing.remove();
  const ov=document.createElement("div");
  ov.className="modal-overlay"; ov.id="canvas-modal";
  const imgHTML=h.canvas?`<img src="${h.canvas}" style="width:100%;border-radius:8px;border:1px solid #ddd">`:`<div style="padding:20px;text-align:center;color:#888">Sin pizarra guardada.</div>`;
  const opts=(h.options||[]).map((v,i)=>{
    const letter=["A","B","C","D"][i];
    const isCorrect=i===h.correctIndex, isChosen=i===h.chosenIndex;
    const mark=isChosen?(isCorrect?"✅":"❌"):"";
    return `<div style="padding:4px 0;font-size:13px">${mark} <b>${letter}.</b> ${v}g ${isCorrect?"← correcta":""}</div>`;
  }).join("");
  ov.innerHTML=`
    <div class="modal-box" style="max-width:500px;width:95%">
      <h3>📋 Detalle del ejercicio</h3>
      <div style="margin-bottom:8px;font-size:13px;color:#555">${fmtTS(h.ts)} · Fase ${(h.phase||0)+1} · Nivel ${h.level||1}</div>
      <div style="margin-bottom:10px;font-size:14px">${h.question||"Sin texto"}</div>
      <div style="margin-bottom:12px">${opts}</div>
      <div style="margin-bottom:8px;font-weight:600;font-size:13px">Pizarra:</div>
      ${imgHTML}
      <div class="modal-actions" style="margin-top:12px"><button class="modal-btn ghost" id="cm-close">Cerrar</button></div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#cm-close").onclick=()=>ov.remove();
  ov.onclick=(e)=>{ if(e.target===ov) ov.remove(); };
}

async function renderStats(body){
  body.innerHTML=`<div style="padding:20px;text-align:center">Calculando estadísticas...</div>`;
  const [progress,history,sessions]=await Promise.all([AdminStore.getProgress(),AdminStore.getHistory(500),AdminStore.getSessions()]);
  if(!progress){ body.innerHTML=`<div style="padding:20px;text-align:center;color:#888">Sin datos aún.</div>`; return; }
  const total=history.length;
  const correctas=history.filter(h=>h.result==="correcta").length;
  const incorrectas=history.filter(h=>h.result==="incorrecta").length;
  const abandonadas=history.filter(h=>h.result==="abandonada").length;
  const acc=total?Math.round((correctas/total)*100):0;
  const completedSessions=sessions.filter(s=>s.end).length;
  const totalSessTime=sessions.filter(s=>s.end).reduce((a,s)=>a+(s.end-s.start),0);
  const avgSess=completedSessions?Math.round(totalSessTime/completedSessions/1000/60):0;
  const phasesCompleted=(progress.phaseStars||[]).filter((s,i)=>s>0&&i<PHASE_TOTAL).length;
  const cards=[
    ["📚 Sesiones","Completadas",completedSessions],["⭐ Estrellas","Acumuladas",progress.stars||0],
    ["🔥 Racha máx.","Alguna vez",progress.bestStreak||0],["✅ Respuestas","Correctas",correctas],
    ["❌ Incorrectas","Total",incorrectas],["⏭️ Abandonadas","Sin responder",abandonadas],
    ["🎯 Precisión",`de ${total} ejercicios`,acc+"%"],["⏱️ Tiempo promedio","Por sesión",avgSess+" min"],
    ["🏆 Fases","Iniciadas",phasesCompleted]
  ].map(([t,sub,v])=>`
    <div class="admin-card">
      <div style="font-size:22px;font-weight:800;color:#6350E0">${v}</div>
      <div style="font-weight:600;font-size:14px;margin:2px 0">${t}</div>
      <div style="font-size:12px;color:#888">${sub}</div>
    </div>`).join("");
  body.innerHTML=`<div class="admin-grid">${cards}</div>`;
}

async function renderPhases(body){
  const cfg=await AdminStore.getConfig();
  adminCFG=cfg;
  const rows=PHASE_META.map((m,i)=>`
    <div class="phase-toggle-row">
      <div>
        <div style="font-weight:600">Fase ${i+1}: ${m.name}</div>
        <div style="font-size:12px;color:#888">${m.desc}</div>
      </div>
      <label class="switch">
        <input type="checkbox" class="phase-toggle" data-i="${i}" ${cfg.enabled[i]!==false?"checked":""}>
        <span class="slider"></span>
      </label>
    </div>`).join("");
  body.innerHTML=`
    <div style="padding:16px">
      <div style="margin-bottom:16px;font-size:14px;color:#555">Activa o desactiva fases para Luanna. Solo puede acceder a las fases habilitadas.</div>
      ${rows}
      <div style="margin-top:28px;border-top:1px solid #eee;padding-top:20px">
        <div style="font-weight:600;color:#c00;margin-bottom:8px">⚠️ Zona de peligro</div>
        <p style="font-size:13px;color:#666;margin-bottom:12px">Elimina todo el historial, progreso, estrellas y estadísticas de Luanna. Esta acción no se puede deshacer.</p>
        <button class="danger-btn" id="reset-btn">🗑️ Reiniciar todo el progreso</button>
      </div>
    </div>`;
  body.querySelectorAll(".phase-toggle").forEach(cb=>{
    cb.onchange=async()=>{
      adminCFG.enabled[+cb.dataset.i]=cb.checked;
      await AdminStore.saveConfig(adminCFG);
    };
  });
  $("#reset-btn").onclick=()=>confirmReset();
}

function confirmReset(){
  const ov=document.createElement("div");
  ov.className="modal-overlay";
  ov.innerHTML=`
    <div class="modal-box">
      <h3>⚠️ Confirmar reinicio</h3>
      <p>Esto eliminará <b>todo</b> el progreso, historial, estrellas y estadísticas de Luanna permanentemente.</p>
      <p>Escribe <b>reiniciar</b> para confirmar:</p>
      <input type="text" class="modal-input" id="confirm-inp" placeholder="reiniciar">
      <div class="modal-error" id="confirm-err"></div>
      <div class="modal-actions">
        <button class="modal-btn ghost" id="confirm-cancel">Cancelar</button>
        <button class="danger-btn" id="confirm-ok">Reiniciar todo</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#confirm-cancel").onclick=()=>ov.remove();
  ov.querySelector("#confirm-ok").onclick=async()=>{
    if(ov.querySelector("#confirm-inp").value.trim()!=="reiniciar"){
      ov.querySelector("#confirm-err").textContent='Escribe exactamente "reiniciar"'; return;
    }
    ov.querySelector("#confirm-ok").disabled=true; ov.querySelector("#confirm-ok").textContent="Eliminando...";
    await AdminStore.resetAll();
    ov.remove();
    const body=$("#admin-body");
    body.innerHTML=`<div style="padding:30px;text-align:center;color:#00B49A;font-weight:600">✅ Progreso reiniciado correctamente.</div>`;
    setTimeout(()=>renderPhases(body),2000);
  };
}

document.addEventListener("DOMContentLoaded",initAdmin);
