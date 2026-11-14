/* HR01 game 001: decision sprint. Universal decision rules; subject data from JSON. */
(function(){
"use strict";
const ID="PL108-001";
const byId=x=>document.getElementById(x);
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const node=(tag,content)=>{const e=document.createElement(tag);e.textContent=content;return e};
function create(ctx){
 const board=byId("board"),prompt=byId("prompt");
 let disposed=false,position=0,correct=0,answered=false,selection=null,pack=null,clock=null,remaining=30;
 const clearClock=()=>{if(clock!==null){clearInterval(clock);clock=null}};
 const total=10;
 function hud(){ctx.hud({round:Math.min(position+1,total),total,score:correct*10,extra:"Time: "+remaining+"s · Correct: "+correct+" · Pass: 8/10"})}
 function action(label,callback,css="tile"){const b=node("button",label);b.className=css;b.addEventListener("click",callback);return b}
 function render(){
  if(disposed||!pack)return;
  clearClock();remaining=30;answered=false;selection=null;hud();
  const item=pack.cases[position];
  prompt.textContent="HR01 · Decision "+(position+1)+" of "+total;
  board.replaceChildren();
  const description=node("p",item.scenario);description.className="scenario-text";
  const heading=node("h3","What should the HR solution architect do?");
  const choices=node("div","");choices.className="decision-choices";
  const feedback=node("div","");feedback.className="decision-feedback";feedback.setAttribute("aria-live","polite");
  const next=action(position===total-1?"Finish mission":"Continue →",()=>{if(!answered)return;clearClock();position++;if(position>=total){const passed=correct>=8;ctx.finish(passed,(passed?"Business decisions validated. ":"Review the missed decisions and replay. ")+correct+" of "+total+" correct; passing threshold 8.",correct*10);return}render()},"alt");
  next.disabled=true;
  shuffle([item.correct,...item.distractors]).forEach(choice=>{
    const b=action(choice,()=>{
      if(answered||disposed)return;
      answered=true;clearClock();selection=choice;
      const ok=choice===item.correct;
      if(ok)correct++;
      [...choices.querySelectorAll("button")].forEach(x=>{x.disabled=true;if(x.textContent===item.correct)x.classList.add("good");else if(x===b)x.classList.add("bad")});
      feedback.replaceChildren(node("strong",ok?"Correct decision":"Decision needs improvement"),node("p","Recommended action: "+item.correct),node("p","Why: "+item.rationale));
      next.disabled=false;hud();
    });
    choices.append(b);
  });
  board.append(description,heading,choices,feedback,next);
  clock=setInterval(()=>{if(disposed||answered){clearClock();return}remaining--;hud();if(remaining<=0){clearClock();answered=true;for(const b of choices.querySelectorAll("button")){b.disabled=true;if(b.textContent===item.correct)b.classList.add("good")}feedback.replaceChildren(node("strong","Time expired"),node("p","Recommended action: "+item.correct),node("p","Why: "+item.rationale));next.disabled=false}},1000);
 }
 fetch("content-packs/hr01/PL108-001.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{
  if(disposed)return;
  if(d.gameId!==ID||!Array.isArray(d.cases)||d.cases.length<total||d.cases.some(x=>!x.scenario||!x.correct||!x.rationale||x.distractors.length<2))throw Error("Invalid HR01 scenario pack");
  pack={...d,cases:shuffle(d.cases).slice(0,total)};
  render();
 }).catch(err=>{if(disposed)return;prompt.textContent="Could not start HR01 Decision Sprint";board.replaceChildren(node("p",err.message));ctx.message("Please reload the page and retry.")});
 prompt.textContent="Loading HR01 business scenarios…";board.replaceChildren();
 return {hint(){if(disposed||!pack||answered)return;ctx.message("Hint: Identify the source of truth, authorization requirement, effective date and downstream impact before deciding.");},dispose(){disposed=true;clearClock()}};
}
window.PLAYLAB_HR01_GAME_MODULES=window.PLAYLAB_HR01_GAME_MODULES||{};
window.PLAYLAB_HR01_GAME_MODULES[ID]=create;
})();
