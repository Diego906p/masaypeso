/* ════════════════════════════════════════════════════════════════
   EJERCICIOS — Kilos y Gramos
   Problemas con coherencia narrativa: los objetos pertenecen a un
   mismo escenario y se relacionan con lógica (modelo de barras para
   componer y descomponer). Cada fase respeta su categoría.
   ════════════════════════════════════════════════════════════════ */

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
  box:`<path d="M21 8L12 13 3 8M3 8l9 5 9-5M3 16l9 5 9-5M12 2l9 5v10l-9 5-9-5V7l9-5z"/>`,
  jar:`<path d="M8 2h8"/><path d="M7 5h10l1 4v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9l1-4z"/><path d="M10 11h4"/>`,
  melon:`<ellipse cx="12" cy="12" rx="9" ry="7"/><path d="M3 12h18M7 8l10 8M7 16l10-8"/>`,
  lemon:`<path d="M12 22c4.4-1 8-5 8-10S16.4 2 12 2"/><path d="M12 22C7.6 21 4 17 4 12S7.6 2 12 2"/>`,
  racket:`<ellipse cx="12" cy="7.5" rx="7" ry="7"/><path d="M7.5 4l9 6.5M7.5 11l9-6.5M12 14.5v8"/>`,
  laptop:`<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 18h20M9 22h6"/>`,
  watch:`<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3h6M9 21h6M12 10v3l2 1"/>`,
  fish:`<path d="M3 12c4-6 12-6 16 0-4 6-12 6-16 0z"/><circle cx="15" cy="11" r="1" fill="currentColor"/><path d="M19 12l3-3v6z"/>`,
  bread:`<path d="M4 13a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>`,
  cheese:`<path d="M3 16l8-12 10 8-2 4H5z"/><circle cx="10" cy="13" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/>`,
  cup:`<path d="M5 4h12v9a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z"/><path d="M17 7h2a2 2 0 0 1 0 4h-2"/>`,
  bag:`<path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>`,
  egg:`<ellipse cx="12" cy="14" rx="6" ry="8"/>`,
  basket:`<path d="M5 9h14l-1.5 11H6.5L5 9z"/><path d="M8 9l2-5M16 9l-2-5M3 9h18"/>`,
  milk:`<path d="M8 2h8v3l1 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l1-3V2z"/><path d="M7 11h10"/>`,
  butter:`<path d="M3 10h18v8H3z"/><path d="M3 10l3-3h15l-3 3"/>`
};

const IC_BG  = { v:"ic-lavender", b:"ic-sky", o:"ic-peach", p:"ic-rose", t:"ic-mint" };
const IC_STR = { v:"#6350E0", b:"#2B8EFF", o:"#E08A2B", p:"#E0508C", t:"#00B49A" };
const FILL_C = { v:"fill-v", b:"fill-b", o:"fill-o", p:"fill-p", t:"fill-t" };
const BV_C   = { v:"bv-v", b:"bv-b", o:"bv-o", p:"bv-p", t:"bv-t" };
const COL_SEQ = ["v","b","o","p"];

function icon(name, sz, col) {
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${IC_STR[col]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[name]||IC.box}</svg>`;
}
function fmt(g) {
  if (g >= 1000) {
    const kg = Math.floor(g/1000), r = g%1000;
    return r ? `${kg}&nbsp;kg&nbsp;${String(r).padStart(3,"0")}&nbsp;g` : `${kg}&nbsp;kg`;
  }
  return `${g}&nbsp;g`;
}
function fmtPlain(g) { return fmt(g).replace(/&nbsp;/g," "); }

/* ── Escenarios coherentes ──
   Cada item: name (etiqueta corta de la barra), label (con artículo, en minúscula),
   plural (verbo pesan/pesa), icon, wMin, wMax (gramos). */
const SCENARIOS = [
  {
    id:"mercado", who:["Ana","Sofía","mamá","el señor López","Lucía"],
    place:"la canasta del mercado", container:{name:"Canasta", icon:"basket"},
    items:[
      {name:"Arroz",     label:"el arroz",     plural:false, icon:"bag",    wMin:500, wMax:1500},
      {name:"Azúcar",    label:"el azúcar",    plural:false, icon:"jar",    wMin:500, wMax:1000},
      {name:"Harina",    label:"la harina",    plural:false, icon:"bread",  wMin:500, wMax:1200},
      {name:"Carne",     label:"la carne",     plural:false, icon:"fish",   wMin:400, wMax:1000},
      {name:"Papas",     label:"las papas",    plural:true,  icon:"bag",    wMin:500, wMax:2000},
      {name:"Manzanas",  label:"las manzanas", plural:true,  icon:"orange", wMin:300, wMax:900},
      {name:"Fideos",    label:"los fideos",   plural:true,  icon:"box",    wMin:250, wMax:600}
    ]
  },
  {
    id:"cocina", who:["Carla","la abuela","mamá","Diego"],
    place:"el tazón de la receta", container:{name:"Tazón", icon:"cup"},
    items:[
      {name:"Harina",      label:"la harina",      plural:false, icon:"bread",  wMin:400, wMax:1000},
      {name:"Azúcar",      label:"el azúcar",      plural:false, icon:"jar",    wMin:200, wMax:600},
      {name:"Mantequilla", label:"la mantequilla", plural:false, icon:"butter", wMin:150, wMax:400},
      {name:"Cocoa",       label:"la cocoa",       plural:false, icon:"box",    wMin:100, wMax:300},
      {name:"Leche",       label:"la leche",       plural:false, icon:"milk",   wMin:250, wMax:750}
    ]
  },
  {
    id:"mochila", who:["Luanna","Mateo","la maestra","Pablo"],
    place:"la mochila del colegio", container:{name:"Mochila", icon:"backpack"},
    items:[
      {name:"Libro",    label:"el libro",    plural:false, icon:"book",     wMin:600, wMax:1400},
      {name:"Cuaderno", label:"el cuaderno", plural:false, icon:"notebook", wMin:200, wMax:600},
      {name:"Estuche",  label:"el estuche",  plural:false, icon:"pencil",   wMin:150, wMax:400},
      {name:"Laptop",   label:"la laptop",   plural:false, icon:"laptop",   wMin:1200,wMax:2200},
      {name:"Botella",  label:"la botella",  plural:false, icon:"bottle",   wMin:400, wMax:900}
    ]
  },
  {
    id:"fruteria", who:["Doña Julia","Sofía","el frutero","Rosa"],
    place:"la bolsa de frutas", container:{name:"Bolsa", icon:"bag"},
    items:[
      {name:"Manzana", label:"la manzana", plural:false, icon:"orange",     wMin:150, wMax:300},
      {name:"Naranja", label:"la naranja", plural:false, icon:"orange",     wMin:150, wMax:350},
      {name:"Plátano", label:"el plátano", plural:false, icon:"lemon",      wMin:100, wMax:250},
      {name:"Sandía",  label:"la sandía",  plural:false, icon:"watermelon", wMin:1500,wMax:3000},
      {name:"Melón",   label:"el melón",   plural:false, icon:"melon",      wMin:1000,wMax:2500},
      {name:"Pera",    label:"la pera",    plural:false, icon:"orange",     wMin:120, wMax:280}
    ]
  }
];

const PHASE_META = [
  {name:"Suma simple",            desc:"Suma de dos objetos"},
  {name:"Resta simple",           desc:"Quita una parte y halla lo que queda"},
  {name:"Encontrar el total",     desc:"Suma con kilos y gramos"},
  {name:"Objeto faltante",        desc:"Descompón el total para hallar la parte"},
  {name:"Problemas mixtos",       desc:"Suma o resta: ¡tú decides!"},
  {name:"Tres objetos",           desc:"Suma de tres pesos"},
  {name:"Cuatro objetos",         desc:"Suma de cuatro pesos"},
  {name:"Problemas inversos",     desc:"Razona con relaciones entre pesos"},
  {name:"Problemas encadenados",  desc:"Dos operaciones seguidas"},
  {name:"Máxima complejidad",     desc:"Relaciones y varios pasos"}
];
const PHASE_TOTAL = PHASE_META.length;
const LEVELS_PER_PHASE = 10;
const QUESTIONS_PER_LEVEL = 10;

/* ── Utilidades ── */
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function pickOne(arr){ return arr[randInt(0,arr.length-1)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=randInt(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function roundStep(w){ const step = w<300?10:(w<1500?50:100); return Math.max(step,Math.round(w/step)*step); }
function genW(item){ return roundStep(randInt(item.wMin,item.wMax)); }

function pickScenario(){ return pickOne(SCENARIOS); }
function pickItems(scn,n){
  const pool=[...scn.items], res=[];
  for(let i=0;i<n && pool.length;i++){ const idx=randInt(0,pool.length-1); res.push(pool[idx]); pool.splice(idx,1); }
  return res;
}
function verb(item){ return item.plural?"pesan":"pesa"; }

/* Cláusula "el arroz pesa <hl>250 g</hl>"  (hidden => signo ?) */
function weigh(item,v,col,hidden){
  const val = hidden ? `<span class="q-glyph">?</span>` : `<span class="hl-${col}">${fmt(v)}</span>`;
  return `${item.label} ${verb(item)} ${val}`;
}
function joinList(strs){
  if(strs.length<=1) return strs[0]||"";
  return strs.slice(0,-1).join(", ")+" y "+strs[strs.length-1];
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

/* Construye un ejercicio de SUMA (componer): partes visibles, total oculto */
function makeSum(scn, parts, qHTML, extraHint){
  const total = parts.reduce((s,p)=>s+p.w,0);
  const sumStr = parts.map(p=>fmtPlain(p.w)).join(" + ");
  return {
    qHTML,
    parts: parts.map((p,i)=>({name:p.item.name,icon:p.item.icon,col:COL_SEQ[i],value:p.w,shown:true})),
    totalValue: total, totalShown:false, targetValue: total,
    hint: extraHint || `Suma las partes: ${sumStr} = ?`,
    explain: `${sumStr} = ${fmtPlain(total)}`
  };
}

/* ════════ FASE 1 — Suma simple ════════ */
function gen1(){
  const scn=pickScenario(); const [a,b]=pickItems(scn,2);
  const wA=genW(a), wB=genW(b);
  const qHTML = `En ${scn.place}, ${weigh(a,wA,"v")} y ${weigh(b,wB,"b")}.<br>¿Cuánto pesan juntos?`;
  return makeSum(scn,[{item:a,w:wA},{item:b,w:wB}],qHTML);
}

/* ════════ FASE 2 — Resta simple (quitar y hallar lo que queda) ════════ */
function gen2(){
  const scn=pickScenario(); const [a]=pickItems(scn,1);
  const total=roundStep(randInt(Math.max(a.wMin,600), a.wMax+400));
  const used=roundStep(randInt(Math.round(total*0.2), Math.round(total*0.7)));
  const rem=total-used;
  const who=pickOne(scn.who);
  const qHTML = `${cap(who)} tenía <span class="hl-t" style="font-weight:900">${fmt(total)}</span> de ${a.label.replace(/^(el|la|los|las) /,"")}.<br>Usó <span class="hl-o">${fmt(used)}</span>. ¿Cuánto le queda?`;
  return {
    qHTML,
    parts: [
      {name:"Usado", icon:a.icon, col:"o", value:used, shown:true},
      {name:"Queda", icon:a.icon, col:"p", value:rem,  shown:false}
    ],
    totalValue: total, totalShown:true, targetValue: rem,
    hint: `Al total le quitas lo usado: ${fmtPlain(total)} - ${fmtPlain(used)} = ?`,
    explain: `${fmtPlain(total)} - ${fmtPlain(used)} = ${fmtPlain(rem)}`
  };
}

/* ════════ FASE 3 — Encontrar el total (con kg y g) ════════ */
function gen3(){
  const scn=pickScenario(); const [a,b]=pickItems(scn,2);
  const wA=roundStep(randInt(1050, Math.max(1900,a.wMax))); // fuerza kg + g
  const wB=genW(b);
  const qHTML = `En ${scn.place}, ${weigh(a,wA,"v")} y ${weigh(b,wB,"b")}.<br>¿Cuál es la masa total?`;
  return makeSum(scn,[{item:a,w:wA},{item:b,w:wB}],qHTML,
    `Convierte ${fmtPlain(wA)} a gramos si te ayuda, luego suma ${fmtPlain(wB)}.`);
}

/* ════════ FASE 4 — Objeto faltante (descomponer) ════════ */
function gen4(){
  const scn=pickScenario(); const [a,b]=pickItems(scn,2);
  const wA=genW(a), wB=genW(b); const total=wA+wB;
  const who=pickOne(scn.who);
  const qHTML = `${cap(who)} puso ${a.label} y ${b.label} en ${scn.container.name.toLowerCase()}. Juntos pesan <span class="hl-t" style="font-weight:900">${fmt(total)}</span>.<br>Si ${weigh(a,wA,"v")}, ¿cuánto pesa ${b.label}?`;
  return {
    qHTML,
    parts: [
      {name:a.name, icon:a.icon, col:"v", value:wA, shown:true},
      {name:b.name, icon:b.icon, col:"b", value:wB, shown:false}
    ],
    totalValue: total, totalShown:true, targetValue: wB,
    hint: `Al total le quitas la parte conocida: ${fmtPlain(total)} - ${fmtPlain(wA)} = ?`,
    explain: `${fmtPlain(total)} - ${fmtPlain(wA)} = ${fmtPlain(wB)}`
  };
}

/* ════════ FASE 5 — Mixtos (suma o resta) ════════ */
function gen5(){ return Math.random()<0.5 ? gen1() : gen2(); }

/* ════════ FASE 6 — Tres objetos (suma) ════════ */
function gen6(){
  const scn=pickScenario(); const items=pickItems(scn,3);
  const parts=items.map(o=>({item:o,w:genW(o)}));
  const clauses=parts.map((p,i)=>weigh(p.item,p.w,COL_SEQ[i]));
  const qHTML = `En ${scn.place}: ${joinList(clauses)}.<br>¿Cuánto pesan los tres juntos?`;
  return makeSum(scn,parts,qHTML);
}

/* ════════ FASE 7 — Cuatro objetos (suma) ════════ */
function gen7(){
  const scn=pickScenario(); const items=pickItems(scn,4);
  const parts=items.map(o=>({item:o,w:genW(o)}));
  const clauses=parts.map((p,i)=>weigh(p.item,p.w,COL_SEQ[i]));
  const qHTML = `En ${scn.place}: ${joinList(clauses)}.<br>¿Cuánto pesan los cuatro juntos?`;
  return makeSum(scn,parts,qHTML);
}

/* ════════ FASE 8 — Problemas inversos (relaciones) ════════ */
function gen8(){
  const scn=pickScenario(); const [a,b]=pickItems(scn,2);
  const nameA=a.label, nameB=b.label;
  const wB=genW(b);
  let wA, relTxt, hint, explain;
  if(Math.random()<0.4){
    const d=roundStep(randInt(50, Math.max(100, Math.round(wB*0.6))));
    wA=wB+d; relTxt=`pesa ${fmtPlain(d)} más que`;
    hint=`${cap(nameA)} = ${nameB} + ${fmtPlain(d)}. El total es dos veces ${nameB} más ${fmtPlain(d)}: quita ${fmtPlain(d)} al total y divide entre 2.`;
    explain=`(${fmtPlain(wA+wB)} - ${fmtPlain(d)}) ÷ 2 = ${fmtPlain(wB)}.`;
  } else {
    const r=pickOne([{k:2,txt:"el doble que"},{k:3,txt:"el triple que"},{k:0.5,txt:"la mitad de"}]);
    wA=roundStep(Math.round(wB*r.k)); relTxt=r.txt;
    hint=`Si ${nameB} es una parte, ${nameA} vale ${r.k} veces esa parte. Entre los dos forman ${fmtPlain(wA+wB)}.`;
    explain=`${cap(nameB)} = ${fmtPlain(wB)}, ${nameA} = ${fmtPlain(wA)} (${r.txt} ${nameB}).`;
  }
  const total=wA+wB;
  const qHTML = `En ${scn.place}, ${nameA} y ${nameB} pesan juntos <span class="hl-t" style="font-weight:900">${fmt(total)}</span>.<br>${cap(nameA)} ${relTxt} ${nameB}.<br>¿Cuánto pesa ${nameB}?`;
  return {
    qHTML,
    parts: [
      {name:a.name, icon:a.icon, col:"v", value:wA, shown:false},
      {name:b.name, icon:b.icon, col:"b", value:wB, shown:false}
    ],
    totalValue: total, totalShown:true, targetValue: wB,
    hint, explain
  };
}

/* ════════ FASE 9 — Encadenados (componer y descomponer) ════════ */
function gen9(){
  const scn=pickScenario(); const [a,b,c]=pickItems(scn,3);
  const wA=genW(a), wB=genW(b), wC=genW(c);
  const S=wA+wB; const total=S+wC; const rem=wA+wC; // se agrega c, se retira b
  const who=pickOne(scn.who);
  const qHTML = `En ${scn.container.name.toLowerCase()} hay ${weigh(a,wA,"v")} y ${weigh(b,wB,"b")}.<br>${cap(who)} agrega ${weigh(c,wC,"o")} y luego retira ${b.label}.<br>¿Cuánto pesa ahora ${scn.container.name.toLowerCase()}?`;
  return {
    qHTML,
    parts: [
      {name:a.name, icon:a.icon, col:"v", value:wA, shown:true},
      {name:c.name, icon:c.icon, col:"o", value:wC, shown:true},
      {name:"Ahora", icon:scn.container.icon, col:"p", value:rem, shown:false}
    ],
    totalValue: rem, totalShown:false, targetValue: rem,
    hint: `Quedan solo ${a.label} y ${c.label}: ${fmtPlain(wA)} + ${fmtPlain(wC)} = ?`,
    explain: `Al retirar ${b.label}, quedan ${fmtPlain(wA)} + ${fmtPlain(wC)} = ${fmtPlain(rem)}.`
  };
}

/* ════════ FASE 10 — Máxima complejidad (relaciones encadenadas) ════════ */
function gen10(){
  // Receta tipo PDF: una base conocida, otra es múltiplo, otra es fracción.
  const scn=SCENARIOS.find(s=>s.id==="cocina");
  const [base,bigItem,smallItem]=pickItems(scn,3);
  const kBig=pickOne([2,3,4]);
  let wBase=roundStep(randInt(base.wMin,base.wMax));
  if(wBase%20!==0) wBase=Math.round(wBase/20)*20;     // divisible para la mitad
  const wBig=wBase*kBig;
  const wSmall=wBig/2;
  const total=wBase+wBig+wSmall;
  const who=pickOne(scn.who);
  const qHTML = `${cap(who)} prepara una receta. ${cap(base.label)} pesa <span class="hl-o">${fmt(wBase)}</span>.<br>${cap(bigItem.label)} pesa el ${kBig===2?"doble":kBig===3?"triple":"cuádruple"} que ${base.label}, y ${smallItem.label} pesa la mitad que ${bigItem.label}.<br>¿Cuánto pesan los tres ingredientes juntos?`;
  return {
    qHTML,
    parts: [
      {name:base.name,  icon:base.icon,  col:"o", value:wBase,  shown:true},
      {name:bigItem.name,icon:bigItem.icon,col:"v", value:wBig,  shown:false},
      {name:smallItem.name,icon:smallItem.icon,col:"b", value:wSmall, shown:false}
    ],
    totalValue: total, totalShown:false, targetValue: total,
    hint: `${cap(bigItem.label)} = ${kBig} × ${fmtPlain(wBase)} = ${fmtPlain(wBig)}. ${cap(smallItem.label)} = ${fmtPlain(wBig)} ÷ 2 = ${fmtPlain(wSmall)}. Luego suma los tres.`,
    explain: `${fmtPlain(wBase)} + ${fmtPlain(wBig)} + ${fmtPlain(wSmall)} = ${fmtPlain(total)}`
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
