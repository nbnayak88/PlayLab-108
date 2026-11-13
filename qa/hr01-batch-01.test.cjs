"use strict";
const fs=require("fs"),assert=require("node:assert/strict"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const registry=JSON.parse(read("standards/game-registry.json")).templates;
const one=JSON.parse(read("content-packs/hr01/PL108-001.json"));
const quiz=JSON.parse(read("content-packs/hr01/quiz-arena-002-009.json"));
const assertCases=(cases,label)=>{assert(cases.length>=10,label+" requires >=10 scenarios");const seen=new Set();for(const c of cases){assert(c.scenario&&c.correct&&c.rationale,label+" incomplete case");assert(Array.isArray(c.distractors)&&c.distractors.length>=2,label+" missing distractors");const answers=[c.correct,...c.distractors].map(x=>x.trim().toLowerCase());assert.equal(new Set(answers).size,answers.length,label+" duplicate/ambiguous choices");assert(!seen.has(c.scenario),label+" duplicate scenario");seen.add(c.scenario);assert(c.scenario.length>35,label+" scenario too shallow");}};
assertCases(one.cases,"PL108-001");assertCases(quiz.cases,"PL108-002–009");
const expected=Array.from({length:9},(_,i)=>"PL108-"+String(i+1).padStart(3,"0"));
assert.deepEqual(registry.slice(0,9).map(x=>x.templateId),expected,"Canonical first nine IDs");
const scripts=["engines/hr01-decision-sprint.js","engines/hr01-quiz-arena.js"];
for(const file of scripts)new vm.Script(read(file),{filename:file});
const modules={};
const sandbox={window:{PLAYLAB_HR01_GAME_MODULES:modules},document:{getElementById(){return null}},fetch(){throw Error("Do not fetch at module load")}};
for(const file of scripts)vm.runInNewContext(read(file),sandbox,{filename:file});
for(const id of expected)assert.equal(typeof modules[id],"function",id+" lacks dedicated HR01 handler");
const html=read("index.html");
for(const file of scripts)assert(html.includes(file),file+" not loaded");
assert(html.includes("https://hub.successlabsacademy.com/web/checkout/694af8798dd872a219700dd3"),"CTA missing");
const runtime=read("app.js");
assert(runtime.includes('window.PLAYLAB_HR01_GAME_MODULES[g.templateId]'),"HR01 dispatch missing");

// Mechanics-specific release regression gates (static contracts; browser testing is separate).
const quizEngine=read("engines/hr01-quiz-arena.js");
const contracts={
 "008 scenario rotates on retry":'cases[(i+turn)%cases.length]',
 "002 50:50 lifeline":'Use 50:50 lifeline',
 "003 locked Jeopardy tiles":'b.disabled=used.has(key)',
 "004 nonrepeating wheel selection":'wheelUsed.add(ix)',
 "005 randomized true/false claims":'const truth=Math.random()<0.5',
 "006 life elimination":'lives===0',
 "007 bank scoring":'id===7?bank:score',
 "007 minimum stake deadlock protection":'id===7&&bank<10',
 "008 real 3x3 grid":'grid-template-columns:repeat(3',
 "008 bingo line evaluation":'lines(marks)',
 "009 boss HP victory":'hp===0',
 "single-answer uniqueness":'new Set([c.correct,...c.distractors]'
};
for(const [name,needle] of Object.entries(contracts))assert(quizEngine.includes(needle),"Missing mechanics contract: "+name);
assert(!quizEngine.includes("score+bank"),"Wager bank must not inflate unrelated game scores");

const statuses=Object.fromEntries(expected.map(id=>[id,{schema:"pass",registered:"pass",browser:"not-run",subjectExpert:"pending",release:"blocked"}]));
const report={generatedAt:new Date().toISOString(),batch:"HR01-B01",gameIds:expected,automatedChecks:"passed",browserTesting:"not-run",businessValidation:"pending",releaseDecision:"blocked",reason:"Static validation is not evidence of correct mechanics or browser completion",statuses};
fs.mkdirSync("qa/reports",{recursive:true});
fs.writeFileSync("qa/reports/hr01-batch-01.json",JSON.stringify(report,null,2)+"\n");
console.log("PASS: HR01 Batch 01 — 9 registered games, unique decisions, HTML wiring, CTA. Release remains BLOCKED pending browser and SME checks.");
