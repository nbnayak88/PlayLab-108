/* PlayLab Quiz Arena: nine distinct playable mechanics, no subject-specific hardcoding.
   All prompts, answers and distractors are read from the selected content pack. */
(function(){
"use strict";
const byId=id=>document.getElementById(id);
const el=(tag,label,click)=>{const n=document.createElement(tag);if(label!==undefined)n.textContent=String(label);if(click)n.addEventListener("click",click);return n};
const random=a=>a.slice().sort(()=>Math.random()-.5);
function create(ctx){
 const game=Number(ctx.game.templateId.slice(-3)), p=ctx.pack, board=byId("board"), prompt=byId("prompt");
 const questions=p.facts.map((q,i)=>({id:i,question:q[0],answer:q[1],options:random([...new Set([q[1],...q.slice(2),p.terms[(i+5)%p.terms.length]])]).slice(0,4)}));
 let stage=0,score=0,lives=3,bank=0,streak=0,help=2,done=false,level=0,chosen=[],grid=[],bingo=[],boss=100;
 const max=game===1?15:game===2?8:game===3?9:game===4?8:game===5?12:game===6?10:game===7?7:game===8?9:8;
 const question=(i)=>questions[(i+stage)%questions.length];
 const btn=(label,fn)=>{const b=el("button",label,fn);b.className="tile";return b};
 const note=t=>ctx.message(t);
 function status(){ctx.hud({round:stage+1,total:max,score,extra:game===6?"Lives: "+lives:game===9?"Boss HP: "+boss:game===7?"Bank: "+bank:game===5?"Streak: "+streak:"Hints: "+help})}
 function end(win,why){if(done)return;done=true;ctx.finish(win,why,Math.max(0,score+bank));}
 function award(ok,points=15){score+=ok?points:-5;streak=ok?streak+1:0;if(!ok)lives--;stage++;status();if(game===6&&lives<=0)return end(false,"Eliminated after three incorrect answers.");if(game===9&&boss<=0)return end(true,"Boss defeated.");if(stage>=max)return end((score+bank)>=Math.max(35,max*6),"Rounds finished. Score "+(score+bank));draw();}
 function choice(q,cb){prompt.textContent=q.question;board.replaceChildren(...q.options.map(x=>btn(x,()=>cb(x===q.answer,x,q))));}
 function basic(){const q=question(game+stage);choice(q,(ok)=>{note(ok?"Correct!":"Incorrect — "+q.answer);award(ok,game===2?10+stage*5:15)});}
 function millionaire(){const q=question(stage+2);prompt.textContent="Level "+(stage+1)+" · "+q.question;const options=q.options.slice();board.replaceChildren(...options.map(x=>btn(x,()=>{const ok=x===q.answer;note(ok?"Level cleared!":"Wrong answer: "+q.answer);if(!ok)return end(false,"Millionaire run ended at level "+(stage+1));award(true,10+stage*10)})),btn("50:50 lifeline ("+help+" left)",()=>{if(help<=0)return;help--;const wrong=options.filter(x=>x!==q.answer).slice(0,2);[...board.querySelectorAll("button")].filter(b=>wrong.includes(b.textContent)).forEach(b=>b.disabled=true);status()}));}
 function jeopardy(){const categories=["People","Processes","Systems"];prompt.textContent="Choose a category and points. Answer correctly to earn the wager.";board.replaceChildren();categories.forEach((cat,i)=>{for(let v=1;v<=3;v++){const key=i*3+v;if(chosen.includes(key))continue;board.append(btn(cat+" · "+v*100,()=>{chosen.push(key);const q=question(key);choice(q,(ok)=>{note(ok?"Correct category response.":"Correct answer: "+q.answer);award(ok,v*10)})}))}});}
 function wheel(){const spins=["Knowledge","Process","Risk","Practice","Architecture","Governance"];const sector=spins[(stage*7+game)%spins.length];const q=question(stage+spins.indexOf(sector));prompt.textContent="Spin "+(stage+1)+" · "+sector;board.replaceChildren(btn("🎡 Spin wheel",()=>{choice(q,(ok)=>{note(ok?"Wheel challenge cleared.":"Answer: "+q.answer);award(ok)})}));}
 function truefalse(){const q=question(stage);const isTrue=(stage%2===0);const candidate=isTrue?q.answer:q.options.find(x=>x!==q.answer);prompt.textContent="True or false: “"+candidate+"” is the answer to “"+q.question+"”";board.replaceChildren(btn("True",()=>{const ok=isTrue;note(ok?"Correct.":"Incorrect.");award(ok)}),btn("False",()=>{const ok=!isTrue;note(ok?"Correct.":"Incorrect.");award(ok)}));}
 function survival(){const q=question(stage);prompt.textContent="Survival · "+lives+" lives · "+q.question;board.replaceChildren(...q.options.map(x=>btn(x,()=>{const ok=x===q.answer;note(ok?"Survived.":"Lost one life. Correct: "+q.answer);award(ok)})));}
 function wager(){const q=question(stage);let stake=10;prompt.textContent="Choose a wager, then answer. Bank "+bank+" points.";board.replaceChildren(...[10,20,30].map(v=>btn("Wager "+v,()=>{stake=v;choice(q,(ok)=>{bank+=ok?stake:-stake;note(ok?"Wager won.":"Wager lost. Answer: "+q.answer);award(ok,5)})})));}
 function bingoGame(){if(!bingo.length){bingo=random(Array.from({length:9},(_,i)=>i));grid=[];}const target=bingo[stage];const q=question(target);prompt.textContent="Trivia Bingo · "+q.question;board.replaceChildren();const holder=el("div");holder.className="grid9";bingo.forEach((n,i)=>{const label=grid.includes(i)?"✓":questions[n%questions.length].answer;holder.append(btn(label,()=>{const ok=n===target;if(ok)grid.push(i);note(ok?"Bingo cell marked!":"Incorrect cell.");if([0,3,6].some(r=>[r,r+1,r+2].every(k=>grid.includes(k)))||[0,1,2].some(c=>[c,c+3,c+6].every(k=>grid.includes(k)))||[[0,4,8],[2,4,6]].some(line=>line.every(k=>grid.includes(k))))return end(true,"Bingo line completed!");award(ok)}))});board.append(holder);}
 function bossBattle(){const q=question(stage);prompt.textContent="Boss HP "+boss+" · "+q.question;board.replaceChildren(...q.options.map(x=>btn(x,()=>{const ok=x===q.answer;boss-=ok?15:0;note(ok?"15 damage dealt.":"Attack missed. Answer: "+q.answer);award(ok,15)})));}
 function draw(){if(done)return;status();switch(game){case 1:basic();break;case 2:millionaire();break;case 3:jeopardy();break;case 4:wheel();break;case 5:truefalse();break;case 6:survival();break;case 7:wager();break;case 8:bingoGame();break;case 9:bossBattle();break;default:basic()}}
 draw();
 return {hint(){if(help<=0){note("No hints remaining.");return;}help--;score=Math.max(0,score-5);note("Hint used. Check the wording and eliminate distractors.");status();},dispose(){done=true;}};
}
window.PLAYLAB_GAME_MODULES=window.PLAYLAB_GAME_MODULES||{};
for(let n=1;n<=9;n++)window.PLAYLAB_GAME_MODULES["PL108-"+String(n).padStart(3,"0")]=create;
})();
