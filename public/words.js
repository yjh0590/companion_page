'use strict';
// Words you fed become the page: its outline is written with them, and loose fragments drift
// around the screen to be eaten or woven into new phrases.
const FLOW_SPEED={lively:38,playful:44,angry:60,hopeful:30,curious:24,proud:18,grateful:14,calm:8,cool:12,shy:10,sad:6,lonely:6,regret:6,anxious:20,awkward:16,bored:4};
const PARTICLE=/(이에요|예요|이야|에서|으로|에게|한테|까지|부터|처럼|보다|이랑|랑|하고|은|는|이|가|을|를|에|의|도|로|와|과|요|야)$/;
let skinOffset=0,skinCycle=0,skinSpeed=15,skinFrame=null,skinLast=0,chipDrag=null;
const chipSpots={};
const PARTICLES=['이에요','예요','이야','에서','으로','에게','한테','까지','부터','처럼','보다','이랑','랑','하고','이가','은','는','이','가','을','를','에','의','도','만','로','와','과','요','야','아'];
// Every way of peeling one particle off; a dictionary word wins over a shorter stem (고양이랑 → 고양이, not 고양).
function stems(t){return [t,...PARTICLES.filter(p=>t.length>p.length&&t.endsWith(p)).map(p=>t.slice(0,-p.length))]}
// Shapes: a fed word that names a thing (SHAPES, from Unicode CLDR Korean) turns the page into that thing.
// One-syllable names that are also everyday words (새 학기, 해 봐, 배 고파) count only with a particle: 새가, 해가, 배를.
const FORM_AT=14,REVERT=/원래대로|원래 모습|돌아와/,BARE_AMBIGUOUS=new Set(['새','해','배','차','눈','말']);
function shapeOf(text){
 for(const t of String(text).replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/)){if(!t)continue;
  for(const c of stems(t))if(Object.hasOwn(SHAPES,c)&&!(c===t&&BARE_AMBIGUOUS.has(c)))return {word:c,emoji:SHAPES[c]}}
 return null;
}
// Each shape answers in its own voice: a few named sounds, otherwise one per kind of movement.
const SHAPE_SOUNDS={고양이:'야옹',강아지:'멍멍',개:'멍멍',닭:'꼬끼오',병아리:'삐약삐약',오리:'꽥꽥',돼지:'꿀꿀',소:'음매',양:'매에',염소:'메에',개구리:'개굴개굴',쥐:'찍찍',사자:'어흥',호랑이:'어흥',늑대:'아우우',부엉이:'부엉부엉',새:'짹짹',참새:'짹짹',벌:'윙윙',꿀벌:'윙윙',모기:'애앵',기차:'칙칙폭폭',자동차:'부릉부릉',버스:'부릉부릉',비행기:'슈웅',로켓:'슈우웅',배:'뿌우',종:'딩동',시계:'째깍째깍',비:'톡톡',번개:'우르릉 쾅',바람:'휘이잉',파도:'철썩',바다:'철썩',불:'타닥타닥',드럼:'둥둥',피아노:'도레미',기타:'둥가둥가',유령:'우우~',고래:'푸우'};
const KIND_SOUNDS={walk:'(꼬리를 살랑)',fly:'파닥파닥',swim:'뻐끔뻐끔',flutter:'팔랑팔랑',sway:'살랑살랑',wobble:'말랑말랑',drive:'부릉부릉',sail:'출렁출렁',float:'두둥실',beat:'둥둥',wear:'반짝'};
const kindOf=emoji=>SHAPE_KIND[emoji]||'bob';
function formSound(){const f=state.xp>=FORM_AT&&state.words?.form;return f?SHAPE_SOUNDS[f.word]||KIND_SOUNDS[kindOf(f.emoji)]||'':''}
// Hats sit on top, glasses on the face, anything else at the side; a second item on the same spot shifts right.
const wearSlot=emoji=>/👒|🎩|🧢|👑|⛑|🪖|🎓/u.test(emoji)?'top':/👓|🕶|🥽/u.test(emoji)?'eyes':'side';
function wearSpot(emoji,shift){const s=wearSlot(emoji);return {x:(s==='side'?372:250)+(shift?64:0),y:s==='top'?60:s==='eyes'?165:252,size:s==='top'?110:s==='eyes'?120:90}}
// Returns the new form, 'revert', or null. Call before render().
function takeShape(text){
 normalizeWords(state);if(state.xp<FORM_AT)return null;
 if(REVERT.test(text)){if(!state.words.form)return null;state.words.form=null;return 'revert'}
 const f=shapeOf(text);if(!f)return null;
 const cur=state.words.form;
 if(cur&&kindOf(f.emoji)==='wear'&&kindOf(cur.emoji)!=='wear'){const wear=(cur.wear||[]).filter(x=>x.emoji!==f.emoji);wear.push({word:f.word,emoji:f.emoji});cur.wear=wear.slice(-2);return {...f,worn:true}}
 state.words.form={...f,at:Date.now(),wear:cur?.wear||[]};
 if(!state.words.forms.some(x=>x.word===f.word)){state.words.forms.unshift({...f,at:Date.now()});state.words.forms=state.words.forms.slice(0,300);state.fragments=(state.fragments||0)+1;notifyDiscovery('새로운 모습 · '+f.emoji+' '+f.word+' · 1조각')}
 return f;
}
function shapeSpeech(f){if(f==='revert')return ' 원래 모습으로 돌아왔어.';if(!f)return '';const sound=formSound();return f.worn?' '+josa('「'+f.word,'」을','」를')+' 걸쳐볼게! '+sound:' '+josa('「'+f.word,'」이','」가')+' 되어볼게! '+(sound?sound+'~':'')}
function setForm(word){normalizeWords(state);if(busy||activity)return false;if(word===null){state.words.form=null}else{const f=state.words.forms.find(x=>x.word===word);if(!f)return false;state.words.form={word:f.word,emoji:f.emoji,at:Date.now(),wear:state.words.form?.wear||[]}}render();speak(shapeSpeech(word===null?'revert':state.words.form).trim());return true}
let shownForm='';
function renderForm(){
 const f=state.xp>=FORM_AT?state.words.form:null,key=f?f.emoji:'';document.body.classList.toggle('has-form',!!f);document.body.dataset.formKind=f?kindOf(f.emoji):'';
 $('formWear').innerHTML=(f?.wear||[]).map((w,i,all)=>{const p=wearSpot(w.emoji,i>0&&wearSlot(all[0].emoji)===wearSlot(w.emoji));return '<text x="'+p.x+'" y="'+p.y+'" font-size="'+p.size+'" text-anchor="middle" dominant-baseline="central">'+w.emoji+'</text>'}).join('');
 if(key!==shownForm){shownForm=key;const g=$('formGlyph');g.textContent=key;g.classList.remove('form-in');void g.offsetWidth;if(key)g.classList.add('form-in')}
}
function normalizeWords(s){
 if(!s.words||typeof s.words!=='object'||Array.isArray(s.words))s.words={};const w=s.words;
 if(!Array.isArray(w.eaten))w.eaten=[];w.eaten=[...new Set(w.eaten.filter(t=>typeof t==='string'&&t.length<=24))].slice(-500);
 const okForm=f=>f&&typeof f.word==='string'&&f.word.length<=12&&typeof f.emoji==='string'&&f.emoji.length<=16;
 if(!okForm(w.form))w.form=null;else{if(!Array.isArray(w.form.wear))w.form.wear=[];w.form.wear=w.form.wear.filter(x=>okForm(x)&&kindOf(x.emoji)==='wear').map(x=>({word:x.word,emoji:x.emoji})).slice(-2)}if(!Array.isArray(w.forms))w.forms=[];w.forms=w.forms.filter(okForm).map(f=>({word:f.word,emoji:f.emoji,at:Number.isFinite(f.at)?f.at:0})).slice(0,300);
 if(!Array.isArray(w.phrases))w.phrases=[];w.phrases=w.phrases.filter(p=>p&&typeof p.text==='string'&&p.text.length<=24&&Number.isFinite(p.at)).map(p=>({text:p.text,at:p.at,eaten:!!p.eaten})).slice(0,60);
}
// ponytail: suffix-strip particle heuristic; dictionary words (고양이) are kept whole. Swap for a morpheme list if scraps read oddly.
function wordTokens(text){return String(text).replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).map(t=>{const known=stems(t).find(c=>Object.hasOwn(SHAPES,c));if(known)return known;const s=t.replace(PARTICLE,'');return s.length>=2?s:t}).filter(t=>t.length>=2&&t.length<=5)}
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
 const shape=takeShape(text);animate('eating');render();speak('「'+text+'」… 오물오물. '+wordFlavor(text)+(phrase?' 엮은 말이라 두 배로 든든해.':'')+shapeSpeech(shape));return true;
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
function renderWords(){normalizeWords(state);renderForm();renderWordSkin();renderWordField();$('wordBookButton').textContent='말 사전 · '+state.words.phrases.length}
function openWordBook(){
 normalizeWords(state);open('말 사전');const w=state.words,p=document.createElement('p');p.textContent='먹인 말에서 떨어진 조각을 다른 조각 위로 끌어 엮으면 새 구절이 생겨. 조각을 누르거나 페이지에게 끌어다 주면 먹어. 지금까지 먹은 조각 '+w.eaten.length+'개.';$('drawerContent').append(p);
 const list=document.createElement('ul');list.className='word-book';for(const ph of w.phrases){const li=document.createElement('li'),s=document.createElement('small');li.textContent='「'+ph.text+'」 ';s.textContent=new Date(ph.at).toLocaleDateString('ko-KR')+(ph.eaten?' · 먹음':' · 화면에 떠 있음');li.append(s);list.append(li)}
 if(!w.phrases.length){const li=document.createElement('li');li.textContent='아직 엮은 말이 없어. 떠다니는 조각 둘을 겹쳐봐.';list.append(li)}$('drawerContent').append(list);
 {const t=document.createElement('h3');t.textContent='변신 도감 · '+w.forms.length+' / '+Object.keys(SHAPES).length;const p=document.createElement('p');p.textContent=state.xp<FORM_AT?'살아 있는 페이지가 되면, 이름 있는 것을 말해줄 때마다 그 모습이 돼. 고양이, 기차, 해바라기처럼.':'이름 있는 것을 말해주면 그 모습이 돼. 한 번 된 모습은 여기서 다시 고를 수 있어.';const grid=document.createElement('div');grid.className='form-book';for(const f of w.forms){const b=button(f.emoji+' '+f.word,()=>{if(setForm(f.word))openWordBook()},grid);b.classList.toggle('active',w.form?.word===f.word)}$('drawerContent').append(t,p,grid);if(w.form)button('원래 모습으로 돌아가기',()=>{if(setForm(null))openWordBook()},$('drawerContent'))}
}
function initWords(){$('wordBookButton').onclick=openWordBook}
