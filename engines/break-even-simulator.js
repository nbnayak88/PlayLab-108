/* Universal break-even simulation: mechanics independent of HR01 scenario content. */
(function(){"use strict";
const id=x=>document.getElementById(x);
const el=(tag,value)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=String(value);return e};
const fmt=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
function create(ctx){
let cancelled=false,caseIndex=0,score=0,attempts=0,source=null,solved=0,locked=false;
const board=id("board"),prompt=id("prompt");
const total=4;
const ui={};
function render(){
 if(cancelled||!source)return;
 locked=false;
 const c=source.scenarios[caseIndex];
 const state={monthlyVolume:c.monthlyVolume,proposedCost:c.proposedCost,monthlyPlatform:c.monthlyPlatform};
 ctx.hud({round:caseIndex+1,total,score,extra:"Validated: "+solved+" / "+caseIndex+" · Target ≤ "+c.targetMonths+" months"});
 prompt.textContent="HR01 · "+c.title;
 board.replaceChildren();
 const description=el("p",c.description);description.className="scenario-text";
 const details=el("p","One-time investment: "+fmt(c.investment)+" · Existing cost/transaction: "+fmt(c.currentCost)+" · Target: break even in "+c.targetMonths+" months");details.className="muted";
 const instruction=el("p","Adjust assumptions, then submit a financially viable plan. Higher volume, lower processing cost and recurring fees change the result.");
 const controls=el("div");controls.className="simulation-controls";
 const metrics=el("div");metrics.className="simulation-metrics";metrics.setAttribute("aria-live","polite");
 const feedback=el("div");feedback.className="decision-feedback";feedback.setAttribute("aria-live","polite");
 const next=el("button",caseIndex===total-1?"Finish simulation":"Next investment →");next.className="alt";next.disabled=true;
 const submit=el("button","Validate investment case");
 function calculate(){const gross=state.monthlyVolume*(c.currentCost-state.proposedCost);const net=gross-state.monthlyPlatform;const months=net>0?c.investment/net:Infinity;return {gross,net,months}}
 function draw(){const m=calculate();metrics.replaceChildren(el("p","Gross monthly savings: "+fmt(m.gross)),el("p","Monthly net savings: "+fmt(m.net)),el("p","Break-even: "+(Number.isFinite(m.months)?m.months.toFixed(1)+" months":"Not achievable")),el("p","12-month net benefit: "+fmt(12*m.net-c.investment)));return m}
 const fields=[["monthlyVolume","Monthly HR transactions",100,10000,100],["proposedCost","New cost per transaction (₹)",1,1000,5],["monthlyPlatform","Recurring monthly platform cost (₹)",0,500000,1000]];
 for(const [key,label,min,max,step] of fields){const wrap=el("div");const l=el("label",label);const input=el("input");input.type="number";input.min=String(min);input.max=String(max);input.step=String(step);input.value=String(state[key]);l.append(input);wrap.append(l);controls.append(wrap);input.addEventListener("input",()=>{const n=Number(input.value);if(Number.isFinite(n)&&n>=min&&n<=max){state[key]=n;draw()}else{metrics.textContent="Enter a valid value between "+min+" and "+max;}})}
 submit.addEventListener("click",()=>{
  if(locked)return;
  const valid=fields.every(([key,,min,max])=>Number.isFinite(state[key])&&state[key]>=min&&state[key]<=max);
  if(!valid){feedback.textContent="Please correct invalid input values.";return}
  attempts++;
  const m=calculate(),ok=m.net>0&&m.months<=c.targetMonths;
  if(ok){locked=true;solved++;score+=25;feedback.replaceChildren(el("strong","Investment case accepted ✓"),el("p","Your plan breaks even in "+m.months.toFixed(1)+" months. Compare operational assumptions with realistic HR demand and vendor estimates before implementation."));next.disabled=false;submit.disabled=true;controls.querySelectorAll("input").forEach(x=>x.disabled=true);ctx.hud({round:caseIndex+1,total,score,extra:"Validated "+solved+" of "+total});}
  else{feedback.replaceChildren(el("strong","Target not achieved"),el("p","Current break-even is "+(Number.isFinite(m.months)?m.months.toFixed(1)+" months":"unachievable")+". Improve transaction efficiency, adoption or recurring operating costs and validate again."));}
 });
 next.addEventListener("click",()=>{if(!locked)return;caseIndex++;if(caseIndex>=total){ctx.finish(solved===total,"Validated "+solved+" of "+total+" HR investment cases. Decisions evaluated using actual break-even calculations.",score);return}render()});
 board.append(description,details,instruction,controls,metrics,submit,feedback,next);
 draw();
}
fetch("content-packs/hr01/PL108-107.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{if(cancelled)return;if(d.gameId!=="PL108-107"||d.scenarios.length<total)throw Error("Invalid simulation pack");source=d;render()}).catch(e=>{if(cancelled)return;prompt.textContent="Simulation unavailable";board.replaceChildren(el("p",e.message));ctx.message("Refresh the page to retry.")});
prompt.textContent="Loading workforce investment scenarios…";board.replaceChildren();
return {hint(){ctx.message("Break-even months = initial investment ÷ monthly net savings. Monthly net savings = transaction volume × (old cost − new cost) − monthly platform fee.");},dispose(){cancelled=true}};
}
window.PLAYLAB_HR01_GAME_MODULES=window.PLAYLAB_HR01_GAME_MODULES||{};
window.PLAYLAB_HR01_GAME_MODULES["PL108-107"]=create;
})();
