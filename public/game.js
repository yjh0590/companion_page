'use strict';
const $=id=>document.getElementById(id), KEY='page-pet-blank-v2';
const TYPES={warm:{label:'다정함',color:'#ffe5cf',icon:'♡',name:'마음이 몽글몽글한 페이지',desc:'다정한 말이 쌓여 볼에 온기가 생겼어.',words:/고마|감사|사랑|좋아|잘했|괜찮|응원|행복/},dream:{label:'상상',color:'#e6ddff',icon:'✦',name:'별을 꿈꾸는 페이지',desc:'엉뚱한 상상을 먹고 별을 피웠어.',words:/별(?!로)|우주|달빛|달나라|밤하늘|꿈|상상|마법|하늘/},sea:{label:'바다',color:'#d5eef7',icon:'≈',name:'물결을 품은 페이지',desc:'파란 풍경을 먹고 작은 파도가 생겼어.',words:/바다|물결|물방울|파랑|파란|푸른|비가|비오는|비\s*와|빗|강물|파도/},nature:{label:'자연',color:'#e1efcf',icon:'♧',name:'새싹이 돋은 페이지',desc:'초록 이야기를 먹고 머리에 싹이 났어.',words:/나무|숲|초록|풀|꽃|새싹|봄|정원/},calm:{label:'차분함',color:'#eee5db',icon:'☾',name:'곁에서 쉬는 페이지',desc:'힘든 날의 말도 소중하게 먹었어. 같이 잠깐 쉬자.',words:/힘들|슬프|슬퍼|피곤|지쳐|외로|불안|쉬|잠/}};
function fresh(){return {version:1,name:'이름 없는 페이지',born:Date.now(),last:Date.now(),xp:0,hunger:65,joy:60,energy:80,counts:Object.fromEntries(Object.keys(TYPES).map(k=>[k,0])),history:[],unlocked:[],wear:[],sleeping:false,plays:0}}
let state=fresh(),busy=false,game=null,lastCare=0;
function valid(s){return s&&s.version===1&&typeof s.name==='string'&&s.name.length<=24&&Number.isFinite(s.xp)&&s.xp>=0&&s.xp<100000&&['born','last','hunger','joy','energy','plays'].every(k=>Number.isFinite(s[k]))&&s.counts&&Object.keys(TYPES).every(k=>Number.isFinite(s.counts[k])&&s.counts[k]>=0)&&Array.isArray(s.unlocked)&&s.unlocked.every(k=>k in TYPES)&&Array.isArray(s.wear)&&s.wear.every(k=>s.unlocked.includes(k))&&Array.isArray(s.history)&&s.history.length<=30&&s.history.every(h=>typeof h.text==='string'&&h.text.length<=160&&Number.isFinite(h.at)&& (h.type==='plain'||h.type in TYPES))&&typeof s.sleeping==='boolean'}
try{const saved=JSON.parse(localStorage.getItem(KEY));if(valid(saved))state=saved}catch(e){}
const clamp=n=>Math.max(0,Math.min(100,n));
function tick(){const now=Date.now(),hours=Math.max(0,Math.min(12,(now-state.last)/3600000));state.hunger=clamp(state.hunger-hours*2);state.joy=clamp(state.joy-hours);state.energy=clamp(state.energy+hours*(state.sleeping?6:0));state.last=now}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('saveStatus').textContent='이 브라우저에 자동 저장 · 계정 연결 준비 중'}catch(e){$('saveStatus').textContent='자동 저장 불가 · 보관함에서 저장 파일을 내려받아줘'}}
function speak(t){$('speech').textContent=t}
function dominant(){return Object.keys(TYPES).sort((a,b)=>state.counts[b]-state.counts[a])[0]}
function render(){tick();normalizeLife(state);const lv=1+Math.floor(state.xp/3),type=dominant(),grown=state.xp>0;
$('nameLabel').textContent=state.name;$('level').textContent='Lv. '+lv;$('stage').textContent=lv<2?'갓 태어남':lv<4?'말랑한 어린 페이지':lv<7?'취향이 생긴 페이지':'나만의 반려 페이지';$('growthBar').style.width=(state.xp%3)/3*100+'%';$('growthText').textContent='다음 성장까지 '+(3-state.xp%3)+'번의 새로운 말';
for(const k of ['hunger','joy','energy']){$(k).value=state[k];$(k+'Text').textContent=Math.round(state[k])+' / 100'}
$('days').textContent='함께한 '+(1+Math.max(0,Math.floor((Date.now()-state.born)/86400000)))+'일';$('body').style.fill=grown&&state.counts[type]?TYPES[type].color:'#fff';$('habitat').style.background=grown&&state.counts[type]?TYPES[type].color+'88':'#eceee3';
$('eyes').innerHTML=state.sleeping?'<path d="M125 133Q147 151 169 133M321 133Q343 151 365 133"/>':!grown?'<path d="M128 103L164 151M164 103L128 151M325 103L361 151M361 103L325 151"/>':state.wear.includes('calm')?'<path d="M127 130Q147 113 167 130M323 130Q343 113 363 130"/>':state.wear.includes('dream')?'<path d="M148 105L155 120L173 125L155 131L148 148L141 131L124 125L141 120ZM345 105L352 120L370 125L352 131L345 148L338 131L321 125L338 120Z"/>':'<ellipse cx="148" cy="128" rx="10" ry="18" fill="#252820"/><ellipse cx="345" cy="128" rx="10" ry="18" fill="#252820"/>';
$('mouth').setAttribute('d',!grown?'M103 210L396 216L396 270L99 275Z':state.sleeping?'M225 241Q248 248 271 241':state.hunger<25?'M211 251Q247 225 283 251':'M166 224Q248 292 332 224');
$('cheeks').innerHTML=state.wear.includes('warm')?'<ellipse cx="105" cy="183" rx="26" ry="13" fill="#efa6a0" stroke="none"/><ellipse cx="390" cy="183" rx="26" ry="13" fill="#efa6a0" stroke="none"/>':'';
$('decor').innerHTML=(state.wear.includes('nature')?'<path d="M251 31Q246 5 265 -8M254 15Q215 17 222 -8Q250 -11 254 15M256 5Q286 12 288 -16Q261 -21 256 5" fill="#9dbc69" stroke="#252820" stroke-width="5"/>':'')+(state.wear.includes('sea')?'<path d="M68 302Q95 285 122 302T176 302T230 302T284 302T338 302T392 302T446 302" stroke="#77b9d0" fill="none" stroke-width="8"/>':'');
$('mood').textContent=state.sleeping?'呼… 잠깐 꿈꾸는 중'.replace('呼','후'):!grown?'조금 낯설어하는 중':state.hunger<25?'말 한 입이 생각나는 중':'네가 와서 반가운 중';$('sleep').textContent=state.sleeping?'☀ 깨우기':'☾ 쉬게 하기';$('traitTitle').textContent=state.counts[type]?TYPES[type].name:'아직 모든 것이 궁금해';$('traitDesc').textContent=state.counts[type]?TYPES[type].desc:'먹인 말에 따라 색과 표정, 장식이 달라져.';$('flavors').replaceChildren();for(const [k,t]of Object.entries(TYPES)){if(state.counts[k]){const s=document.createElement('span');s.textContent=t.icon+' '+t.label+' '+state.counts[k];$('flavors').append(s)}}$('collectionCount').textContent=state.unlocked.length+' / 5';$('history').replaceChildren();
for(const h of state.history.slice(0,3)){const li=document.createElement('li'),sm=document.createElement('small');sm.textContent=new Date(h.at).toLocaleDateString('ko-KR')+' · '+(Object.hasOwn(MIXES,h.mix)?MIXES[h.mix].label:EMOTIONS[h.emotion||feelingOf(h.text)]?.label||'담담함')+' · '+(TYPES[h.type]?.label||'새로운 맛');li.append(sm,document.createTextNode('“'+h.text+'”'));$('history').append(li)}if(!state.history.length){const li=document.createElement('li');li.textContent='아직 먹은 말이 없어. 첫 추억을 만들어줘.';$('history').append(li)}renderPage();renderFeeling();renderUpgrade();renderDimension();renderEvolution();renderLife();save()}
function burst(icon){for(let i=0;i<7;i++){const el=document.createElement('span');el.className='particle';el.textContent=icon;el.style.setProperty('--x',(Math.random()*240-120)+'px');el.style.left=(35+Math.random()*30)+'%';$('particles').append(el);setTimeout(()=>el.remove(),1300)}}
function animate(cls){$('pet').classList.remove('happy','eating');void $('pet').offsetWidth;$('pet').classList.add(cls);setTimeout(()=>$('pet').classList.remove(cls),1300)}
function syncFeedControls(){
 const locked=busy||!!activity;
 $('feedForm').querySelector('button').disabled=locked;
 $('food').disabled=!!activity;
 $('feedForm').setAttribute('aria-busy',busy?'true':'false');
}
function feedingError(error,text){
 console.error('Page pet feeding failed:',error);
 if(!$('food').value.trim())$('food').value=text;
 speak('말을 처리하다 잠깐 멈췄어. 다시 보내줘. 저장된 성장은 유지돼.');
}
$('feedForm').addEventListener('submit',e=>{
 e.preventDefault();
 // Korean IME confirmation must finish before Enter sends the sentence.
 if($('food').dataset.composing==='true'||busy||game||activity)return;
 const text=$('food').value.trim();
 if(!text){speak('빈 접시야! 먹고 싶은 말을 적어줘.');return}
 if(state.sleeping){speak('지금은 쉬는 중이야. 깨운 다음 먹여줘.');return}
 let context,emotion,type,repeat;
 try{
  context=interpretFood(text);emotion=context.primary;
  const matches=Object.keys(TYPES).filter(k=>TYPES[k].words.test(text)&&!(k==='warm'&&['cool','angry'].includes(emotion)));
  type=matches.sort((a,b)=>state.counts[a]-state.counts[b])[0]||'plain';repeat=knowsFood(text);
 }catch(error){feedingError(error,text);return}
 busy=true;syncFeedControls();
 // Clear only the submitted text now, so typing the next sentence is never wiped later.
 $('food').value='';
 animate('eating');speak('냠냠… 이 말은 어떤 맛일까?');
 setTimeout(()=>{
  const before=JSON.parse(JSON.stringify(state));
  try{
   tick();normalizeFeelings(state);normalizeLife(state);state.life.lastEmotionFromEvent=false;
   state.emotion=emotion;state.mix=context.mix;state.situation=context.situation;state.contextVersion=1;
   if(!repeat)state.feelings[emotion]++;
   state.hunger=clamp(state.hunger+15);state.joy=clamp(state.joy+5);
   if(!repeat){state.xp++;rememberFood(text);nourishLife(type,emotion);if(type!=='plain'){state.counts[type]++;if(!state.unlocked.includes(type)){state.unlocked.push(type);state.wear.push(type)}}}
   state.history.unshift({text,type,emotion,mix:context.mix,situation:context.situation,grew:!repeat,at:Date.now()});state.history=state.history.slice(0,30);
   render();burst(EMOTIONS[emotion].icon);
   speak(contextualReply()+(repeat?' 익숙한 맛이네.':[1,3,6,9,11,12,14,24].includes(state.xp)?' '+growthSpeech(type):''));
  }catch(error){state=before;save();feedingError(error,text)}
  finally{busy=false;syncFeedControls()}
 },850);
});
$('food').addEventListener('compositionstart',()=>{$('food').dataset.composing='true'});
$('food').addEventListener('compositionend',()=>{$('food').dataset.composing='false'});
document.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{$('food').value=b.dataset.word;$('food').focus()});
function stroke(){if(busy||game||activity||state.xp<1)return;if(state.sleeping){speak('잠든 얼굴이 편안해 보여.');return}if(Date.now()-lastCare<2000)return;lastCare=Date.now();state.joy=clamp(state.joy+6);animate('happy');burst('♡');speak(state.emotion==='cool'?'…싫지는 않아. 한 번만 더.':state.emotion==='sad'?'조용히 쓰다듬어줘서 고마워.':'간질간질해. 손길이 따뜻하네!');render()}
$('pet').onclick=()=>{if(activity)return;if(game){game.hits++;animate('happy');burst('✧');speak('잡았다! '+game.hits+' / 5');if(game.hits>=5)finishPlay(true)}else stroke()};$('stroke').onclick=stroke;
function finishPlay(won){clearTimeout(game.timer);game=null;$('pet').style.transform='';$('pet').style.position='';$('pet').style.left='';$('pet').style.top='';$('play').textContent='✧ 놀아주기';if(won){state.plays++;state.joy=clamp(state.joy+20);state.energy=clamp(state.energy-8);speak('다섯 번이나 찾았어! 같이 놀아서 신나.')}else speak('조금만 놀아도 좋아. 다음에 또 하자.');render()}
$('play').onclick=()=>{if(busy||state.xp<8)return;if(game){finishPlay(false);return}if(state.sleeping){speak('먼저 깨워줘. 꿈속에서 놀고 있어.');return}if(state.energy<10){speak('조금 쉬고 나서 놀자.');return}game={hits:0,timer:setTimeout(()=>finishPlay(false),20000)};$('play').textContent='놀이 그만';speak('나를 다섯 번 잡아봐! 20초 동안 숨바꼭질.');const move=()=>{if(!game)return;$('pet').style.position='relative';$('pet').style.left=(Math.random()*20-10)+'%';$('pet').style.top=(Math.random()*50-25)+'px';setTimeout(move,1000)};move()};
$('sleep').onclick=()=>{if(busy||game||activity)return;tick();state.sleeping=!state.sleeping;speak(state.sleeping?'잠깐 눈을 감을게. 쉬는 동안 기운이 돌아와.':'잘 잤어! 다시 만나서 좋아.');render()};
function open(title){$('drawerTitle').textContent=title;$('drawerContent').replaceChildren();$('drawer').showModal()}function button(text,fn,container){const b=document.createElement('button');b.textContent=text;b.onclick=fn;container.append(b);return b}
$('closeDialog').onclick=()=>$('drawer').close();$('closet').onclick=()=>{open('발견한 장식');const p=document.createElement('p');p.textContent='먹인 말에서 발견한 장식을 자유롭게 입혀줘.';$('drawerContent').append(p);const box=document.createElement('div');box.className='collection';$('drawerContent').append(box);for(const[k,t]of Object.entries(TYPES)){const unlocked=state.unlocked.includes(k),b=button(unlocked?t.icon+' '+t.label:'아직 발견하지 못했어',()=>{if(state.wear.includes(k))state.wear=state.wear.filter(x=>x!==k);else state.wear.push(k);b.classList.toggle('active',state.wear.includes(k));render()},box);b.disabled=!unlocked;b.classList.toggle('active',state.wear.includes(k))}};
$('settings').onclick=()=>{open('우리의 보관함');const box=document.createElement('div');box.className='dialog-actions';$('drawerContent').append(box);const input=document.createElement('input');input.className='rename';input.value=state.name;input.maxLength=24;input.setAttribute('aria-label','페이지 이름');box.append(input);button('이름 붙여주기',()=>{state.name=input.value.trim()||'이름 없는 페이지';render();$('drawer').close();speak('내 이름은 '+state.name+'! 기억할게.')},box);button('저장 파일 내려받기',()=>{tick();const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='page-pet-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},box);const file=document.createElement('input');file.type='file';file.accept='.json';file.hidden=true;box.append(file);button('저장 파일 불러오기',()=>file.click(),box);file.onchange=async()=>{try{if(file.files[0].size>5000000)throw Error();const s=JSON.parse(await file.files[0].text());if(!valid(s))throw Error();if(!confirm('현재 페이지 대신 저장 파일의 페이지를 불러올까?'))return;if(activity)stopActivity();backupBeforeChange();state=s;editing=false;render();$('drawer').close();speak('다시 만났네. 이어서 함께하자.')}catch(e){alert('이 게임의 올바른 저장 파일인지 확인해줘.')}};button('이전 버전에서 키운 기록 가져오기',()=>{try{const old=JSON.parse(localStorage.getItem('page-pet-v1'));if(!valid(old)){alert('이 브라우저에 이전 버전 기록이 없어.');return}if(!confirm('빈 화면 버전의 현재 기록 대신 이전 성장 기록을 가져올까?'))return;if(activity)stopActivity();backupBeforeChange();state=old;editing=false;render();$('drawer').close();speak('함께한 말들이 이 화면에 다시 피어났어.')}catch(e){alert('이전 기록을 불러올 수 없어.')}},box);button('불러오기·초기화 전 기록 복구',()=>{try{const old=JSON.parse(localStorage.getItem(KEY+'-before-import'));if(!valid(old)){alert('복구할 기록이 없어.');return}if(!confirm('현재 기록을 이전 기록과 바꿀까?'))return;if(activity)stopActivity();backupBeforeChange();state=old;editing=false;render();$('drawer').close();speak('이전의 작은 친구를 다시 만났어.')}catch(e){alert('복구할 기록을 읽지 못했어.')}},box);const p=document.createElement('p');p.textContent='감정과 풍경은 단어 규칙으로 반응해. 부정 표현이나 섞인 감정은 잘못 읽을 수 있어. 현재는 이 브라우저에 저장돼. 브라우저 데이터를 지우기 전 저장 파일을 보관해줘. 계정과 기기 간 이어하기는 다음 버전에서 연결할 예정이야. 말의 맛은 단어 규칙으로 분류하며, 대화 내용을 서버에 보내지 않아.';box.append(p);button('새 페이지로 다시 시작',()=>{if(confirm('지금 키운 페이지를 지우고 처음부터 시작할까? 저장 파일을 먼저 내려받을 수 있어.')){if(activity)stopActivity();backupBeforeChange();state=fresh();editing=false;render();$('drawer').close();speak('여기에 말을 놓아줘.')}},box)};
render();if(!state.history.length)speak('여기에 말을 놓아줘.');if(state.history.length)speak(state.sleeping?'잠깐 쉬고 있어. 다시 와줘서 고마워.':'다시 왔구나! 오늘은 무슨 말을 먹을까?');setInterval(()=>{if(!busy)render()},60000);

function growthSpeech(type){
const steps={1:'아무것도 없던 곳에 작은 점이 생겼어.',3:'그 점이 길어져 선이 됐어.',6:'선이 구부러져 윤곽을 만들기 시작했어.',9:'선이 닫혔어. 안쪽에 처음으로 색이 차오르고 있어.',11:'같은 면 위에 눈이 생겼어.',12:'입이 생겼어. 말마다 다른 표정을 지을 수 있어.',14:'이제 하나의 살아 있는 페이지가 됐어. 놀이와 꾸미기가 열렸어.',24:'처음의 면이 두께를 얻었어. 끌어서 여러 방향으로 돌려봐.'};
return steps[state.xp]||(TYPES[type]?TYPES[type].desc:'네 이야기가 이 화면의 한 조각이 됐어.');
}
function renderPage(){
const xp=state.xp,t=TYPES[dominant()],show=(id,on)=>{const el=$(id);el.classList.toggle('visible',on);el.inert=!on};
document.body.dataset.growth=Math.min(10,xp);document.body.classList.toggle('sleeping',state.sleeping);
show('identity',xp>=6);show('suggestions',xp>=2);show('changeSamples',xp>=2);show('careDock',xp>=8);show('memoryCorner',xp>=10);show('saveFooter',xp>=8);
$('pet').disabled=xp<3;
for(const[id,on]of [['firstDot',xp===1],['firstLine',xp===2],['eyes',xp>=3],['mouth',xp>=4],['cheeks',xp>=5],['decor',xp>=6]])$(id).style.opacity=on?1:0;
// The screen is the creature. There is no body shape or card around it.
$('pageTexture').style.opacity=xp>=5?Math.min(.85,.25+(xp-5)*.055):0;
$('pageTexture').style.background='radial-gradient(ellipse at 50% 45%, '+t.color+'99 0%, transparent 58%),linear-gradient(155deg,#fff 25%,'+t.color+'66 100%)';
$('feedNote').textContent=xp===0?'네가 건넨 말이 이 화면의 첫 조각이 돼.':xp<5?'새로운 말을 건넬 때마다 화면에 변화가 생겨.':'말의 취향이 쌓일수록 화면의 풍경도 달라져.';
$('food').placeholder=xp===0?'안녕':'오늘은 어떤 말을 놓아줄까?';
if(xp<8)$('statePanel').hidden=true;
$('world').replaceChildren();
if(xp>=6){const frame=document.createElement('div');frame.className='edge-line';$('world').append(frame)}
if(xp<6)return;
const enabled=k=>state.wear.includes(k),n=k=>Math.min(12,2+state.counts[k]*2);
if(enabled('dream'))for(let i=0;i<n('dream');i++){const e=document.createElement('span');e.className='world-star';e.textContent=i%3===0?'✦':'·';e.style.left=(9+(i*29)%84)+'%';e.style.top=(14+(i*17)%66)+'%';e.style.setProperty('--size',(10+(i%3)*6)+'px');e.style.animationDelay=i*.4+'s';$('world').append(e)}
if(enabled('nature'))for(let i=0;i<n('nature');i++){const e=document.createElement('span');e.className='world-leaf';e.style.left=(i%2===0?3+(i%4):90+(i%4))+'%';e.style.top=(25+(i*11)%55)+'%';e.style.setProperty('--angle',(i*37)+'deg');$('world').append(e)}
if(enabled('sea')){const e=document.createElementNS('http://www.w3.org/2000/svg','svg');e.setAttribute('viewBox','0 0 1200 100');e.setAttribute('preserveAspectRatio','none');e.classList.add('world-wave');e.innerHTML='<path d="M0 45Q150 0 300 45T600 45T900 45T1200 45V100H0Z" fill="#96cfe5"/><path d="M0 65Q150 20 300 65T600 65T900 65T1200 65" fill="none" stroke="#7cb8d0" stroke-width="2"/>';$('world').append(e)}
if(enabled('warm'))for(let i=0;i<Math.min(5,state.counts.warm);i++){const e=document.createElement('span');e.className='world-word';e.textContent=['다정','온기','함께','마음','반가워'][i];e.style.right=(8+i*3)+'%';e.style.top=(24+i*9)+'%';$('world').append(e)}
if(enabled('calm')){const e=document.createElement('span');e.className='world-star';e.textContent='☾';e.style.left='80%';e.style.top='15%';e.style.fontSize='35px';$('world').append(e)}
}
$('details').onclick=()=>{$('statePanel').hidden=!$('statePanel').hidden};

const SAMPLE_MENUS=[
 [['오늘은 최고!','오늘 기분이 좋아!'],['그냥 별로야','별로야, 좀 귀찮아'],['조금 외로운 날','오늘 조금 슬퍼'],['억울한 마음','억울해서 화가 나'],['잠깐 쉬고 싶어','피곤해, 잠깐 쉬자'],['별이 궁금해','별은 왜 빛날까?'],['두근두근','두근두근, 조금 설레'],['같이 놀자','나랑 장난치고 놀자']],
 [['드디어 해냈어','드디어 시험 잘 봤어, 해냈어!'],['다시 해볼까','실수했지만 다시 해보고 싶어'],['친구랑 다퉜어','친구랑 다퉜어, 조금 속상해'],['다시 친해졌어','서로 미안하다고 화해했어'],['첫 출근이야','첫 출근이라 기대되는데 무서워'],['오늘은 쉬자','오늘 피곤해서 잠깐 쉬고 싶어']],
 [['웃음과 하품','힘들었지만 해냈어, 행복해'],['다가갔다 멈칫','설레는데 조금 긴장돼'],['좋아하는데 서운해','좋아하는데 연락이 없어서 서운해'],['화나서 눈물이 나','억울해서 화가 나고 눈물이 나']]
];
let sampleMenu=0;
function sampleChoices(){const buttons=document.querySelectorAll('[data-word]'),menu=SAMPLE_MENUS[sampleMenu];buttons.forEach((b,i)=>{b.hidden=i>=menu.length;if(i<menu.length){b.textContent=menu[i][0];b.dataset.word=menu[i][1]}})}
$('changeSamples').onclick=()=>{sampleMenu=(sampleMenu+1)%SAMPLE_MENUS.length;sampleChoices()};sampleChoices();

initUpgrade();

initDimensions();

initEvolution();

initLife();
