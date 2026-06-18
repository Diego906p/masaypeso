const Pizarra = (function(){
  const COLORS = ["#1C1852","#6350E0","#2B8EFF","#00B49A","#E08A2B","#E0508C"];
  let canvas, ctx, wrap, dpr=1;
  let strokes=[], redoStack=[], current=null;
  let tool="pencil", color=COLORS[0], size=4;
  let drawing=false;

  function buildDOM(container){
    container.innerHTML = `
      <div class="canvas-card">
        <div class="canvas-title">🎨 Tu pizarra de trabajo</div>
        <div class="canvas-wrap"><canvas id="pz-canvas"></canvas></div>
        <div class="canvas-tools">
          <button class="ctool active" id="pz-pencil" title="Lápiz">✏️</button>
          <button class="ctool" id="pz-eraser" title="Borrador">🧽</button>
          <button class="ctool" id="pz-undo" title="Deshacer">↩️</button>
          <button class="ctool" id="pz-redo" title="Rehacer">↪️</button>
          <button class="ctool" id="pz-clear" title="Limpiar todo">🗑️</button>
          <input type="range" class="csize" id="pz-size" min="2" max="22" value="4">
          <div id="pz-colors" style="display:flex;gap:6px;flex-shrink:0">
            ${COLORS.map((c,i)=>`<span class="cswatch${i===0?" active":""}" data-color="${c}" style="background:${c}"></span>`).join("")}
          </div>
        </div>
      </div>`;
    canvas = container.querySelector("#pz-canvas");
    ctx = canvas.getContext("2d");
    wrap = container.querySelector(".canvas-wrap");
    bindUI(container);
    bindPointer();
    resize();
  }

  function bindUI(c){
    c.querySelector("#pz-pencil").onclick = ()=>setTool("pencil",c);
    c.querySelector("#pz-eraser").onclick = ()=>setTool("eraser",c);
    c.querySelector("#pz-undo").onclick = undo;
    c.querySelector("#pz-redo").onclick = redo;
    c.querySelector("#pz-clear").onclick = clear;
    c.querySelector("#pz-size").oninput = (e)=>{ size = +e.target.value; };
    c.querySelectorAll(".cswatch").forEach(sw=>{
      sw.onclick = ()=>{
        color = sw.dataset.color;
        c.querySelectorAll(".cswatch").forEach(s=>s.classList.remove("active"));
        sw.classList.add("active");
        if(tool==="eraser") setTool("pencil",c);
      };
    });
  }

  function setTool(t,c){
    tool=t;
    const root = c || canvas.closest(".canvas-card");
    root.querySelector("#pz-pencil").classList.toggle("active", t==="pencil");
    root.querySelector("#pz-eraser").classList.toggle("active", t==="eraser");
  }

  function resize(){
    if(!canvas) return;
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(rect.width, 200);
    const h = Math.round(w*0.6);
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
    canvas.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    redraw();
  }

  function localPoint(e){
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX-r.left, y: e.clientY-r.top };
  }

  function bindPointer(){
    canvas.addEventListener("pointerdown",(e)=>{
      e.preventDefault();
      drawing=true;
      canvas.setPointerCapture(e.pointerId);
      current = { tool, color, size, pts:[localPoint(e)] };
    });
    canvas.addEventListener("pointermove",(e)=>{
      if(!drawing||!current) return;
      e.preventDefault();
      const p = localPoint(e);
      current.pts.push(p);
      drawSegment(current, current.pts.length-2, current.pts.length-1);
    });
    function end(e){
      if(!drawing) return;
      drawing=false;
      if(current && current.pts.length>1){ strokes.push(current); redoStack=[]; }
      current=null;
    }
    canvas.addEventListener("pointerup",end);
    canvas.addEventListener("pointercancel",end);
    canvas.addEventListener("pointerleave",()=>{ if(drawing) end(); });
    window.addEventListener("resize", debounce(resize,200));
  }

  function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

  function strokeStyle(s){
    ctx.lineJoin="round"; ctx.lineCap="round";
    ctx.lineWidth = s.size;
    if(s.tool==="eraser"){ ctx.globalCompositeOperation="destination-out"; ctx.strokeStyle="rgba(0,0,0,1)"; }
    else { ctx.globalCompositeOperation="source-over"; ctx.strokeStyle=s.color; }
  }

  function drawSegment(s, i, j){
    if(i<0) return;
    strokeStyle(s);
    ctx.beginPath();
    ctx.moveTo(s.pts[i].x, s.pts[i].y);
    ctx.lineTo(s.pts[j].x, s.pts[j].y);
    ctx.stroke();
  }

  function redraw(){
    ctx.save();
    ctx.globalCompositeOperation="source-over";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    strokes.forEach(s=>{
      for(let k=1;k<s.pts.length;k++) drawSegment(s,k-1,k);
    });
    ctx.globalCompositeOperation="source-over";
  }

  function undo(){
    if(!strokes.length) return;
    redoStack.push(strokes.pop());
    redraw();
  }
  function redo(){
    if(!redoStack.length) return;
    strokes.push(redoStack.pop());
    redraw();
  }
  function clear(){
    strokes=[]; redoStack=[];
    redraw();
  }
  function hasContent(){ return strokes.length>0; }

  function exportPNG(maxW){
    maxW = maxW || 480;
    const w = canvas.width/dpr, h = canvas.height/dpr;
    const scale = Math.min(1, maxW/w);
    const off = document.createElement("canvas");
    off.width = Math.round(w*scale); off.height = Math.round(h*scale);
    const octx = off.getContext("2d");
    octx.fillStyle = "#FFFFFF";
    octx.fillRect(0,0,off.width,off.height);
    octx.drawImage(canvas, 0,0, off.width, off.height);
    return off.toDataURL("image/jpeg", 0.62);
  }

  return { mount: buildDOM, clear, undo, redo, hasContent, exportPNG, resize };
})();
