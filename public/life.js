'use strict';
// A fictional life for a living page. No real-time aging or absence penalties.
Object.assign(EMOTIONS,{
 anxious:{label:'불안함',color:'#e2e8f3',icon:'…',reply:'조금 긴장돼. 천천히 주변을 살펴볼게.',motion:'curious',eyes:'<ellipse cx="148" cy="129" rx="7" ry="16" fill="currentColor"/><ellipse cx="345" cy="129" rx="7" ry="16" fill="currentColor"/><path d="M130 101L167 113M326 113L363 101"/>',mouth:'M222 247Q234 237 246 247T270 247'},
 hopeful:{label:'희망',color:'#f3f1cf',icon:'↗',reply:'아직 모르지만, 다음 장이 기대돼. 한 걸음 가볼래.',motion:'lively',eyes:'<path d="M127 134Q148 103 169 134M324 134Q345 103 366 134"/>',mouth:'M216 239Q248 269 280 239'},
 proud:{label:'뿌듯함',color:'#efdfbd',icon:'✧',reply:'내가 해냈어. 오늘의 흔적은 오래 남겨둘래.',motion:'cool',eyes:'<path d="M125 130Q148 143 171 130M322 130Q345 143 368 130"/>',mouth:'M220 239Q248 256 280 236'},
 grateful:{label:'고마움',color:'#f6e1d8',icon:'♡',reply:'고마운 마음이 화면을 따뜻하게 채웠어.',motion:'calm',eyes:'<path d="M127 136Q148 111 169 136M324 136Q345 111 366 136"/>',mouth:'M211 237Q248 272 285 237'},
 bored:{label:'권태',color:'#e7e6dc',icon:'—',reply:'조금 심심해. 다른 풍경이나 새로운 일을 만나볼까?',motion:'cool',eyes:'<path d="M124 128L172 128M321 128L369 128M148 129L148 141M345 129L345 141"/>',mouth:'M227 244L269 244'},
 regret:{label:'후회',color:'#e4dfed',icon:'↶',reply:'아쉬운 선택도 있었지. 다음에는 다른 길을 가볼 수 있어.',motion:'sad',eyes:'<path d="M129 130Q147 146 167 131M327 131Q345 146 365 130"/>',mouth:'M219 252Q248 232 277 252'},
 awkward:{label:'어색함',color:'#f0e0e5',icon:'〰',reply:'조금 민망해서 눈을 피했어. 금방 익숙해질 거야.',motion:'shy',eyes:'<ellipse cx="137" cy="132" rx="7" ry="14" fill="currentColor"/><ellipse cx="334" cy="132" rx="7" ry="14" fill="currentColor"/>',mouth:'M226 244Q248 237 270 244'},
 lonely:{label:'그리움',color:'#dfe9f0',icon:'·',reply:'보고 싶은 마음이 남았어. 예전의 흔적을 바라보고 있어.',motion:'sad',eyes:'<ellipse cx="143" cy="135" rx="7" ry="13" fill="currentColor"/><ellipse cx="340" cy="135" rx="7" ry="13" fill="currentColor"/>',mouth:'M224 246Q248 239 272 246'}
});
FEELING_RULES.unshift(['regret',/후회|아쉬워|아쉽|미련/],['awkward',/민망|어색|창피|당황/],['bored',/심심|지루|권태|무료해/],['lonely',/그리워|그립|보고\s*싶|외로/],['anxious',/불안|걱정|두려|무서|초조|긴장/],['proud',/뿌듯|자랑스럽|성취감/],['grateful',/고마|감사/],['hopeful',/희망|기대돼|기대되|할\s*수\s*있|해보고\s*싶/]);
const LIFE_STATS={knowledge:'이해력',creativity:'상상력',social:'친화력',stamina:'활력'};
const HOBBIES={art:{label:'그림',stat:'creativity',icon:'✎'},reading:{label:'독서',stat:'knowledge',icon:'▤'},walking:{label:'산책',stat:'stamina',icon:'♧'},chat:{label:'친구 만나기',stat:'social',icon:'♡'}};
const JOBS={
 artist:{name:'그림 작가',icon:'✎',requires:{creativity:30},income:6,stat:'creativity',description:'상상을 색과 형태로 남기는 일.'},
 researcher:{name:'별 연구원',icon:'✦',requires:{knowledge:35},income:7,stat:'knowledge',description:'밤하늘의 질문을 하나씩 풀어내는 일.'},
 gardener:{name:'정원사',icon:'♧',requires:{stamina:25,creativity:20},income:5,stat:'stamina',description:'작은 싹을 돌보며 풍경을 만드는 일.'},
 explorer:{name:'탐험가',icon:'↗',requires:{stamina:35,knowledge:20},income:7,stat:'stamina',description:'새로운 공간을 찾고 지도를 그리는 일.'},
 storyteller:{name:'이야기꾼',icon:'▤',requires:{creativity:25,social:25},income:6,stat:'social',description:'말을 모아 다른 페이지에게 들려주는 일.'},
 cook:{name:'말 요리사',icon:'♨',requires:{creativity:25,stamina:25},income:6,stat:'creativity',description:'여러 맛의 말을 섞어 새로운 먹이를 만드는 일.'},
 maker:{name:'조각 기술자',icon:'⚙',requires:{knowledge:30,creativity:25},income:8,stat:'knowledge',description:'선과 면을 연결해 움직이는 물건을 만드는 일.'},
 companion:{name:'마음 돌보미',icon:'♡',requires:{social:35},income:5,stat:'social',description:'다른 페이지의 말을 듣고 곁을 지키는 일.'}
};
const lifeChoice=(text,effects,emotion,result)=>({text,effects,emotion,result});
const LIFE_EVENTS=[
 {id:'firstFriend',min:0,max:5,title:'처음 만난 작은 점',text:'옆 화면의 작은 점이 너를 바라본다. 어떻게 인사할까?',choices:[lifeChoice('먼저 다가가 인사하기',{social:5},'grateful','작은 점과 처음으로 인사를 나눴다.'),lifeChoice('함께 그림을 그려보기',{creativity:5,social:2},'playful','선 하나를 같이 그리며 친해졌다.'),lifeChoice('멀리서 천천히 관찰하기',{knowledge:5},'curious','점이 움직이는 방식을 알게 됐다.')]},
 {id:'paint',min:0,max:5,title:'세 가지 색',text:'빈 면 옆에 색 조각들이 떨어졌다. 어떤 놀이를 해볼까?',choices:[lifeChoice('마음대로 섞어보기',{creativity:6},'playful','새로운 색을 직접 만들어냈다.'),lifeChoice('색의 이름을 알아보기',{knowledge:5},'curious','각 색에 작은 이름을 붙였다.'),lifeChoice('친구에게 하나 나눠주기',{social:5},'grateful','색을 나누자 옆 화면도 밝아졌다.')]},
 {id:'littleSound',min:0,max:5,title:'낯선 소리',text:'화면 바깥에서 작은 소리가 들린다.',choices:[lifeChoice('어디서 나는지 찾아보기',{knowledge:4,stamina:2},'curious','소리의 주인을 조심스럽게 찾아냈다.'),lifeChoice('옆에서 잠깐 기다리기',{stamina:4},'calm','서두르지 않고 새로운 소리에 익숙해졌다.'),lifeChoice('친구와 함께 들어보기',{social:4},'hopeful','낯선 것을 함께 경험했다.')]},
 {id:'school',min:6,max:12,title:'페이지 학교의 첫 수업',text:'선으로 길을 만드는 수업이 시작됐다.',choices:[lifeChoice('원리를 차근차근 배우기',{knowledge:6},'proud','길이 이어지는 원리를 이해했다.'),lifeChoice('새로운 모양을 제안하기',{creativity:6},'hopeful','아무도 만들지 않은 길을 제안했다.'),lifeChoice('친구의 길을 도와주기',{social:5,knowledge:2},'grateful','함께 더 긴 길을 완성했다.')]},
 {id:'presentation',min:6,max:17,title:'앞에 나가 말하는 날',text:'내가 만든 것을 친구들에게 보여줄 차례다.',choices:[lifeChoice('준비한 대로 발표하기',{social:5,knowledge:3},'proud','조금 떨렸지만 끝까지 발표했다.'),lifeChoice('그림으로 먼저 설명하기',{creativity:5,social:2},'hopeful','말보다 그림으로 생각을 전했다.'),lifeChoice('친구와 함께 발표하기',{social:6},'grateful','서로 빈 부분을 채우며 발표했다.')]},
 {id:'friendConflict',min:6,max:17,title:'친구와 엇갈린 마음',text:'같이 만들던 장식을 두고 의견이 달라졌다.',choices:[lifeChoice('서로 원하는 것을 듣기',{social:6},'calm','말을 듣고 함께 쓸 새 모양을 찾았다.'),lifeChoice('각자 하나씩 만들어 비교하기',{creativity:5,knowledge:2},'curious','서로 다른 두 결과를 보며 이해했다.'),lifeChoice('잠깐 쉬었다 이야기하기',{stamina:4,social:2},'calm','마음을 가라앉힌 뒤 다시 만났다.')]},
 {id:'festival',min:6,max:17,title:'작은 축제',text:'페이지 마을에서 축제를 준비한다.',choices:[lifeChoice('무대 장식 만들기',{creativity:6},'playful','축제에 내가 만든 무늬가 걸렸다.'),lifeChoice('준비를 도와 뛰어다니기',{stamina:5,social:2},'lively','부지런히 움직여 준비를 마쳤다.'),lifeChoice('친구들을 초대하기',{social:6},'grateful','여러 페이지가 모여 즐거운 시간을 보냈다.')]},
 {id:'future',min:13,max:17,title:'어떤 페이지가 되고 싶을까?',text:'아직 정답은 없다. 올해는 무엇을 더 알아볼까?',choices:[lifeChoice('궁금한 것을 깊이 공부하기',{knowledge:7},'curious','질문 하나를 오래 붙잡아 보았다.'),lifeChoice('새로운 작품을 만들어보기',{creativity:7},'hopeful','내 방식의 표현을 찾기 시작했다.'),lifeChoice('낯선 곳을 다녀오기',{stamina:6,social:2},'hopeful','직접 경험하며 다음 길을 떠올렸다.')]},
 {id:'failedWork',min:13,max:59,title:'뜻대로 되지 않은 작업',text:'열심히 만든 결과가 생각과 달랐다.',choices:[lifeChoice('어디서 꼬였는지 살펴보기',{knowledge:6},'curious','실패한 흔적에서 다음 방법을 찾았다.'),lifeChoice('새로운 방식으로 다시 만들기',{creativity:6},'hopeful','다른 모양을 시도하며 다시 시작했다.'),lifeChoice('오늘은 쉬고 내일 보기',{stamina:6},'calm','잠깐 멈추는 선택으로 기운을 되찾았다.')]},
 {id:'team',min:18,max:59,title:'함께할 프로젝트',text:'다른 페이지가 함께 새 공간을 만들자고 제안한다.',choices:[lifeChoice('설계와 계획 맡기',{knowledge:6},'proud','복잡한 공간에 뼈대를 세웠다.'),lifeChoice('색과 이야기를 맡기',{creativity:6},'playful','공간에 개성을 더했다.'),lifeChoice('팀의 의견을 조율하기',{social:6},'grateful','서로의 생각을 연결했다.')]},
 {id:'newHobby',min:18,max:99,title:'일 밖의 작은 즐거움',text:'여유가 생겼다. 무엇을 해보고 싶을까?',choices:[lifeChoice('새로운 그림을 그리기',{creativity:5,stamina:2},'hopeful','일과 다른 나만의 즐거움을 찾았다.'),lifeChoice('책 속의 세계 만나기',{knowledge:5},'curious','낯선 이야기가 새 질문을 남겼다.'),lifeChoice('친구와 산책하기',{social:4,stamina:4},'grateful','함께 걷는 시간이 오래 기억에 남았다.')]},
 {id:'busyYear',min:18,max:59,title:'너무 바빴던 한 해',text:'하고 싶은 일과 해야 할 일이 겹쳤다.',choices:[lifeChoice('일의 순서를 다시 정하기',{knowledge:5,stamina:2},'calm','내 속도로 할 수 있는 계획을 세웠다.'),lifeChoice('도움을 부탁하기',{social:6},'grateful','혼자 들던 부담을 나눴다.'),lifeChoice('일부를 미루고 쉬기',{stamina:8},'calm','쉬는 시간도 내 삶의 일부로 남겼다.')]},
 {id:'recognition',min:18,max:99,title:'누군가 알아봐 준 날',text:'예전에 만든 작은 작품을 누군가 기억하고 있었다.',choices:[lifeChoice('고마운 마음을 전하기',{social:5},'grateful','칭찬해 준 페이지에게 마음을 전했다.'),lifeChoice('새로운 목표를 세우기',{knowledge:3,creativity:4},'hopeful','지난 성취를 다음 시도의 발판으로 삼았다.'),lifeChoice('조용히 기념하기',{stamina:4},'proud','작은 성취를 내 마음에 오래 남겼다.')]},
 {id:'reunion',min:18,max:120,title:'오랜 친구와 다시 만남',text:'한동안 못 본 페이지가 문을 두드린다.',choices:[lifeChoice('추억을 함께 이야기하기',{social:6},'grateful','잊고 있던 따뜻한 말들이 돌아왔다.'),lifeChoice('새로운 모습 보여주기',{creativity:4,social:2},'proud','서로 자란 모습을 반갑게 바라봤다.'),lifeChoice('조용히 함께 머물기',{stamina:4,social:2},'calm','말이 적어도 편안한 사이가 됐다.')]},
 {id:'teach',min:60,max:120,title:'경험을 나누는 시간',text:'어린 페이지가 어떻게 자랐는지 물어본다.',choices:[lifeChoice('실수했던 이야기도 들려주기',{social:6},'grateful','잘된 일과 어려운 일을 함께 나눴다.'),lifeChoice('같이 새로운 것을 만들기',{creativity:5},'playful','나이와 상관없이 새 작품이 생겼다.'),lifeChoice('스스로 찾을 질문 남기기',{knowledge:5},'curious','답 대신 작은 질문을 건넸다.')]},
 {id:'memoryWalk',min:60,max:120,title:'처음의 흔적을 따라',text:'처음 점이었던 날을 떠올리며 옛 공간을 걷는다.',choices:[lifeChoice('남아 있는 기록 정리하기',{knowledge:4},'proud','흩어진 추억을 하나의 이야기로 묶었다.'),lifeChoice('다시 그 장소를 그리기',{creativity:5},'lonely','그리운 풍경에 오늘의 색을 더했다.'),lifeChoice('친구와 함께 걸어보기',{social:4,stamina:3},'grateful','오래된 기억을 다시 함께 나눴다.')]},
 {id:'neverTooLate',min:60,max:120,title:'아직 해보지 않은 일',text:'마음 한쪽에 남아 있던 취미가 생각난다.',choices:[lifeChoice('작게라도 시작해보기',{creativity:5,stamina:2},'hopeful','새로운 시작은 지금도 가능했다.'),lifeChoice('천천히 알아보기',{knowledge:5},'curious','낯선 분야의 첫 페이지를 펼쳤다.'),lifeChoice('함께할 친구 찾기',{social:5},'grateful','새로운 즐거움을 나눌 친구가 생겼다.')]},
 {id:'rain',min:0,max:120,title:'비 오는 화면',text:'화면 가장자리에 물방울이 맺힌다.',choices:[lifeChoice('빗소리를 들으며 쉬기',{stamina:5},'calm','잔잔한 소리에 잠깐 머물렀다.'),lifeChoice('물방울 무늬 그리기',{creativity:5},'playful','비도 새로운 그림의 재료가 됐다.'),lifeChoice('왜 비가 오는지 알아보기',{knowledge:5},'curious','날씨에 관한 작은 지식을 얻었다.')]},
 {id:'lostPiece',min:0,max:120,title:'길을 잃은 조각',text:'익숙하지 않은 조각 하나가 찾아왔다.',choices:[lifeChoice('집을 찾아주기',{social:5},'grateful','길 잃은 조각이 제자리를 찾았다.'),lifeChoice('새 친구가 되어주기',{social:4,creativity:2},'lively','뜻밖의 만남이 새로운 놀이로 이어졌다.'),lifeChoice('어디서 왔는지 물어보기',{knowledge:5},'curious','조각이 지나온 공간의 이야기를 들었다.')]},
 {id:'quietDay',min:0,max:120,title:'아무 일 없는 날',text:'큰 사건은 없다. 이 시간을 어떻게 보낼까?',choices:[lifeChoice('좋아하는 것을 연습하기',{creativity:4,knowledge:2},'calm','작은 연습도 조금씩 쌓였다.'),lifeChoice('친구에게 안부 건네기',{social:5},'grateful','평범한 하루에 다정한 말이 남았다.'),lifeChoice('몸을 움직이며 돌아보기',{stamina:5},'lively','새로운 바람을 맞으며 기운을 얻었다.')]} 
];
function lifeAge(s=state){return Math.min(120,Math.floor(s.xp/3)+(s.life?.turns||0))}
function lifeStage(age){return age<6?'유년기':age<13?'배움기':age<18?'탐색기':age<60?'독립기':'여유기'}
function normalizeLife(s){
 if(!s.life||typeof s.life!=='object'||Array.isArray(s.life))s.life={};const l=s.life;
 if(!Number.isInteger(l.turns)||l.turns<0)l.turns=0;l.turns=Math.min(10000,l.turns);
 if(!l.stats||typeof l.stats!=='object')l.stats={};for(const k of Object.keys(LIFE_STATS)){if(!Number.isFinite(l.stats[k]))l.stats[k]=12;l.stats[k]=clampRange(l.stats[k],0,100)}
 if(!Object.hasOwn(JOBS,l.job))l.job=null;if(!Object.hasOwn(HOBBIES,l.hobby))l.hobby='art';
 for(const k of ['jobYears','jobXp'])if(!Number.isFinite(l[k])||l[k]<0)l[k]=0;
 if(!Array.isArray(l.log))l.log=[];l.log=l.log.filter(r=>r&&typeof r.text==='string'&&r.text.length<400&&Number.isFinite(r.age)).slice(0,60);
 if(!Array.isArray(l.seen))l.seen=[];l.seen=[...new Set(l.seen.filter(id=>LIFE_EVENTS.some(e=>e.id===id)))];
 if(typeof l.lastEmotionFromEvent!=='boolean')l.lastEmotionFromEvent=false;
 if(!Number.isFinite(l.trainedTurn))l.trainedTurn=-1;
 const eligible=LIFE_EVENTS.filter(e=>lifeAge(s)>=e.min&&lifeAge(s)<=e.max);
 if(!eligible.some(e=>e.id===l.eventId)){const fresh=eligible.filter(e=>!l.seen.includes(e.id));const pool=fresh.length?fresh:eligible;l.eventId=pool[l.turns%pool.length].id}
}
function jobLevel(){return state.life.jobXp>=25?'거장':state.life.jobXp>=12?'전문':state.life.jobXp>=5?'숙련':'신입'}
function lifeOccupation(){const l=state.life;return l.job?jobLevel()+' '+JOBS[l.job].name:lifeAge()<6?'작은 탐험가':lifeAge()<18?'페이지 학생':'자유로운 페이지'}
function renderLife(){normalizeLife(state);const age=lifeAge(),l=state.life;const show=state.xp>=14;
 $('lifeHUD').classList.toggle('visible',show);$('lifeHUD').inert=!show;
 $('lifeAge').textContent=age+'세'+(age===120?'+':'');$('lifePeriod').textContent=lifeStage(age);$('lifeJob').textContent=lifeOccupation();
 $('lifeHobby').textContent=HOBBIES[l.hobby].icon+' '+HOBBIES[l.hobby].label;
 $('lifeButton').textContent='내 인생 · '+age+'세';
 $('lifeEventTitle').textContent=LIFE_EVENTS.find(e=>e.id===l.eventId).title;
 for(const[k,label]of Object.entries(LIFE_STATS)){$('life-'+k).value=l.stats[k];$('life-'+k+'-text').textContent=Math.round(l.stats[k])}
 $('lifeAccessory').innerHTML='';if(show&&l.job){const color='#7a8669';const art={artist:'<path d="M391 216L425 246M419 240L430 244L426 255Z" stroke="'+color+'" stroke-width="5" fill="#d7bc8e"/>',researcher:'<g fill="none" stroke="'+color+'" stroke-width="3"><rect x="116" y="104" width="64" height="49" rx="15"/><rect x="313" y="104" width="64" height="49" rx="15"/><path d="M180 127L313 127"/></g>',gardener:'<path d="M194 61Q250 3 306 61L328 69L174 69Z" fill="#c9d8a8" stroke="'+color+'" stroke-width="2"/>',explorer:'<circle cx="374" cy="247" r="18" fill="#f3ecd4" stroke="'+color+'"/><path d="M374 233L383 253L365 253Z" fill="'+color+'"/>',storyteller:'<path d="M391 175L425 175L425 195L403 195L395 204L397 195L391 195Z" fill="#e5dfef" stroke="'+color+'"/>',cook:'<path d="M215 61L215 36Q190 9 219 7Q232 -15 250 4Q280 -17 289 15Q311 33 285 40L285 61Z" fill="#faf9ed" stroke="'+color+'" stroke-width="2"/>',maker:'<text x="388" y="209" font-size="35" fill="'+color+'">⚙</text>',companion:'<text x="382" y="212" font-size="35" fill="#bf9596">♡</text>'};$('lifeAccessory').innerHTML=art[l.job];}
 if(l.lastEmotionFromEvent)$('correctFeeling').hidden=true;
 document.body.dataset.life=show?'active':'hidden';
}
function skillTags(effects){return Object.entries(effects).map(([k,v])=>LIFE_STATS[k]+' +'+v).join(' · ')}
function chooseLifeEvent(id,index){if(busy||activity||state.xp<14)return false;normalizeLife(state);const l=state.life;if(l.eventId!==id)return false;const e=LIFE_EVENTS.find(e=>e.id===id),c=e?.choices[index];if(!c)return false;
 const age=lifeAge();for(const[k,v]of Object.entries(c.effects))l.stats[k]=clampRange(l.stats[k]+v,0,100);
 l.stats[HOBBIES[l.hobby].stat]=clampRange(l.stats[HOBBIES[l.hobby].stat]+1,0,100);
 let reward=2;if(l.job){l.jobYears++;l.jobXp++;reward=JOBS[l.job].income+(l.jobXp>=12?2:l.jobXp>=5?1:0);l.stats[JOBS[l.job].stat]=clampRange(l.stats[JOBS[l.job].stat]+1,0,100)}
 state.fragments+=reward;l.turns++;l.log.unshift({age,text:e.title+' — '+c.result+' · '+reward+'조각'});l.log=l.log.slice(0,60);if(!l.seen.includes(e.id))l.seen.push(e.id);l.eventId=null;
 state.emotion=c.emotion;state.mix=null;state.situation={failedWork:'setback',friendConflict:'reconcile',reunion:'reconcile',school:'beginning',future:'beginning',neverTooLate:'beginning',busyYear:'rest',recognition:'success',quietDay:'rest'}[e.id]||null;l.lastEmotionFromEvent=true;state.contextVersion=1;state.feelings[c.emotion]++;state.joy=clamp(state.joy+4);if(c.effects.stamina)state.energy=clamp(state.energy+5);
 render();speak(c.result+' 한 해가 지나 '+lifeAge()+'세가 됐어.');return true;
}
function jobAvailable(key){normalizeLife(state);const j=JOBS[key];return !!j&&lifeAge()>=18&&Object.entries(j.requires).every(([k,v])=>state.life.stats[k]>=v)}
function takeJob(key){if(busy||activity||!jobAvailable(key))return false;const l=state.life;if(l.job===key)return false;l.job=key;l.jobYears=0;l.jobXp=0;l.log.unshift({age:lifeAge(),text:JOBS[key].name+'의 길을 시작했다.'});l.log=l.log.slice(0,60);render();speak(JOBS[key].name+'이 됐어. 다음 한 해부터 경험과 조각이 쌓여.');return true}
function practiceHobby(){normalizeLife(state);const l=state.life;if(busy||activity||state.xp<14||l.trainedTurn===l.turns)return false;l.trainedTurn=l.turns;l.stats[HOBBIES[l.hobby].stat]=clampRange(l.stats[HOBBIES[l.hobby].stat]+3,0,100);state.joy=clamp(state.joy+3);render();speak(HOBBIES[l.hobby].label+'를 즐겼어. 다음 한 해에 또 해보자.');return true}
function openLife(){if(busy||activity||state.xp<14)return;normalizeLife(state);open('내 페이지의 인생');const l=state.life,summary=document.createElement('p');summary.textContent=lifeAge()+'세 · '+lifeStage(lifeAge())+' · '+lifeOccupation()+' · 취미 '+HOBBIES[l.hobby].label;$('drawerContent').append(summary);
 const note=document.createElement('p');note.textContent='새로운 말 3개 또는 아래의 한 해 선택 1번마다 1살 자라. 접속하지 않는 동안 나이는 늘지 않아.';$('drawerContent').append(note);const skills=document.createElement('div');skills.className='life-quick-stats';for(const[k,label]of Object.entries(LIFE_STATS)){const badge=document.createElement('span');badge.textContent=label+' '+Math.round(l.stats[k])+'/100';skills.append(badge)}$('drawerContent').append(skills);
 const e=LIFE_EVENTS.find(e=>e.id===l.eventId),card=document.createElement('section');card.className='life-event';const h=document.createElement('h3');h.textContent=e.title;const p=document.createElement('p');p.textContent=e.text;card.append(h,p);for(let i=0;i<e.choices.length;i++){const c=e.choices[i],b=button(c.text+'\n'+skillTags(c.effects),()=>{if(chooseLifeEvent(e.id,i))openLife()},card);b.className='life-choice'}$('drawerContent').append(card);
 const hobbies=document.createElement('div');hobbies.className='hobby-list';$('drawerContent').append(hobbies);for(const[k,v]of Object.entries(HOBBIES)){const b=button(v.icon+' '+v.label,()=>{l.hobby=k;render();openLife()},hobbies);b.classList.toggle('active',l.hobby===k)}const practice=button(l.trainedTurn===l.turns?'올해의 취미 활동 완료':'취미 즐기기 · '+LIFE_STATS[HOBBIES[l.hobby].stat]+' +3',()=>{if(practiceHobby())openLife()},$('drawerContent'));practice.disabled=l.trainedTurn===l.turns;
 button('직업과 다음 길 보기',openCareers,$('drawerContent'));if(l.log.length){const title=document.createElement('h3');title.textContent='살아온 이야기';$('drawerContent').append(title);const list=document.createElement('ul');list.className='life-log';for(const row of l.log.slice(0,12)){const li=document.createElement('li');li.textContent=row.age+'세 · '+row.text;list.append(li)}$('drawerContent').append(list)}
}
function openCareers(){if(busy||activity)return;open('어떤 일을 해볼까?');const p=document.createElement('p');p.textContent=lifeAge()<18?'18세부터 직업을 선택할 수 있어. 지금은 좋아하는 것과 능력을 키워보자.':'원하는 직업을 선택해. 이직하면 새 직업의 경험은 처음부터 쌓이고, 능력은 유지돼.';$('drawerContent').append(p);const grid=document.createElement('div');grid.className='career-grid';$('drawerContent').append(grid);
 for(const[k,j]of Object.entries(JOBS)){const box=document.createElement('div');box.className='career-card';const h=document.createElement('strong');h.textContent=j.icon+' '+j.name;const desc=document.createElement('p');desc.textContent=j.description;const req=document.createElement('p');req.textContent=Object.entries(j.requires).map(([s,v])=>LIFE_STATS[s]+' '+Math.round(state.life.stats[s])+'/'+v).join(' · ');const b=button(state.life.job===k?'현재 직업':jobAvailable(k)?'이 길 시작하기':'아직 준비 중',()=>{if(takeJob(k))openLife()},box);b.disabled=!jobAvailable(k)||state.life.job===k;box.prepend?.(h,desc,req);if(!box.prepend){box.append(h,desc,req)}grid.append(box)}
 if(state.life.job)button('일을 내려놓고 자유롭게 지내기',()=>{const old=state.life.job;state.life.job=null;state.life.jobXp=0;state.life.jobYears=0;state.life.log.unshift({age:lifeAge(),text:JOBS[old].name+'의 일을 내려놓고 새로운 여유를 선택했다.'});render();openLife()},$('drawerContent'));
 button('내 인생으로 돌아가기',openLife,$('drawerContent'));
}
function initLife(){ $('lifeButton').onclick=openLife;$('lifeNext').onclick=openLife;SAMPLE_MENUS.push([['조금 불안해','새로운 일이 걱정되고 불안해'],['다음이 기대돼','다음에는 해보고 싶어, 희망이 생겨'],['스스로 뿌듯해','오늘 해낸 일이 뿌듯해'],['고마운 하루','함께 있어줘서 고마워'],['심심한 오후','오늘은 조금 심심해'],['아쉬운 선택','아까 선택이 후회돼'],['민망한 순간','오늘은 좀 어색하고 민망했어'],['오래된 친구','오랜 친구가 보고 싶고 그리워']]);}

function nourishLife(type,emotion){normalizeLife(state);const key={warm:'social',dream:'creativity',sea:'stamina',nature:'stamina',calm:'stamina'}[type]||(['curious','proud'].includes(emotion)?'knowledge':['grateful','lively'].includes(emotion)?'social':'creativity');state.life.stats[key]=clampRange(state.life.stats[key]+1,0,100)}
