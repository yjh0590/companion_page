'use strict';
// v0.7: local interpretation feedback, lasting food memory and a growth album.
const GAME_VERSION='0.7.0';
function foodKey(text){return 'word:'+text.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim().replace(/[.!?…。、！？]+$/u,'')}
function normalizeEvolution(s){
 if(!Array.isArray(s.eatenKeys))s.eatenKeys=[...new Set(s.history.map(h=>foodKey(h.text)))];
 s.eatenKeys=[...new Set(s.eatenKeys.filter(k=>typeof k==='string'&&k.startsWith('word:')&&k.length<=170))].slice(-5000);
 if(!s.wordOverrides||typeof s.wordOverrides!=='object'||Array.isArray(s.wordOverrides))s.wordOverrides={};
 for(const k of Object.keys(s.wordOverrides))if(!k.startsWith('word:')||k.length>170||!Object.hasOwn(EMOTIONS,s.wordOverrides[k]))delete s.wordOverrides[k];
 for(const k of Object.keys(s.wordOverrides).slice(0,-100))delete s.wordOverrides[k];
 if(!Array.isArray(s.growthJournal))s.growthJournal=[];
 s.growthJournal=s.growthJournal.filter(r=>r&&DIMENSION_STAGES.some(d=>d.id===r.stage)&&r.stage!=='blank'&&Number.isFinite(r.at)&&Number.isFinite(r.xp)&&Object.hasOwn(EMOTIONS,r.emotion)&&(!r.personality||Object.hasOwn(PERSONALITIES,r.personality))).slice(0,6);
 const current=dimensionStage(s.xp);if(current.id!=='blank'&&!s.growthJournal.some(r=>r.stage===current.id))s.growthJournal.push({stage:current.id,at:Date.now(),xp:s.xp,emotion:s.emotion,personality:s.personality||null});
}
function knowsFood(text){normalizeEvolution(state);return state.eatenKeys.includes(foodKey(text))}
function rememberFood(text){const key=foodKey(text);if(!state.eatenKeys.includes(key))state.eatenKeys.push(key);state.eatenKeys=state.eatenKeys.slice(-5000)}
function interpretFood(text){const context=analyzeWords(text);normalizeEvolution(state);const key=foodKey(text);if(Object.hasOwn(state.wordOverrides,key)){context.primary=state.wordOverrides[key];context.mix=null;context.learned=true}return context}
function evolveOutline(base,kind,xp){
 const t=clampRange((xp-14)/10,0,1);if(!t||!Object.hasOwn(PERSONALITIES,kind))return base;
 return base.map(([x,y],i)=>{const theta=Math.atan2((y-175)/125,(x-250)/170);let tx=x,ty=y;
 if(kind!=='cool'){const radius=kind==='playful'?1+.085*Math.sin(theta*3):kind==='curious'?1+.055*Math.cos(theta*2):1;const width={lively:168,playful:166,curious:150,shy:145,calm:158}[kind],height={lively:128,playful:126,curious:142,shy:112,calm:113}[kind];tx=250+Math.cos(theta)*width*radius;ty=175+Math.sin(theta)*height*radius}
 else{tx=250+(x-250)*1.045;ty=175+(y-175)*.92}
 return [x+(tx-x)*t,y+(ty-y)*t]});
}
function renderEvolution(){normalizeEvolution(state);$('correctFeeling').hidden=state.history.length===0;$('correctFeeling').textContent='이 느낌이 맞아?';$('albumButton').textContent='성장 기록 · '+state.growthJournal.length;
 $('versionLabel').textContent='v'+GAME_VERSION;
 const formNames={lively:'통통한',cool:'반듯한',calm:'부드러운',curious:'길쭉한',shy:'아담한',playful:'물결치는'};
 if(state.xp>=14&&state.personality)$('emotionTrait').textContent=PERSONALITIES[state.personality]+' 성격 · '+formNames[state.personality]+' 형태로 자라는 중';
}
function correctLastFeeling(key){
 if(!Object.hasOwn(EMOTIONS,key)||!state.history.length||busy||activity)return false;
 const latest=state.history[0];
 if(latest.grew===true&&latest.emotion!==key){if(Object.hasOwn(EMOTIONS,latest.emotion))state.feelings[latest.emotion]=Math.max(0,state.feelings[latest.emotion]-1);state.feelings[key]++}
 state.emotion=key;state.mix=null;state.contextVersion=1;latest.emotion=key;latest.mix=null;latest.corrected=true;
 const word=foodKey(latest.text);state.wordOverrides[word]=key;normalizeEvolution(state);render();speak('그 말은 '+EMOTIONS[key].label+'으로 기억할게. 같은 표현을 다시 만나면 이 느낌으로 받을게.');return true;
}
function openFeelingFeedback(){if(busy||activity||!state.history.length)return;open('이 말은 어떤 느낌이었어?');const quote=document.createElement('p');quote.textContent='“'+state.history[0].text+'”';$('drawerContent').append(quote);const choices=document.createElement('div');choices.className='collection';$('drawerContent').append(choices);for(const[k,e]of Object.entries(EMOTIONS)){const b=button(e.icon+' '+e.label,()=>{if(correctLastFeeling(k))$('drawer').close()},choices);b.classList.toggle('active',k===state.emotion)}const p=document.createElement('p');p.textContent='페이지의 해석만 바꿔. 성장이나 조각 보상은 추가되지 않아. 고친 표현은 이 브라우저에서 기억해.';$('drawerContent').append(p)}
function miniShape(record){const color=EMOTIONS[record.emotion].color;const stage=record.stage;let drawing='';if(stage==='blank')return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160"></svg>';
 if(stage==='point')drawing='<circle cx="110" cy="76" r="4" fill="#596149"/>';
 else if(stage==='line')drawing='<path d="M50 76Q110 66 170 76" fill="none" stroke="#596149" stroke-width="2"/>';
 else if(stage==='outline')drawing='<path d="M50 106L50 45Q110 25 170 45L170 106" fill="none" stroke="#596149" stroke-width="2"/>';
 else{const face=stage==='life'||stage==='volume';if(stage==='volume')drawing+='<path d="M54 43L69 29L183 35L173 117L161 129L49 123Z" fill="'+shadeColor(color,.82)+'" stroke="#869278" stroke-width="1"/>';
 drawing+='<rect x="48" y="40" width="116" height="83" rx="'+(record.personality==='cool'?7:28)+'" fill="'+color+'" stroke="#869278" stroke-width="1.5"/>';
 if(face)drawing+='<circle cx="80" cy="70" r="4" fill="#596149"/><circle cx="132" cy="70" r="4" fill="#596149"/><path d="M92 99Q107 114 122 99" fill="none" stroke="#596149" stroke-width="2"/>';}
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160" aria-hidden="true">'+drawing+'</svg>';
}
function openGrowthAlbum(){open('한 점에서 여기까지');const text=document.createElement('p');text.textContent='형태가 바뀐 순간의 감정과 성격을 남겨뒀어. 이전 버전에서 가져온 기록은 가져온 시점부터 남아.';$('drawerContent').append(text);const grid=document.createElement('div');grid.className='growth-album';$('drawerContent').append(grid);for(const stage of DIMENSION_STAGES.filter(s=>s.id!=='blank')){const entry=state.growthJournal.find(r=>r.stage===stage.id),card=document.createElement('div');card.className='growth-card'+(entry?' recorded':'');const art=document.createElement('div');art.className='growth-mini';if(entry)art.innerHTML=miniShape(entry);else art.textContent='·';const h=document.createElement('strong');h.textContent=stage.name;const p=document.createElement('p');p.textContent=entry?new Date(entry.at).toLocaleDateString('ko-KR')+' · '+EMOTIONS[entry.emotion].label:'아직 만나지 못한 모습';card.append(art,h,p);grid.append(card)}
 button('현재 모습의 성장 카드 SVG 내려받기',downloadGrowthCard,$('drawerContent'));
}
function xmlText(text){return text.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]))}
function downloadGrowthCard(){const record={stage:dimensionStage(state.xp).id,emotion:state.emotion,personality:state.personality},art=miniShape(record).replace(/^<svg[^>]*>|<\/svg>$/g,'');const svg='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="720" viewBox="0 0 600 720"><rect width="600" height="720" rx="28" fill="#f8f9f2"/><text x="300" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#9da88b">한 점에서 여기까지</text><g transform="translate(80 140) scale(2)">'+art+'</g><text x="300" y="540" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#596149">'+xmlText(state.name)+'</text><text x="300" y="580" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#8b9879">'+xmlText(dimensionStage(state.xp).name+' · '+EMOTIONS[state.emotion].label)+'</text><text x="300" y="635" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#a5ad99">'+state.xp+'개의 새로운 말로 자란 페이지</text></svg>';const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),a=document.createElement('a');a.href=url;a.download='my-page-growth.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function initEvolution(){ $('correctFeeling').onclick=openFeelingFeedback;$('albumButton').onclick=openGrowthAlbum;$('dimensionTag').onclick=openGrowthAlbum; }

function backupBeforeChange(){try{localStorage.setItem(KEY+'-before-import',JSON.stringify(state))}catch(e){/* Saving may be unavailable; playing and importing still work. */}}
