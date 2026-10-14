'use strict';
// Separate the feeling of a sentence from the scenery words it contains.
const EMOTIONS={
 lively:{label:'활발함',color:'#fff0bf',icon:'✧',reply:'좋아! 화면 끝까지 폴짝 뛰고 싶어.',motion:'lively',eyes:'<ellipse cx="148" cy="128" rx="12" ry="21" fill="currentColor"/><ellipse cx="345" cy="128" rx="12" ry="21" fill="currentColor"/>',mouth:'M176 220Q246 291 316 220Q248 255 176 220Z'},
 cool:{label:'시크함',color:'#e2e7ec',icon:'—',reply:'흠. 그럴 수도 있지. 여기서 같이 있어줄게.',motion:'cool',eyes:'<path d="M125 129L171 133M323 133L369 129"/><path d="M146 132L146 142M345 132L345 142"/>',mouth:'M218 245L277 242'},
 sad:{label:'쓸쓸함',color:'#dce6f5',icon:'·',reply:'오늘은 조용히 곁에 있을게. 슬픈 말도 놓아줘도 돼.',motion:'sad',eyes:'<path d="M127 132Q148 149 169 132M324 132Q345 149 366 132M130 113L164 120M330 120L364 113"/>',mouth:'M217 255Q247 227 277 255'},
 angry:{label:'화남',color:'#f5ddd2',icon:'!',reply:'으으, 답답한 마음이구나. 나도 볼을 부풀렸어.',motion:'angry',eyes:'<path d="M122 108L174 129M321 129L373 108"/><ellipse cx="148" cy="144" rx="7" ry="10" fill="currentColor"/><ellipse cx="347" cy="144" rx="7" ry="10" fill="currentColor"/>',mouth:'M221 240Q248 220 275 240Q248 270 221 240Z'},
 calm:{label:'차분함',color:'#ece7dd',icon:'☾',reply:'서두르지 말자. 오늘은 천천히 숨을 쉬어볼게.',motion:'calm',eyes:'<path d="M124 134Q148 150 172 134M321 134Q345 150 369 134"/>',mouth:'M225 242Q248 252 271 242'},
 curious:{label:'호기심',color:'#dcefe8',icon:'?',reply:'그러게, 왜 그럴까? 나도 조금 궁금해졌어.',motion:'curious',eyes:'<ellipse cx="148" cy="123" rx="14" ry="23" fill="currentColor"/><ellipse cx="345" cy="131" rx="9" ry="15" fill="currentColor"/><path d="M125 91Q147 82 172 91"/>',mouth:'M235 238Q248 225 261 238Q271 258 248 264Q225 258 235 238Z'},
 shy:{label:'설렘',color:'#f8dfe9',icon:'♡',reply:'그 말을 들으니 화면이 조금 분홍빛이 됐어. 두근두근.',motion:'shy',eyes:'<path d="M128 136Q147 109 166 136M327 136Q346 109 365 136"/>',mouth:'M225 241Q248 265 271 241'},
 playful:{label:'장난기',color:'#eee0fc',icon:'~',reply:'장난칠 준비 됐어! 한쪽 눈으로 찡긋.',motion:'playful',eyes:'<ellipse cx="148" cy="128" rx="10" ry="19" fill="currentColor"/><path d="M323 135L347 119L370 135"/>',mouth:'M188 226Q248 280 309 224M248 252Q254 277 273 259'},
 neutral:{label:'담담함',color:'#edf0e7',icon:'·',reply:'그 이야기도 한 입. 천천히 알아가고 있어.',motion:'neutral',eyes:'<ellipse cx="148" cy="128" rx="9" ry="17" fill="currentColor"/><ellipse cx="345" cy="128" rx="9" ry="17" fill="currentColor"/>',mouth:'M218 241Q248 255 278 241'}
};
const FEELING_RULES=[
 ['angry',/화(?:가)?\s*나|분노|열받|억울|빡치|분하다|화났/],
 ['sad',/슬프|슬퍼|우울|외로|눈물|울고|속상|서럽|서운|그립|보고\s*싶/],
 ['shy',/부끄|쑥스|설레|설렘|두근|떨려|떨리|기대돼|기대되/],
 ['cool',/싫|별로|귀찮|재미없|안\s*좋|좋지\s*않|행복하지\s*않|기쁘지\s*않|안\s*행복|짜증|됐어|관심\s*없|최악|부정|안돼|아니야/],
 ['calm',/피곤|지쳐|지치|힘들|졸려|졸리|잠|쉬고|쉬자|쉬어|차분|평온|조용/],
 ['playful',/장난|놀자|놀고|웃겨|농담|재밌|재미있|엉뚱|메롱/],
 ['lively',/좋아|좋다|좋네|좋은|행복|기뻐|기쁘|신나|신난|즐거|최고|성공|해냈|고마|감사|사랑|응원|잘했|괜찮/],
 ['curious',/왜|어떻게|뭘까|무엇|궁금|알고\s*싶|어디|언제|[?？]/]
];
function feelingOf(text){
 // Known negations are removed before keyword matching. This is a small rule engine, not an AI interpretation.
 const clean=cleanFeelingText(text);
 const clauses=clean.split(/하지만|그렇지만|그래도|그런데|지만|근데/).map(s=>s.trim()).filter(Boolean);
 for(let i=clauses.length-1;i>=0;i--){for(const [key,rule]of FEELING_RULES){if(rule.test(clauses[i]))return key}}
 return 'neutral';
}
function normalizeFeelings(s){
 if(!s.feelings||typeof s.feelings!=='object')s.feelings={};
 for(const k of Object.keys(EMOTIONS))if(!Number.isFinite(s.feelings[k])||s.feelings[k]<0)s.feelings[k]=0;
 if(!Object.hasOwn(EMOTIONS,s.emotion)){s.emotion=s.history.length?feelingOf(s.history[0].text):'neutral';for(const h of s.history)s.feelings[feelingOf(h.text)]++}
}
function renderFeeling(){
 normalizeFeelings(state);const e=EMOTIONS[state.emotion];
 document.body.dataset.emotion=state.sleeping?'calm':state.emotion;
 document.body.style.setProperty('--emotion-color',e.color);
 $('feeling').textContent=state.xp?e.icon+' '+e.label:'';
 $('feeling').setAttribute('aria-label','현재 페이지의 감정: '+e.label);
 $('mood').textContent=state.sleeping?'편안하게 쉬는 중':'지금은 '+e.label+'을 표현하는 중';
 const traits=Object.keys(EMOTIONS).filter(k=>k!=='neutral').sort((a,b)=>state.feelings[b]-state.feelings[a]);const best=traits[0];
 $('emotionTrait').textContent=state.feelings[best]>0?'자주 보인 표정: '+EMOTIONS[best].label+' · '+state.feelings[best]+'번':'아직 어떤 성격이 될지 몰라.';
 $('emotionNote').textContent='지금 감정은 마지막 말에 반응해. 자주 먹인 감정은 성향으로 쌓여.';
 if(state.sleeping){renderContext();return;}
 $('eyes').innerHTML=e.eyes;
 $('mouth').setAttribute('d',e.mouth);
 if(state.emotion==='shy')$('cheeks').innerHTML='<ellipse cx="108" cy="182" rx="29" ry="12" fill="#e8a6b3"/><ellipse cx="390" cy="182" rx="29" ry="12" fill="#e8a6b3"/>';
 if(state.xp>=5)$('pageTexture').style.background='radial-gradient(ellipse at 50% 42%,'+e.color+'cc 0%,transparent 62%),linear-gradient(155deg,#fff 25%,'+TYPES[dominant()].color+'77 100%)';
 renderContext();
}

const SITUATIONS={
 success:{label:'작은 성취',icon:'⚑',reply:'화면 한쪽에 작은 기념 깃발을 꽂았어.',words:/해냈|성공|합격|완성했|잘\s*봤|붙었|이뤘|목표.*달성/},
 setback:{label:'다시 모으기',icon:'◇',reply:'흩어진 조각을 천천히 다시 모아볼게.',words:/망쳤|망했|실패|실수했|못했|틀렸|떨어졌|탈락|시험.*못\s*봤/},
 reconcile:{label:'다시 연결',icon:'⌁',reply:'떨어진 조각 사이에 선이 다시 이어졌어.',words:/화해|서로.*미안|사과했|사과받|다시\s*친|오해.*풀/},
 conflict:{label:'엇갈림',icon:'↔',reply:'두 조각이 잠깐 거리를 두고 있어.',words:/싸웠|싸움|다퉜|다투|갈등|말다툼/},
 beginning:{label:'첫걸음',icon:'↗',reply:'화면에 작은 문이 열렸어. 아직 안쪽은 궁금해.',words:/처음|시작했|시작할|첫\s*(출근|수업|도전|날|만남)|도전/},
 rest:{label:'잠깐의 쉼',icon:'☾',reply:'흩어져 있던 조각들이 편히 자리를 잡았어.',words:/피곤|쉬어|쉬자|쉬고|휴식|지쳐|지치|졸려|졸리|잠깐\s*쉬/}
};
const MIXES={
 livelyCalm:{label:'기쁘지만 지친',reply:'웃음은 나는데 눈꺼풀은 무거워. 느리게 기뻐할게.'},
 shyTense:{label:'설레지만 긴장한',reply:'궁금해서 다가갔다가, 두근거려서 한 발 물러났어.'},
 affectionSad:{label:'좋아하지만 서운한',reply:'따뜻한 마음은 남아 있는데 입은 조금 삐죽해.'},
 angrySad:{label:'화나고 속상한',reply:'눈썹은 찌푸려지고 작은 물방울이 떨어졌어.'}
};
function cleanFeelingText(text){return text.replace(/(?:안\s*(?:슬프|슬퍼|우울|피곤|외로|힘들|설레|짜증|불안|걱정|무서|두려|초조|긴장|심심|후회|그립)|(?:슬프|슬퍼|우울|피곤|외롭|힘들|설레|짜증|불안|걱정|무섭|두렵|초조|긴장|심심|후회|그립)[가-힣]*?\s*(?:지\s*않|않아)|화\s*안\s*나)/g,'')}
function analyzeWords(text){
 const clean=cleanFeelingText(text),found=new Set(FEELING_RULES.filter(([,r])=>r.test(clean)).map(([k])=>k));
 const affection=/사랑|좋아|좋다|고마|감사|소중|아끼/.test(clean)&&!/(안\s*좋|좋지\s*않|사랑하지\s*않|안\s*사랑)/.test(clean);
 const tension=/불안|걱정|무서|두려|긴장|초조|떨려/.test(clean)&&!/(안\s*(무서|불안)|불안하지\s*않)/.test(clean);
 let mix=null;
 if(found.has('angry')&&found.has('sad'))mix='angrySad';
 else if(affection&&found.has('sad'))mix='affectionSad';
 else if(found.has('shy')&&tension)mix='shyTense';
 else if(found.has('lively')&&found.has('calm'))mix='livelyCalm';
 const situation=SITUATIONS.setback.words.test(clean)?'setback':Object.keys(SITUATIONS).find(k=>SITUATIONS[k].words.test(clean))||null;
 return {primary:feelingOf(text),mix,situation};
}
const PERSONALITIES={lively:'활발한',cool:'시크한',calm:'차분한',curious:'호기심 많은',shy:'수줍은',playful:'장난기 많은'};
function evolvePersonality(s){
 const scores={lively:s.feelings.lively+(s.feelings.hopeful||0)+(s.feelings.proud||0)+(s.feelings.grateful||0),cool:s.feelings.cool+s.feelings.angry+(s.feelings.bored||0),calm:s.feelings.calm+s.feelings.sad+(s.feelings.regret||0)+(s.feelings.lonely||0),curious:s.feelings.curious,shy:s.feelings.shy+(s.feelings.anxious||0)+(s.feelings.awkward||0),playful:s.feelings.playful};
 if(!Object.hasOwn(PERSONALITIES,s.personality))s.personality=null;
 const candidate=Object.keys(scores).sort((a,b)=>scores[b]-scores[a])[0];
 if(s.xp>=5&&scores[candidate]>=3&&(!s.personality||scores[candidate]>=scores[s.personality]+3))s.personality=candidate;
 return scores;
}
function normalizeContext(s){
 if(s.contextVersion!==1){const c=analyzeWords(s.history[0]?.text||'');s.mix=c.mix;s.situation=c.situation;s.contextVersion=1}
 if(!Object.hasOwn(MIXES,s.mix))s.mix=null;
 if(!Object.hasOwn(SITUATIONS,s.situation))s.situation=null;
 evolvePersonality(s);
}
function contextualReply(){
 const e=EMOTIONS[state.emotion];let reply=state.mix?MIXES[state.mix].reply:e.reply;
 if(!state.mix&&state.personality==='cool'&&state.emotion==='lively')reply='…좋네. 티는 조금만 낼게. 입꼬리는 올라갔어.';
 else if(!state.mix&&state.personality==='lively'&&state.emotion==='lively')reply='야호! 화면 끝까지 폴짝! 기쁜 마음이 넘쳐.';
 else if(!state.mix&&state.personality==='shy'&&state.emotion==='lively')reply='좋아…! 작은 웃음으로 살짝 표현해볼게.';
 else if(!state.mix&&state.personality==='playful'&&state.emotion==='cool')reply='흥. 오늘은 장난도 살짝 시크하게 칠래.';
 else if(!state.mix&&state.personality==='calm'&&state.emotion==='lively')reply='기쁜 마음을 천천히 오래 느껴볼게.';
 if(state.situation)reply+=' '+SITUATIONS[state.situation].reply;
 return reply;
}
function renderContext(){
 normalizeContext(state);document.body.dataset.personality=state.personality||'forming';document.body.dataset.mix=state.sleeping?'':state.mix||'';document.body.dataset.situation=state.situation||'';
 $('emotionTrait').textContent=state.personality?'조금씩 자리 잡은 성격: '+PERSONALITIES[state.personality]+' 페이지':'아직 성격이 자라는 중이야.';
 $('emotionNote').textContent='성격은 여러 번의 새로운 말로 천천히 변해. 지금 감정과는 따로 기억해.';
 const label=state.mix?MIXES[state.mix].label:EMOTIONS[state.emotion].label;
 $('feeling').textContent=state.xp?EMOTIONS[state.emotion].icon+' '+label+(state.situation?' · '+SITUATIONS[state.situation].label:''):'';
 $('feeling').setAttribute('aria-label','현재 표현: '+label+(state.situation?', 상황: '+SITUATIONS[state.situation].label:''));
 $('mood').textContent=state.sleeping?'편안하게 쉬는 중':'지금은 '+label+' 표정';
 $('emotionExtra').innerHTML='';
 if(!state.sleeping){
 if(!state.mix&&state.emotion==='lively'&&['cool','shy','calm'].includes(state.personality)){
 $('eyes').innerHTML=EMOTIONS[state.personality].eyes;$('mouth').setAttribute('d','M224 241Q248 253 272 241');
 }
 if(state.mix==='livelyCalm'){$('eyes').innerHTML=EMOTIONS.calm.eyes;$('mouth').setAttribute('d','M199 229Q248 271 297 229');}
 if(state.mix==='shyTense'){$('eyes').innerHTML=EMOTIONS.curious.eyes;$('mouth').setAttribute('d',EMOTIONS.shy.mouth);}
 if(state.mix==='affectionSad'){$('eyes').innerHTML=EMOTIONS.sad.eyes;$('mouth').setAttribute('d','M218 247Q248 229 278 247');$('cheeks').innerHTML='<ellipse cx="107" cy="181" rx="24" ry="10" fill="#eab4b8"/><ellipse cx="390" cy="181" rx="24" ry="10" fill="#eab4b8"/>';}
 if(state.mix==='angrySad'){$('eyes').innerHTML=EMOTIONS.angry.eyes;$('mouth').setAttribute('d',EMOTIONS.sad.mouth);$('emotionExtra').innerHTML='<path class="tear" d="M374 164Q365 181 374 186Q384 181 374 164Z" fill="#a6c4e4"/>';}
 }
 $('emotionExtra').style.opacity=state.xp>=3?1:0;
 if(state.xp>=5&&state.mix==='affectionSad')$('pageTexture').style.background='radial-gradient(ellipse at 50% 42%,#f8e4eccc 0%,transparent 62%),linear-gradient(155deg,#fff 25%,#dce6f577 100%)';
 renderSituation();
}
function renderSituation(){
 const box=$('situationScene');box.replaceChildren();if(!state.situation||state.xp<2||state.sleeping)return;
 const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;box.append(e);return e};
 if(state.situation==='success'){make('span','event-flag','⚑');for(let i=0;i<3;i++)make('span','event-spark spark-'+i,'·')}
 if(['setback','conflict','reconcile','rest'].includes(state.situation)){make('i','event-piece piece-a');make('i','event-piece piece-b');if(state.situation==='reconcile')make('i','event-connection');if(state.situation==='rest')make('span','event-rest','· · ·')}
 if(state.situation==='beginning'){make('i','event-door');make('span','event-light','·')}
}
