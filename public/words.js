'use strict';
// Words you fed become the page: its outline is written with them, and loose fragments drift
// around the screen to be eaten or woven into new phrases.
const FLOW_SPEED={lively:38,playful:44,angry:60,hopeful:30,curious:24,proud:18,grateful:14,calm:8,cool:12,shy:10,sad:6,lonely:6,regret:6,anxious:20,awkward:16,bored:4};
const PARTICLE=/(이에요|예요|이야|에서|으로|에게|한테|까지|부터|처럼|보다|이랑|랑|하고|은|는|이|가|을|를|에|의|도|로|와|과|요|야)$/;
let skinOffset=0,skinCycle=0,skinSpeed=15,skinFrame=null,skinLast=0,chipDrag=null;
const chipSpots={};
function normalizeWords(s){
 if(!s.words||typeof s.words!=='object'||Array.isArray(s.words))s.words={};const w=s.words;
 if(!Array.isArray(w.eaten))w.eaten=[];w.eaten=[...new Set(w.eaten.filter(t=>typeof t==='string'&&t.length<=24))].slice(-500);
 if(!Array.isArray(w.phrases))w.phrases=[];w.phrases=w.phrases.filter(p=>p&&typeof p.text==='string'&&p.text.length<=24&&Number.isFinite(p.at)).map(p=>({text:p.text,at:p.at,eaten:!!p.eaten})).slice(0,60);
}
// ponytail: suffix-strip particle heuristic (고양이 → 고양); swap for a morpheme list if scraps read oddly.
function wordTokens(text){return String(text).replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).map(t=>{const s=t.replace(PARTICLE,'');return s.length>=2?s:t}).filter(t=>t.length>=2&&t.length<=5)}
function wordChips(){
 const w=state.words,used=new Set(w.eaten),loose=[];
 for(const h of state.history)for(const t of wordTokens(h.text))if(!used.has(t)){used.add(t);loose.push({text:t,kind:'word'})}
 return [...w.phrases.filter(p=>!p.eaten).slice(0,3).map(p=>({text:p.text,kind:'phrase'})),...loose.slice(0,6)];
}
function wordFlavor(text){const f=feelingOf(text);return f==='neutral'?'담백한 맛이야.':EMOTIONS[f].label+'의 맛이 나.'}
function eatWord(text){
 normalizeWords(state);if(busy||activity||state.sleeping||state.xp<9)return false;const w=state.words,phrase=w.phrases.find(p=>p.text===text&&!p.eaten);
 if(!phrase&&!wordChips().some(c=>c.text===text))return false;
 const times=phrase?2:1,type=Object.keys(TYPES).find(k=>TYPES[k].words.test(text))||'plain',felt=feelingOf(text);
 for(let i=0;i<times;i++)nourishLife(type,felt);
 if(phrase)phrase.eaten=true;else w.eaten.push(text);
 state.joy=clamp(state.joy+3*times);state.hunger=clamp(state.hunger+3*times);if(felt!=='neutral'&&EMOTIONS[felt]){state.emotion=felt;state.mix=null}
 animate('eating');render();speak('「'+text+'」… 오물오물. '+wordFlavor(text)+(phrase?' 엮은 말이라 두 배로 든든해.':''));return true;
}
function weaveWords(a,b){
 normalizeWords(state);if(busy||activity||state.xp<9||a===b)return false;const w=state.words,chips=wordChips(),ca=chips.find(c=>c.text===a),cb=chips.find(c=>c.text===b);
 const text=a+' '+b;if(!ca||!cb||text.length>24)return false;
 for(const c of [ca,cb]){if(c.kind==='phrase')w.phrases=w.phrases.filter(p=>!(p.text===c.text&&!p.eaten));else w.eaten.push(c.text)}
 const first=!w.phrases.some(p=>p.text===text);w.phrases.unshift({text,at:Date.now(),eaten:false});w.phrases=w.phrases.slice(0,60);
 if(first)state.fragments+=1;render();speak(josa('「'+a,'」과','」와')+' '+josa('「'+b,'」을','」를')+' 엮었더니 '+josa('「'+text,'」이','」가')+' 됐어. '+wordFlavor(text));return true;
}
function renderWordSkin(){
 const xp=state.xp,skin=$('wordSkinPath'),texts=state.history.slice(0,12).map(h=>h.text).filter(Boolean);
 $('wordSkin').style.opacity=xp>=3&&texts.length?1:0;
 skin.setAttribute('href',xp>=9?'#body':'#firstLine');
 const rep=texts.join(' · ')+' · ',path=$(xp>=9?'body':'firstLine'),length=typeof path.getTotalLength==='function'?path.getTotalLength()||1000:1000;
 const copies=Math.max(1,Math.ceil(length/Math.max(1,rep.length*13)));const once=rep.repeat(copies);
 if(skin.textContent!==once+once){skin.textContent=once+once;skinCycle=typeof $('wordSkin').getComputedTextLength==='function'?$('wordSkin').getComputedTextLength()/2:once.length*13}
 skinSpeed=state.sleeping?0:FLOW_SPEED[state.emotion]??15;
 const still=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(skinFrame===null&&!still&&typeof requestAnimationFrame==='function'){const step=t=>{const dt=skinLast?Math.min(.1,(t-skinLast)/1000):0;skinLast=t;skinOffset-=skinSpeed*dt;if(skinCycle&&skinOffset<-skinCycle)skinOffset+=skinCycle;skin.setAttribute('startOffset',skinOffset.toFixed(1));skinFrame=requestAnimationFrame(step)};skinFrame=requestAnimationFrame(step)}
}
// Fixed slots keep scraps apart and away from the face, the card and the writing line.
// Wide screens use the empty right side; narrow (stacked) layouts pin four scraps beside the creature.
const CHIP_SLOTS=[[66,12],[80,21],[93,31],[84,44],[93,56],[86,7],[94,70],[76,61]];
function chipSpot(text){
 const hab=$('habitat').getBoundingClientRect(),narrow=hab.width<=900,count=narrow?4:CHIP_SLOTS.length;let s=chipSpots[text];
 if(!s){const used=new Set(Object.values(chipSpots).map(p=>p.slot)),slot=[...Array(count).keys()].find(i=>!used.has(i));if(slot===undefined)return null;s=chipSpots[text]={slot}}
 if(s.x!==undefined)return s;if(s.slot>=count)return null;if(!narrow)return {x:CHIP_SLOTS[s.slot][0],y:CHIP_SLOTS[s.slot][1]};
 const pet=$('pet').getBoundingClientRect();return {x:s.slot%2?98:2,side:s.slot%2?"r":"l",y:(pet.top+pet.height*(s.slot<2?.3:.72)-hab.top)/hab.height*100};
}
function renderWordField(){
 const field=$('wordField');if(chipDrag)return;field.replaceChildren();if(state.xp<9||activity){field.hidden=true;return}field.hidden=false;
 const live=new Set(wordChips().map(c=>c.text));for(const t of Object.keys(chipSpots))if(!live.has(t))delete chipSpots[t];
 wordChips().forEach((c,i)=>{const b=document.createElement('button');b.className='word-chip'+(c.kind==='phrase'?' phrase':'');b.textContent=c.text;b.dataset.chip=c.text;b.setAttribute('aria-label','말 조각 「'+c.text+'」 · 눌러서 먹이기, 다른 조각에 끌어서 엮기');const p=chipSpot(c.text);if(!p)return;if(p.side)b.classList.add('edge-'+p.side);b.style.left=p.x+'%';b.style.top=p.y+'%';b.style.setProperty('--tilt',((i*37)%9-4)+'deg');b.style.setProperty('--delay',(i*.7)+'s');
  b.addEventListener('pointerdown',ev=>{if(ev.button!==0||busy||activity)return;ev.preventDefault();chipDrag={el:b,text:c.text,x:ev.clientX,y:ev.clientY,moved:false};b.setPointerCapture(ev.pointerId);b.classList.add('dragging')});
  b.addEventListener('pointermove',ev=>{if(!chipDrag||chipDrag.el!==b)return;if(Math.abs(ev.clientX-chipDrag.x)+Math.abs(ev.clientY-chipDrag.y)>6)chipDrag.moved=true;const r=$('habitat').getBoundingClientRect();b.style.left=((ev.clientX-r.left)/r.width*100)+'%';b.style.top=((ev.clientY-r.top)/r.height*100)+'%'});
  const drop=ev=>{if(!chipDrag||chipDrag.el!==b)return;const d=chipDrag;chipDrag=null;b.classList.remove('dragging');if(b.hasPointerCapture(ev.pointerId))b.releasePointerCapture(ev.pointerId);
   if(!d.moved){eatWord(d.text);return}
   const hit=el=>{const r=el.getBoundingClientRect();return ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom};
   const other=[...field.children].find(o=>o!==b&&hit(o));
   if(other&&weaveWords(d.text,other.dataset.chip))return;
   if(hit($('pet'))&&eatWord(d.text))return;
   const r=$('habitat').getBoundingClientRect();chipSpots[d.text]={x:clampRange((ev.clientX-r.left)/r.width*100,4,96),y:clampRange((ev.clientY-r.top)/r.height*100,10,62),slot:chipSpots[d.text]?.slot};renderWordField()};
  b.addEventListener('pointerup',drop);b.addEventListener('pointercancel',drop);
  b.addEventListener('click',ev=>{if(ev.detail===0)eatWord(c.text)});
  field.append(b)});
}
function renderWords(){normalizeWords(state);renderWordSkin();renderWordField();$('wordBookButton').textContent='말 사전 · '+state.words.phrases.length}
function openWordBook(){
 normalizeWords(state);open('말 사전');const w=state.words,p=document.createElement('p');p.textContent='먹인 말에서 떨어진 조각을 다른 조각 위로 끌어 엮으면 새 구절이 생겨. 조각을 누르거나 페이지에게 끌어다 주면 먹어. 지금까지 먹은 조각 '+w.eaten.length+'개.';$('drawerContent').append(p);
 const list=document.createElement('ul');list.className='word-book';for(const ph of w.phrases){const li=document.createElement('li'),s=document.createElement('small');li.textContent='「'+ph.text+'」 ';s.textContent=new Date(ph.at).toLocaleDateString('ko-KR')+(ph.eaten?' · 먹음':' · 화면에 떠 있음');li.append(s);list.append(li)}
 if(!w.phrases.length){const li=document.createElement('li');li.textContent='아직 엮은 말이 없어. 떠다니는 조각 둘을 겹쳐봐.';list.append(li)}$('drawerContent').append(list);
}
function initWords(){$('wordBookButton').onclick=openWordBook}
