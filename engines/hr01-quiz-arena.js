/* Reusable Quiz Arena mechanics: HR01 is supplied exclusively through content packs. */
(function(){"use strict";
const $=id=>document.getElementById(id);
const el=(tag,label)=>{const n=document.createElement(tag);if(label!==undefined)n.textContent=label;return n};
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const lines=m=>[0,1,2].some(i=>[0,1,2].every(j=>m[3*i+j])||[0,1,2].every(j=>m[3*j+i]))||(m[0]&&m[4]&&m[8])||(m[2]&&m[4]&&m[6]);
function create(ctx){
 const id=Number(ctx.game.templateId.slice(-3)),board=$("board"),prompt=$("prompt");
 const max=id===2?7:id===3?9:id===8?12:10;
 let cases=[],turn=0,score=0,bank=30,lives=3,help=1,hp=100,streak=0,used=new Set(),wheelUsed=new Set(),marks=Array(9).fill(false),done=false,locked=false,selected=-1;
 const btn=(label,fn,cls="tile")=>{const b=el("button",label);b.className=cls;b.type="button";b.addEventListener("click",fn);return b};
 const totalScore=()=>id===7?bank:score;
 const hud=()=>ctx.hud({round:Math.min(turn+1,max),total:max,score:totalScore(),extra:id===2?"50:50: "+help:id===6?"Lives: "+lives:id===7?"Bank: "+bank:id===8?"Marked: "+marks.filter(Boolean).length+"/9":id===9?"Boss HP: "+hp:"Correct streak: "+streak});
 const end=(win,reason)=>{if(done)return;done=true;locked=true;ctx.finish(win,reason,totalScore())};
 const progress=(ok,points)=>{
  if(done)return;
  if(id!==7)score=Math.max(0,score+(ok?points:-5));
  if(id===7)bank+=ok?points:-points;
  if(id===9&&ok)hp=Math.max(0,hp-20);
  if(!ok)lives--;
  streak=ok?streak+1:0;turn++;hud();
  if(id===2&&!ok)return end(false,"Millionaire: an incorrect decision ends the challenge.");
  if(id===6&&lives===0)return end(false,"Eliminated after three incorrect decisions.");
  if(id===7&&bank<10)return end(false,"Your points bank is below the minimum 10-point wager.");
  if(id===8&&lines(marks))return end(true,"Bingo! Completed a row, column or diagonal.");
  if(id===9&&hp===0)return end(true,"HR risk boss defeated.");
  if(turn>=max)return end(id===8?false:id===7?bank>=60:id===9?false:id===6?lives>0:id===2?true:score>=Math.ceil(max*.7)*10,
   id===8?"No bingo line completed.":id===7?"Bank "+bank+" / target 60.":id===9?"Boss survived with "+hp+" HP.":"Completed "+turn+" HR decisions; score "+totalScore()+".");
  render();
 };
 const question=(c,points=10)=>{
  locked=false;prompt.textContent=c.scenario;board.replaceChildren(el("p",c.question||"Choose the best HR architecture decision."));
  const choices=el("div");choices.className="decision-choices";
  const feedback=el("div");feedback.className="decision-feedback";feedback.setAttribute("aria-live","polite");
  const next=btn("Continue →",()=>progress(feedback.dataset.ok==="true",points),"alt");next.disabled=true;
  const answers=shuffle([c.correct,...c.distractors]);
  for(const answer of answers)choices.append(btn(answer,()=>{
   if(locked||done)return;locked=true;
   const ok=answer===c.correct;feedback.dataset.ok=String(ok);
   for(const b of choices.querySelectorAll("button")){b.disabled=true;if(b.textContent===c.correct)b.classList.add("good");else if(b.textContent===answer)b.classList.add("bad")}
   feedback.replaceChildren(el("strong",ok?"Correct decision":"Review this decision"),el("p","Recommended: "+c.correct),el("p","Why: "+c.rationale));
   if(id===8&&ok&&selected>=0)marks[selected]=true;
   if(id===7)feedback.append(el("p","Wager outcome: "+(ok?"+":"−")+points));
   next.disabled=false;
  }));
  board.append(choices,feedback,next);
  if(id===2&&help){const life=btn("Use 50:50 lifeline",()=>{if(locked||!help)return;const wrong=[...choices.querySelectorAll("button")].filter(b=>b.textContent!==c.correct);wrong.slice(0,wrong.length-1).forEach(b=>b.disabled=true);help=0;life.disabled=true;hud()},"alt");board.insertBefore(life,feedback)}
 };
 function render(){
  if(done||!cases.length)return;hud();board.replaceChildren();
  const c=cases[turn%cases.length];
  if(id===2){prompt.textContent="Millionaire · Level "+(turn+1)+"/7";board.append(el("p","One wrong answer ends the run. A single 50:50 lifeline is available."),btn("Start level",()=>question(c,10)));return}
  if(id===3){prompt.textContent="Jeopardy · Select a remaining category and stake";const cats=["Employee lifecycle","Data governance","Security & workflow"];for(let i=0;i<3;i++)for(let j=0;j<3;j++){const key=i*3+j;const b=btn(cats[i]+" · "+(j+1)*100,()=>{if(used.has(key))return;used.add(key);question(cases[key%cases.length],(j+1)*10)});b.disabled=used.has(key);board.append(b)}return}
  if(id===4){prompt.textContent="Quiz Wheel · Spin to select a challenge";board.append(btn("🎡 Spin wheel",()=>{if(wheelUsed.size===cases.length)wheelUsed.clear();const available=cases.map((_,i)=>i).filter(i=>!wheelUsed.has(i));const ix=available[Math.floor(Math.random()*available.length)];wheelUsed.add(ix);ctx.message("Wheel landed on HR challenge "+(ix+1));question(cases[ix])}));return}
  if(id===5){prompt.textContent="True / False Blitz";const truth=Math.random()<0.5,claim=truth?c.correct:c.distractors[Math.floor(Math.random()*c.distractors.length)];board.append(el("p",c.scenario),el("p","Proposed solution: "+claim));let answered=false;for(const [label,value] of [["Appropriate",true],["Inappropriate",false]])board.append(btn(label,()=>{if(answered)return;answered=true;const ok=value===truth;board.replaceChildren(el("p",ok?"Correct.":"Incorrect."),el("p","Recommended: "+c.correct),el("p",c.rationale),btn("Continue →",()=>progress(ok,10),"alt"))}));return}
  if(id===6){prompt.textContent="Last Learner Standing · "+lives+" lives";question(c);return}
  if(id===7){prompt.textContent="Risk Your Points · Bank "+bank;board.append(el("p","Choose a stake. Correct +stake; incorrect −stake. Goal: 60 points."));for(const stake of [10,20,30]){const b=btn("Wager "+stake,()=>question(c,stake));b.disabled=stake>bank;board.append(b)}return}
  if(id===8){prompt.textContent="Trivia Bingo · Complete a row, column or diagonal";board.append(el("p","Select a square, then answer its HR challenge correctly."));const grid=el("div");grid.style.cssText="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px";for(let i=0;i<9;i++){const b=btn(marks[i]?"✓ "+(i+1):"Square "+(i+1),()=>{selected=i;question(cases[i%cases.length])});b.disabled=marks[i];grid.append(b)}board.append(grid);return}
  if(id===9){prompt.textContent="Boss Battle · HR risk remaining: "+hp+" HP";question(c);return}
  question(c);
 }
 fetch("content-packs/hr01/quiz-arena-002-009.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(p=>{
  if(done)return;
  if(p.stream!=="HR01"||!Array.isArray(p.cases)||p.cases.length<10||p.cases.some(c=>!c.scenario||!c.correct||!c.rationale||!Array.isArray(c.distractors)||c.distractors.length<2||new Set([c.correct,...c.distractors].map(x=>x.trim().toLowerCase())).size!==c.distractors.length+1))throw Error("Invalid or ambiguous HR01 scenario pack");
  cases=shuffle(p.cases);render();
 }).catch(e=>{if(done)return;prompt.textContent="Could not load HR01 scenarios";board.replaceChildren(el("p",e.message))});
 prompt.textContent="Loading HR01 scenarios…";board.replaceChildren();
 return {hint(){if(!done)ctx.message("Check the HR source of truth, authorization, effective date and downstream impact.")},dispose(){done=true}};
}
window.PLAYLAB_HR01_GAME_MODULES=window.PLAYLAB_HR01_GAME_MODULES||{};
for(let i=2;i<=9;i++)window.PLAYLAB_HR01_GAME_MODULES["PL108-"+String(i).padStart(3,"0")]=create;
})();
