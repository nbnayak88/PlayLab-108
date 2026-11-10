/* HR01 Quiz Arena 002–009: shared scenario assessment with distinct game rules.
   All business content is loaded from a separate JSON content pack. */
(function(){"use strict";
const $=id=>document.getElementById(id);
const make=(tag,t)=>{const e=document.createElement(tag);if(t!==undefined)e.textContent=t;return e};
const mix=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function engine(ctx){
const id=Number(ctx.game.templateId.slice(-3)),board=$("board"),prompt=$("prompt");
let cases=[],round=0,score=0,lives=3,bank=30,help=1,done=false,chosen=[],streak=0,marks=[],boss=100,used=new Set(),selectedCell=-1;
const total=id===2?7:id===3?9:id===8?9:10;
const button=(text,fn,style="tile")=>{const b=make("button",text);b.className=style;b.onclick=fn;return b};
const info=t=>ctx.message(t);
const stats=()=>ctx.hud({round:Math.min(round+1,total),total,score:score+(id===7?bank:0),extra:id===6?"Lives: "+lives:id===7?"Bank: "+bank:id===9?"Risk remaining: "+boss:id===2?"Lifelines: "+help:"Correct streak: "+streak});
function finish(win,reason){if(done)return;done=true;ctx.finish(win,reason,Math.max(0,score+(id===7?bank:0)))}
function next(ok,points=10){
if(ok){if(id!==7)score+=points;streak++}else{streak=0;if(id!==7)score=Math.max(0,score-5);lives--}
round++;stats();
if(id===2&&!ok)return finish(false,"Millionaire challenge ended after an incorrect HR architecture decision.");
if(id===6&&lives<=0)return finish(false,"Three HR decisions were incorrect. Review access, effective dating and governance.");
if(id===8&&marks.some(Boolean)&&[...Array(3)].some((_,i)=>[0,1,2].every(j=>marks[i*3+j])||[0,1,2].every(j=>marks[j*3+i]))||id===8&&marks[0]&&marks[4]&&marks[8]||id===8&&marks[2]&&marks[4]&&marks[6])return finish(true,"Completed a real bingo line.");
if(id===9&&boss<=0)return finish(true,"HR architecture risk eliminated by evidence-based decisions.");
if(round>=total)return finish(id===8?false:id===7?bank>=60:id===9?boss<=0:score>=Math.ceil(total*.7)*10,"Completed "+total+" contextual HR decisions. Score: "+(score+bank));
draw();
}
function ask(c,points=10,strict=false){
prompt.textContent=c.scenario;
board.replaceChildren(make("p","Which decision best protects HR data quality, process integrity and enterprise outcomes?"));
const choices=make("div");choices.className="decision-choices";
const feedback=make("div");feedback.className="decision-feedback";feedback.setAttribute("aria-live","polite");
const continueBtn=button("Continue →",()=>next(feedback.dataset.ok==="true",points),"alt");continueBtn.disabled=true;
mix([c.correct,...c.distractors]).forEach(answer=>choices.append(button(answer,()=>{
if(continueBtn.disabled===false)return;
const ok=answer===c.correct;feedback.dataset.ok=String(ok);
[...choices.querySelectorAll("button")].forEach(b=>{b.disabled=true;if(b.textContent===c.correct)b.classList.add("good");else if(b.textContent===answer)b.classList.add("bad")});
feedback.replaceChildren(make("strong",ok?"Good architectural decision":"Review the trade-off"),make("p","Recommended: "+c.correct),make("p",c.rationale));
if(id===7){bank+=ok?points:-points;feedback.append(make("p","Wager result: "+(ok?"+":"−")+points+" points"))}
if(id===8&&ok&&selectedCell>=0)marks[selectedCell]=true;
if(id===9&&ok)boss-=20;
continueBtn.disabled=false;stats();
})));
board.append(choices,feedback,continueBtn);
if(id===2&&help>0){const lifeline=button("50:50 lifeline (one use)",()=>{const wrong=[...choices.querySelectorAll("button")].filter(b=>b.textContent!==c.correct);wrong.slice(0,Math.max(0,wrong.length-1)).forEach(b=>b.disabled=true);help=0;lifeline.disabled=true;stats()},"alt");board.insertBefore(lifeline,feedback)}
}
function draw(){
if(done||!cases.length)return;stats();
const c=cases[round%cases.length];
if(id===2){prompt.textContent="HR Architecture Millionaire · Level "+(round+1);board.replaceChildren(make("p","One incorrect decision ends this run. Use your one 50:50 lifeline to remove a distractor."),button("Play level "+(round+1),()=>ask(c,10+round*3,true)));return}
if(id===3){prompt.textContent="HR Jeopardy · Select an unused clue";board.replaceChildren();const cats=["Employee lifecycle","Data governance","Security & workflow"];for(let i=0;i<3;i++)for(let j=0;j<3;j++){const key=i*3+j;const tile=button(cats[i]+" · "+(j+1)*100,()=>{used.add(key);ask(cases[key%cases.length],(j+1)*10)});tile.disabled=used.has(key);board.append(tile)}return}
if(id===4){prompt.textContent="HR Wheel · Spin for a random HR architecture challenge";board.replaceChildren(button("🎡 Spin wheel",()=>{const index=Math.floor(Math.random()*cases.length);ask(cases[index]);ctx.message("Wheel landed on challenge "+(index+1))}));return}
if(id===5){prompt.textContent="HR True/False · Evaluate the proposed decision";const proposal=round%2===0?c.correct:c.distractors[0],truth=round%2===0;board.replaceChildren(make("p",c.scenario),make("p","Proposed response: "+proposal));for(const [label,val] of [["Appropriate",true],["Inappropriate",false]])board.append(button(label,()=>{const ok=val===truth;board.replaceChildren(make("p",ok?"Correct assessment.":"Incorrect assessment."),make("p","Recommended: "+c.correct),make("p",c.rationale),button("Continue →",()=>next(ok)))}));return}
if(id===6){prompt.textContent="Last HR Architect Standing · "+lives+" lives";ask(c);return}
if(id===7){prompt.textContent="Risk Your Points · Bank: "+bank;board.replaceChildren(make("p","Choose a stake. Correct: +stake; incorrect: −stake. Start bank: 30; goal: 60."));for(const stake of [10,20,30]){const b=button("Wager "+stake+" points",()=>ask(c,stake));b.disabled=stake>bank;board.append(b)}return}
if(id===8){prompt.textContent="HR Governance Bingo · Mark three cells in a row, column or diagonal";board.replaceChildren(make("p","Select an unmarked square and answer its HR scenario correctly."));const grid=make("div");grid.style.cssText="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px";for(let i=0;i<9;i++){const b=button(marks[i]?"✓ HR "+(i+1):"HR "+(i+1),()=>{selectedCell=i;ask(cases[i%cases.length]);});b.disabled=!!marks[i];grid.append(b)}board.append(grid);return}
if(id===9){prompt.textContent="HR Risk Boss Battle · Remaining risk "+boss;ask(c);return}
ask(c);
}
fetch("content-packs/hr01/quiz-arena-002-009.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(p=>{if(done)return;if(p.stream!=="HR01"||p.cases.length<10)throw Error("Invalid HR01 Quiz Arena pack");cases=mix(p.cases);draw()}).catch(e=>{if(done)return;prompt.textContent="Could not load HR01 scenarios";board.replaceChildren(make("p",e.message))});
prompt.textContent="Loading HR01 architecture scenarios…";board.replaceChildren();
return {hint(){info("Hint: identify the authoritative HR record, required permission, effective date and downstream impact.")},dispose(){done=true}};
}
window.PLAYLAB_HR01_GAME_MODULES=window.PLAYLAB_HR01_GAME_MODULES||{};
for(let n=2;n<=9;n++)window.PLAYLAB_HR01_GAME_MODULES["PL108-"+String(n).padStart(3,"0")]=engine;
})();
