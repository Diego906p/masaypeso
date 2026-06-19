/* ════════════════════════════════════════════════════════════════
   PIZARRA — lienzo de trabajo
   Herramientas: lápiz, selección (mover formas), borrador, formas
   (menú desplegable: cuadrado/triángulo/círculo/línea), mano (zoom/pan).
   Zoom con ➖ % ➕ sobre el lienzo. Papel cuadriculado fijo.
   Atajos: v=selección  e=borrador  m=formas  h=mano  Ctrl+Z / Ctrl+Y
   ════════════════════════════════════════════════════════════════ */
const Pizarra = (function(){
  const COLORS_DEFAULT = "#1C1852";
  const GRID = 28;
  const SHAPE_ICON = { rect:"⬜", triangle:"🔺", circle:"⭕", line:"📏" };

  let canvas, ctx, layer, lctx, wrap, container, dpr=1, cssW=0, cssH=0;
  let strokes=[], redoStack=[], current=null;
  let tool="pencil", shapeKind="rect", color=COLORS_DEFAULT, size=4;
  let view={scale:1, ox:0, oy:0};
  let drawing=false, panning=false, panStart=null;
  let selected=[], movingFrom=null, moving=false, marquee=null;
  let keyHandler=null, outsideHandler=null;

  function buildDOM(host){
    container = host;
    // Empezar siempre limpio al montar
    strokes=[]; redoStack=[]; current=null; drawing=false; panning=false;
    selected=[]; movingFrom=null; moving=false; marquee=null;
    view={scale:1, ox:0, oy:0}; tool="pencil"; shapeKind="rect";
    color=COLORS_DEFAULT; size=4;

    host.innerHTML = `
      <div class="canvas-card">
        <div class="canvas-title">🎨 Tu pizarra de trabajo</div>
        <div class="canvas-wrap">
          <canvas id="pz-canvas"></canvas>
          <div class="pz-size-ind" id="pz-size-ind" title="Grosor del trazo"><span id="pz-size-dot"></span></div>
          <div class="pz-zoom">
            <button class="pz-zb" id="pz-zoomout" title="Alejar">➖</button>
            <span id="pz-zoom-ind">100%</span>
            <button class="pz-zb" id="pz-zoomin" title="Acercar">➕</button>
          </div>
        </div>
        <div class="canvas-tools">
          <button class="ctool active" id="pz-pencil" title="Lápiz (B)">✏️</button>
          <button class="ctool"        id="pz-select" title="Seleccionar y mover (V)">⬚</button>
          <button class="ctool"        id="pz-eraser" title="Borrador (E)">🧽</button>
          <div class="pz-shape-box">
            <button class="ctool" id="pz-shape" title="Formas (M)"><span id="pz-shape-ic">⬜</span> ▾</button>
            <div class="pz-shape-menu" id="pz-shape-menu" hidden>
              <button data-k="rect"     title="Cuadrado">⬜</button>
              <button data-k="triangle" title="Triángulo">🔺</button>
              <button data-k="circle"   title="Círculo">⭕</button>
              <button data-k="line"     title="Línea">📏</button>
            </div>
          </div>
          <button class="ctool" id="pz-hand" title="Mover/Zoom (H). Doble toque = restablecer">✋</button>
          <span class="ctool-sep"></span>
          <button class="ctool" id="pz-undo" title="Deshacer (Ctrl+Z)">↩️</button>
          <button class="ctool" id="pz-redo" title="Rehacer (Ctrl+Y)">↪️</button>
          <button class="ctool" id="pz-clear" title="Limpiar todo">🗑️</button>
          <span class="ctool-sep"></span>
          <input type="color" class="ccolor" id="pz-color" value="${COLORS_DEFAULT}" title="Color">
          <input type="range" class="csize" id="pz-size" min="2" max="22" value="4" title="Grosor">
        </div>
      </div>`;

    canvas = host.querySelector("#pz-canvas");
    ctx = canvas.getContext("2d");
    wrap = host.querySelector(".canvas-wrap");
    layer = document.createElement("canvas");
    lctx = layer.getContext("2d");
    bindUI(host);
    bindPointer();
    bindKeys();
    resize();
  }

  function bindUI(c){
    c.querySelector("#pz-pencil").onclick = ()=>setTool("pencil");
    c.querySelector("#pz-select").onclick = ()=>setTool("select");
    c.querySelector("#pz-eraser").onclick = ()=>setTool("eraser");
    c.querySelector("#pz-hand").onclick   = ()=>setTool("hand");
    c.querySelector("#pz-undo").onclick = undo;
    c.querySelector("#pz-redo").onclick = redo;
    c.querySelector("#pz-clear").onclick = clear;
    c.querySelector("#pz-zoomin").onclick  = ()=>zoom(1.25);
    c.querySelector("#pz-zoomout").onclick = ()=>zoom(0.8);
    c.querySelector("#pz-color").oninput = (e)=>{ color=e.target.value; updateSizeDot(); if(tool==="eraser"||tool==="hand"||tool==="select") setTool("pencil"); };
    c.querySelector("#pz-size").oninput  = (e)=>{ size=+e.target.value; updateSizeDot(true); };
    updateSizeDot();

    const shapeBtn=c.querySelector("#pz-shape"), menu=c.querySelector("#pz-shape-menu");
    const markActive=()=>menu.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.k===shapeKind));
    shapeBtn.onclick=(e)=>{ e.stopPropagation(); markActive(); menu.hidden=!menu.hidden; };
    menu.querySelectorAll("button").forEach(b=>{
      b.onclick=()=>{ shapeKind=b.dataset.k; c.querySelector("#pz-shape-ic").textContent=SHAPE_ICON[shapeKind]; menu.hidden=true; setTool("shape"); };
    });
    if(outsideHandler) document.removeEventListener("pointerdown",outsideHandler,true);
    outsideHandler=closeMenuOnOutside;
    document.addEventListener("pointerdown",outsideHandler,true);
  }
  function closeMenuOnOutside(e){
    const menu=container&&container.querySelector("#pz-shape-menu");
    const box=container&&container.querySelector(".pz-shape-box");
    if(menu&&!menu.hidden&&box&&!box.contains(e.target)) menu.hidden=true;
  }

  const TOOL_BTN={pencil:"#pz-pencil",select:"#pz-select",eraser:"#pz-eraser",shape:"#pz-shape",hand:"#pz-hand"};
  function setTool(t){
    // doble activación de la mano => restablecer vista
    if(t==="hand" && tool==="hand"){ view={scale:1,ox:0,oy:0}; updateZoomInd(); redraw(); return; }
    if(t!=="select"){ selected=[]; marquee=null; }
    tool=t;
    Object.values(TOOL_BTN).forEach(sel=>{ const b=container.querySelector(sel); if(b) b.classList.remove("active"); });
    const btn=container.querySelector(TOOL_BTN[t]); if(btn) btn.classList.add("active");
    if(wrap) wrap.style.cursor = t==="hand"?"grab":(t==="select"?"move":"crosshair");
    redraw();
  }

  function bindKeys(){
    if(keyHandler) document.removeEventListener("keydown",keyHandler);
    keyHandler=(e)=>{
      if(!container||!container.querySelector("#pz-canvas")) return; // pizarra no montada
      const t=e.target, type=(t.type||"").toLowerCase();
      // solo ignorar entradas de texto; range/color permiten atajos
      if((t.tagName==="INPUT" && (type==="text"||type==="number"||type==="search")) || t.tagName==="TEXTAREA") return;
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="z"){ e.preventDefault(); undo(); return; }
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="y"){ e.preventDefault(); redo(); return; }
      if(e.ctrlKey||e.metaKey) return;
      const k=e.key.toLowerCase();
      // tras usar slider/color, soltar el foco para que el atajo cambie de herramienta
      if(t.tagName==="INPUT" && (type==="range"||type==="color")) t.blur();
      if(e.key==="Delete"||e.key==="Backspace"){ deleteSelected(); return; }
      if(k==="b"){ setTool("pencil"); }
      else if(k==="v"){ setTool("select"); }
      else if(k==="e"){ setTool("eraser"); }
      else if(k==="m"){ shapeKind=shapeKind||"rect"; const ic=container.querySelector("#pz-shape-ic"); if(ic) ic.textContent=SHAPE_ICON[shapeKind]; setTool("shape"); }
      else if(k==="h"){ setTool("hand"); }
    };
    document.addEventListener("keydown",keyHandler);
  }

  function resize(){
    if(!canvas) return;
    const rect = wrap.getBoundingClientRect();
    cssW = Math.max(rect.width, 200);
    cssH = Math.round(cssW*0.62);
    dpr = window.devicePixelRatio || 1;
    [canvas,layer].forEach(cv=>{ cv.width=Math.round(cssW*dpr); cv.height=Math.round(cssH*dpr); });
    canvas.style.height = cssH+"px";
    redraw();
  }

  let sizeDotTimer=null;
  function updateSizeDot(flash){
    const wrapEl=container&&container.querySelector("#pz-size-ind");
    const dot=container&&container.querySelector("#pz-size-dot");
    if(!wrapEl||!dot) return;
    dot.style.width=size+"px"; dot.style.height=size+"px"; dot.style.background=color;
    if(flash){ // resaltar mientras se ajusta el grosor
      wrapEl.classList.add("show");
      clearTimeout(sizeDotTimer);
      sizeDotTimer=setTimeout(()=>wrapEl.classList.remove("show"),1100);
    }
  }
  function updateZoomInd(){ const i=container&&container.querySelector("#pz-zoom-ind"); if(i) i.textContent=Math.round(view.scale*100)+"%"; }
  function zoom(factor){
    const ns=Math.min(3, Math.max(0.4, view.scale*factor));
    const cx=cssW/2, cy=cssH/2;
    const wx=(cx-view.ox)/view.scale, wy=(cy-view.oy)/view.scale;
    view.scale=ns; view.ox=cx-wx*ns; view.oy=cy-wy*ns;
    updateZoomInd(); redraw();
  }

  function toWorld(e){ const r=canvas.getBoundingClientRect(); return { x:(e.clientX-r.left-view.ox)/view.scale, y:(e.clientY-r.top-view.oy)/view.scale }; }
  function screenRaw(e){ const r=canvas.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }

  function bbox(s){
    const xs=s.pts.map(p=>p.x), ys=s.pts.map(p=>p.y);
    return { x0:Math.min(...xs), y0:Math.min(...ys), x1:Math.max(...xs), y1:Math.max(...ys) };
  }
  function hitTest(w){
    const pad=8/view.scale;
    for(let i=strokes.length-1;i>=0;i--){
      const b=bbox(strokes[i]);
      if(w.x>=b.x0-pad && w.x<=b.x1+pad && w.y>=b.y0-pad && w.y<=b.y1+pad) return strokes[i];
    }
    return null;
  }
  function normRect(m){ return { x0:Math.min(m.x0,m.x1), y0:Math.min(m.y0,m.y1), x1:Math.max(m.x0,m.x1), y1:Math.max(m.y0,m.y1) }; }
  function rectsIntersect(a,b){ return !(a.x1<b.x0 || a.x0>b.x1 || a.y1<b.y0 || a.y0>b.y1); }
  function selBBox(){
    if(!selected.length) return null;
    const bs=selected.map(bbox);
    return { x0:Math.min(...bs.map(b=>b.x0)), y0:Math.min(...bs.map(b=>b.y0)), x1:Math.max(...bs.map(b=>b.x1)), y1:Math.max(...bs.map(b=>b.y1)) };
  }
  function pointInSel(w){ const b=selBBox(); if(!b) return false; const pad=8/view.scale; return w.x>=b.x0-pad&&w.x<=b.x1+pad&&w.y>=b.y0-pad&&w.y<=b.y1+pad; }

  function bindPointer(){
    canvas.addEventListener("pointerdown",(e)=>{
      e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      if(tool==="hand"){ panning=true; panStart={...screenRaw(e), ox:view.ox, oy:view.oy}; wrap.style.cursor="grabbing"; return; }
      if(tool==="select"){
        const w=toWorld(e);
        if(selected.length && pointInSel(w)){ moving=true; movingFrom=w; }
        else { moving=false; selected=[]; marquee={x0:w.x,y0:w.y,x1:w.x,y1:w.y}; }
        redraw(); return;
      }
      drawing=true;
      const type = tool==="pencil"||tool==="eraser" ? "free" : shapeKind;
      current = { tool, color, size, type, pts:[toWorld(e)] };
    });
    canvas.addEventListener("pointermove",(e)=>{
      if(panning){ const s=screenRaw(e); view.ox=panStart.ox+(s.x-panStart.x); view.oy=panStart.oy+(s.y-panStart.y); redraw(); return; }
      if(tool==="select"){
        if(moving && selected.length && movingFrom){
          const w=toWorld(e); const dx=w.x-movingFrom.x, dy=w.y-movingFrom.y;
          selected.forEach(s=>{ s.pts=s.pts.map(p=>({x:p.x+dx,y:p.y+dy})); });
          movingFrom=w; redraw();
        } else if(marquee){ const w=toWorld(e); marquee.x1=w.x; marquee.y1=w.y; redraw(); }
        return;
      }
      if(!drawing||!current) return;
      e.preventDefault();
      const p=toWorld(e);
      if(current.type==="free") current.pts.push(p); else current.pts[1]=p;
      redraw();
    });
    function end(){
      if(panning){ panning=false; wrap.style.cursor="grab"; return; }
      if(tool==="select"){
        if(marquee){
          const moved=Math.abs(marquee.x1-marquee.x0)+Math.abs(marquee.y1-marquee.y0);
          if(moved < 6/view.scale){ const h=hitTest({x:marquee.x0,y:marquee.y0}); selected=h?[h]:[]; }
          else { const r=normRect(marquee); selected=strokes.filter(s=>rectsIntersect(bbox(s),r)); }
          marquee=null; redraw();
        }
        moving=false; movingFrom=null; return;
      }
      if(!drawing) return;
      drawing=false;
      if(current && current.pts.length>1){ strokes.push(current); redoStack=[]; }
      current=null; redraw();
    }
    canvas.addEventListener("pointerup",end);
    canvas.addEventListener("pointercancel",end);
    canvas.addEventListener("pointerleave",()=>{ if(drawing||panning) end(); });
    window.addEventListener("resize", debounce(resize,200));
  }
  function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

  function drawPaper(){
    ctx.save(); ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle="#FFFFFF"; ctx.fillRect(0,0,cssW,cssH);
    ctx.strokeStyle="#E4E0F4"; ctx.lineWidth=1;
    const g=GRID*view.scale;
    let sy=view.oy % g; if(sy>0) sy-=g;
    for(let y=sy; y<cssH; y+=g){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(cssW,y); ctx.stroke(); }
    let sx=view.ox % g; if(sx>0) sx-=g;
    for(let x=sx; x<cssW; x+=g){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,cssH); ctx.stroke(); }
    ctx.restore();
  }
  function applyView(c){ c.setTransform(view.scale*dpr,0,0,view.scale*dpr, view.ox*dpr, view.oy*dpr); }

  function drawStroke(c,s){
    c.lineJoin="round"; c.lineCap="round"; c.lineWidth=s.size;
    if(s.tool==="eraser"){ c.globalCompositeOperation="destination-out"; c.strokeStyle="rgba(0,0,0,1)"; }
    else { c.globalCompositeOperation="source-over"; c.strokeStyle=s.color; }
    const p=s.pts; c.beginPath();
    if(s.type==="free"){ c.moveTo(p[0].x,p[0].y); for(let k=1;k<p.length;k++) c.lineTo(p[k].x,p[k].y); }
    else if(s.type==="line"){ c.moveTo(p[0].x,p[0].y); c.lineTo(p[1].x,p[1].y); }
    else if(s.type==="rect"){ const x=Math.min(p[0].x,p[1].x),y=Math.min(p[0].y,p[1].y); c.rect(x,y,Math.abs(p[1].x-p[0].x),Math.abs(p[1].y-p[0].y)); }
    else if(s.type==="triangle"){ const x0=p[0].x,y0=p[0].y,x1=p[1].x,y1=p[1].y; c.moveTo((x0+x1)/2,y0); c.lineTo(x1,y1); c.lineTo(x0,y1); c.closePath(); }
    else if(s.type==="circle"){ const cx=(p[0].x+p[1].x)/2,cy=(p[0].y+p[1].y)/2; c.ellipse(cx,cy,Math.max(Math.abs(p[1].x-p[0].x)/2,1),Math.max(Math.abs(p[1].y-p[0].y)/2,1),0,0,Math.PI*2); }
    c.stroke();
  }

  function drawSelection(){
    ctx.save(); ctx.setTransform(dpr,0,0,dpr,0,0);
    // recuadro de cada forma seleccionada
    selected.forEach(s=>{
      const b=bbox(s);
      const x=b.x0*view.scale+view.ox, y=b.y0*view.scale+view.oy;
      const w=(b.x1-b.x0)*view.scale, h=(b.y1-b.y0)*view.scale;
      ctx.fillStyle="rgba(99,80,224,.08)"; ctx.fillRect(x-5,y-5,w+10,h+10);
      ctx.strokeStyle="#6350E0"; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.strokeRect(x-5,y-5,w+10,h+10);
    });
    // marco general con tiradores si hay selección
    const sb=selBBox();
    if(sb){
      const x=sb.x0*view.scale+view.ox, y=sb.y0*view.scale+view.oy;
      const w=(sb.x1-sb.x0)*view.scale, h=(sb.y1-sb.y0)*view.scale, pad=7;
      ctx.setLineDash([]); ctx.fillStyle="#6350E0";
      [[x-pad,y-pad],[x+w+pad,y-pad],[x-pad,y+h+pad],[x+w+pad,y+h+pad]].forEach(([hx,hy])=>{ ctx.beginPath(); ctx.arc(hx,hy,4,0,Math.PI*2); ctx.fill(); });
    }
    // rectángulo de selección en curso (marquee), visible mientras se delimita
    if(marquee){
      const r=normRect(marquee);
      const x=r.x0*view.scale+view.ox, y=r.y0*view.scale+view.oy;
      const w=(r.x1-r.x0)*view.scale, h=(r.y1-r.y0)*view.scale;
      ctx.fillStyle="rgba(99,80,224,.10)"; ctx.fillRect(x,y,w,h);
      ctx.strokeStyle="#6350E0"; ctx.lineWidth=1.5; ctx.setLineDash([5,3]); ctx.strokeRect(x,y,w,h);
    }
    ctx.restore();
  }

  function redraw(){
    if(!ctx) return;
    drawPaper();
    lctx.setTransform(1,0,0,1,0,0); lctx.clearRect(0,0,layer.width,layer.height);
    applyView(lctx);
    strokes.forEach(s=>drawStroke(lctx,s));
    if(current) drawStroke(lctx,current);
    ctx.save(); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.globalCompositeOperation="source-over";
    ctx.drawImage(layer,0,0,layer.width,layer.height,0,0,cssW,cssH);
    ctx.restore();
    drawSelection();
  }

  function deleteSelected(){
    if(!selected.length) return;
    strokes=strokes.filter(s=>!selected.includes(s));
    selected=[]; redoStack=[]; redraw();
  }
  function undo(){ if(strokes.length){ redoStack.push(strokes.pop()); selected=[]; redraw(); } }
  function redo(){ if(redoStack.length){ strokes.push(redoStack.pop()); redraw(); } }
  function clear(){ strokes=[]; redoStack=[]; selected=[]; marquee=null; redraw(); }
  function hasContent(){ return strokes.length>0; }

  function exportPNG(maxW){
    maxW=maxW||480;
    const scale=Math.min(1, maxW/cssW);
    const off=document.createElement("canvas");
    off.width=Math.round(cssW*scale); off.height=Math.round(cssH*scale);
    const octx=off.getContext("2d");
    octx.fillStyle="#FFFFFF"; octx.fillRect(0,0,off.width,off.height);
    octx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,off.width,off.height);
    return off.toDataURL("image/jpeg",0.62);
  }

  return { mount: buildDOM, clear, undo, redo, hasContent, exportPNG, resize };
})();
