const IC = {
  book:`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  backpack:`<path d="M8 2h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/><path d="M10 12h4M9 22v-4h6v4"/>`,
  ball:`<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/>`,
  bottle:`<path d="M9 2h6v4l2 3v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-3V2z"/><path d="M9 9h6"/>`,
  notebook:`<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 3v18M4 8h4M4 13h4M4 18h4"/>`,
  pencil:`<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="M15 5l4 4"/>`,
  watermelon:`<path d="M12 22c-5 0-9-4-9-9s4-9 9-9 9 4 9 9"/><path d="M3 13h18"/><circle cx="9" cy="17.5" r="1" fill="currentColor"/><circle cx="14" cy="17.5" r="1" fill="currentColor"/>`,
  orange:`<circle cx="12" cy="13" r="8"/><path d="M12 5V3M10.5 4c1-.8 3-.8 3 0"/>`,
  shoes:`<path d="M4 18h16v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2z"/><path d="M4 16l4-9h4l4 5 4 4M12 7l2 3"/>`,
  socks:`<path d="M9 2v10l-5 5a3 3 0 0 0 4 4l6-6V7"/><path d="M9 2h5v5H9"/>`,
  box:`<path d="M21 8L12 13 3 8M3 8l9 5 9-5M3 16l9 5 9-5M12 2l9 5v10l-9 5-9-5V7l9-5z"/>`,
  jar:`<path d="M8 2h8"/><path d="M7 5h10l1 4v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9l1-4z"/><path d="M10 11h4"/>`,
  melon:`<ellipse cx="12" cy="12" rx="9" ry="7"/><path d="M3 12h18M7 8l10 8M7 16l10-8"/>`,
  lemon:`<path d="M12 22c4.4-1 8-5 8-10S16.4 2 12 2"/><path d="M12 22C7.6 21 4 17 4 12S7.6 2 12 2"/>`,
  racket:`<ellipse cx="12" cy="7.5" rx="7" ry="7"/><path d="M7.5 4l9 6.5M7.5 11l9-6.5M12 14.5v8"/>`,
  balls:`<circle cx="8" cy="15" r="5"/><circle cx="17" cy="15" r="5"/><circle cx="12.5" cy="7" r="4"/>`,
  laptop:`<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 18h20M9 22h6"/>`,
  charger:`<path d="M13 2L4.09 12.6A1 1 0 0 0 5 14h7l-2 8 8.91-10.6A1 1 0 0 0 18 10h-7l2-8z"/>`,
  calc:`<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="7" width="8" height="3" rx="1"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/><circle cx="9" cy="17" r="1" fill="currentColor"/><circle cx="12" cy="17" r="1" fill="currentColor"/><circle cx="15" cy="17" r="1" fill="currentColor"/>`,
  watch:`<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3h6M9 21h6M12 10v3l2 1"/>`,
  fish:`<path d="M3 12c4-6 12-6 16 0-4 6-12 6-16 0z"/><circle cx="15" cy="11" r="1" fill="currentColor"/><path d="M19 12l3-3v6z"/>`,
  bread:`<path d="M4 13a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>`,
  cheese:`<path d="M3 16l8-12 10 8-2 4H5z"/><circle cx="10" cy="13" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/>`,
  cup:`<path d="M5 4h12v9a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z"/><path d="M17 7h2a2 2 0 0 1 0 4h-2"/>`,
  bag:`<path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>`,
  hat:`<path d="M4 16c0-5 4-9 8-9s8 4 8 9"/><path d="M2 16h20"/>`
};

const IC_BG  = { v:"ic-lavender", b:"ic-sky", o:"ic-peach", p:"ic-rose", t:"ic-mint" };
const IC_STR = { v:"#6350E0", b:"#2B8EFF", o:"#E08A2B", p:"#E0508C", t:"#00B49A" };
const FILL_C = { v:"fill-v", b:"fill-b", o:"fill-o", p:"fill-p", t:"fill-t" };
const BV_C   = { v:"bv-v", b:"bv-b", o:"bv-o", p:"bv-p", t:"bv-t" };
const COL_SEQ = ["v","b","o","p"];

function icon(name, sz, col) {
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${IC_STR[col]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[name]||IC.calc}</svg>`;
}
function fmt(g) {
  if (g >= 1000) {
    const kg = Math.floor(g/1000), r = g%1000;
    return r ? `${kg}&nbsp;kg&nbsp;${String(r).padStart(3,"0")}&nbsp;g` : `${kg}&nbsp;kg`;
  }
  return `${g}&nbsp;g`;
}
function fmtPlain(g) { return fmt(g).replace(/&nbsp;/g," "); }

const OBJECTS = [
  {name:"Libro",art:"Un",verb:"pesa",icon:"book",wMin:800,wMax:1600},
  {name:"Mochila",art:"Una",verb:"pesa",icon:"backpack",wMin:700,wMax:1400},
  {name:"Pelota",art:"Una",verb:"pesa",icon:"ball",wMin:200,wMax:500},
  {name:"Botella",art:"Una",verb:"pesa",icon:"bottle",wMin:400,wMax:1000},
  {name:"Cuaderno",art:"Un",verb:"pesa",icon:"notebook",wMin:200,wMax:600},
  {name:"Estuche",art:"Un",verb:"pesa",icon:"pencil",wMin:100,wMax:350},
  {name:"Sandía",art:"Una",verb:"pesa",icon:"watermelon",wMin:1800,wMax:3500},
  {name:"Naranja",art:"Una",verb:"pesa",icon:"orange",wMin:150,wMax:350},
  {name:"Zapatos",art:"Unos",verb:"pesan",icon:"shoes",wMin:500,wMax:1100},
  {name:"Calcetines",art:"Unos",verb:"pesan",icon:"socks",wMin:50,wMax:150},
  {name:"Caja",art:"Una",verb:"pesa",icon:"box",wMin:1000,wMax:2500},
  {name:"Frasco",art:"Un",verb:"pesa",icon:"jar",wMin:300,wMax:900},
  {name:"Melón",art:"Un",verb:"pesa",icon:"melon",wMin:1200,wMax:2800},
  {name:"Limones",art:"Unos",verb:"pesan",icon:"lemon",wMin:200,wMax:500},
  {name:"Raqueta",art:"Una",verb:"pesa",icon:"racket",wMin:250,wMax:450},
  {name:"Pelotas",art:"Unas",verb:"pesan",icon:"balls",wMin:300,wMax:600},
  {name:"Laptop",art:"Una",verb:"pesa",icon:"laptop",wMin:1500,wMax:3000},
  {name:"Cargador",art:"Un",verb:"pesa",icon:"charger",wMin:200,wMax:600},
  {name:"Manzana",art:"Una",verb:"pesa",icon:"orange",wMin:120,wMax:250},
  {name:"Plátano",art:"Un",verb:"pesa",icon:"lemon",wMin:100,wMax:200},
  {name:"Taza",art:"Una",verb:"pesa",icon:"cup",wMin:200,wMax:400},
  {name:"Bolsa",art:"Una",verb:"pesa",icon:"bag",wMin:300,wMax:900},
  {name:"Gorro",art:"Un",verb:"pesa",icon:"hat",wMin:80,wMax:200},
  {name:"Pescado",art:"Un",verb:"pesa",icon:"fish",wMin:300,wMax:1200},
  {name:"Pan",art:"Un",verb:"pesa",icon:"bread",wMin:250,wMax:600},
  {name:"Queso",art:"Un",verb:"pesa",icon:"cheese",wMin:200,wMax:800},
  {name:"Mango",art:"Un",verb:"pesa",icon:"orange",wMin:200,wMax:400},
  {name:"Durazno",art:"Un",verb:"pesa",icon:"orange",wMin:100,wMax:250},
  {name:"Reloj",art:"Un",verb:"pesa",icon:"watch",wMin:30,wMax:150},
  {name:"Termo",art:"Un",verb:"pesa",icon:"bottle",wMin:300,wMax:700}
];

const PHASE_META = [
  {name:"Suma simple",desc:"Suma de dos objetos"},
  {name:"Resta simple",desc:"Encuentra la diferencia"},
  {name:"Encontrar el total",desc:"Convierte y suma"},
  {name:"Objeto faltante",desc:"Descubre el peso oculto"},
  {name:"Problemas mixtos",desc:"Suma o resta: ¡tú decides!"},
  {name:"Tres objetos",desc:"Suma de tres pesos"},
  {name:"Cuatro objetos",desc:"Suma de cuatro pesos"},
  {name:"Problemas inversos",desc:"Razona con relaciones"},
  {name:"Problemas encadenados",desc:"Dos operaciones seguidas"},
  {name:"Máxima complejidad",desc:"El mayor desafío"}
];
const PHASE_TOTAL = PHASE_META.length;
const LEVELS_PER_PHASE = 10;
const QUESTIONS_PER_LEVEL = 10;

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function pickOne(arr){ return arr[randInt(0,arr.length-1)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=randInt(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function roundStep(w){ const step = w<300?10:(w<1500?50:100); return Math.max(step,Math.round(w/step)*step); }
function genW(obj){ return roundStep(randInt(obj.wMin,obj.wMax)); }
function pickObjects(n){
  const pool=[...OBJECTS], res=[];
  for(let i=0;i<n;i++){ const idx=randInt(0,pool.length-1); res.push(pool[idx]); pool.splice(idx,1); }
  return res;
}
function buildOptions(correct){
  const step = correct<300?10:(correct<1500?50:100);
  const set = new Set([correct]);
  let guard=0;
  while(set.size<4 && guard<40){
    guard++;
    const off = randInt(1,5)*step*(Math.random()<0.5?-1:1);
    const v = correct+off;
    if(v>0) set.add(v);
  }
  const opts = shuffle([...set]);
  return { opts, ci: opts.indexOf(correct) };
}
function clause(obj,value,col,hidden,opts){
  opts = opts || {};
  const art = opts.first ? obj.art : obj.art.toLowerCase();
  const verb = opts.embedded ? "que "+obj.verb : obj.verb;
  const val = hidden ? `<span class="q-glyph">?</span>` : `<span class="hl-${col}">${fmt(value)}</span>`;
  return `${art}&nbsp;${obj.name} ${verb} ${val}`;
}
function defArt(art,lower){
  const m = {Un:"el",Una:"la",Unos:"los",Unas:"las"};
  const d = m[art] || art.toLowerCase();
  return lower ? d : d.charAt(0).toUpperCase()+d.slice(1);
}
function joinList(strs){
  if(strs.length<=1) return strs[0]||"";
  return strs.slice(0,-1).join(", ")+" y "+strs[strs.length-1];
}

function buildSumExercise(parts){
  const total = parts.reduce((s,p)=>s+p.w,0);
  const clauses = parts.map((p,i)=>clause(p.obj,p.w,COL_SEQ[i],false,{first:i===0}));
  const qHTML = `${joinList(clauses)}.<br>¿Cuánto pesan juntos?`;
  const sumStr = parts.map(p=>fmtPlain(p.w)).join(" + ");
  return {
    qHTML,
    parts: parts.map((p,i)=>({name:p.obj.name,icon:p.obj.icon,col:COL_SEQ[i],value:p.w,shown:true})),
    totalValue: total, totalShown:false, targetValue: total,
    hint: `${sumStr} = ?`,
    explain: `${sumStr} = ${fmtPlain(total)}`
  };
}
function buildSubExercise(parts, hiddenIdx, frame){
  const total = parts.reduce((s,p)=>s+p.w,0);
  const known = parts.filter((_,i)=>i!==hiddenIdx);
  const hidden = parts[hiddenIdx];
  const knownClauses = known.map((p)=>clause(p.obj,p.w,COL_SEQ[parts.indexOf(p)],false,{embedded:true}));
  const qHTML = (frame||((kc,h,T)=>
    `Juntos, ${joinList(kc)} y ${h} pesan en total <span class="bv-t" style="font-weight:900">${fmt(T)}</span>.<br>¿Cuánto pesa ${parts[hiddenIdx].obj.art.toLowerCase()}&nbsp;${parts[hiddenIdx].obj.name.toLowerCase()}?`
  ))(knownClauses, clause(hidden.obj,0,"v",true,{embedded:true}), total);
  const subStr = `${fmtPlain(total)} - ${known.map(p=>fmtPlain(p.w)).join(" - ")}`;
  return {
    qHTML,
    parts: parts.map((p,i)=>({name:p.obj.name,icon:p.obj.icon,col:COL_SEQ[i],value:p.w,shown:i!==hiddenIdx})),
    totalValue: total, totalShown:true, targetValue: hidden.w,
    hint: `${subStr} = ?`,
    explain: `${subStr} = ${fmtPlain(hidden.w)}`
  };
}

function gen1(){
  const [o1,o2] = pickObjects(2);
  const w1=genW(o1), w2=genW(o2);
  return buildSumExercise([{obj:o1,w:w1},{obj:o2,w:w2}]);
}
function gen2(){
  const [o1,o2] = pickObjects(2);
  const w1=genW(o1), w2=genW(o2);
  return buildSubExercise([{obj:o1,w:w1},{obj:o2,w:w2}], 1);
}
function gen3(){
  const [o1,o2] = pickObjects(2);
  const w1 = roundStep(randInt(Math.max(o1.wMin,1050), Math.max(o1.wMax,1900)));
  const w2 = roundStep(randInt(Math.min(o2.wMin,150), Math.min(o2.wMax,950)));
  const ex = buildSumExercise([{obj:o1,w:w1},{obj:o2,w:w2}]);
  ex.hint = `Convierte ${fmtPlain(w1)} a gramos si es necesario. Luego suma con ${fmtPlain(w2)}.`;
  return ex;
}
function gen4(){
  const [o1,o2] = pickObjects(2);
  const w1=genW(o1), w2=genW(o2);
  const frame = (kc,h,T)=>`Se perdió la etiqueta de un objeto. Sabemos que ${joinList(kc)}, y que en total pesan <span class="bv-t" style="font-weight:900">${fmt(T)}</span>.<br>¿Cuánto pesa ${defArt(o2.art,true)}&nbsp;${o2.name.toLowerCase()} sin etiqueta?`;
  return buildSubExercise([{obj:o1,w:w1},{obj:o2,w:w2}], 1, frame);
}
function gen5(){
  return Math.random()<0.5 ? gen1() : gen2();
}
function gen6(){
  const objs = pickObjects(3);
  const parts = objs.map(o=>({obj:o,w:genW(o)}));
  return buildSumExercise(parts);
}
function gen7(){
  const objs = pickObjects(4);
  const parts = objs.map(o=>({obj:o,w:genW(o)}));
  return buildSumExercise(parts);
}
function gen8(){
  const [oA,oB] = pickObjects(2);
  const ratios = [
    {k:2, txt:"el doble que"},
    {k:3, txt:"el triple que"},
    {k:0.5, txt:"la mitad de"},
    {k:1.5, txt:"una vez y media más que"}
  ];
  const r = pickOne(ratios);
  const wB = genW(oB);
  const wA = roundStep(Math.round(wB*r.k));
  const total = wA+wB;
  const qHTML = `${oA.art}&nbsp;${oA.name} y ${oB.art.toLowerCase()}&nbsp;${oB.name} pesan juntos <span class="bv-t" style="font-weight:900">${fmt(total)}</span>.<br>${defArt(oA.art)}&nbsp;${oA.name.toLowerCase()} pesa ${r.txt} ${defArt(oB.art,true)}&nbsp;${oB.name.toLowerCase()}.<br>¿Cuánto pesa ${defArt(oB.art,true)}&nbsp;${oB.name.toLowerCase()}?`;
  return {
    qHTML,
    parts: [
      {name:oA.name,icon:oA.icon,col:"v",value:wA,shown:false},
      {name:oB.name,icon:oB.icon,col:"b",value:wB,shown:false}
    ],
    totalValue: total, totalShown:true, targetValue: wB,
    hint: `Si ${oB.name.toLowerCase()} pesa una parte, ${oA.name.toLowerCase()} pesa ${r.k}&nbsp;veces esa parte. Juntas forman ${fmtPlain(total)}.`,
    explain: `${oB.name} = ${fmtPlain(wB)}, ${oA.name} = ${fmtPlain(wA)} (${r.txt} ${oB.name.toLowerCase()}). Juntos: ${fmtPlain(total)}.`
  };
}
function gen9(){
  const [oX,oY,oC] = pickObjects(3);
  const wX=genW(oX), wY=genW(oY);
  const S = wX+wY;
  let wC = genW(oC);
  let guard=0;
  while(wC>=S && guard<20){ wC=genW(oC); guard++; }
  if(wC>=S) wC = Math.round(S*0.4/10)*10;
  const rem = S-wC;
  const qHTML = `Tienes ${clause(oX,wX,"v",false,{embedded:true})} y ${clause(oY,wY,"b",false,{embedded:true})} juntos en una caja, con un peso total de <span class="bv-t" style="font-weight:900">${fmt(S)}</span>.<br>Si retiras ${clause(oC,wC,"o",false,{embedded:true})}, ¿cuánto pesa ahora la caja?`;
  return {
    qHTML,
    parts: [
      {name:oC.name,icon:oC.icon,col:"o",value:wC,shown:true},
      {name:"Restante",icon:"box",col:"p",value:rem,shown:false}
    ],
    totalValue: S, totalShown:true, targetValue: rem,
    hint: `Primero suma ${fmtPlain(wX)} + ${fmtPlain(wY)}. Luego resta ${fmtPlain(wC)} a ese resultado.`,
    explain: `${fmtPlain(wX)} + ${fmtPlain(wY)} = ${fmtPlain(S)}. ${fmtPlain(S)} - ${fmtPlain(wC)} = ${fmtPlain(rem)}.`
  };
}
function gen10(){
  const [oX,oY,oC] = pickObjects(3);
  const ratios = [{k:2,txt:"el doble que"},{k:0.5,txt:"la mitad de"},{k:3,txt:"el triple que"}];
  const r = pickOne(ratios);
  const wY = genW(oY);
  const wX = roundStep(Math.round(wY*r.k));
  const S = wX+wY;
  let wC = genW(oC);
  let guard=0;
  while(wC>=S && guard<20){ wC=genW(oC); guard++; }
  if(wC>=S) wC = Math.round(S*0.4/10)*10;
  const rem = S-wC;
  const qHTML = `${oX.art}&nbsp;${oX.name} y ${oY.art.toLowerCase()}&nbsp;${oY.name} están juntos en una caja, con un peso total de <span class="bv-t" style="font-weight:900">${fmt(S)}</span>. (Dato curioso: ${oX.name.toLowerCase()} pesa ${r.txt} ${oY.name.toLowerCase()}, ¡pero no lo necesitas para responder!)<br>Si retiras ${clause(oC,wC,"o",false,{embedded:true})} de la caja, ¿cuánto pesa ahora?`;
  return {
    qHTML,
    parts: [
      {name:oC.name,icon:oC.icon,col:"o",value:wC,shown:true},
      {name:"Restante",icon:"box",col:"p",value:rem,shown:false}
    ],
    totalValue: S, totalShown:true, targetValue: rem,
    hint: `Ignora la relación entre ${oX.name.toLowerCase()} y ${oY.name.toLowerCase()}: ya tienes el total. Solo resta ${fmtPlain(wC)} de ${fmtPlain(S)}.`,
    explain: `${fmtPlain(S)} - ${fmtPlain(wC)} = ${fmtPlain(rem)}. La relación entre ${oX.name.toLowerCase()} y ${oY.name.toLowerCase()} era información de más.`
  };
}

const GENERATORS = [gen1,gen2,gen3,gen4,gen5,gen6,gen7,gen8,gen9,gen10];
const RECENT_KEY = "pesomas_recent_sigs";

function signatureOf(ex){ return ex.parts.map(p=>p.name).sort().join("|"); }
function loadRecent(){ try{ return JSON.parse(localStorage.getItem(RECENT_KEY))||[]; }catch(e){ return []; } }
function pushRecent(sig){
  const list = loadRecent();
  list.push(sig);
  while(list.length>24) list.shift();
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}
function generateExercise(phaseIdx){
  const gen = GENERATORS[phaseIdx] || gen1;
  const recent = loadRecent();
  let ex, sig, guard=0;
  do {
    ex = gen();
    sig = signatureOf(ex)+"#"+phaseIdx;
    guard++;
  } while (recent.includes(sig) && guard<10);
  pushRecent(sig);
  const { opts, ci } = buildOptions(ex.targetValue);
  ex.opts = opts; ex.ci = ci; ex.phaseIdx = phaseIdx;
  return ex;
}
