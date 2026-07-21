/* ============================================================================
   EJERCICIOS - Matematicas
   Problemas de suma y resta para niños de 8 a 10 años.
   Los contextos se mantienen coherentes y algunos retos usan soles y céntimos.
   ============================================================================ */

const IC = {
  book:`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  backpack:`<path d="M8 2h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/><path d="M10 12h4M9 22v-4h6v4"/>`,
  bottle:`<path d="M9 2h6v4l2 3v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-3V2z"/><path d="M9 9h6"/>`,
  notebook:`<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 3v18M4 8h4M4 13h4M4 18h4"/>`,
  pencil:`<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="M15 5l4 4"/>`,
  box:`<path d="M21 8L12 13 3 8M3 8l9 5 9-5M3 16l9 5 9-5M12 2l9 5v10l-9 5-9-5V7l9-5z"/>`,
  jar:`<path d="M8 2h8"/><path d="M7 5h10l1 4v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9l1-4z"/><path d="M10 11h4"/>`,
  orange:`<circle cx="12" cy="13" r="8"/><path d="M12 5V3M10.5 4c1-.8 3-.8 3 0"/>`,
  lemon:`<path d="M12 22c4.4-1 8-5 8-10S16.4 2 12 2"/><path d="M12 22C7.6 21 4 17 4 12S7.6 2 12 2"/>`,
  watermelon:`<path d="M12 22c-5 0-9-4-9-9s4-9 9-9 9 4 9 9"/><path d="M3 13h18"/><circle cx="9" cy="17.5" r="1" fill="currentColor"/><circle cx="14" cy="17.5" r="1" fill="currentColor"/>`,
  bread:`<path d="M4 13a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>`,
  cheese:`<path d="M3 16l8-12 10 8-2 4H5z"/><circle cx="10" cy="13" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/>`,
  cup:`<path d="M5 4h12v9a6 6 0 0 1-6 6 6 6 0 0 1-6-6V4z"/><path d="M17 7h2a2 2 0 0 1 0 4h-2"/>`,
  bag:`<path d="M6 7h12l1 13H5z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>`,
  egg:`<ellipse cx="12" cy="14" rx="6" ry="8"/>`,
  basket:`<path d="M5 9h14l-1.5 11H6.5L5 9z"/><path d="M8 9l2-5M16 9l-2-5M3 9h18"/>`,
  milk:`<path d="M8 2h8v3l1 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l1-3V2z"/><path d="M7 11h10"/>`,
  butter:`<path d="M3 10h18v8H3z"/><path d="M3 10l3-3h15l-3 3"/>`,
  coin:`<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .9-3 2.2 0 3.3 6 1.5 6 4.8 0 1.3-1.3 2.2-3 2.2-1.3 0-2.5-.4-3.4-1.2"/><path d="M12 5v14"/>`,
  ticket:`<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7z"/><path d="M9 9h6M9 13h6"/>`
};

const IC_BG  = { v:"ic-lavender", b:"ic-sky", o:"ic-peach", p:"ic-rose", t:"ic-mint" };
const IC_STR = { v:"#6350E0", b:"#2B8EFF", o:"#E08A2B", p:"#E0508C", t:"#00B49A" };
const FILL_C = { v:"fill-v", b:"fill-b", o:"fill-o", p:"fill-p", t:"fill-t" };
const BV_C   = { v:"bv-v", b:"bv-b", o:"bv-o", p:"bv-p", t:"bv-t" };
const COL_SEQ = ["v","b","o","p"];

function icon(name, sz, col) {
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${IC_STR[col]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[name]||IC.box}</svg>`;
}
function fmt(v, unit) {
  if (unit === "money") {
    const soles = Math.floor(v / 100);
    const cents = Math.abs(v % 100);
    return `S/&nbsp;${soles}.${String(cents).padStart(2,"0")}`;
  }
  if (v >= 1000) {
    const kg = Math.floor(v/1000), r = v%1000;
    return r ? `${kg}&nbsp;kg&nbsp;${String(r).padStart(3,"0")}&nbsp;g` : `${kg}&nbsp;kg`;
  }
  return `${v}&nbsp;g`;
}
function fmtPlain(v, unit) { return fmt(v, unit).replace(/&nbsp;/g," "); }

const PHASE_META = [
  {name:"Sumas cercanas",        desc:"Dos cantidades del mismo contexto"},
  {name:"Restas con sentido",    desc:"Quitar, usar o consumir una parte"},
  {name:"Kilos y gramos",        desc:"Sumas con kg y g en situaciones reales"},
  {name:"Parte faltante",        desc:"Hallar una cantidad escondida"},
  {name:"Elige la operación",    desc:"Decidir si conviene sumar o restar"},
  {name:"Tres datos",            desc:"Sumas de tres cantidades relacionadas"},
  {name:"Soles y céntimos",      desc:"Compras, vuelto y ahorro en moneda peruana"},
  {name:"Problemas combinados",  desc:"Dos pasos con suma y resta"},
  {name:"Comparaciones",         desc:"Mas que, menos que, doble y mitad"},
  {name:"Reto final",            desc:"Problemas variados de varios pasos"}
];
const PHASE_TOTAL = PHASE_META.length;
const LEVELS_PER_PHASE = 10;
const QUESTIONS_PER_LEVEL = 10;

const SCENARIOS = [
  {
    id:"mercado",
    who:["Ana","Sofía","Lucía","Rosa","el señor López"],
    place:"la canasta del mercado",
    container:{name:"Canasta", icon:"basket"},
    items:[
      {name:"Arroz", label:"el arroz", noun:"arroz", plural:false, icon:"bag", wMin:500, wMax:1800},
      {name:"Azúcar", label:"el azúcar", noun:"azúcar", plural:false, icon:"jar", wMin:500, wMax:1200},
      {name:"Harina", label:"la harina", noun:"harina", plural:false, icon:"bread", wMin:500, wMax:1500},
      {name:"Papas", label:"las papas", noun:"papas", plural:true, icon:"bag", wMin:800, wMax:2500},
      {name:"Manzanas", label:"las manzanas", noun:"manzanas", plural:true, icon:"orange", wMin:350, wMax:1000},
      {name:"Fideos", label:"los fideos", noun:"fideos", plural:true, icon:"box", wMin:250, wMax:750}
    ]
  },
  {
    id:"receta",
    who:["Carla","Diego","la abuela","mamá"],
    place:"el tazon de la receta",
    container:{name:"Tazon", icon:"cup"},
    items:[
      {name:"Harina", label:"la harina", noun:"harina", plural:false, icon:"bread", wMin:300, wMax:1000},
      {name:"Azúcar", label:"el azúcar", noun:"azúcar", plural:false, icon:"jar", wMin:150, wMax:600},
      {name:"Mantequilla", label:"la mantequilla", noun:"mantequilla", plural:false, icon:"butter", wMin:100, wMax:400},
      {name:"Cocoa", label:"la cocoa", noun:"cocoa", plural:false, icon:"box", wMin:80, wMax:300},
      {name:"Leche", label:"la leche", noun:"leche", plural:false, icon:"milk", wMin:250, wMax:900},
      {name:"Queso", label:"el queso", noun:"queso", plural:false, icon:"cheese", wMin:150, wMax:500}
    ]
  },
  {
    id:"colegio",
    who:["Luanna","Mateo","Pablo","la maestra"],
    place:"la mochila del colegio",
    container:{name:"Mochila", icon:"backpack"},
    items:[
      {name:"Libro", label:"el libro", noun:"libro", plural:false, icon:"book", wMin:500, wMax:1200},
      {name:"Cuaderno", label:"el cuaderno", noun:"cuaderno", plural:false, icon:"notebook", wMin:180, wMax:550},
      {name:"Estuche", label:"el estuche", noun:"estuche", plural:false, icon:"pencil", wMin:120, wMax:350},
      {name:"Botella", label:"la botella con agua", noun:"botella con agua", plural:false, icon:"bottle", wMin:400, wMax:900},
      {name:"Lonchera", label:"la lonchera", noun:"lonchera", plural:false, icon:"box", wMin:350, wMax:850}
    ]
  },
  {
    id:"frutas",
    who:["Doña Julia","Sofía","Rosa","el frutero"],
    place:"la bolsa de frutas",
    container:{name:"Bolsa", icon:"bag"},
    items:[
      {name:"Manzanas", label:"las manzanas", noun:"manzanas", plural:true, icon:"orange", wMin:300, wMax:900},
      {name:"Naranjas", label:"las naranjas", noun:"naranjas", plural:true, icon:"orange", wMin:350, wMax:1000},
      {name:"Plátanos", label:"los plátanos", noun:"plátanos", plural:true, icon:"lemon", wMin:250, wMax:800},
      {name:"Sandía", label:"la sandía", noun:"sandía", plural:false, icon:"watermelon", wMin:1500, wMax:3200},
      {name:"Melón", label:"el melón", noun:"melón", plural:false, icon:"orange", wMin:1000, wMax:2400}
    ]
  }
];

const MONEY_ITEMS = [
  {name:"Pan con queso", label:"un pan con queso", icon:"bread", price:[180, 350]},
  {name:"Jugo", label:"un jugo", icon:"cup", price:[250, 500]},
  {name:"Fruta", label:"una fruta", icon:"orange", price:[120, 300]},
  {name:"Cuaderno", label:"un cuaderno", icon:"notebook", price:[350, 750]},
  {name:"Lápiz", label:"un lápiz", icon:"pencil", price:[80, 180]},
  {name:"Entrada", label:"una entrada", icon:"ticket", price:[400, 900]},
  {name:"Galletas", label:"un paquete de galletas", icon:"box", price:[150, 350]}
];

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function pickOne(arr){ return arr[randInt(0,arr.length-1)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=randInt(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function stripArticle(s){ return s.replace(/^(el|la|los|las|un|una) /,""); }
function roundStep(w){ const step = w<300?10:(w<1500?50:100); return Math.max(step,Math.round(w/step)*step); }
function genW(item){ return roundStep(randInt(item.wMin,item.wMax)); }
function genMoney(item){
  const [min,max]=item.price;
  return Math.round(randInt(min,max)/10)*10;
}
function pickScenario(){ return pickOne(SCENARIOS); }
function pickItems(scn,n){
  const pool=[...scn.items], res=[];
  for(let i=0;i<n && pool.length;i++){ const idx=randInt(0,pool.length-1); res.push(pool[idx]); pool.splice(idx,1); }
  return res;
}
function pickMoneyItems(n){
  const pool=[...MONEY_ITEMS], res=[];
  for(let i=0;i<n && pool.length;i++){ const idx=randInt(0,pool.length-1); res.push(pool[idx]); pool.splice(idx,1); }
  return res;
}
function verb(item){ return item.plural?"pesan":"pesa"; }
function weigh(item,v,col,hidden){
  const val = hidden ? `<span class="q-glyph">?</span>` : `<span class="hl-${col}">${fmt(v)}</span>`;
  return `${item.label} ${verb(item)} ${val}`;
}
function priced(item,v,col){
  return `${item.label} cuesta <span class="hl-${col}">${fmt(v,"money")}</span>`;
}
function joinList(strs){
  if(strs.length<=1) return strs[0]||"";
  return strs.slice(0,-1).join(", ")+" y "+strs[strs.length-1];
}

function optionStep(correct, unit){
  if(unit==="money") return correct<500 ? 20 : 50;
  return correct<300 ? 10 : (correct<1500 ? 50 : 100);
}
function buildOptions(correct, unit){
  const step = optionStep(correct, unit);
  const set = new Set([correct]);
  let guard=0;
  while(set.size<4 && guard<60){
    guard++;
    const off = randInt(1,5)*step*(Math.random()<0.5?-1:1);
    const v = correct+off;
    if(v>0) set.add(v);
  }
  const opts = shuffle([...set]);
  return { opts, ci: opts.indexOf(correct) };
}

function makeExercise({unit="mass", qHTML, parts, totalValue, totalShown=false, targetValue, explain}){
  return { unit, qHTML, parts, totalValue, totalShown, targetValue, explain };
}
function makeSum(scn, parts, qHTML){
  const total = parts.reduce((s,p)=>s+p.w,0);
  const sumStr = parts.map(p=>fmtPlain(p.w)).join(" + ");
  return makeExercise({
    qHTML,
    parts: parts.map((p,i)=>({name:p.item.name,icon:p.item.icon,col:COL_SEQ[i],value:p.w,shown:true})),
    totalValue: total,
    targetValue: total,
    explain: `${sumStr} = ${fmtPlain(total)}`
  });
}

function gen1(){
  const scn=pickScenario(), [a,b]=pickItems(scn,2);
  const wA=genW(a), wB=genW(b);
  const qHTML = `En ${scn.place}, ${weigh(a,wA,"v")} y ${weigh(b,wB,"b")}.<br>¿Cuánto pesan juntos?`;
  return makeSum(scn,[{item:a,w:wA},{item:b,w:wB}],qHTML);
}

function gen2(){
  const scn=pickScenario(), [a]=pickItems(scn,1);
  const total=roundStep(randInt(Math.max(a.wMin+200,700), a.wMax+700));
  const used=roundStep(randInt(Math.round(total*0.25), Math.round(total*0.7)));
  const rem=total-used;
  const who=pickOne(scn.who);
  const action=scn.id==="receta" ? "uso en la receta" : (scn.id==="colegio" ? "saco de la mochila" : "separo");
  const qHTML = `${cap(who)} tenía <span class="hl-t" style="font-weight:900">${fmt(total)}</span> de ${a.noun}.<br>${cap(action)} <span class="hl-o">${fmt(used)}</span>. ¿Cuánto queda?`;
  return makeExercise({
    qHTML,
    parts:[
      {name:"Usado", icon:a.icon, col:"o", value:used, shown:true},
      {name:"Queda", icon:a.icon, col:"p", value:rem, shown:false}
    ],
    totalValue: total,
    totalShown: true,
    targetValue: rem,
    explain: `${fmtPlain(total)} - ${fmtPlain(used)} = ${fmtPlain(rem)}`
  });
}

function gen3(){
  const scn=pickOne(SCENARIOS.filter(s=>s.id!=="colegio")), [a,b]=pickItems(scn,2);
  const wA=roundStep(randInt(1100, Math.max(1800,a.wMax)));
  const wB=genW(b);
  const qHTML = `Para preparar o llevar una compra, ${weigh(a,wA,"v")} y ${weigh(b,wB,"b")}.<br>¿Cuál es la masa total?`;
  return makeSum(scn,[{item:a,w:wA},{item:b,w:wB}],qHTML);
}

function gen4(){
  const scn=pickScenario(), [a,b]=pickItems(scn,2);
  const wA=genW(a), wB=genW(b), total=wA+wB;
  const who=pickOne(scn.who);
  const qHTML = `${cap(who)} puso ${a.label} y ${b.label} en ${scn.container.name.toLowerCase()}.<br>Todo junto pesa <span class="hl-t" style="font-weight:900">${fmt(total)}</span>. Si ${weigh(a,wA,"v")}, ¿cuánto pesa ${b.label}?`;
  return makeExercise({
    qHTML,
    parts:[
      {name:a.name, icon:a.icon, col:"v", value:wA, shown:true},
      {name:b.name, icon:b.icon, col:"b", value:wB, shown:false}
    ],
    totalValue: total,
    totalShown: true,
    targetValue: wB,
    explain: `${fmtPlain(total)} - ${fmtPlain(wA)} = ${fmtPlain(wB)}`
  });
}

function gen5(){
  if(Math.random()<0.5) return gen1();
  const scn=pickScenario(), [a,b]=pickItems(scn,2);
  let wA, wB, guard=0;
  do {
    wA=genW(a);
    wB=genW(b);
    guard++;
  } while(wA===wB && guard<12);
  if(wA===wB) wB += optionStep(wB);
  const big=Math.max(wA,wB), small=Math.min(wA,wB);
  const bigItem=wA>=wB?a:b, smallItem=wA>=wB?b:a;
  const diff=big-small;
  const qHTML = `En ${scn.place}, ${weigh(bigItem,big,"v")} y ${weigh(smallItem,small,"b")}.<br>¿Cuánto más pesa ${bigItem.label} que ${smallItem.label}?`;
  return makeExercise({
    qHTML,
    parts:[
      {name:smallItem.name, icon:smallItem.icon, col:"b", value:small, shown:true},
      {name:"Diferencia", icon:bigItem.icon, col:"p", value:diff, shown:false}
    ],
    totalValue: big,
    totalShown: true,
    targetValue: diff,
    explain: `${fmtPlain(big)} - ${fmtPlain(small)} = ${fmtPlain(diff)}`
  });
}

function gen6(){
  const scn=pickScenario(), items=pickItems(scn,3);
  const parts=items.map(item=>({item,w:genW(item)}));
  const qHTML = `En ${scn.place}: ${joinList(parts.map((p,i)=>weigh(p.item,p.w,COL_SEQ[i])))}.<br>¿Cuánto pesan las tres cantidades juntas?`;
  return makeSum(scn,parts,qHTML);
}

function gen7(){
  if(Math.random()<0.45) return genMoneyChange();
  const items=pickMoneyItems(2);
  const a=items[0], b=items[1], pA=genMoney(a), pB=genMoney(b), total=pA+pB;
  const qHTML = `En la feria escolar, Luanna compra ${a.label} por <span class="hl-v">${fmt(pA,"money")}</span> y ${b.label} por <span class="hl-b">${fmt(pB,"money")}</span>.<br>¿Cuánto paga en total?`;
  return makeExercise({
    unit:"money",
    qHTML,
    parts:[
      {name:a.name, icon:a.icon, col:"v", value:pA, shown:true},
      {name:b.name, icon:b.icon, col:"b", value:pB, shown:true}
    ],
    totalValue: total,
    targetValue: total,
    explain: `${fmtPlain(pA,"money")} + ${fmtPlain(pB,"money")} = ${fmtPlain(total,"money")}`
  });
}

function genMoneyChange(){
  const [a,b]=pickMoneyItems(2);
  const pA=genMoney(a), pB=genMoney(b), total=pA+pB;
  const paid=Math.ceil((total+randInt(80,350))/100)*100;
  const change=paid-total;
  const qHTML = `Mateo tiene <span class="hl-t" style="font-weight:900">${fmt(paid,"money")}</span> y compra ${a.label} y ${b.label}.<br>${cap(a.label)} cuesta <span class="hl-v">${fmt(pA,"money")}</span> y ${b.label} cuesta <span class="hl-b">${fmt(pB,"money")}</span>. ¿Cuánto vuelto recibe?`;
  return makeExercise({
    unit:"money",
    qHTML,
    parts:[
      {name:"Compra", icon:"ticket", col:"o", value:total, shown:true},
      {name:"Vuelto", icon:"coin", col:"p", value:change, shown:false}
    ],
    totalValue: paid,
    totalShown: true,
    targetValue: change,
    explain: `${fmtPlain(pA,"money")} + ${fmtPlain(pB,"money")} = ${fmtPlain(total,"money")}; ${fmtPlain(paid,"money")} - ${fmtPlain(total,"money")} = ${fmtPlain(change,"money")}`
  });
}

function gen8(){
  const scn=pickScenario(), [a,b,c]=pickItems(scn,3);
  const wA=genW(a), wB=genW(b), wC=genW(c);
  const total=wA+wB+wC;
  const after=total-wB;
  const qHTML = `En ${scn.container.name.toLowerCase()} hay ${weigh(a,wA,"v")}, ${weigh(b,wB,"b")} y ${weigh(c,wC,"o")}.<br>Luego retiran ${b.label}. ¿Cuánto pesa ahora ${scn.container.name.toLowerCase()}?`;
  return makeExercise({
    qHTML,
    parts:[
      {name:a.name, icon:a.icon, col:"v", value:wA, shown:true},
      {name:c.name, icon:c.icon, col:"o", value:wC, shown:true},
      {name:"Ahora", icon:scn.container.icon, col:"p", value:after, shown:false}
    ],
    totalValue: after,
    targetValue: after,
    explain: `${fmtPlain(wA)} + ${fmtPlain(wC)} = ${fmtPlain(after)}`
  });
}

function gen9(){
  const scn=pickScenario(), [a,b]=pickItems(scn,2);
  const base=genW(b);
  const mode=pickOne(["mas","menos","doble","mitad"]);
  let other, rel, target, explain;
  if(mode==="mas"){
    const d=roundStep(randInt(100, Math.max(200, Math.round(base*0.6))));
    other=base+d; rel=`pesa ${fmtPlain(d)} más que`; target=other;
    explain=`${fmtPlain(base)} + ${fmtPlain(d)} = ${fmtPlain(other)}`;
  } else if(mode==="menos"){
    const d=roundStep(randInt(50, Math.max(100, Math.round(base*0.4))));
    other=Math.max(50, base-d); rel=`pesa ${fmtPlain(d)} menos que`; target=other;
    explain=`${fmtPlain(base)} - ${fmtPlain(d)} = ${fmtPlain(other)}`;
  } else if(mode==="doble"){
    other=roundStep(base*2); rel="pesa el doble que"; target=other;
    explain=`${fmtPlain(base)} + ${fmtPlain(base)} = ${fmtPlain(other)}`;
  } else {
    other=roundStep(Math.max(50, Math.round(base/2))); rel="pesa la mitad que"; target=other;
    explain=`${fmtPlain(base)} ÷ 2 = ${fmtPlain(other)}`;
  }
  const qHTML = `En ${scn.place}, ${b.label} pesa <span class="hl-b">${fmt(base)}</span>.<br>${cap(a.label)} ${rel} ${b.label}. ¿Cuánto pesa ${a.label}?`;
  return makeExercise({
    qHTML,
    parts:[
      {name:b.name, icon:b.icon, col:"b", value:base, shown:true},
      {name:a.name, icon:a.icon, col:"v", value:target, shown:false}
    ],
    totalValue: Math.max(base,target),
    totalShown: false,
    targetValue: target,
    explain
  });
}

function gen10(){
  if(Math.random()<0.35) return genMoneySaving();
  const scn=pickScenario(), [a,b,c]=pickItems(scn,3);
  const wA=genW(a), wB=genW(b);
  const extra=roundStep(randInt(100,450));
  const removed=roundStep(randInt(50, Math.max(100, Math.round((wA+wB+extra)*0.45))));
  const result=wA+wB-removed+extra;
  const qHTML = `${cap(pickOne(scn.who))} prepara ${scn.container.name.toLowerCase()}. Primero pone ${weigh(a,wA,"v")} y ${weigh(b,wB,"b")}.<br>Después retira ${fmt(removed)} de ${c.noun} y agrega <span class="hl-o">${fmt(extra)}</span> más. ¿Cuánto queda al final?`;
  return makeExercise({
    qHTML,
    parts:[
      {name:a.name, icon:a.icon, col:"v", value:wA, shown:true},
      {name:b.name, icon:b.icon, col:"b", value:wB, shown:true},
      {name:"Cambio", icon:scn.container.icon, col:"p", value:result, shown:false}
    ],
    totalValue: result,
    targetValue: result,
    explain: `${fmtPlain(wA)} + ${fmtPlain(wB)} - ${fmtPlain(removed)} + ${fmtPlain(extra)} = ${fmtPlain(result)}`
  });
}

function genMoneySaving(){
  const [a,b]=pickMoneyItems(2);
  const pA=genMoney(a), pB=genMoney(b);
  const saved=Math.ceil((pA+pB+randInt(150,500))/100)*100;
  const gift=Math.round(randInt(100,400)/10)*10;
  const left=saved+gift-pA-pB;
  const qHTML = `Sofía ahorró <span class="hl-t" style="font-weight:900">${fmt(saved,"money")}</span> y su tía le dio <span class="hl-o">${fmt(gift,"money")}</span> más.<br>Compra ${a.label} por <span class="hl-v">${fmt(pA,"money")}</span> y ${b.label} por <span class="hl-b">${fmt(pB,"money")}</span>. ¿Cuánto dinero le queda?`;
  return makeExercise({
    unit:"money",
    qHTML,
    parts:[
      {name:"Tenia", icon:"coin", col:"t", value:saved+gift, shown:true},
      {name:"Gasto", icon:"ticket", col:"o", value:pA+pB, shown:true},
      {name:"Queda", icon:"coin", col:"p", value:left, shown:false}
    ],
    totalValue: saved+gift,
    totalShown: true,
    targetValue: left,
    explain: `${fmtPlain(saved,"money")} + ${fmtPlain(gift,"money")} - ${fmtPlain(pA,"money")} - ${fmtPlain(pB,"money")} = ${fmtPlain(left,"money")}`
  });
}

const GENERATORS = [gen1,gen2,gen3,gen4,gen5,gen6,gen7,gen8,gen9,gen10];
const RECENT_KEY = "matematicas_recent_sigs";

function signatureOf(ex){
  const names = ex.parts.map(p=>p.name).sort().join("|");
  return `${ex.unit||"mass"}:${names}:${ex.targetValue}`;
}
function loadRecent(){ try{ return JSON.parse(localStorage.getItem(RECENT_KEY))||[]; }catch(e){ return []; } }
function pushRecent(sig){
  const list = loadRecent();
  list.push(sig);
  while(list.length>30) list.shift();
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
  const { opts, ci } = buildOptions(ex.targetValue, ex.unit);
  ex.opts = opts; ex.ci = ci; ex.phaseIdx = phaseIdx;
  return ex;
}
