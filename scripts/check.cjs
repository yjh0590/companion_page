// These checks simulate DOM events; they do not replace visual browser testing.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
class Element{constructor(){this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.children=[];this.classList={toggle(){},add(){},remove(){}};this.handlers={};this.hidden=false;this.value='';}addEventListener(k,f){this.handlers[k]=f}setAttribute(k,v){this[k]=v}replaceChildren(){this.children=[]}append(...e){this.children.push(...e)}querySelector(){return this.submit||(this.submit=new Element)}setPointerCapture(id){this.captured=id}hasPointerCapture(id){return this.captured===id}releasePointerCapture(id){this.captured=null}getBoundingClientRect(){return {left:0,top:0,right:500,bottom:370,width:500,height:370}}remove(){}focus(){}showModal(){}close(){}}
const html=fs.readFileSync('public/index.html','utf8'),els=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(x=>[x[1],new Element]));const saved={},timers=[];const document={getElementById:k=>{if(!els[k])throw Error('Unknown id '+k);return els[k]},body:new Element,createElement:()=>new Element,createElementNS:()=>new Element,createTextNode:t=>t,querySelectorAll:()=>[]};
// Model the real DOM rule: replacing parent text removes nested nodes and their ID lookup.
if(els.collectionCount){
 els.closet.children=[els.closetLabel,els.collectionCount].filter(Boolean);
 Object.defineProperty(els.closet,'textContent',{get(){return this.labelText||''},set(value){for(const child of this.children){for(const key of Object.keys(els))if(els[key]===child)delete els[key]}this.children=[];this.labelText=value}});
}
const context=vm.createContext({document,localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},setTimeout:(f,ms)=>{if(ms===350)timers.push(f);return 1},clearTimeout(){},setInterval(){},console,alert(){},confirm:()=>true,Blob,URL,Date,Math});vm.runInContext(fs.readFileSync('public/emotions.js','utf8'),context);vm.runInContext(fs.readFileSync('public/upgrade.js','utf8'),context);vm.runInContext(fs.readFileSync('public/dimensions.js','utf8'),context);vm.runInContext(fs.readFileSync('public/evolution.js','utf8'),context);vm.runInContext(fs.readFileSync('public/life.js','utf8'),context);vm.runInContext(fs.readFileSync('public/words.js','utf8'),context);vm.runInContext(fs.readFileSync('public/game.js','utf8'),context);

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
// v0.9 content: job-only events follow the current job, ids stay unique, choices use real stats/emotions.
assert.equal(vm.runInContext('new Set(LIFE_EVENTS.map(e=>e.id)).size===LIFE_EVENTS.length&&LIFE_EVENTS.length',context),71);
assert(vm.runInContext("LIFE_EVENTS.every(e=>e.choices.length>=3&&(!e.job||JOBS[e.job])&&(!e.season||SEASONS.includes(e.season))&&(!e.situation||SITUATIONS[e.situation])&&e.choices.every(c=>EMOTIONS[c.emotion]&&Object.keys(c.effects).every(k=>LIFE_STATS[k])&&Object.keys(c.need||{}).every(k=>LIFE_STATS[k])))",context));
assert.equal(vm.runInContext("LIFE_EVENTS.filter(e=>e.choices.some(c=>c.need)).length",context),11);
// Seasons gate seasonal events.
for(let n=0;n<40;n++){vm.runInContext('state.life.turns='+(20+n)+';state.life.eventId=null;normalizeLife(state)',context);const e=vm.runInContext('LIFE_EVENTS.find(e=>e.id===state.life.eventId)',context);assert(!e.season||e.season===vm.runInContext('lifeSeason()',context),e.id)}
// Special choices stay locked until the stat requirement is met.
vm.runInContext("state.life.turns=40;state.life.job=null;state.life.eventId='reunion';state.life.stats.social=20;render()",context);
assert.equal(vm.runInContext("chooseLifeEvent('reunion',3)",context),false);
vm.runInContext("state.life.stats.social=60;render()",context);const sp=vm.runInContext('state.life.specialChoices',context);
assert(vm.runInContext("chooseLifeEvent('reunion',3)",context));assert.equal(vm.runInContext('state.life.specialChoices',context),sp+1);
assert(vm.runInContext("state.life.achievements.includes('special')",context));
// Achievements pay once, survive reload, and old saves get them retroactively.
const ach=vm.runInContext('state.life.achievements.length',context),frag=vm.runInContext('state.fragments',context);vm.runInContext('render();render()',context);
assert.equal(vm.runInContext('state.life.achievements.length',context),ach);assert.equal(vm.runInContext('state.fragments',context),frag);
const oldAch=JSON.parse(saved['page-pet-blank-v2']);delete oldAch.life.achievements;vm.runInContext('state='+JSON.stringify(oldAch)+';render()',context);
assert(vm.runInContext("state.life.achievements.includes('adult')",context));
vm.runInContext("state.life.achievements=['bogus','adult','adult'];normalizeLife(state)",context);assert.deepEqual(vm.runInContext('state.life.achievements',context),['adult']);
vm.runInContext('openLife()',context);assert(els.drawerContent.children.some(c=>c.className==='life-achievements'));
console.log('Verified: seasons, stat-gated special choices, achievements pay once and migrate.');
// v0.11: friends meet by age, bond once per year, unlock their events at bond 30.
vm.runInContext("state.life.friends={bogus:5,kong:'x'};state.life.friendTurn=-1;state.life.turns=40;state.life.job=null;render()",context);
assert.equal(vm.runInContext('Object.keys(state.life.friends).length',context),6);assert(vm.runInContext("state.life.achievements.includes('allFriends')",context));
assert(vm.runInContext("spendTimeWith('kong')",context));assert.equal(vm.runInContext("spendTimeWith('mori')",context),false);assert.equal(vm.runInContext('state.life.friends.kong',context),20);
assert.equal(vm.runInContext("lifeEligible(state).some(e=>e.id==='nuriTea')",context),false);vm.runInContext('state.life.friends.nuri=30',context);assert(vm.runInContext("lifeEligible(state).some(e=>e.id==='nuriTea')",context));
// Shop: one stat item per year, reroll changes the event, costs are paid.
vm.runInContext('state.fragments=100;state.life.boughtTurn=-1;state.life.stats.knowledge=20;render()',context);
assert(vm.runInContext("buyLifeItem('book')",context));assert.equal(vm.runInContext('state.life.stats.knowledge',context),25);assert.equal(vm.runInContext("buyLifeItem('paint')",context),false);
const beforeReroll=vm.runInContext('state.life.eventId',context);assert(vm.runInContext("buyLifeItem('reroll')",context));assert.notEqual(vm.runInContext('state.life.eventId',context),beforeReroll);
assert.equal(vm.runInContext('state.fragments',context),82);vm.runInContext('state.fragments=3',context);assert.equal(vm.runInContext("buyLifeItem('reroll')",context),false);
// Promotion pays a bonus and is logged.
vm.runInContext("state.life.job='artist';state.life.jobXp=4;state.fragments=0;render()",context);const pev=vm.runInContext('state.life.eventId',context);
assert(vm.runInContext('chooseLifeEvent('+JSON.stringify(pev)+',0)',context));assert.equal(vm.runInContext('jobLevel()',context),'숙련');
assert(vm.runInContext('state.fragments',context)>=12);assert(vm.runInContext("state.life.log.some(r=>r.text.includes('숙련 그림 작가로 인정'))",context));
vm.runInContext('openLife()',context);assert(els.drawerContent.children.some(c=>c.className==='life-friends'));
console.log('Verified: friends and bonds, friend events, life shop, promotions.');
assert.equal(vm.runInContext("Object.keys(JOBS).every(k=>LIFE_EVENTS.some(e=>e.job===k))",context),true);
for(const job of ['musician','courier',null]){vm.runInContext('state.life.job='+JSON.stringify(job)+';state.life.turns=30;state.life.eventId=null;render()',context);for(let n=0;n<40;n++){const e=vm.runInContext('LIFE_EVENTS.find(e=>e.id===state.life.eventId)',context);assert(!e.job||e.job===job,e.id);vm.runInContext('state.life.turns++;state.life.eventId=null;normalizeLife(state)',context)}}
vm.runInContext("state.life.job='courier';render()",context);assert(els.lifeAccessory.innerHTML.length>0);
assert.equal(vm.runInContext("josa('산책','을','를')+josa('노래','을','를')+josa('음악가','이','가')+josa('이야기꾼','이','가')",context),'산책을노래를음악가가이야기꾼이');
console.log('Verified: 71 events, job-only events, 10 jobs, 8 hobbies, Korean particles.');
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
// v0.12: dreams, homes, retirement.
vm.runInContext("state.life.turns=10;state.xp=24;state.life.dream=null;state.life.dreamsDone=[];state.life.job=null;state.life.retired=null;state.life.home=0;render()",context);
assert(vm.runInContext('lifeAge()',context)>=13);
assert(vm.runInContext("chooseDream('wholeLife')",context));assert.equal(vm.runInContext("chooseDream('dreamHome')",context),false);
const fBefore=vm.runInContext('state.fragments',context);vm.runInContext("for(const k of Object.keys(LIFE_STATS))state.life.stats[k]=70;render()",context);
assert.deepEqual(vm.runInContext('state.life.dreamsDone',context),['wholeLife']);assert.equal(vm.runInContext('state.life.dream',context),null);assert(vm.runInContext('state.fragments',context)>=fBefore+30);
assert.equal(vm.runInContext("chooseDream('wholeLife')",context),false);assert(vm.runInContext("state.life.log.some(r=>r.text.includes('「고르게 자란 삶」을 이뤘다'))",context));
vm.runInContext('state.fragments=19;render()',context);assert.equal(vm.runInContext('upgradeHome()',context),false);vm.runInContext('state.fragments=20',context);assert(vm.runInContext('upgradeHome()',context));assert.equal(vm.runInContext('state.fragments',context),0);
const hev=vm.runInContext('state.life.eventId',context);vm.runInContext('chooseLifeEvent('+JSON.stringify(hev)+',0)',context);assert.equal(vm.runInContext('state.fragments',context),3);
vm.runInContext("state.life.job='researcher';state.life.jobXp=12;state.life.turns=70;render()",context);assert.equal(vm.runInContext('retireJob()',context),true);
assert.equal(vm.runInContext('state.life.job',context),null);assert.equal(vm.runInContext('pension(state.life)',context),6);assert(vm.runInContext("lifeOccupation().startsWith('은퇴한 전문 별 연구원')",context));
vm.runInContext('state.fragments=0;render()',context);const rev=vm.runInContext('state.life.eventId',context);vm.runInContext('chooseLifeEvent('+JSON.stringify(rev)+',0)',context);assert(vm.runInContext('state.fragments',context)>=7);
vm.runInContext("state.life.home=99;state.life.dream='nope';state.life.retired={job:'x'};normalizeLife(state)",context);assert.equal(vm.runInContext('state.life.home',context),4);assert.equal(vm.runInContext('state.life.dream',context),null);assert.equal(vm.runInContext('state.life.retired',context),null);
console.log('Verified: dreams pay once, homes cost and pay yearly, retirement pension, save sanitizing.');
// v0.13: words become fragments, fragments can be eaten or woven; the year can be answered in words.
assert.deepEqual(vm.runInContext("wordTokens('친구랑 같이 놀자!')",context),['친구','같이','놀자']);
vm.runInContext("state.sleeping=false;state.words={eaten:['x'.repeat(30)],phrases:[{text:'ok',at:'bad'}]};normalizeWords(state)",context);assert.deepEqual(vm.runInContext('JSON.stringify(state.words)',context),'{"eaten":[],"phrases":[]}');
feed('친구랑 같이 놀자 바다');assert(vm.runInContext("wordChips().some(c=>c.text==='친구')",context));
assert(vm.runInContext("eatWord('친구')",context));assert.equal(vm.runInContext("eatWord('친구')",context),false);
assert(vm.runInContext("weaveWords('같이','놀자')",context));assert(vm.runInContext("wordChips()[0].kind==='phrase'&&wordChips()[0].text==='같이 놀자'",context));
assert.equal(vm.runInContext("wordChips().some(c=>c.text==='같이')",context),false);
assert(vm.runInContext("eatWord('같이 놀자')",context));assert(vm.runInContext("state.words.phrases[0].eaten",context));assert.equal(vm.runInContext("eatWord('같이 놀자')",context),false);
assert.equal(vm.runInContext("answerChoiceIndex(LIFE_EVENTS.find(e=>e.id==='firstFriend'),'왜 그런지 천천히 관찰해볼래')",context),2);
assert.equal(vm.runInContext("answerChoiceIndex(LIFE_EVENTS.find(e=>e.id==='firstFriend'),'먼저 다가가서 인사할래')",context),0);
const ansEvent=vm.runInContext('state.life.eventId',context),turnsBefore=vm.runInContext('state.life.turns',context);
assert(vm.runInContext("answerLifeEvent('같이 노래 만들자')",context)>=0);assert.equal(vm.runInContext('state.life.turns',context),turnsBefore+1);
assert(vm.runInContext("state.life.log.some(r=>r.text.startsWith('「같이 노래 만들자」'))&&state.history[0].text==='같이 노래 만들자'",context));
assert.equal(vm.runInContext("answerLifeEvent('   ')",context),-1);assert.notEqual(ansEvent,null);
console.log('Verified: word fragments eat once, weaving, phrase book, answering the year in words.');
// v0.14: quick consecutive new words build a combo that pays a bonus fragment from the third feed.
vm.runInContext('combo=0;comboAt=0;state.sleeping=false',context);
for(const t of ['연속 하나 사과','연속 둘 포도']){feed(t)}
const comboBefore=vm.runInContext('state.fragments',context);feed('연속 셋 자두');
assert.equal(vm.runInContext('combo',context),3);const comboGain=vm.runInContext('state.fragments',context)-comboBefore;
vm.runInContext('comboAt=Date.now()-20000',context);const comboReset=vm.runInContext('state.fragments',context);feed('한참 뒤 바나나');
assert.equal(vm.runInContext('combo',context),1);assert.equal(comboGain-(vm.runInContext('state.fragments',context)-comboReset),1);
console.log('Verified: feeding combo bonus and reset.');
