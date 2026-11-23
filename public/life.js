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
const HOBBIES={art:{label:'그림',stat:'creativity',icon:'✎'},reading:{label:'독서',stat:'knowledge',icon:'▤'},walking:{label:'산책',stat:'stamina',icon:'♧'},chat:{label:'친구 만나기',stat:'social',icon:'♡'},singing:{label:'노래',stat:'creativity',icon:'♪'},puzzle:{label:'퍼즐',stat:'knowledge',icon:'▦'}};
const JOBS={
 artist:{name:'그림 작가',icon:'✎',requires:{creativity:30},income:6,stat:'creativity',description:'상상을 색과 형태로 남기는 일.'},
 researcher:{name:'별 연구원',icon:'✦',requires:{knowledge:35},income:7,stat:'knowledge',description:'밤하늘의 질문을 하나씩 풀어내는 일.'},
 gardener:{name:'정원사',icon:'♧',requires:{stamina:25,creativity:20},income:5,stat:'stamina',description:'작은 싹을 돌보며 풍경을 만드는 일.'},
 explorer:{name:'탐험가',icon:'↗',requires:{stamina:35,knowledge:20},income:7,stat:'stamina',description:'새로운 공간을 찾고 지도를 그리는 일.'},
 storyteller:{name:'이야기꾼',icon:'▤',requires:{creativity:25,social:25},income:6,stat:'social',description:'말을 모아 다른 페이지에게 들려주는 일.'},
 cook:{name:'말 요리사',icon:'♨',requires:{creativity:25,stamina:25},income:6,stat:'creativity',description:'여러 맛의 말을 섞어 새로운 먹이를 만드는 일.'},
 maker:{name:'조각 기술자',icon:'⚙',requires:{knowledge:30,creativity:25},income:8,stat:'knowledge',description:'선과 면을 연결해 움직이는 물건을 만드는 일.'},
 companion:{name:'마음 돌보미',icon:'♡',requires:{social:35},income:5,stat:'social',description:'다른 페이지의 말을 듣고 곁을 지키는 일.'},
 musician:{name:'음악가',icon:'♪',requires:{creativity:30,social:20},income:6,stat:'creativity',description:'말의 리듬을 모아 노래로 들려주는 일.'},
 courier:{name:'편지 배달부',icon:'✉',requires:{stamina:30,social:25},income:6,stat:'stamina',description:'화면과 화면 사이로 마음을 실어 나르는 일.'}
};
const lifeChoice=(text,effects,emotion,result,need)=>({text,effects,emotion,result,need});
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
const lifeEvent=(id,min,max,title,text,choices,extra={})=>({id,min,max,title,text,choices,...extra});
LIFE_EVENTS.push(
 lifeEvent('firstWord',0,5,'처음 만든 말','받아먹던 말을 섞어 나만의 첫 단어를 만들었다.',[lifeChoice('크게 말해보기',{social:4,stamina:2},'proud','처음 만든 말이 화면 끝까지 울렸다.'),lifeChoice('뜻을 하나 더 붙이기',{creativity:5},'playful','한 단어에 두 가지 뜻이 생겼다.'),lifeChoice('소리를 천천히 따라 하기',{knowledge:5},'curious','말이 소리로 바뀌는 순서를 알게 됐다.')],{situation:'beginning'}),
 lifeEvent('shadow',0,5,'그림자 놀이','화면 아래에 내 모양을 닮은 그림자가 생겼다.',[lifeChoice('그림자와 술래잡기',{stamina:6},'lively','그림자보다 빨리 달려보려 애썼다.'),lifeChoice('그림자로 동물 만들기',{creativity:6},'playful','그림자가 토끼도 되고 새도 됐다.'),lifeChoice('왜 따라오는지 살펴보기',{knowledge:5},'curious','빛이 있는 쪽 반대에 그림자가 생긴다는 걸 알았다.')]),
 lifeEvent('library',6,12,'도서관의 오래된 책','먼지 쌓인 책 한 권이 저절로 펼쳐졌다.',[lifeChoice('끝까지 읽어보기',{knowledge:7},'curious','옛 페이지들이 남긴 이야기를 알게 됐다.'),lifeChoice('뒷이야기를 상상하기',{creativity:6},'hopeful','끝나지 않은 이야기에 결말을 지어줬다.'),lifeChoice('친구에게 읽어주기',{social:5,knowledge:2},'grateful','같은 책을 읽은 친구가 생겼다.')]),
 lifeEvent('race',6,12,'달리기 시합','운동장 화면에서 첫 달리기 시합이 열렸다.',[lifeChoice('처음부터 전력으로 달리기',{stamina:7},'lively','숨이 차도록 달려 결승선을 지났다.'),lifeChoice('넘어진 친구 일으키기',{social:6},'grateful','순위보다 오래 남는 장면을 만들었다.'),lifeChoice('빠른 길을 계산해보기',{knowledge:4,stamina:2},'proud','곡선 대신 안쪽 길로 달리는 법을 찾았다.')]),
 lifeEvent('newKid',6,17,'새로 온 페이지','다른 화면에서 이사 온 페이지가 혼자 앉아 있다.',[lifeChoice('옆자리에 앉기',{social:6},'awkward','처음엔 어색했지만 금세 웃음이 났다.'),lifeChoice('우리 동네 지도 그려주기',{creativity:4,social:2},'grateful','손으로 그린 지도가 첫 선물이 됐다.'),lifeChoice('예전 화면 이야기 듣기',{knowledge:4,social:2},'curious','먼 곳의 풍경을 귀로 여행했다.')]),
 lifeEvent('band',13,17,'노래 동아리','친구들이 함께 노래할 페이지를 찾고 있다.',[lifeChoice('목소리를 맡기',{social:5,creativity:2},'lively','처음으로 여럿 앞에서 노래했다.'),lifeChoice('가사를 써보기',{creativity:6},'hopeful','내 말이 노래 속에 들어갔다.'),lifeChoice('박자를 맞춰주기',{knowledge:3,stamina:3},'calm','흩어진 소리를 하나로 묶었다.')]),
 lifeEvent('nightSky',13,17,'혼자 본 밤하늘','처음으로 늦게까지 깨어 밤하늘을 올려다봤다.',[lifeChoice('별자리 이름 찾기',{knowledge:6},'curious','어둠 속에서 아는 모양을 찾아냈다.'),lifeChoice('새 별자리 지어보기',{creativity:6},'hopeful','하늘에 나만 아는 그림을 그렸다.'),lifeChoice('조용히 오래 바라보기',{stamina:4},'lonely','멀리 있는 것들이 괜히 그리워졌다.')]),
 lifeEvent('partTime',13,17,'처음 해본 일','조각 가게에서 잠깐 일을 도와달라고 한다.',[lifeChoice('손님 맞이하기',{social:6},'awkward','떨리는 인사가 조금씩 자연스러워졌다.'),lifeChoice('조각 정리하기',{knowledge:4,stamina:3},'proud','어지럽던 진열대가 깔끔해졌다.'),lifeChoice('가게 간판 꾸미기',{creativity:6},'playful','간판을 보고 손님이 더 찾아왔다.')]),
 lifeEvent('move',18,59,'새 화면으로 이사','오래 살던 화면을 떠나 넓은 곳으로 옮기게 됐다.',[lifeChoice('새 이웃에게 인사하기',{social:6},'hopeful','낯선 곳에서도 아는 얼굴이 생겼다.'),lifeChoice('공간을 내 식으로 꾸미기',{creativity:6},'proud','빈 화면이 금세 내 집이 됐다.'),lifeChoice('예전 화면에 들러보기',{stamina:3,social:2},'lonely','떠난 자리에도 내 흔적이 남아 있었다.')],{situation:'beginning'}),
 lifeEvent('mentor',18,59,'처음 생긴 후배','막 독립한 페이지가 조언을 구한다.',[lifeChoice('내가 배운 순서대로 알려주기',{knowledge:5,social:2},'proud','설명하면서 나도 다시 배웠다.'),lifeChoice('직접 해보게 두고 지켜보기',{social:4,stamina:2},'calm','실수해도 괜찮다고 말해줬다.'),lifeChoice('함께 새 방법을 찾기',{creativity:5},'curious','둘 다 몰랐던 길을 찾아냈다.')]),
 lifeEvent('burnout',18,59,'지친 마음','좋아하던 일도 오늘은 조금 무겁게 느껴진다.',[lifeChoice('며칠 푹 쉬기',{stamina:8},'calm','멈춘 시간 덕분에 다시 움직일 힘이 생겼다.'),lifeChoice('마음을 털어놓기',{social:6},'grateful','이야기를 들어준 친구가 곁에 있었다.'),lifeChoice('하던 일을 다르게 해보기',{creativity:5},'bored','익숙한 일에 작은 변화를 줬다.')],{situation:'rest'}),
 lifeEvent('travel',18,99,'먼 화면 여행','지도 끝에 있는 화면으로 떠날 기회가 생겼다.',[lifeChoice('계획 없이 떠나기',{stamina:5,creativity:2},'lively','예상 못 한 풍경을 잔뜩 만났다.'),lifeChoice('그곳의 역사를 알아보기',{knowledge:6},'curious','낯선 화면이 만들어진 이유를 알게 됐다.'),lifeChoice('현지 페이지와 친해지기',{social:6},'grateful','다른 말투를 쓰는 친구가 생겼다.')]),
 lifeEvent('garden',60,120,'작은 정원','창가에 남는 자리가 생겨 씨앗을 심었다.',[lifeChoice('매일 물 주기',{stamina:5},'calm','하루하루 자라는 싹을 지켜봤다.'),lifeChoice('꽃 색을 섞어 심기',{creativity:5},'playful','정원이 작은 그림이 됐다.'),lifeChoice('이웃과 씨앗 나누기',{social:5},'grateful','동네 곳곳에 같은 꽃이 피었다.')]),
 lifeEvent('letter',60,120,'오래된 편지','서랍 속에서 아주 예전에 받은 편지를 찾았다.',[lifeChoice('답장을 써보기',{social:5,creativity:2},'lonely','늦었지만 하고 싶던 말을 적었다.'),lifeChoice('편지를 모아 책으로 엮기',{knowledge:4,creativity:3},'proud','흩어진 말들이 한 권의 기록이 됐다.'),lifeChoice('그때 하지 못한 일 떠올리기',{knowledge:4},'regret','아쉬움도 내가 지나온 길의 일부였다.')]),
 lifeEvent('elderFestival',60,120,'마을 어른의 축제','이번 축제의 첫 인사를 맡아달라는 부탁을 받았다.',[lifeChoice('지난 이야기로 인사하기',{social:6},'proud','오랜 기억에 모두가 귀를 기울였다.'),lifeChoice('어린 페이지에게 순서 넘기기',{social:4,knowledge:2},'hopeful','새 목소리가 축제를 열었다.'),lifeChoice('춤으로 시작하기',{stamina:5,creativity:2},'playful','나이와 상관없이 가장 신나게 움직였다.')],{situation:'success'}),
 lifeEvent('lateLesson',60,120,'뒤늦은 배움','늘 궁금했던 분야의 수업이 열렸다.',[lifeChoice('맨 앞자리에 앉기',{knowledge:6},'curious','새 질문이 매일 생겼다.'),lifeChoice('배운 것을 작품으로 만들기',{creativity:5},'hopeful','배움이 곧장 새 작품이 됐다.'),lifeChoice('같은 반 친구 사귀기',{social:5},'grateful','나이가 다른 친구들과 함께 배웠다.')],{situation:'beginning'}),
 lifeEvent('stormNight',0,120,'번개 치는 밤','화면이 번쩍이고 큰 소리가 울린다.',[lifeChoice('이불 속에서 기다리기',{stamina:4},'anxious','무서웠지만 아침은 다시 찾아왔다.'),lifeChoice('번개 모양 따라 그리기',{creativity:5},'curious','하늘에 그어진 선을 그림으로 남겼다.'),lifeChoice('친구와 함께 있기',{social:5},'grateful','둘이 있으니 천둥도 덜 무서웠다.')]),
 // Job events appear only while the page holds that job.
 lifeEvent('artistGallery',18,120,'첫 전시회','내 그림만 걸린 작은 전시실이 열렸다.',[lifeChoice('관람객과 이야기하기',{social:5},'awkward','내 그림을 설명하는 게 생각보다 쑥스러웠다.'),lifeChoice('새 연작 준비하기',{creativity:7},'hopeful','다음 전시의 첫 그림을 시작했다.'),lifeChoice('그림마다 설명 쓰기',{knowledge:5},'proud','그림에 담은 생각을 말로도 남겼다.')],{job:'artist',situation:'success'}),
 lifeEvent('researcherComet',18,120,'처음 보는 혜성','관측 기록에 없던 빛이 지나간다.',[lifeChoice('궤도를 계산하기',{knowledge:7},'curious','혜성이 언제 돌아올지 알아냈다.'),lifeChoice('동료에게 바로 알리기',{social:5},'lively','함께 밤새 하늘을 지켜봤다.'),lifeChoice('이름을 지어주기',{creativity:5},'proud','혜성에 내가 지은 이름이 붙었다.')],{job:'researcher',situation:'success'}),
 lifeEvent('gardenerStorm',18,120,'폭풍 지난 정원','밤사이 바람이 정원을 흐트러뜨렸다.',[lifeChoice('하나씩 다시 세우기',{stamina:7},'calm','꺾인 줄기에도 새 잎이 났다.'),lifeChoice('바람길을 살려 다시 설계하기',{knowledge:4,creativity:3},'hopeful','다음 폭풍에도 버틸 정원을 만들었다.'),lifeChoice('이웃의 도움 받기',{social:5},'grateful','여럿의 손으로 금방 정원이 돌아왔다.')],{job:'gardener',situation:'setback'}),
 lifeEvent('explorerMap',18,120,'지도에 없는 길','익숙한 길 옆으로 처음 보는 오솔길이 나 있다.',[lifeChoice('끝까지 가보기',{stamina:7},'lively','아무도 몰랐던 화면을 발견했다.'),lifeChoice('꼼꼼히 측량하기',{knowledge:6},'proud','새 길이 지도에 정확히 그려졌다.'),lifeChoice('다음에 함께 오기로 하기',{social:5},'hopeful','동료와 다음 탐험을 약속했다.')],{job:'explorer'}),
 lifeEvent('storyStage',18,120,'이야기 무대','많은 페이지가 내 이야기를 들으러 모였다.',[lifeChoice('준비한 이야기 들려주기',{social:6},'proud','마지막 문장에서 모두가 숨을 멈췄다.'),lifeChoice('즉석에서 지어내기',{creativity:7},'playful','관객이 준 단어로 새 이야기를 만들었다.'),lifeChoice('관객의 이야기 듣기',{social:4,knowledge:2},'grateful','들려주러 갔다가 더 많이 듣고 왔다.')],{job:'storyteller'}),
 lifeEvent('cookContest',18,120,'말 요리 대회','가장 맛있는 말 요리를 겨루는 대회가 열렸다.',[lifeChoice('익숙한 맛으로 승부하기',{knowledge:5},'calm','늘 만들던 요리가 가장 안정적이었다.'),lifeChoice('처음 보는 조합 시도하기',{creativity:7},'anxious','결과를 기다리며 손끝이 떨렸다.'),lifeChoice('다른 요리사와 맛 나누기',{social:5},'grateful','서로의 비법을 하나씩 배웠다.')],{job:'cook'}),
 lifeEvent('makerClock',18,120,'멈춘 시계탑','마을 시계탑이 갑자기 멈췄다.',[lifeChoice('톱니를 하나씩 살피기',{knowledge:7},'curious','작은 톱니 하나가 빠져 있었다.'),lifeChoice('새 장치를 만들어 달기',{creativity:6},'proud','시계탑이 노래하며 시간을 알리게 됐다.'),lifeChoice('마을 페이지들과 고치기',{social:5},'grateful','함께 고친 시계가 다시 움직였다.')],{job:'maker',situation:'setback'}),
 lifeEvent('companionNight',18,120,'잠 못 드는 페이지','한밤중에 불안해하는 페이지가 찾아왔다.',[lifeChoice('말없이 곁에 있기',{social:5,stamina:2},'calm','조용한 시간이 가장 큰 위로가 됐다.'),lifeChoice('천천히 이야기 들어주기',{social:6},'grateful','마음속 말이 하나씩 풀려나왔다.'),lifeChoice('같이 할 수 있는 일 찾기',{knowledge:4,creativity:2},'hopeful','작은 계획 하나가 내일을 기다리게 했다.')],{job:'companion',situation:'reconcile'}),
 lifeEvent('musicianConcert',18,120,'첫 연주회','객석이 가득 찬 무대 뒤에서 차례를 기다린다.',[lifeChoice('연습한 그대로 연주하기',{knowledge:4,stamina:3},'proud','한 음도 놓치지 않고 끝냈다.'),lifeChoice('그날 기분대로 바꿔 부르기',{creativity:7},'lively','처음 듣는 노래에 관객이 일어섰다.'),lifeChoice('관객과 함께 부르기',{social:6},'grateful','무대와 객석이 한 목소리가 됐다.')],{job:'musician',situation:'success'}),
 lifeEvent('courierLost',18,120,'주소 없는 편지','받는 이의 주소가 지워진 편지가 가방에 있다.',[lifeChoice('글씨체로 주인 찾기',{knowledge:6},'curious','편지 끝 서명에서 단서를 찾았다.'),lifeChoice('마을을 돌며 물어보기',{stamina:5,social:2},'hopeful','발품 끝에 편지가 주인을 만났다.'),lifeChoice('보낸 이에게 돌려주기',{social:5},'awkward','멋쩍었지만 다시 보낼 기회를 만들었다.')],{job:'courier'})
);
// v0.10: seasons, stat-gated special choices, life achievements.
const SEASONS=['봄','여름','가을','겨울'];
function lifeSeason(s=state){return SEASONS[(s.life?.turns||0)%4]}
LIFE_EVENTS.push(
 lifeEvent('blossom',0,120,'꽃잎 날리는 날','화면 위로 연분홍 꽃잎이 떨어진다.',[lifeChoice('꽃잎을 모아 장식하기',{creativity:5},'playful','꽃잎으로 작은 화관을 만들었다.'),lifeChoice('꽃길 따라 걷기',{stamina:5},'calm','바람을 따라 천천히 걸었다.'),lifeChoice('꽃 이름 알아보기',{knowledge:5},'curious','같은 분홍에도 여러 이름이 있었다.')],{season:'봄',situation:'beginning'}),
 lifeEvent('springCleaning',0,120,'봄맞이 정리','겨울 동안 쌓인 조각들을 정리할 때가 됐다.',[lifeChoice('필요 없는 것 나누기',{social:5},'grateful','내게 남던 조각이 누군가에게 꼭 필요했다.'),lifeChoice('색깔별로 정리하기',{knowledge:4,creativity:2},'proud','방이 한결 넓어 보였다.'),lifeChoice('정리하다 옛 추억 꺼내 보기',{creativity:3},'lonely','잊고 있던 그림 한 장이 나왔다.')],{season:'봄'}),
 lifeEvent('summerSea',0,120,'바다 화면','화면 끝이 파랗게 출렁인다. 바다가 열렸다.',[lifeChoice('파도에 뛰어들기',{stamina:7},'lively','물보라 속에서 실컷 웃었다.'),lifeChoice('모래성 쌓기',{creativity:6},'playful','파도가 닿기 전까지 성을 지켜냈다.'),lifeChoice('조개 껍데기 모으기',{knowledge:4,social:2},'curious','무늬가 다른 조개를 친구와 나눠 가졌다.')],{season:'여름',situation:'rest'}),
 lifeEvent('firefly',0,120,'반딧불 밤','어두운 화면에 작은 빛들이 떠다닌다.',[lifeChoice('빛을 따라가 보기',{stamina:4,knowledge:2},'curious','빛이 모이는 숲을 찾았다.'),lifeChoice('빛으로 글자 쓰기',{creativity:6},'playful','허공에 잠깐 내 이름이 떠올랐다.'),lifeChoice('친구와 나란히 앉아 보기',{social:5},'calm','아무 말 없이도 좋은 밤이었다.')],{season:'여름'}),
 lifeEvent('harvest',0,120,'말 열매 수확','지난 계절에 심은 말이 열매로 맺혔다.',[lifeChoice('부지런히 거두기',{stamina:6},'proud','바구니가 금세 가득 찼다.'),lifeChoice('이웃과 나눠 먹기',{social:6},'grateful','같은 열매도 함께 먹으니 더 달았다.'),lifeChoice('씨앗을 골라 남기기',{knowledge:5},'hopeful','내년에 심을 씨앗을 챙겼다.')],{season:'가을',situation:'success'}),
 lifeEvent('autumnLeaves',0,120,'낙엽 편지','바람에 실려 온 낙엽에 글씨가 적혀 있다.',[lifeChoice('보낸 이를 찾아가기',{social:4,stamina:2},'curious','옆 화면의 오랜 친구가 보낸 낙엽이었다.'),lifeChoice('낙엽에 답장 쓰기',{creativity:5},'lonely','바람에 답장을 실어 보냈다.'),lifeChoice('낙엽을 책갈피로 만들기',{knowledge:3,creativity:2},'calm','읽던 책에 가을 한 장이 끼워졌다.')],{season:'가을'}),
 lifeEvent('firstSnow',0,120,'첫눈','화면이 하얗게 덮이기 시작했다.',[lifeChoice('눈사람 만들기',{creativity:4,stamina:3},'playful','나를 닮은 눈사람이 생겼다.'),lifeChoice('눈송이 모양 관찰하기',{knowledge:6},'curious','눈송이마다 모양이 달랐다.'),lifeChoice('첫눈 소식 전하기',{social:5},'lively','모두가 창밖을 내다보며 웃었다.')],{season:'겨울'}),
 lifeEvent('yearEnd',0,120,'한 해의 끝','올해의 마지막 밤이다. 무엇을 하며 보낼까?',[lifeChoice('올해를 돌아보며 적기',{knowledge:5},'proud','한 해 동안 꽤 많이 자랐다.'),lifeChoice('내년의 소원 그리기',{creativity:5},'hopeful','작은 소원이 그림으로 남았다.'),lifeChoice('고마운 이에게 인사하기',{social:5},'grateful','올해의 고마움을 빠짐없이 전했다.')],{season:'겨울',situation:'rest'})
);
const SPECIAL_CHOICES={
 school:lifeChoice('혼자 새 원리 찾아내기',{knowledge:8,creativity:3},'proud','선생님도 몰랐던 길의 원리를 찾아냈다.',{knowledge:40}),
 festival:lifeChoice('축제 전체를 기획하기',{social:7,knowledge:4},'proud','내가 짠 순서대로 축제가 흘러갔다.',{social:40}),
 future:lifeChoice('나만의 길 지도 그리기',{creativity:8,knowledge:3},'hopeful','아직 없는 길을 지도에 먼저 그려 넣었다.',{creativity:40}),
 failedWork:lifeChoice('실패를 작품으로 바꾸기',{creativity:9},'proud','어긋난 결과가 가장 아끼는 작품이 됐다.',{creativity:45}),
 team:lifeChoice('프로젝트를 이끌기',{social:7,knowledge:5},'proud','모두의 힘을 모아 새 공간을 완성했다.',{social:45,knowledge:30}),
 busyYear:lifeChoice('일과 쉼의 균형 찾기',{stamina:7,knowledge:4},'calm','바빠도 지치지 않는 나만의 박자를 찾았다.',{stamina:45}),
 reunion:lifeChoice('옛 친구들을 모두 모으기',{social:9},'grateful','오랜만에 모든 얼굴이 한자리에 모였다.',{social:50}),
 rain:lifeChoice('빗소리로 노래 만들기',{creativity:7,social:2},'playful','빗방울 박자에 맞춘 노래가 퍼졌다.',{creativity:35}),
 lostPiece:lifeChoice('조각의 고향 지도 만들기',{knowledge:7,social:3},'proud','길 잃은 조각들이 더는 헤매지 않게 됐다.',{knowledge:40}),
 teach:lifeChoice('작은 배움터 열기',{social:7,knowledge:5},'grateful','어린 페이지들이 매일 찾아오는 곳이 생겼다.',{knowledge:50,social:40}),
 travel:lifeChoice('여행기를 책으로 내기',{creativity:6,knowledge:5},'proud','내가 본 풍경이 다른 페이지의 여행이 됐다.',{creativity:45,knowledge:35})
};
for(const[id,c]of Object.entries(SPECIAL_CHOICES))LIFE_EVENTS.find(e=>e.id===id).choices.push(c);
function meetsNeed(need){return !need||Object.entries(need).every(([k,v])=>state.life.stats[k]>=v)}
const LIFE_ACHIEVEMENTS=[
 {id:'firstYear',name:'첫 한 해',desc:'한 해의 선택을 처음 했다.',reward:3,test:l=>l.turns>=1},
 {id:'adult',name:'홀로서기',desc:'18세가 됐다.',reward:5,test:(l,a)=>a>=18},
 {id:'elder',name:'긴 이야기',desc:'60세가 됐다.',reward:8,test:(l,a)=>a>=60},
 {id:'century',name:'백 번째 해',desc:'100세가 됐다.',reward:15,test:(l,a)=>a>=100},
 {id:'firstJob',name:'첫 직업',desc:'처음으로 직업을 가졌다.',reward:5,test:l=>l.jobsTried.length>=1},
 {id:'wanderer',name:'여러 갈래 길',desc:'직업 세 가지를 경험했다.',reward:8,test:l=>l.jobsTried.length>=3},
 {id:'master',name:'거장',desc:'한 직업에서 거장이 됐다.',reward:12,test:l=>!!l.job&&l.jobXp>=25},
 {id:'specialist',name:'한 분야의 달인',desc:'능력 하나가 80에 도달했다.',reward:8,test:l=>Object.values(l.stats).some(v=>v>=80)},
 {id:'allRound',name:'고른 성장',desc:'네 능력이 모두 50 이상이 됐다.',reward:10,test:l=>Object.values(l.stats).every(v=>v>=50)},
 {id:'storyCollector',name:'이야기 수집가',desc:'서로 다른 사건 20개를 겪었다.',reward:8,test:l=>l.seen.length>=20},
 {id:'fourSeasons',name:'사계절',desc:'네 계절의 사건을 모두 겪었다.',reward:6,test:l=>new Set(LIFE_EVENTS.filter(e=>e.season&&l.seen.includes(e.id)).map(e=>e.season)).size===4},
 {id:'hobbyist',name:'다재다능',desc:'취미 네 가지를 즐겨봤다.',reward:6,test:l=>l.hobbiesTried.length>=4},
 {id:'special',name:'나만 할 수 있는 선택',desc:'능력이 열어준 특별한 선택을 했다.',reward:6,test:l=>l.specialChoices>=1},
 {id:'friendMet',name:'첫 인연',desc:'이름을 가진 친구를 처음 만났다.',reward:3,test:l=>Object.keys(l.friends).length>=1},
 {id:'bestFriend',name:'오랜 단짝',desc:'한 친구와 친밀도 60에 도달했다.',reward:8,test:l=>Object.values(l.friends).some(v=>v>=60)},
 {id:'allFriends',name:'모두의 친구',desc:'여섯 인연을 모두 만났다.',reward:10,test:l=>Object.keys(l.friends).length===Object.keys(FRIENDS).length},
 {id:'promoted',name:'믿고 맡기는 사람',desc:'한 직업에서 전문이 됐다.',reward:8,test:l=>!!l.job&&l.jobXp>=12},
 {id:'dreamer',name:'꿈을 이룬 페이지',desc:'마음에 품은 꿈 하나를 이뤘다.',reward:10,test:l=>l.dreamsDone.length>=1},
 {id:'dreamCollector',name:'꿈 수집가',desc:'꿈 세 개를 이뤘다.',reward:15,test:l=>l.dreamsDone.length>=3},
 {id:'homeOwner',name:'내 손으로 가꾼 집',desc:'나무 오두막 이상으로 이사했다.',reward:6,test:l=>l.home>=2},
 {id:'retired',name:'명예로운 마무리',desc:'오래 한 일에서 명예롭게 은퇴했다.',reward:8,test:l=>!!l.retired},
 {id:'shopper',name:'알뜰한 준비',desc:'인생 상점에서 다섯 번 준비했다.',reward:5,test:l=>l.itemsBought>=5}
];
// Called from render() before save, so old saves get earned achievements retroactively.
function checkLifeAchievements(){const l=state.life,age=lifeAge();if(state.xp<14)return;meetFriends();checkDream();for(const a of LIFE_ACHIEVEMENTS){if(l.achievements.includes(a.id)||!a.test(l,age))continue;l.achievements.push(a.id);state.fragments+=a.reward;l.log.unshift({age,text:'업적 「'+a.name+'」 · '+a.reward+'조각'});l.log=l.log.slice(0,60);notifyDiscovery('인생 업적 「'+a.name+'」 달성 · '+a.reward+'조각')}}
// v0.11: friends with bonds and their own events, a small life shop, promotions.
const FRIENDS={
 kong:{name:'콩',icon:'•',meetAge:2,stat:'social',desc:'옆 화면의 작은 점. 처음 사귄 친구.',line:'콩이랑 점 굴리기를 했어. 여전히 제일 편한 친구야.'},
 mori:{name:'모리',icon:'▤',meetAge:7,stat:'knowledge',desc:'책 냄새를 좋아하는 조용한 페이지.',line:'모리가 추천해 준 책을 같이 읽었어.'},
 haru:{name:'하루',icon:'↗',meetAge:10,stat:'stamina',desc:'가만히 있지 못하는 달리기 선수.',line:'하루랑 화면 끝까지 달리기 시합을 했어!'},
 sori:{name:'소리',icon:'♪',meetAge:14,stat:'creativity',desc:'혼잣말도 노래처럼 하는 페이지.',line:'소리가 만든 노래에 내가 가사를 붙였어.'},
 gyeol:{name:'결',icon:'❧',meetAge:25,stat:'creativity',desc:'새 이웃. 무엇이든 키우고 가꾼다.',line:'결의 정원에서 새싹 이름을 같이 지었어.'},
 nuri:{name:'누리',icon:'☾',meetAge:40,stat:'social',desc:'마을에서 가장 오래 산 이웃 어른.',line:'누리가 옛날이야기를 들려줬어. 처음 듣는 이야기였어.'}
};
LIFE_EVENTS.push(
 lifeEvent('kongPromise',2,120,'콩과의 약속','콩이 오래된 비밀 장소를 보여주겠다고 한다.',[lifeChoice('꼭 비밀로 하기',{social:6},'grateful','둘만 아는 장소가 생겼다.'),lifeChoice('그곳을 같이 꾸미기',{creativity:5,social:2},'playful','비밀 장소에 둘의 무늬가 새겨졌다.'),lifeChoice('지도에 표시해 두기',{knowledge:5},'curious','언제든 다시 찾아올 수 있게 됐다.')],{friend:'kong'}),
 lifeEvent('moriBook',7,120,'모리의 책방','모리가 작은 책방을 열고 첫 손님으로 초대했다.',[lifeChoice('하루 종일 읽기',{knowledge:7},'calm','시간 가는 줄 몰랐다.'),lifeChoice('책방 간판 그려주기',{creativity:6},'proud','모리가 간판을 보고 한참 웃었다.'),lifeChoice('손님을 데려오기',{social:6},'grateful','작은 책방이 북적였다.')],{friend:'mori'}),
 lifeEvent('haruRace',10,120,'하루의 장거리 달리기','하루가 마을을 한 바퀴 도는 달리기에 같이 나가자고 한다.',[lifeChoice('끝까지 같이 뛰기',{stamina:8},'lively','숨이 턱까지 찼지만 나란히 들어왔다.'),lifeChoice('응원 깃발 만들기',{creativity:5,social:2},'playful','하루가 깃발을 보고 속도를 올렸다.'),lifeChoice('코스를 함께 짜기',{knowledge:5},'curious','오르막을 피하는 길을 찾아냈다.')],{friend:'haru'}),
 lifeEvent('soriDuet',14,120,'소리와 이중창','소리가 무대에서 함께 노래하자고 한다.',[lifeChoice('화음을 맡기',{creativity:6,social:2},'proud','두 목소리가 하나로 겹쳤다.'),lifeChoice('긴장해도 무대에 서기',{social:6},'anxious','떨렸지만 소리가 손을 잡아줬다.'),lifeChoice('무대 뒤에서 반주하기',{knowledge:3,creativity:4},'calm','보이지 않는 자리에서 노래를 받쳤다.')],{friend:'sori'}),
 lifeEvent('gyeolGarden',25,120,'결의 정원 초대','결이 가장 아끼는 꽃이 피었다며 부른다.',[lifeChoice('꽃 옆에서 그림 그리기',{creativity:6},'calm','꽃이 지기 전에 그림으로 남겼다.'),lifeChoice('씨앗 받아 오기',{stamina:3,knowledge:3},'hopeful','내 창가에도 같은 꽃이 필 것이다.'),lifeChoice('정원 일을 도와주기',{stamina:6},'grateful','흙 묻은 손으로 함께 웃었다.')],{friend:'gyeol'}),
 lifeEvent('nuriTea',40,120,'누리의 찻잔','누리가 아끼는 찻잔에 차를 따라준다.',[lifeChoice('옛이야기를 청하기',{knowledge:6},'curious','마을이 처음 생긴 날의 이야기를 들었다.'),lifeChoice('내 고민을 털어놓기',{social:6},'grateful','누리는 대답 대신 차를 한 잔 더 따랐다.'),lifeChoice('다음엔 내가 대접하기로 하기',{social:4,creativity:2},'hopeful','다음 만남의 약속이 생겼다.')],{friend:'nuri'})
);
const LIFE_ITEMS={
 book:{name:'두꺼운 책',icon:'▤',cost:12,stat:'knowledge',amount:5},
 paint:{name:'물감 세트',icon:'✎',cost:12,stat:'creativity',amount:5},
 shoes:{name:'가벼운 운동화',icon:'♧',cost:12,stat:'stamina',amount:5},
 invite:{name:'초대장 꾸러미',icon:'✉',cost:12,stat:'social',amount:5},
 reroll:{name:'다른 이야기 듣기',icon:'↻',cost:6}
};
const PROMOTION_BONUS={숙련:5,전문:10,거장:20};
function lifeEligible(s){const l=s.life,age=lifeAge(s);return LIFE_EVENTS.filter(e=>age>=e.min&&age<=e.max&&(!e.job||e.job===l.job)&&(!e.season||e.season===lifeSeason(s))&&(!e.friend||(l.friends?.[e.friend]||0)>=30))}
function meetFriends(){const l=state.life,age=lifeAge();for(const[k,f]of Object.entries(FRIENDS)){if(Object.hasOwn(l.friends,k)||age<f.meetAge)continue;l.friends[k]=10;l.log.unshift({age,text:'새 인연 「'+f.name+'」 · '+f.desc});l.log=l.log.slice(0,60);notifyDiscovery('새로운 인연 · '+f.icon+' '+f.name)}}
function spendTimeWith(id){normalizeLife(state);const l=state.life,f=FRIENDS[id];if(busy||activity||state.xp<14||!f||!Object.hasOwn(l.friends,id)||l.friendTurn===l.turns)return false;l.friendTurn=l.turns;l.friends[id]=Math.min(100,l.friends[id]+10);l.stats[f.stat]=clampRange(l.stats[f.stat]+2,0,100);state.joy=clamp(state.joy+3);if(l.friends[id]===30)l.log.unshift({age:lifeAge(),text:josa(f.name,'과','와')+' 한층 가까워졌다. 특별한 이야기가 찾아올지도 몰라.'});render();speak(f.line+' 친밀도 '+l.friends[id]+'.');return true}
function buyLifeItem(key){normalizeLife(state);const l=state.life,item=LIFE_ITEMS[key];if(busy||activity||state.xp<14||!item||state.fragments<item.cost)return false;
 if(item.stat){if(l.boughtTurn===l.turns)return false;l.boughtTurn=l.turns;l.stats[item.stat]=clampRange(l.stats[item.stat]+item.amount,0,100)}
 else{const others=lifeEligible(state).filter(e=>e.id!==l.eventId);if(!others.length)return false;const fresh=others.filter(e=>!l.seen.includes(e.id)),pool=fresh.length?fresh:others;l.eventId=pool[(l.turns+l.rerolls++)%pool.length].id}
 state.fragments-=item.cost;l.itemsBought++;render();speak(item.stat?josa(item.name,'으로','로')+' '+LIFE_STATS[item.stat]+'이 '+item.amount+' 올랐어.':'다른 이야기가 찾아왔어. 「'+LIFE_EVENTS.find(e=>e.id===l.eventId).title+'」');return true}
// v0.12: dreams, homes, retirement, more everyday events.
Object.assign(HOBBIES,{gardening:{label:'정원 가꾸기',stat:'stamina',icon:'❀'},stargazing:{label:'별 보기',stat:'knowledge',icon:'✦'}});
LIFE_EVENTS.push(
 lifeEvent('treasureHunt',6,12,'보물찾기','친구들이 화면 곳곳에 쪽지를 숨겼다.',[lifeChoice('단서를 차례로 풀기',{knowledge:6},'curious','마지막 쪽지에서 작은 별 조각을 찾았다.'),lifeChoice('구석구석 뛰어다니기',{stamina:6},'lively','누구보다 먼저 쪽지를 모았다.'),lifeChoice('다음엔 내가 숨기기',{creativity:5,social:2},'playful','내가 낸 문제에 친구들이 한참 헤맸다.')]),
 lifeEvent('savings',18,59,'처음 모은 조각','조금씩 모은 조각이 꽤 쌓였다.',[lifeChoice('꼭 필요한 곳에 아껴두기',{knowledge:5},'calm','든든한 마음이 생겼다.'),lifeChoice('나에게 작은 선물하기',{creativity:4,stamina:2},'proud','열심히 한 나를 칭찬해줬다.'),lifeChoice('고마운 이에게 선물하기',{social:6},'grateful','받는 얼굴을 보니 더 기뻤다.')]),
 lifeEvent('noisyNeighbor',18,59,'시끄러운 이웃','옆 화면에서 밤마다 쿵쿵 소리가 난다.',[lifeChoice('직접 찾아가 이야기하기',{social:6},'awkward','알고 보니 춤 연습이었다. 같이 추자고 했다.'),lifeChoice('소리를 막는 벽 만들기',{knowledge:4,creativity:2},'proud','조용한 밤이 돌아왔다.'),lifeChoice('그 박자에 맞춰 노래하기',{creativity:6},'playful','이웃과 이상한 합주가 시작됐다.')],{situation:'conflict'}),
 lifeEvent('crossroads',18,59,'두 갈래 길','안정된 지금과 새로운 도전 사이에서 고민된다.',[lifeChoice('지금 길을 더 깊게 걷기',{knowledge:5,stamina:2},'calm','익숙한 길에도 새 풍경이 있었다.'),lifeChoice('새 길로 한 발 내딛기',{creativity:4,stamina:3},'hopeful','두렵지만 설레는 시작이었다.'),lifeChoice('믿는 이에게 물어보기',{social:6},'grateful','다른 눈으로 보니 답이 조금 보였다.')],{situation:'beginning'}),
 lifeEvent('sickDay',13,99,'몸이 무거운 날','감기에 걸린 듯 화면이 흐릿하다.',[lifeChoice('따뜻하게 푹 자기',{stamina:7},'calm','하룻밤 사이 기운이 돌아왔다.'),lifeChoice('누워서 책 읽기',{knowledge:5},'bored','심심했지만 책 한 권을 끝냈다.'),lifeChoice('친구에게 연락하기',{social:5},'grateful','친구가 따뜻한 말을 잔뜩 가져왔다.')],{situation:'rest'}),
 lifeEvent('surpriseParty',18,99,'깜짝 파티','문을 열자 친구들이 한꺼번에 소리쳤다.',[lifeChoice('펑펑 울며 웃기',{social:6},'grateful','오래 기억에 남을 하루였다.'),lifeChoice('즉석에서 답가 부르기',{creativity:5,social:2},'lively','파티가 더 시끄러워졌다.'),lifeChoice('누가 준비했는지 추리하기',{knowledge:5},'curious','범인은 모두였다.')],{situation:'success'}),
 lifeEvent('lostInCity',18,59,'낯선 거리에서','처음 온 큰 화면에서 길을 잃었다.',[lifeChoice('지나가는 페이지에게 묻기',{social:5},'awkward','친절한 페이지가 길 끝까지 데려다줬다.'),lifeChoice('간판을 보며 지도 그리기',{knowledge:5},'proud','다음엔 혼자서도 올 수 있다.'),lifeChoice('그냥 발길 닿는 대로 걷기',{stamina:5},'curious','길을 잃은 덕에 멋진 골목을 찾았다.')]),
 lifeEvent('photoAlbum',60,120,'오래된 사진첩','먼지 쌓인 사진첩에 어린 시절의 점이 찍혀 있다.',[lifeChoice('한 장씩 이야기 붙이기',{knowledge:4,creativity:2},'lonely','사진마다 그날의 냄새가 났다.'),lifeChoice('친구들과 같이 보기',{social:6},'grateful','모두 깔깔 웃으며 옛날을 떠올렸다.'),lifeChoice('오늘의 사진 한 장 더하기',{creativity:5},'hopeful','사진첩에 아직 빈 장이 많았다.')]),
 lifeEvent('slowMorning',60,120,'느린 아침','서두를 일이 하나도 없는 아침이다.',[lifeChoice('차 한 잔 천천히 마시기',{stamina:5},'calm','김이 사라질 때까지 창밖을 봤다.'),lifeChoice('아침 산책 나가기',{stamina:4,social:2},'lively','이웃들과 아침 인사를 나눴다.'),lifeChoice('오래 미룬 편지 쓰기',{social:4,creativity:2},'grateful','짧지만 진심을 담았다.')],{situation:'rest'}),
 lifeEvent('birthdayCake',0,120,'생일 케이크','누군가 내 이름이 적힌 케이크를 들고 왔다.',[lifeChoice('소원 빌고 촛불 끄기',{creativity:4},'hopeful','소원은 비밀로 남겼다.'),lifeChoice('모두에게 한 조각씩 나누기',{social:6},'grateful','케이크는 작아도 웃음은 컸다.'),lifeChoice('케이크 만드는 법 묻기',{knowledge:5},'curious','내년엔 내가 만들어볼 생각이다.')],{situation:'success'})
);
const DREAMS={
 starFinder:{name:'새 별을 찾는 페이지',desc:'별 연구원으로 처음 보는 혜성을 만난다.',test:l=>l.seen.includes('researcherComet')},
 singer:{name:'모두가 아는 노래',desc:'소리와 이중창을 부르고 상상력 60을 넘긴다.',test:l=>l.seen.includes('soriDuet')&&l.stats.creativity>=60},
 worldMap:{name:'세상의 지도',desc:'먼 화면 여행을 다녀오고 지도에 없는 길을 걷는다.',test:l=>l.seen.includes('travel')&&l.seen.includes('explorerMap')},
 neighbors:{name:'모두의 이웃',desc:'인연 여섯을 모두 만나고 셋과 친밀도 50을 넘긴다.',test:l=>Object.keys(l.friends).length===Object.keys(FRIENDS).length&&Object.values(l.friends).filter(v=>v>=50).length>=3},
 masterpiece:{name:'평생의 걸작',desc:'첫 전시회를 열고 상상력 80을 넘긴다.',test:l=>l.seen.includes('artistGallery')&&l.stats.creativity>=80},
 wiseElder:{name:'지혜로운 어른',desc:'60세가 넘어 경험을 나누고 이해력 70을 넘긴다.',test:(l,a)=>a>=60&&l.seen.includes('teach')&&l.stats.knowledge>=70},
 dreamHome:{name:'꿈의 집',desc:'집을 별빛 저택까지 가꾼다.',test:l=>l.home>=HOMES.length-1},
 wholeLife:{name:'고르게 자란 삶',desc:'네 능력을 모두 70 이상으로 키운다.',test:l=>Object.values(l.stats).every(v=>v>=70)}
};
const DREAM_REWARD=30;
const HOMES=[{name:'작은 상자',icon:'▢',cost:0,bonus:0},{name:'아늑한 다락방',icon:'⌂',cost:20,bonus:1},{name:'나무 오두막',icon:'⌂',cost:45,bonus:2},{name:'정원 딸린 집',icon:'❀',cost:90,bonus:3},{name:'별빛 저택',icon:'✦',cost:160,bonus:5}];
function pension(l){return l.retired?Math.ceil(JOBS[l.retired.job].income/2)+({숙련:1,전문:2,거장:4}[l.retired.level]||0):0}
function chooseDream(key){normalizeLife(state);const l=state.life;if(busy||activity||state.xp<14||lifeAge()<13||!DREAMS[key]||l.dreamsDone.includes(key)||l.dream)return false;l.dream=key;l.log.unshift({age:lifeAge(),text:'꿈 '+josa('「'+DREAMS[key].name,'」을','」를')+' 마음에 품었다.'});l.log=l.log.slice(0,60);render();speak('「'+DREAMS[key].name+'」 — 언젠가 꼭 이루고 싶어.');return true}
function dropDream(){const l=state.life;if(busy||activity||!l.dream)return false;l.dream=null;render();speak('괜찮아. 다른 꿈을 다시 골라도 돼.');return true}
function checkDream(){const l=state.life,d=DREAMS[l.dream];if(!d||!d.test(l,lifeAge()))return;l.dreamsDone.push(l.dream);l.dream=null;state.fragments+=DREAM_REWARD;state.emotion='proud';l.log.unshift({age:lifeAge(),text:'꿈 '+josa('「'+d.name,'」을','」를')+' 이뤘다 · '+DREAM_REWARD+'조각'});l.log=l.log.slice(0,60);notifyDiscovery('꿈을 이뤘어 · 「'+d.name+'」 · '+DREAM_REWARD+'조각')}
function upgradeHome(){normalizeLife(state);const l=state.life,next=HOMES[l.home+1];if(busy||activity||state.xp<14||!next||state.fragments<next.cost)return false;state.fragments-=next.cost;l.home++;l.log.unshift({age:lifeAge(),text:josa(next.name,'으로','로')+' 이사했다.'});l.log=l.log.slice(0,60);render();speak(josa(next.name,'으로','로')+' 옮겼어! 이제 해마다 '+next.bonus+'조각이 더 들어와.');return true}
function retireJob(){normalizeLife(state);const l=state.life;if(busy||activity||!l.job||lifeAge()<60)return false;l.retired={job:l.job,level:jobLevel()};l.job=null;l.jobXp=0;l.jobYears=0;l.log.unshift({age:lifeAge(),text:'명예롭게 은퇴했다 · 해마다 연금 '+pension(l)+'조각'});l.log=l.log.slice(0,60);render();speak('오랫동안 수고했어. 이제는 내 속도로 살아보자.');return true}
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
 if(!Array.isArray(l.achievements))l.achievements=[];l.achievements=[...new Set(l.achievements.filter(id=>LIFE_ACHIEVEMENTS.some(a=>a.id===id)))];
 if(!Array.isArray(l.jobsTried))l.jobsTried=[];l.jobsTried=[...new Set(l.jobsTried.filter(k=>Object.hasOwn(JOBS,k)))];if(l.job&&!l.jobsTried.includes(l.job))l.jobsTried.push(l.job);
 if(!Array.isArray(l.hobbiesTried))l.hobbiesTried=[];l.hobbiesTried=[...new Set(l.hobbiesTried.filter(k=>Object.hasOwn(HOBBIES,k)))];
 if(!Number.isInteger(l.specialChoices)||l.specialChoices<0)l.specialChoices=0;
 if(!l.friends||typeof l.friends!=='object'||Array.isArray(l.friends))l.friends={};for(const k of Object.keys(l.friends))if(!Object.hasOwn(FRIENDS,k)||!Number.isFinite(l.friends[k]))delete l.friends[k];else l.friends[k]=clampRange(Math.round(l.friends[k]),0,100);
 for(const k of ['friendTurn','boughtTurn'])if(!Number.isFinite(l[k]))l[k]=-1;
 for(const k of ['rerolls','itemsBought'])if(!Number.isInteger(l[k])||l[k]<0)l[k]=0;
 if(!Number.isInteger(l.home)||l.home<0)l.home=0;l.home=Math.min(HOMES.length-1,l.home);
 if(!Object.hasOwn(DREAMS,l.dream))l.dream=null;if(!Array.isArray(l.dreamsDone))l.dreamsDone=[];l.dreamsDone=[...new Set(l.dreamsDone.filter(k=>Object.hasOwn(DREAMS,k)))];if(l.dreamsDone.includes(l.dream))l.dream=null;
 if(!l.retired||!Object.hasOwn(JOBS,l.retired.job)||!['신입','숙련','전문','거장'].includes(l.retired.level))l.retired=null;
 const eligible=lifeEligible(s);
 if(!eligible.some(e=>e.id===l.eventId)){const fresh=eligible.filter(e=>!l.seen.includes(e.id));const pool=fresh.length?fresh:eligible;l.eventId=pool[l.turns%pool.length].id}
}
function jobLevel(){return state.life.jobXp>=25?'거장':state.life.jobXp>=12?'전문':state.life.jobXp>=5?'숙련':'신입'}
function lifeOccupation(){const l=state.life;return l.job?jobLevel()+' '+JOBS[l.job].name:l.retired?'은퇴한 '+l.retired.level+' '+JOBS[l.retired.job].name:lifeAge()<6?'작은 탐험가':lifeAge()<18?'페이지 학생':'자유로운 페이지'}
function renderLife(){normalizeLife(state);const age=lifeAge(),l=state.life;const show=state.xp>=14;
 $('lifeHUD').classList.toggle('visible',show);$('lifeHUD').inert=!show;
 $('lifeAge').textContent=age+'세'+(age===120?'+':'');$('lifePeriod').textContent=lifeStage(age)+' · '+lifeSeason();$('lifeJob').textContent=lifeOccupation();
 $('lifeHobby').textContent=HOBBIES[l.hobby].icon+' '+HOBBIES[l.hobby].label;
 $('lifeButton').textContent='내 인생 · '+age+'세';
 $('lifeEventTitle').textContent=LIFE_EVENTS.find(e=>e.id===l.eventId).title;
 for(const[k,label]of Object.entries(LIFE_STATS)){$('life-'+k).value=l.stats[k];$('life-'+k+'-text').textContent=Math.round(l.stats[k])}
 $('lifeAccessory').innerHTML='';if(show&&l.job){const color='#7a8669';const art={artist:'<path d="M391 216L425 246M419 240L430 244L426 255Z" stroke="'+color+'" stroke-width="5" fill="#d7bc8e"/>',researcher:'<g fill="none" stroke="'+color+'" stroke-width="3"><rect x="116" y="104" width="64" height="49" rx="15"/><rect x="313" y="104" width="64" height="49" rx="15"/><path d="M180 127L313 127"/></g>',gardener:'<path d="M194 61Q250 3 306 61L328 69L174 69Z" fill="#c9d8a8" stroke="'+color+'" stroke-width="2"/>',explorer:'<circle cx="374" cy="247" r="18" fill="#f3ecd4" stroke="'+color+'"/><path d="M374 233L383 253L365 253Z" fill="'+color+'"/>',storyteller:'<path d="M391 175L425 175L425 195L403 195L395 204L397 195L391 195Z" fill="#e5dfef" stroke="'+color+'"/>',cook:'<path d="M215 61L215 36Q190 9 219 7Q232 -15 250 4Q280 -17 289 15Q311 33 285 40L285 61Z" fill="#faf9ed" stroke="'+color+'" stroke-width="2"/>',maker:'<text x="388" y="209" font-size="35" fill="'+color+'">⚙</text>',companion:'<text x="382" y="212" font-size="35" fill="#bf9596">♡</text>',musician:'<text x="386" y="210" font-size="35" fill="'+color+'">♪</text>',courier:'<path d="M381 186L425 186L425 214L381 214Z M381 186L403 202L425 186" fill="#f3ecd4" stroke="'+color+'" stroke-width="2"/>'};$('lifeAccessory').innerHTML=art[l.job];}
 if(l.lastEmotionFromEvent)$('correctFeeling').hidden=true;
 document.body.dataset.life=show?'active':'hidden';
}
const josa=(w,a,b)=>{const c=w.charCodeAt(w.length-1)-44032;return w+(c>=0&&c<11172&&c%28?a:b)};
function skillTags(effects){return Object.entries(effects).map(([k,v])=>LIFE_STATS[k]+' +'+v).join(' · ')}
function chooseLifeEvent(id,index){if(busy||activity||state.xp<14)return false;normalizeLife(state);const l=state.life;if(l.eventId!==id)return false;const e=LIFE_EVENTS.find(e=>e.id===id),c=e?.choices[index];if(!c||!meetsNeed(c.need))return false;if(c.need)l.specialChoices++;
 const age=lifeAge();for(const[k,v]of Object.entries(c.effects))l.stats[k]=clampRange(l.stats[k]+v,0,100);
 l.stats[HOBBIES[l.hobby].stat]=clampRange(l.stats[HOBBIES[l.hobby].stat]+1,0,100);
 let reward=Math.max(2,pension(l)),promo=null;if(l.job){const was=jobLevel();l.jobYears++;l.jobXp++;if(jobLevel()!==was)promo=jobLevel();reward=JOBS[l.job].income+(l.jobXp>=12?2:l.jobXp>=5?1:0);l.stats[JOBS[l.job].stat]=clampRange(l.stats[JOBS[l.job].stat]+1,0,100)}
 reward+=HOMES[l.home].bonus;state.fragments+=reward;l.turns++;l.log.unshift({age,text:e.title+' — '+c.result+' · '+reward+'조각'});l.log=l.log.slice(0,60);if(!l.seen.includes(e.id))l.seen.push(e.id);l.eventId=null;
 state.emotion=c.emotion;state.mix=null;state.situation=e.situation||{failedWork:'setback',friendConflict:'reconcile',reunion:'reconcile',school:'beginning',future:'beginning',neverTooLate:'beginning',busyYear:'rest',recognition:'success',quietDay:'rest'}[e.id]||null;l.lastEmotionFromEvent=true;state.contextVersion=1;state.feelings[c.emotion]++;state.joy=clamp(state.joy+4);if(c.effects.stamina)state.energy=clamp(state.energy+5);
 if(promo){const bonus=PROMOTION_BONUS[promo],j=JOBS[l.job];state.fragments+=bonus;l.stats[j.stat]=clampRange(l.stats[j.stat]+3,0,100);state.emotion='proud';l.log.unshift({age:lifeAge(),text:josa(promo+' '+j.name,'으로','로')+' 인정받았다 · 보너스 '+bonus+'조각'});l.log=l.log.slice(0,60);notifyDiscovery(j.icon+' '+promo+' '+j.name+' 승진 · '+bonus+'조각')}
 render();speak(promo?c.result+' 그리고 '+josa(promo+' '+JOBS[l.job].name,'이','가')+' 됐어! 노력이 인정받았어.':c.result+' 한 해가 지나 '+lifeAge()+'세가 됐어.');return true;
}
function jobAvailable(key){normalizeLife(state);const j=JOBS[key];return !!j&&lifeAge()>=18&&Object.entries(j.requires).every(([k,v])=>state.life.stats[k]>=v)}
function takeJob(key){if(busy||activity||!jobAvailable(key))return false;const l=state.life;if(l.job===key)return false;l.job=key;if(!l.jobsTried.includes(key))l.jobsTried.push(key);l.jobYears=0;l.jobXp=0;l.log.unshift({age:lifeAge(),text:JOBS[key].name+'의 길을 시작했다.'});l.log=l.log.slice(0,60);render();speak(josa(JOBS[key].name,'이','가')+' 됐어. 다음 한 해부터 경험과 조각이 쌓여.');return true}
function practiceHobby(){normalizeLife(state);const l=state.life;if(busy||activity||state.xp<14||l.trainedTurn===l.turns)return false;l.trainedTurn=l.turns;if(!l.hobbiesTried.includes(l.hobby))l.hobbiesTried.push(l.hobby);l.stats[HOBBIES[l.hobby].stat]=clampRange(l.stats[HOBBIES[l.hobby].stat]+3,0,100);state.joy=clamp(state.joy+3);render();speak(josa(HOBBIES[l.hobby].label,'을','를')+' 즐겼어. 다음 한 해에 또 해보자.');return true}
function openLife(){if(busy||activity||state.xp<14)return;normalizeLife(state);open('내 페이지의 인생');const l=state.life,summary=document.createElement('p');summary.textContent=lifeAge()+'세 · '+lifeStage(lifeAge())+' · '+lifeSeason()+' · '+lifeOccupation()+' · 취미 '+HOBBIES[l.hobby].label;$('drawerContent').append(summary);
 const note=document.createElement('p');note.textContent='새로운 말 3개 또는 아래의 한 해 선택 1번마다 1살 자라. 접속하지 않는 동안 나이는 늘지 않아.';$('drawerContent').append(note);const skills=document.createElement('div');skills.className='life-quick-stats';for(const[k,label]of Object.entries(LIFE_STATS)){const badge=document.createElement('span');badge.textContent=label+' '+Math.round(l.stats[k])+'/100';skills.append(badge)}$('drawerContent').append(skills);
 const e=LIFE_EVENTS.find(e=>e.id===l.eventId),card=document.createElement('section');card.className='life-event';const h=document.createElement('h3');h.textContent=e.title;const p=document.createElement('p');p.textContent=e.text;card.append(h,p);for(let i=0;i<e.choices.length;i++){const c=e.choices[i],b=button((c.need?'★ ':'')+c.text+'\n'+skillTags(c.effects)+(c.need?' · 조건 '+Object.entries(c.need).map(([k,v])=>LIFE_STATS[k]+' '+v).join(' · '):''),()=>{if(chooseLifeEvent(e.id,i))openLife()},card);b.className='life-choice'+(c.need?' special':'');b.disabled=!meetsNeed(c.need)}$('drawerContent').append(card);
 const hobbies=document.createElement('div');hobbies.className='hobby-list';$('drawerContent').append(hobbies);for(const[k,v]of Object.entries(HOBBIES)){const b=button(v.icon+' '+v.label,()=>{l.hobby=k;render();openLife()},hobbies);b.classList.toggle('active',l.hobby===k)}const practice=button(l.trainedTurn===l.turns?'올해의 취미 활동 완료':'취미 즐기기 · '+LIFE_STATS[HOBBIES[l.hobby].stat]+' +3',()=>{if(practiceHobby())openLife()},$('drawerContent'));practice.disabled=l.trainedTurn===l.turns;
 button('직업과 다음 길 보기',openCareers,$('drawerContent'));{const t=document.createElement('h3');t.textContent='꿈'+(l.dreamsDone.length?' · 이룬 꿈 '+l.dreamsDone.length+'개':'');const box=document.createElement('div');box.className='life-friends';$('drawerContent').append(t,box);
 if(lifeAge()<13){const p=document.createElement('p');p.textContent='13세부터 이루고 싶은 꿈을 정할 수 있어.';box.append(p)}
 else if(l.dream){const d=DREAMS[l.dream],p=document.createElement('p');p.textContent='지금의 꿈 · 「'+d.name+'」 — '+d.desc+' 이루면 '+DREAM_REWARD+'조각.';box.append(p);button('다른 꿈 고르기',()=>{if(dropDream())openLife()},box)}
 else for(const[k,d]of Object.entries(DREAMS)){if(l.dreamsDone.includes(k))continue;const b=button('☆ '+d.name+'\n'+d.desc,()=>{if(chooseDream(k))openLife()},box);b.className='life-choice'}
 if(l.dreamsDone.length){const p=document.createElement('p');p.textContent='이룬 꿈 · '+l.dreamsDone.map(k=>DREAMS[k].name).join(' · ');box.append(p)}}
 {const h=HOMES[l.home],next=HOMES[l.home+1],t=document.createElement('h3');t.textContent='집 · '+h.icon+' '+h.name+(h.bonus?' · 해마다 +'+h.bonus+'조각':'');$('drawerContent').append(t);if(next){const b=button('다음 집으로 · '+next.icon+' '+next.name+' · '+next.cost+'조각 (해마다 +'+next.bonus+')',()=>{if(upgradeHome())openLife()},$('drawerContent'));b.disabled=state.fragments<next.cost}}
 {const t=document.createElement('h3');const met=Object.keys(l.friends);t.textContent='인연 '+met.length+'/'+Object.keys(FRIENDS).length+(l.friendTurn===l.turns?' · 올해는 이미 함께했어':' · 한 해에 한 명과 시간 보내기');const list=document.createElement('div');list.className='life-friends';for(const k of met){const f=FRIENDS[k],b=button(f.icon+' '+f.name+' · 친밀도 '+l.friends[k]+'\n'+f.desc+(l.friends[k]>=30?' · 특별한 이야기 열림':''),()=>{if(spendTimeWith(k))openLife()},list);b.className='life-choice';b.disabled=l.friendTurn===l.turns}if(!met.length){const p=document.createElement('p');p.textContent='아직 만난 인연이 없어. 조금 더 자라면 누군가 찾아올 거야.';list.append(p)}$('drawerContent').append(t,list)}
 {const t=document.createElement('h3');t.textContent='인생 상점 · '+state.fragments+'조각';const shop=document.createElement('div');shop.className='hobby-list';for(const[k,it]of Object.entries(LIFE_ITEMS)){const b=button(it.icon+' '+it.name+' · '+(it.stat?LIFE_STATS[it.stat]+' +'+it.amount+' · ':'이번 사건 바꾸기 · ')+it.cost+'조각',()=>{if(buyLifeItem(k))openLife()},shop);b.disabled=state.fragments<it.cost||(!!it.stat&&l.boughtTurn===l.turns)}const note=document.createElement('p');note.textContent='능력 아이템은 한 해에 하나만 쓸 수 있어.';$('drawerContent').append(t,shop,note)}
 {const t=document.createElement('h3');t.textContent='인생 업적 '+l.achievements.length+'/'+LIFE_ACHIEVEMENTS.length;const list=document.createElement('ul');list.className='life-achievements';for(const a of LIFE_ACHIEVEMENTS){const li=document.createElement('li');const got=l.achievements.includes(a.id);li.textContent=(got?'✓ '+a.name+' · ':'· ')+a.desc;li.classList.toggle('done',got);list.append(li)}$('drawerContent').append(t,list)}if(l.log.length){const title=document.createElement('h3');title.textContent='살아온 이야기';$('drawerContent').append(title);const list=document.createElement('ul');list.className='life-log';for(const row of l.log.slice(0,12)){const li=document.createElement('li');li.textContent=row.age+'세 · '+row.text;list.append(li)}$('drawerContent').append(list)}
}
function openCareers(){if(busy||activity)return;open('어떤 일을 해볼까?');const p=document.createElement('p');p.textContent=lifeAge()<18?'18세부터 직업을 선택할 수 있어. 지금은 좋아하는 것과 능력을 키워보자.':'원하는 직업을 선택해. 이직하면 새 직업의 경험은 처음부터 쌓이고, 능력은 유지돼.';$('drawerContent').append(p);const grid=document.createElement('div');grid.className='career-grid';$('drawerContent').append(grid);
 for(const[k,j]of Object.entries(JOBS)){const box=document.createElement('div');box.className='career-card';const h=document.createElement('strong');h.textContent=j.icon+' '+j.name;const desc=document.createElement('p');desc.textContent=j.description;const req=document.createElement('p');req.textContent=Object.entries(j.requires).map(([s,v])=>LIFE_STATS[s]+' '+Math.round(state.life.stats[s])+'/'+v).join(' · ');const b=button(state.life.job===k?'현재 직업':jobAvailable(k)?'이 길 시작하기':'아직 준비 중',()=>{if(takeJob(k))openLife()},box);b.disabled=!jobAvailable(k)||state.life.job===k;box.prepend?.(h,desc,req);if(!box.prepend){box.append(h,desc,req)}grid.append(box)}
 if(state.life.job&&lifeAge()>=60)button('명예롭게 은퇴하기 · 해마다 연금 '+(Math.ceil(JOBS[state.life.job].income/2)+({숙련:1,전문:2,거장:4}[jobLevel()]||0))+'조각',()=>{if(retireJob())openLife()},$('drawerContent'));
 if(state.life.job)button('일을 내려놓고 자유롭게 지내기',()=>{const old=state.life.job;state.life.job=null;state.life.jobXp=0;state.life.jobYears=0;state.life.log.unshift({age:lifeAge(),text:JOBS[old].name+'의 일을 내려놓고 새로운 여유를 선택했다.'});render();openLife()},$('drawerContent'));
 button('내 인생으로 돌아가기',openLife,$('drawerContent'));
}
function initLife(){ $('lifeButton').onclick=openLife;$('lifeNext').onclick=openLife;SAMPLE_MENUS.push([['조금 불안해','새로운 일이 걱정되고 불안해'],['다음이 기대돼','다음에는 해보고 싶어, 희망이 생겨'],['스스로 뿌듯해','오늘 해낸 일이 뿌듯해'],['고마운 하루','함께 있어줘서 고마워'],['심심한 오후','오늘은 조금 심심해'],['아쉬운 선택','아까 선택이 후회돼'],['민망한 순간','오늘은 좀 어색하고 민망했어'],['오래된 친구','오랜 친구가 보고 싶고 그리워']]);}

function nourishLife(type,emotion){normalizeLife(state);const key={warm:'social',dream:'creativity',sea:'stamina',nature:'stamina',calm:'stamina'}[type]||(['curious','proud'].includes(emotion)?'knowledge':['grateful','lively'].includes(emotion)?'social':'creativity');state.life.stats[key]=clampRange(state.life.stats[key]+1,0,100)}
