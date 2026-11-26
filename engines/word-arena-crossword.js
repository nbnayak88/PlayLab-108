/* Domain-neutral crossword model; UI integration intentionally separate. */
(function(root){
"use strict";
function create(entries){
 if(!Array.isArray(entries)||entries.length<2)throw Error("Need at least two clues");
 const cells=new Map(), links=entries.map(()=>new Set()), ids=new Set();
 entries.forEach((e,i)=>{
 if(!e.id||ids.has(e.id)||!e.clue||!Number.isInteger(e.row)||!Number.isInteger(e.col)||e.row<0||e.col<0||!["across","down"].includes(e.direction)||!/^[A-Z]{2,}$/.test(e.answer))throw Error("Invalid clue");
 ids.add(e.id);
 [...e.answer].forEach((letter,k)=>{
 const key=(e.row+(e.direction==="down"?k:0))+","+(e.col+(e.direction==="across"?k:0));
 const old=cells.get(key);
 if(old){if(old.letter!==letter||old.directions.has(e.direction))throw Error("Invalid crossing");old.owners.forEach(j=>{links[i].add(j);links[j].add(i)});old.owners.push(i);old.directions.add(e.direction);}
 else cells.set(key,{letter,owners:[i],directions:new Set([e.direction])});
 });
 });
 const visited=new Set([0]), queue=[0];while(queue.length){for(const j of links[queue.shift()])if(!visited.has(j)){visited.add(j);queue.push(j)}}
 if(visited.size!==entries.length)throw Error("Disconnected crossword");
 const values=new Map();
 return {keys:()=>[...cells.keys()], set(key,value){if(!cells.has(key)||typeof value!=="string"||!/^([A-Za-z])?$/.test(value))return false;values.set(key,value.toUpperCase());return true;},check(){let correct=0;for(const [key,c] of cells)if(values.get(key)===c.letter)correct++;return {correct,total:cells.size,complete:correct===cells.size};},reset(){values.clear();}};
}
root.PlayLabCrossword={create};
})(typeof module==="object"&&module.exports?module.exports:globalThis);
