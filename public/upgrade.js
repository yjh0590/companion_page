'use strict';
const ORNAMENTS={
 star:{name:'꿈의 별',glyph:'✦',type:'dream',cost:3,color:'#9c8fbe'},leaf:{name:'초록 잎',glyph:'❧',type:'nature',cost:3,color:'#8ea66c'},wave:{name:'작은 물결',glyph:'≈',type:'sea',cost:3,color:'#80adbf'},heart:{name:'온기 한 조각',glyph:'♡',type:'warm',cost:3,color:'#ca9d9c'},moon:{name:'쉬어가는 달',glyph:'☾',type:'calm',cost:3,color:'#a9a48b'}
};
const DISCOVERIES={
 line:{title:'점이 남긴 길',hint:'하나의 흔적이 양쪽으로 길어지면.',check:s=>s.xp>=3},plane:{title:'선 안의 새로운 공간',hint:'윤곽이 만나면 안쪽이 생겨.',check:s=>s.xp>=9},volume:{title:'면의 다른 쪽',hint:'오래 함께한 면은 두께를 얻어.',check:s=>s.xp>=24},first:{title:'첫 흔적',hint:'아무것도 없는 곳에 말을 놓으면…',check:s=>s.xp>=1},eyes:{title:'눈을 뜬 화면',hint:'작은 흔적은 다른 형태가 될지도.',check:s=>s.xp>=11},landscape:{title:'나만의 풍경',hint:'조금 더 함께하면 화면 밖으로 퍼질 거야.',check:s=>s.xp>=14},flavors:{title:'다섯 가지 맛',hint:'하늘, 숲, 물, 온기, 쉼.',check:s=>s.unlocked.length>=5},feelings:{title:'표정 수집가',hint:'늘 같은 기분일 필요는 없어.',check:s=>Object.keys(EMOTIONS).filter(k=>k!=='neutral'&&s.feelings[k]>0).length>=8},mixed:{title:'두 마음의 얼굴',hint:'웃으면서 하품할 수도 있지.',check:s=>s.seenMixes.length>=1},mixedAll:{title:'복잡해도 괜찮아',hint:'서로 다른 두 마음을 여러 번 만나봐.',check:s=>s.seenMixes.length>=4},play:{title:'함께한 작은 놀이',hint:'말을 먹이는 것 말고도 함께할 일이 있어.',check:s=>s.plays>=1},decorate:{title:'내 손으로 만든 자리',hint:'세 조각이 놓일 자리를 찾아봐.',check:s=>s.placements.length>=3},bond:{title:'오래된 작은 친구',hint:'서로 다른 이야기들이 오래 쌓이면.',check:s=>s.xp>=110}
};
let activity=null,editing=false,dragging=false,toastTimer=null,upgradeInitialized=false;
function normalizeUpgrade(s){
 if(!Number.isFinite(s.fragments)||s.fragments<0)s.fragments=0;
 if(!Number.isFinite(s.rewardedXp)||s.rewardedXp<0)s.rewardedXp=0;
 if(s.xp>s.rewardedXp){s.fragments+=Math.min(1000,(s.xp-s.rewardedXp)*2);s.rewardedXp=s.xp}
 if(!Array.isArray(s.placements))s.placements=[];
 s.placements=s.placements.filter(p=>p&&Object.hasOwn(ORNAMENTS,p.kind)&&Number.isInteger(p.id)&&p.id>=0&&Number.isFinite(p.x)&&Number.isFinite(p.y)).slice(0,12).map(p=>({...p,x:Math.max(4,Math.min(96,p.x)),y:Math.max(15,Math.min(75,p.y))}));
 if(!Number.isInteger(s.nextPlacement)||s.nextPlacement<0)s.nextPlacement=0;
 s.nextPlacement=Math.max(s.nextPlacement,...s.placements.map(p=>p.id+1));
 for(const field of ['discoveries','seenMixes','seenSituations'])if(!Array.isArray(s[field]))s[field]=[];
 s.discoveries=[...new Set(s.discoveries.filter(k=>Object.hasOwn(DISCOVERIES,k)))];
 s.seenMixes=[...new Set(s.seenMixes.filter(k=>Object.hasOwn(MIXES,k)))];s.seenSituations=[...new Set(s.seenSituations.filter(k=>Object.hasOwn(SITUATIONS,k)))];
 if(s.mix&&!s.seenMixes.includes(s.mix))s.seenMixes.push(s.mix);
 if(s.situation&&!s.seenSituations.includes(s.situation))s.seenSituations.push(s.situation);
}
function notifyDiscovery(message){$('discoveryToast').textContent=message;$('discoveryToast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('discoveryToast').classList.remove('show'),3500)}
function renderUpgrade(){
 normalizeUpgrade(state);
 const newly=[];for(const[k,d]of Object.entries(DISCOVERIES))if(!state.discoveries.includes(k)&&d.check(state)){state.discoveries.push(k);newly.push(d.title)}
 if(newly.length&&upgradeInitialized)notifyDiscovery('새로운 발견 · '+newly.join(' · '));
 $('fragments').textContent=state.fragments+' 조각';$('discoveryButton').textContent='발견 '+state.discoveries.length+' / '+Object.keys(DISCOVERIES).length;
 $('closet').textContent='조각 상자 · '+state.fragments;
 $('editButton').textContent=editing?'배치 마치기 ✓':'자리 바꾸기';
 $('editButton').hidden=state.placements.length===0;
 document.body.classList.toggle('editing',editing);
 if(!dragging)renderPlacements();
 if(!activity)$('play').textContent=activityLabel();else{$('pet').disabled=true;$('food').disabled=true;$('feedForm').querySelector('button').disabled=true;}
}
function activityLabel(){return {success:'✧ 기념 별 줍기',setback:'◇ 조각 모으기',conflict:'◇ 마음 정리',reconcile:'⌁ 다시 연결하기',beginning:'↗ 문 열어보기',rest:'☾ 함께 숨쉬기'}[state.situation]||'✧ 별 조각 줍기'}
function putOrnament(kind){normalizeUpgrade(state);const o=ORNAMENTS[kind];if(state.xp<14||!o||!state.unlocked.includes(o.type)||state.fragments<o.cost||state.placements.length>=12)return false;
 const index=state.placements.length;state.fragments-=o.cost;state.placements.push({id:state.nextPlacement++,kind,x:index%2?82:18,y:24+(index%4)*12});editing=true;render();speak(o.name+'을 놓았어. 끌거나 방향키로 자리를 바꿔줘.');return true}
function positionStamp(el,p){el.style.left=p.x+'%';el.style.top=p.y+'%'}
function moveStamp(p,x,y){p.x=Math.max(4,Math.min(96,x));p.y=Math.max(15,Math.min(75,y))}
function renderPlacements(){
 $('placedOrnaments').replaceChildren();
 for(const p of state.placements){const o=ORNAMENTS[p.kind],b=document.createElement('button');b.className='placed-ornament';b.textContent=o.glyph;b.style.color=o.color;b.dataset.placement=String(p.id);b.setAttribute('aria-label',o.name+(editing?' · 드래그 또는 방향키로 이동, Delete로 되돌리기':' · 만져보기'));positionStamp(b,p);$('placedOrnaments').append(b);
 b.onclick=()=>{if(editing||activity||busy)return;state.joy=clamp(state.joy+1);b.classList.remove('ornament-pop');void b.offsetWidth;b.classList.add('ornament-pop');speak({star:'반짝! 네 상상이 남긴 별이야.',leaf:'사각사각. 작은 잎이 손길에 흔들려.',wave:'찰랑. 화면에 바다 한 조각이 있어.',heart:'살짝 따뜻해졌어.',moon:'조용히 같이 쉬어볼까?'}[p.kind]);save()};
 b.addEventListener('pointerdown',e=>{if(!editing||activity||e.button!==0)return;e.preventDefault();dragging=true;b.setPointerCapture(e.pointerId);b.classList.add('dragging')});
 b.addEventListener('pointermove',e=>{if(!dragging||!b.hasPointerCapture(e.pointerId))return;const rect=$('habitat').getBoundingClientRect();moveStamp(p,(e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100);positionStamp(b,p)});
 const finish=e=>{if(!b.hasPointerCapture(e.pointerId))return;b.releasePointerCapture(e.pointerId);b.classList.remove('dragging');dragging=false;save()};b.addEventListener('pointerup',finish);b.addEventListener('pointercancel',finish);b.addEventListener('lostpointercapture',()=>{dragging=false;save()});
 b.addEventListener('keydown',e=>{if(!editing)return;const arrows={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(arrows[e.key]){e.preventDefault();const d=arrows[e.key],n=e.shiftKey?5:1;moveStamp(p,p.x+d[0]*n,p.y+d[1]*n);positionStamp(b,p);save()}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();state.placements=state.placements.filter(x=>x.id!==p.id);state.fragments+=1;render();speak('한 조각을 되돌려 받았어. 다른 자리에 다시 놓아도 좋아.')}});
 }
}
function openCraftBox(){
 if(state.xp<14)return;if(activity){speak('놀이를 마친 다음 조각을 놓아보자.');return}open('말이 남긴 조각들');const info=document.createElement('p');info.textContent=state.fragments+' 조각 · 새로운 말마다 2조각, 놀이를 마치면 3조각. 화면에는 최대 12개를 놓을 수 있어.';$('drawerContent').append(info);
 const grid=document.createElement('div');grid.className='collection';$('drawerContent').append(grid);
 for(const[k,o]of Object.entries(ORNAMENTS)){const unlocked=state.unlocked.includes(o.type);const b=button(unlocked?o.glyph+' '+o.name+' · '+o.cost+'조각':'아직 발견하지 못했어',()=>{if(putOrnament(k)){$('drawer').close()}},grid);b.disabled=!unlocked||state.fragments<o.cost||state.placements.length>=12}
 const title=document.createElement('p');title.textContent='화면의 풍경 켜기 / 끄기';$('drawerContent').append(title);const themes=document.createElement('div');themes.className='collection';$('drawerContent').append(themes);
 for(const[k,t]of Object.entries(TYPES)){if(!state.unlocked.includes(k))continue;const b=button(t.icon+' '+t.label,()=>{if(state.wear.includes(k))state.wear=state.wear.filter(x=>x!==k);else state.wear.push(k);b.classList.toggle('active',state.wear.includes(k));render()},themes);b.classList.toggle('active',state.wear.includes(k))}
 const p=document.createElement('p');p.textContent='놓은 조각은 「자리 바꾸기」에서 끌어 움직여. 키보드로는 조각을 선택한 뒤 방향키, 크게 움직일 땐 Shift+방향키. Delete로 돌려놓으면 1조각을 받아.';$('drawerContent').append(p);
}
function openDiscoveryBook(){open('우리가 발견한 것들');const grid=document.createElement('div');grid.className='discovery-grid';$('drawerContent').append(grid);for(const[k,d]of Object.entries(DISCOVERIES)){const row=document.createElement('div');row.className='discovery-row'+(state.discoveries.includes(k)?' found':'');const title=document.createElement('strong'),hint=document.createElement('p');title.textContent=state.discoveries.includes(k)?'✧ '+d.title:'아직 이름 없는 발견';hint.textContent=d.hint;row.append(title,hint);grid.append(row)}}
function stopActivity(message){activity=null;$('activityLayer').replaceChildren();$('activityLayer').hidden=true;$('activityBar').hidden=true;$('feedForm').querySelector('button').disabled=false;$('food').disabled=false;$('pet').disabled=state.xp<3;render();if(message)speak(message)}
function completeActivity(){if(!activity)return;state.plays++;state.fragments+=3;state.joy=clamp(state.joy+12);state.energy=clamp(state.energy+(activity.kind==='rest'?8:-4));burst('✧');stopActivity('같이 해냈어! 작은 조각 3개를 주웠어.');notifyDiscovery('함께한 놀이 · +3조각')}
function taskButton(text,cls,x,y,fn){const b=document.createElement('button');b.className='task-piece '+cls;b.textContent=text;b.style.left=x+'%';b.style.top=y+'%';b.onclick=fn;$('activityLayer').append(b);if($('activityLayer').children.length===1)b.focus();return b}
function updateTask(text){$('activityInstruction').textContent=text;}
function startActivity(){
 if(busy||state.xp<14)return;if(activity){stopActivity('짧게 쉬어가자. 다음에 이어서 놀아도 돼.');return}
 if(state.sleeping){speak('먼저 깨워줘. 꿈속에서 놀고 있어.');return}if(state.energy<5){speak('조금 쉬고 기운이 돌아오면 놀자.');return}
 editing=false;activity={kind:state.situation,hits:0,owner:state.born,lastBeat:0,selected:null};render();$('activityLayer').hidden=false;$('activityBar').hidden=false;$('food').disabled=true;$('feedForm').querySelector('button').disabled=true;$('pet').disabled=true;$('play').textContent='놀이 마치기';$('statePanel').hidden=true;
 const kind=activity.kind;
 if(kind==='rest'){
 updateTask('천천히 함께 숨쉬기 · 가운데 원을 3번, 2초 간격으로 눌러줘.');const b=taskButton('숨 쉬기','breath-orb',50,40,()=>{if(!activity)return;const now=Date.now();if(activity.lastBeat&&now-activity.lastBeat<2000){updateTask('조금만 천천히. 한 번의 숨이 지나가고 있어.');return}activity.lastBeat=now;activity.hits++;b.textContent='후… '+activity.hits+'/3';b.classList.remove('breathing');void b.offsetWidth;b.classList.add('breathing');updateTask('편하게 숨을 내쉬어. '+activity.hits+' / 3');if(activity.hits===3)completeActivity()});return;
 }
 if(kind==='beginning'){
 updateTask('처음의 문 · 마음에 드는 문 하나를 열어봐.');for(let i=0;i<3;i++)taskButton(['Ⅰ','Ⅱ','Ⅲ'][i],'little-door',32+i*18,38,()=>{if(!activity)return;completeActivity();speak(['문 뒤에서 작은 별빛을 찾았어.','문 뒤에는 초록 바람이 있었어.','문 뒤에서 잔잔한 물소리가 들렸어.'][i]+' +3조각')});return;
 }
 if(kind==='reconcile'){
 updateTask('다시 이어주기 · 떨어진 두 점을 차례로 눌러줘.');const nodes=[];for(let i=0;i<2;i++){const b=taskButton('·','connection-node',35+i*30,38,()=>{if(!activity||b.disabled)return;b.disabled=true;b.classList.add('selected');activity.hits++;if(activity.hits===2){completeActivity();speak('두 점 사이에 다시 길이 생겼어. +3조각')}else updateTask('첫 점을 찾았어. 이제 다른 점을 눌러 이어줘.')});nodes.push(b)}return;
 }
 if(kind==='setback'||kind==='conflict'){
 updateTask('조각 모으기 · 조각을 고르고 가운데 원에 놓아줘. 끌어 놓아도 좋아.');const target=taskButton('○','gather-target',50,42,()=>{if(activity?.selected)gather(activity.selected)});const gather=b=>{if(!activity||b.disabled)return;b.disabled=true;b.classList.add('gathered');activity.hits++;activity.selected=null;updateTask('조금씩 제자리를 찾는 중 · '+activity.hits+' / 3');if(activity.hits===3)completeActivity()};
 for(let i=0;i<3;i++){const b=taskButton('◇','gather-piece',25+i*25,25+(i%2)*30,()=>{if(!activity||b.disabled)return;if(activity.selected)activity.selected.classList.remove('chosen');activity.selected=b;b.classList.add('chosen');updateTask('조각을 골랐어. 가운데 원을 눌러 놓아줘.');});b.addEventListener('pointerdown',e=>{if(e.button!==0||b.disabled)return;b.setPointerCapture(e.pointerId)});b.addEventListener('pointermove',e=>{if(!b.hasPointerCapture(e.pointerId))return;const rect=$('habitat').getBoundingClientRect();b.style.left=(e.clientX-rect.left)/rect.width*100+'%';b.style.top=(e.clientY-rect.top)/rect.height*100+'%'});b.addEventListener('pointerup',e=>{if(!b.hasPointerCapture(e.pointerId))return;b.releasePointerCapture(e.pointerId);const r=target.getBoundingClientRect();if(e.clientX>=r.left-20&&e.clientX<=r.right+20&&e.clientY>=r.top-20&&e.clientY<=r.bottom+20)gather(b)});}
 return;
 }
 updateTask('별 조각 줍기 · 화면에 흩어진 반짝임 5개를 찾아줘.');for(let i=0;i<5;i++){const b=taskButton('✦','collect-star',15+(i*17)%75,22+(i%3)*15,()=>{if(!activity||b.disabled)return;b.disabled=true;b.classList.add('collected');activity.hits++;updateTask('반짝임을 모았어 · '+activity.hits+' / 5');if(activity.hits===5)completeActivity()})}
}
function initUpgrade(){
 upgradeInitialized=true;const originalSettings=$('settings').onclick;$('settings').onclick=()=>{if(busy){speak('말을 다 먹고 나서 보관함을 열어줘.');return}originalSettings()};$('closet').onclick=openCraftBox;$('play').onclick=startActivity;$('cancelActivity').onclick=()=>stopActivity('잠깐 쉬어가자.');$('editButton').onclick=()=>{if(activity)return;editing=!editing;render();speak(editing?'놓은 조각을 끌거나 방향키로 옮겨줘.':'각자의 자리가 생겼네. 화면에 기억해둘게.')};$('discoveryButton').onclick=openDiscoveryBook;
}
