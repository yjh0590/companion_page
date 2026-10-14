// These checks simulate DOM events; they do not replace visual browser testing.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
class Element{constructor(){this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.children=[];this.classList={toggle(){},add(){},remove(){}};this.handlers={};this.hidden=false;this.value='';}addEventListener(k,f){this.handlers[k]=f}setAttribute(k,v){this[k]=v}replaceChildren(){this.children=[]}append(...e){this.children.push(...e)}querySelector(){return this.submit||(this.submit=new Element)}setPointerCapture(id){this.captured=id}hasPointerCapture(id){return this.captured===id}releasePointerCapture(id){this.captured=null}getBoundingClientRect(){return {left:0,top:0,right:500,bottom:370,width:500,height:370}}remove(){}focus(){}showModal(){}close(){}}
const html=fs.readFileSync('public/index.html','utf8'),els=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(x=>[x[1],new Element]));const saved={},timers=[];const document={getElementById:k=>{if(!els[k])throw Error('Unknown id '+k);return els[k]},body:new Element,createElement:()=>new Element,createElementNS:()=>new Element,createTextNode:t=>t,querySelectorAll:()=>[]};
// Model the real DOM rule: replacing parent text removes nested nodes and their ID lookup.
if(els.collectionCount){
 els.closet.children=[els.closetLabel,els.collectionCount].filter(Boolean);
 Object.defineProperty(els.closet,'textContent',{get(){return this.labelText||''},set(value){for(const child of this.children){for(const key of Object.keys(els))if(els[key]===child)delete els[key]}this.children=[];this.labelText=value}});
}
const context=vm.createContext({document,localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},setTimeout:(f,ms)=>{if(ms===850)timers.push(f);return 1},clearTimeout(){},setInterval(){},console,alert(){},confirm:()=>true,Blob,URL,Date,Math});vm.runInContext(fs.readFileSync('public/emotions.js','utf8'),context);vm.runInContext(fs.readFileSync('public/upgrade.js','utf8'),context);vm.runInContext(fs.readFileSync('public/dimensions.js','utf8'),context);vm.runInContext(fs.readFileSync('public/evolution.js','utf8'),context);vm.runInContext(fs.readFileSync('public/life.js','utf8'),context);vm.runInContext(fs.readFileSync('public/game.js','utf8'),context);

function feed(text){els.food.value=text;els.feedForm.handlers.submit({preventDefault(){}});timers.shift()()}
assert.equal(document.body.dataset.dimension,'blank');assert.equal(els.firstDot.style.opacity,0);assert.equal(els.body.style.opacity,0);assert(els.careDock.inert);
const expected={1:'point',2:'point',3:'line',5:'line',6:'outline',8:'outline',9:'plane',13:'plane',14:'life',23:'life',24:'volume'};
for(let i=1;i<=24;i++){feed('새로운 이야기 '+i);if(expected[i])assert.equal(document.body.dataset.dimension,expected[i]);assert(!els.firstLine.d.includes('NaN'));if(i<9){assert.equal(els.body.style.opacity,0);assert.equal(els.eyes.style.opacity,0)}if(i===9){assert.equal(els.body.style.opacity,1);assert.equal(els.body.style.fillOpacity,.2)}if(i===11)assert.equal(els.eyes.style.opacity,1);if(i===12)assert.equal(els.mouth.style.opacity,1);if(i<14)assert(els.careDock.inert);if(i===14)assert(!els.careDock.inert)}
assert.equal(els.volumeMesh.children.length,16);assert.equal(els.body.style.opacity,0);assert.match(els.dimensionFrame.transform,/matrix/);for(const face of els.volumeMesh.children)assert(!face.d.includes('NaN'));
const before=els.volumeMesh.children[0].d;els.pet.handlers.keydown({key:'ArrowRight',preventDefault(){}});assert.notEqual(els.volumeMesh.children[0].d,before);assert(Number.isFinite(JSON.parse(saved['page-pet-blank-v2']).viewRotation.yaw));
vm.runInContext('rotation.yaw=Math.PI;renderVolume()',context);assert.equal(els.dimensionFrame.style.opacity,0);vm.runInContext('rotation.yaw=0;renderVolume()',context);assert.equal(els.dimensionFrame.style.opacity,1);
// Dragging the same plane into 3D persists its viewing angle.
els.pet.handlers.pointerdown({button:0,clientX:200,clientY:170,pointerId:1});els.pet.handlers.pointermove({clientX:245,clientY:190,pointerId:1});els.pet.handlers.pointerup({pointerId:1});assert.equal(vm.runInContext('dimensionPointer',context),null);assert(Number.isFinite(JSON.parse(saved['page-pet-blank-v2']).viewRotation.pitch));
// Repeated food changes emotion but not form growth.
const xp=JSON.parse(saved['page-pet-blank-v2']).xp;feed('새로운 이야기 24');assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,xp);
// An older record gets its corresponding shape without losing XP.
const old=JSON.parse(saved['page-pet-blank-v2']);old.xp=12;delete old.viewRotation;vm.runInContext('state='+JSON.stringify(old)+';render()',context);assert.equal(document.body.dataset.dimension,'plane');assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,12);assert(els.careDock.inert);
// Gameplay and ornament purchases stay locked until 2D life.
assert.equal(vm.runInContext("putOrnament('star')",context),false);els.play.onclick();assert.equal(vm.runInContext('activity',context),null);
feed('고마워');feed('별');assert.equal(document.body.dataset.dimension,'life');assert.equal(vm.runInContext("putOrnament('star')",context),true);
feed('친구랑 다퉜어');els.play.onclick();const pieces=[...els.activityLayer.children];for(const b of pieces.slice(1)){b.onclick();pieces[0].onclick()}assert(els.activityLayer.hidden);
// Geometry is finite at every milestone, regardless of personality.
for(const type of ['cool','lively','shy','playful','calm','curious'])for(const growth of [0,1,3,6,9,14,24,40]){vm.runInContext('state.personality='+JSON.stringify(type)+';state.xp='+growth+';render()',context);assert(!els.firstLine.d.includes('NaN'));if(growth>=24)for(const path of els.volumeMesh.children)assert(!path.d.includes('NaN'))}
console.log('Verified: dimensional stages, delayed face and menus, stable 3D projection, rotation and back view, saved pose, old-record continuity, gameplay gates.');

// Feedback changes the feeling without creating additional food rewards.
feed('좋아하는 마음');let prior=JSON.parse(saved['page-pet-blank-v2']);assert.equal(vm.runInContext("correctLastFeeling('cool')",context),true);let corrected=JSON.parse(saved['page-pet-blank-v2']);assert.equal(corrected.xp,prior.xp);assert.equal(corrected.fragments,prior.fragments);assert.equal(corrected.history[0].corrected,true);
feed('좋아하는 마음!!!');let repeated=JSON.parse(saved['page-pet-blank-v2']);assert.equal(repeated.emotion,'cool');assert.equal(repeated.xp,corrected.xp);
// More than 30 intervening messages must not erase food memory.
feed('영원히 기억할 말');const recordXp=JSON.parse(saved['page-pet-blank-v2']).xp;for(let i=0;i<35;i++)feed('새로운 기록 '+i);const later=JSON.parse(saved['page-pet-blank-v2']);feed('영원히 기억할 말');assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,later.xp);
// A saved album entry is a snapshot, rather than a live view of current feelings.
const beforeEntry=JSON.parse(saved['page-pet-blank-v2']).growthJournal[0];feed('오늘 귀찮아');assert.deepEqual(JSON.parse(saved['page-pet-blank-v2']).growthJournal[0],beforeEntry);
assert(vm.runInContext("miniShape({stage:'volume',emotion:'lively',personality:'cool'})",context).includes('<svg'));
assert(vm.runInContext("xmlText('<script>')",context)==='&lt;script&gt;');
const round=vm.runInContext("JSON.stringify(evolveOutline(PAGE_OUTLINE,'lively',30))",context),angular=vm.runInContext("JSON.stringify(evolveOutline(PAGE_OUTLINE,'cool',30))",context);assert.notEqual(round,angular);
// Local storage failure must not crash the backup operation.
vm.runInContext("localStorage.setItem=()=>{throw Error('blocked')};backupBeforeChange()",context);
console.log('Verified: correction learning, no correction rewards, normalized duplicate memory beyond recent history, album snapshots, safe SVG names, shape variants, storage fallback.');

// Reset is reversible through the explicit backup action.
context.localStorage.setItem=(k,v)=>saved[k]=v;
function findButton(root,text){for(const c of root.children||[]){if(c&&c.textContent===text)return c;const found=c&&typeof c==='object'?findButton(c,text):null;if(found)return found}return null}
const keep=JSON.parse(saved['page-pet-blank-v2']);els.settings.onclick();findButton(els.drawerContent,'새 페이지로 다시 시작').onclick();assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,0);assert.equal(JSON.parse(saved['page-pet-blank-v2-before-import']).xp,keep.xp);
els.settings.onclick();findButton(els.drawerContent,'불러오기·초기화 전 기록 복구').onclick();assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,keep.xp);assert.equal(JSON.parse(saved['page-pet-blank-v2']).fragments,keep.fragments);
console.log('Verified: reset backup and restore preserve growth and decorations.');

// Age advances through food and explicit annual choices, not wall-clock time.
vm.runInContext('state=fresh();render()',context);assert.equal(els.lifeHUD.inert,true);
for(let i=0;i<14;i++)feed('인생의 새로운 말 '+i);assert.equal(els.lifeHUD.inert,false);assert.equal(vm.runInContext('lifeAge()',context),4);
const event=vm.runInContext('state.life.eventId',context),age=vm.runInContext('lifeAge()',context);assert(vm.runInContext('chooseLifeEvent('+JSON.stringify(event)+',0)',context));assert.equal(vm.runInContext('lifeAge()',context),age+1);assert.equal(vm.runInContext('chooseLifeEvent('+JSON.stringify(event)+',0)',context),false);
assert(vm.runInContext('practiceHobby()',context));const statsAfter=JSON.parse(saved['page-pet-blank-v2']).life.stats;assert.equal(vm.runInContext('practiceHobby()',context),false);assert.deepEqual(JSON.parse(saved['page-pet-blank-v2']).life.stats,statsAfter);
assert.equal(vm.runInContext("takeJob('artist')",context),false);
// Advance by one choice per year. Validate age-appropriate event pools.
for(let n=0;n<14;n++){const ev=vm.runInContext('LIFE_EVENTS.find(e=>e.id===state.life.eventId)',context);const age=vm.runInContext('lifeAge()',context);assert(age>=ev.min&&age<=ev.max);assert(vm.runInContext('chooseLifeEvent('+JSON.stringify(ev.id)+',0)',context))}
assert(vm.runInContext('lifeAge()',context)>=18);
vm.runInContext('state.life.stats.creativity=40;render()',context);assert(vm.runInContext("takeJob('artist')",context));assert.equal(vm.runInContext("takeJob('artist')",context),false);assert(els.lifeAccessory.innerHTML.length>0);
const money=JSON.parse(saved['page-pet-blank-v2']).fragments;const ev=vm.runInContext('state.life.eventId',context);vm.runInContext('chooseLifeEvent('+JSON.stringify(ev)+',0)',context);assert.equal(JSON.parse(saved['page-pet-blank-v2']).fragments,money+6);assert.equal(vm.runInContext('state.life.jobXp',context),1);
for(let n=0;n<4;n++){const ev=vm.runInContext('state.life.eventId',context);vm.runInContext('chooseLifeEvent('+JSON.stringify(ev)+',1)',context)}assert.equal(vm.runInContext('jobLevel()',context),'숙련');
for(const [text,feeling] of [['걱정되고 불안해','anxious'],['다음이 기대돼','hopeful'],['오늘은 뿌듯해','proud'],['고마워','grateful'],['심심해','bored'],['후회돼','regret'],['민망하고 어색해','awkward'],['친구가 그리워','lonely']]){feed(text);assert.equal(document.body.dataset.emotion,feeling,text)}
// Older save formats gain a life record without losing existing belongings.
const oldLife=JSON.parse(saved['page-pet-blank-v2']);delete oldLife.life;vm.runInContext('state='+JSON.stringify(oldLife)+';render()',context);assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,oldLife.xp);assert.deepEqual(JSON.parse(saved['page-pet-blank-v2']).placements,oldLife.placements);
for(const year of [0,6,13,18,60,120]){vm.runInContext('state.life.turns='+Math.max(0,year-Math.floor(oldLife.xp/3))+';state.life.eventId=null;render()',context);const age=vm.runInContext('lifeAge()',context),ev=vm.runInContext('LIFE_EVENTS.find(e=>e.id===state.life.eventId)',context);assert(age>=ev.min&&age<=ev.max)}
console.log('Verified: life age, 20 age-filtered events, yearly choices, hobby cooldown, profession prerequisites, income and promotion, 8 extra emotions, save migration.');

// Life panels are usable as rendered dialogs, not only as standalone logic.
vm.runInContext('state.life.turns=18;state.life.eventId=null;render();openLife()',context);assert(els.drawerContent.children.length>4);vm.runInContext('openCareers()',context);assert(els.drawerContent.children.some(c=>c.className==='career-grid'));
for(const [text,expected]of [['불안하지 않아','neutral'],['걱정하지 않아','neutral'],['안 무서워','neutral']])assert.equal(vm.runInContext('feelingOf('+JSON.stringify(text)+')',context),expected,text);
console.log('Verified: life dialogs render and common anxiety negations do not trigger anxiety.');

// The collection display remains attached during every parent-label update.
vm.runInContext('state=fresh();render()',context);for(let i=0;i<35;i++){feed('연속 입력 검증 '+i);assert(document.getElementById('collectionCount'));assert.equal(vm.runInContext('busy',context),false);assert.equal(els.feedForm.querySelector('button').disabled,false)}
// New text written while chewing must remain in the field.
els.food.value='먼저 보낼 말';els.feedForm.handlers.submit({preventDefault(){}});els.food.value='다음에 보낼 말';timers.shift()();assert.equal(els.food.value,'다음에 보낼 말');els.feedForm.handlers.submit({preventDefault(){}});timers.shift()();assert.equal(JSON.parse(saved['page-pet-blank-v2']).history[0].text,'다음에 보낼 말');
// Force a view failure: state rolls back, and the submit button is released.
const oldXp=JSON.parse(saved['page-pet-blank-v2']).xp;vm.runInContext('const renderingBeforeFailure=render;render=()=>{throw Error("injected view failure")};const loggingBeforeFailure=console;console={...console,error(){}}',context);feed('오류에도 잠기지 않는 입력');assert.equal(vm.runInContext('busy',context),false);assert.equal(els.feedForm.querySelector('button').disabled,false);assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,oldXp);assert.equal(els.food.value,'오류에도 잠기지 않는 입력');vm.runInContext('render=renderingBeforeFailure;console=loggingBeforeFailure',context);feed('오류에도 잠기지 않는 입력');assert.equal(JSON.parse(saved['page-pet-blank-v2']).xp,oldXp+1);
// Enter during IME composition does not send an incomplete Korean word.
els.food.handlers.compositionstart();els.food.value='한글 조합';const waiting=timers.length;els.feedForm.handlers.submit({preventDefault(){}});assert.equal(timers.length,waiting);els.food.handlers.compositionend();els.feedForm.handlers.submit({preventDefault(){}});timers.shift()();assert.equal(vm.runInContext('busy',context),false);
console.log('Verified: DOM child preservation, 35 consecutive feeds, next draft preservation, failure rollback and unlock, Korean composition handling.');
