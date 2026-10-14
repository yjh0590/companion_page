// These checks simulate DOM events; they do not replace visual browser testing.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
class Element{constructor(){this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.children=[];this.classList={toggle(){},add(){},remove(){}};this.handlers={};this.hidden=false;this.value='';}addEventListener(k,f){this.handlers[k]=f}setAttribute(k,v){this[k]=v}replaceChildren(){this.children=[]}append(...e){this.children.push(...e)}querySelector(){return this.submit||(this.submit=new Element)}setPointerCapture(id){this.captured=id}hasPointerCapture(id){return this.captured===id}releasePointerCapture(id){this.captured=null}getBoundingClientRect(){return {left:0,top:0,right:500,bottom:370,width:500,height:370}}remove(){}focus(){}showModal(){}close(){}}
const html=fs.readFileSync('public/index.html','utf8'),els=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(x=>[x[1],new Element]));const saved={},timers=[];const document={getElementById:k=>{if(!els[k])throw Error('Unknown id '+k);return els[k]},body:new Element,createElement:()=>new Element,createElementNS:()=>new Element,createTextNode:t=>t,querySelectorAll:()=>[]};
const context=vm.createContext({document,localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},setTimeout:(f,ms)=>{if(ms===850)timers.push(f);return 1},clearTimeout(){},setInterval(){},console,alert(){},confirm:()=>true,Blob,URL,Date,Math});vm.runInContext(fs.readFileSync('public/emotions.js','utf8'),context);vm.runInContext(fs.readFileSync('public/upgrade.js','utf8'),context);vm.runInContext(fs.readFileSync('public/dimensions.js','utf8'),context);vm.runInContext(fs.readFileSync('public/evolution.js','utf8'),context);vm.runInContext(fs.readFileSync('public/game.js','utf8'),context);

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
