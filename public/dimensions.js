'use strict';
const DIMENSION_STAGES=[
 {id:'blank',at:0,name:'아직 아무것도 없는 곳'},
 {id:'point',at:1,name:'작은 점 · 0D'},
 {id:'line',at:3,name:'늘어나는 선 · 1D'},
 {id:'outline',at:6,name:'닫히는 윤곽 · 1D'},
 {id:'plane',at:9,name:'색을 가진 면 · 2D'},
 {id:'life',at:14,name:'살아 있는 페이지 · 2D'},
 {id:'volume',at:24,name:'두께를 얻은 페이지 · 3D'}
];
const PAGE_OUTLINE=[[250,65],[335,70],[405,95],[420,140],[420,215],[395,282],[335,294],[250,300],[165,294],[105,282],[80,215],[80,140],[95,95],[165,70],[250,65]];
let rotationOwner=null,linePoints=null,lineTween=null;
let dimensionPointer=null,dimensionPull={x:0,y:0},rotation={yaw:-.35,pitch:-.18},skipStrokeUntil=0;
function dimensionStage(xp){return [...DIMENSION_STAGES].reverse().find(s=>xp>=s.at)}
function clampRange(n,a,b){return Math.max(a,Math.min(b,n))}
function planeOutline(){
 const p=state.personality||state.emotion;
 if(p==='cool'||p==='angry')return evolveOutline(PAGE_OUTLINE.map(([x,y])=>[250+(x-250)*.96,175+(y-175)*.92]),p,state.xp);
 if(p==='shy')return evolveOutline(PAGE_OUTLINE.map(([x,y])=>[250+(x-250)*.91,175+(y-175)*.96]),p,state.xp);
 if(p==='lively'||p==='playful')return evolveOutline(PAGE_OUTLINE.map(([x,y],i)=>[250+(x-250)*(1+(i%3-1)*.025),175+(y-175)*1.04]),p,state.xp);
 return evolveOutline(PAGE_OUTLINE,p,state.xp);
}
function smoothPath(points,close=false,angular=false){
 if(angular)return 'M'+points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join('L')+(close?'Z':'');
 let d='M'+points[0].map(n=>n.toFixed(2)).join(',');
 for(let i=1;i<points.length-1;i++){const a=points[i],b=points[i+1];d+='Q'+a.map(n=>n.toFixed(2)).join(',')+' '+((a[0]+b[0])/2).toFixed(2)+','+((a[1]+b[1])/2).toFixed(2)}
 d+='L'+points.at(-1).map(n=>n.toFixed(2)).join(',');return d+(close?'Z':'');
}
function growingLine(xp,pull=dimensionPull){
 const emotion=state.emotion,p=planeOutline(),span=clampRange((xp-2)/3,0,1),bend=clampRange((xp-5)/4,0,1);
 return p.map((target,i)=>{const u=i/(p.length-1),wave=Math.sin(u*Math.PI*2)*(emotion==='playful'?12:emotion==='lively'?7:emotion==='sad'?3:0),base=[250+(u-.5)*340*span,175+wave];return [base[0]*(1-bend)+target[0]*bend+Math.sin(u*Math.PI)*pull.x,base[1]*(1-bend)+target[1]*bend+Math.sin(u*Math.PI)*pull.y]});
}
function renderDimension(){
 if(rotationOwner!==state.born){rotationOwner=state.born;const pose=state.viewRotation;rotation=pose&&Number.isFinite(pose.yaw)&&Number.isFinite(pose.pitch)?{yaw:pose.yaw%(Math.PI*2),pitch:clampRange(pose.pitch,-1,1)}:{yaw:-.35,pitch:-.18}}
 const xp=state.xp,stage=dimensionStage(xp),e=EMOTIONS[state.emotion];document.body.dataset.dimension=stage.id;
 $('stage').textContent=stage.name;
 $('dimensionTag').textContent=xp?stage.name:'';$('dimensionTag').classList.toggle('visible',xp>0);
 $('pet').disabled=xp<1||!!activity;
 $('firstDot').style.opacity=stage.id==='point'?1:0;$('firstDot').setAttribute('r',xp===2?6:4);$('firstDot').style.fill=xp>=9?e.color:'#42483b';
 const angular=['cool','angry'].includes(state.personality||state.emotion),outline=planeOutline(),line=growingLine(xp);
 $('firstLine').style.opacity=['line','outline'].includes(stage.id)?1:0;updateGrowingLine(line,angular);
 $('body').setAttribute('d',smoothPath(outline,true,angular));$('body').style.display='block';$('body').style.opacity=xp>=9&&xp<24?1:0;$('body').style.fill=e.color;$('body').style.fillOpacity=clampRange((xp-8)/5,0,1);$('body').style.stroke=state.emotion==='cool'?'#626b73':'#596149';$('body').style.strokeWidth='3';
 for(const[id,on]of [['eyes',xp>=11],['mouth',xp>=12],['cheeks',xp>=13],['decor',xp>=14],['emotionExtra',xp>=11]])$(id).style.opacity=on?1:0;
 $('pageTexture').style.opacity=xp>=14?Math.min(.85,.3+(xp-14)*.04):0;
 const show=(id,on)=>{$(id).classList.toggle('visible',on);$(id).inert=!on};
 show('identity',xp>=14);show('careDock',xp>=14);show('memoryCorner',xp>=18);show('saveFooter',xp>=14);show('suggestions',xp>=3);show('changeSamples',xp>=3);
 if(xp<14){$('world').replaceChildren();$('situationScene').replaceChildren();$('placedOrnaments').hidden=true;$('statePanel').hidden=true}else $('placedOrnaments').hidden=false;
 $('feeling').style.opacity=xp>0?1:0;
 const next=DIMENSION_STAGES.find(s=>s.at>xp);
 $('growthText').textContent=next?'다음 형태까지 새로운 말 '+(next.at-xp)+'개':'내 말에 따라 계속 개성이 쌓이는 중';
 const start=stage.at,end=next?.at||xp+1;$('growthBar').style.width=next?(xp-start)/(end-start)*100+'%':'100%';
 $('level').textContent=stage.id==='volume'?'3D':stage.id==='plane'||stage.id==='life'?'2D':stage.id==='point'?'0D':stage.id==='blank'?'—':'1D';
 $('feedNote').textContent=stage.id==='blank'?'네가 건넨 말이 이 화면의 첫 조각이 돼.':stage.id==='point'?'작은 점도 네 손길에 반응해. 서로 다른 말이 모이면 길어져.':stage.id==='line'||stage.id==='outline'?'선을 살짝 끌어봐. 같은 흔적이 구부러져 윤곽을 만들고 있어.':stage.id==='plane'?'선 안에 색이 차오르는 중. 이 면이 곧 표정을 얻게 돼.':stage.id==='life'?'면을 살짝 만져봐. 말과 손길이 나만의 형태를 만들고 있어.':'끌어서 앞·옆·뒤를 돌려봐. 처음의 면이 두께를 얻었어.';
 if(xp<24){$('volumeMesh').replaceChildren();$('dimensionFrame').setAttribute('transform','translate('+dimensionPull.x*.15+' '+dimensionPull.y*.15+')');$('dimensionFrame').style.opacity=1;}
 else renderVolume();
}
function rotate3D(v,yaw,pitch){const x=v[0]*Math.cos(yaw)+v[2]*Math.sin(yaw),z=-v[0]*Math.sin(yaw)+v[2]*Math.cos(yaw);return [x,v[1]*Math.cos(pitch)-z*Math.sin(pitch),v[1]*Math.sin(pitch)+z*Math.cos(pitch)]}
function project3D(v){const r=rotate3D(v,rotation.yaw,rotation.pitch),scale=650/(650-r[2]);return [250+r[0]*scale,175+r[1]*scale,r[2]]}
function shadeColor(hex,light){const nums=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return '#'+nums.map(n=>Math.round(clampRange(n*light,0,255)).toString(16).padStart(2,'0')).join('')}
function renderVolume(){
 const shape=planeOutline().slice(0,-1),thickness=clampRange(24+(state.xp-24)*3,24,72),front=shape.map(([x,y])=>[x-250,y-175,thickness/2]),back=shape.map(([x,y])=>[x-250,y-175,-thickness/2]);
 const faces=[{points:front,normal:[0,0,1]},{points:back,normal:[0,0,-1]}];for(let i=0;i<front.length;i++){const j=(i+1)%front.length,dx=front[j][0]-front[i][0],dy=front[j][1]-front[i][1],len=Math.hypot(dx,dy)||1;faces.push({points:[front[i],front[j],back[j],back[i]],normal:[dy/len,-dx/len,0]})}
 const painted=faces.map(face=>{const pts=face.points.map(project3D),n=rotate3D(face.normal,rotation.yaw,rotation.pitch);return {pts,z:pts.reduce((sum,p)=>sum+p[2],0)/pts.length,light:.8+.19*Math.max(-.8,n[2]-.35*n[0]-.3*n[1])}}).sort((a,b)=>a.z-b.z);
 $('volumeMesh').replaceChildren();for(const f of painted){const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M'+f.pts.map(p=>p.slice(0,2).join(',')).join('L')+'Z');path.setAttribute('fill',shadeColor(EMOTIONS[state.emotion].color,f.light));path.setAttribute('stroke','#64715a66');path.setAttribute('stroke-width','1.5');$('volumeMesh').append(path)}
 const a=project3D([-170,-110,thickness/2]),b=project3D([170,-110,thickness/2]),c=project3D([-170,125,thickness/2]);const ma=(b[0]-a[0])/340,mb=(b[1]-a[1])/340,mc=(c[0]-a[0])/235,md=(c[1]-a[1])/235;
 $('dimensionFrame').setAttribute('transform','matrix('+[ma,mb,mc,md,a[0]-ma*80-mc*65,a[1]-mb*80-md*65].join(' ')+')');
 $('dimensionFrame').style.opacity=Math.cos(rotation.yaw)*Math.cos(rotation.pitch)>0?1:0;
}
function initDimensions(){
 const click=$('pet').onclick;$('pet').onclick=()=>{if(Date.now()<skipStrokeUntil)return;click()};
 $('pet').addEventListener('pointerdown',ev=>{if(state.xp<1||busy||activity||editing||ev.button!==0)return;dimensionPointer={x:ev.clientX,y:ev.clientY,yaw:rotation.yaw,pitch:rotation.pitch,moved:false};$('pet').setPointerCapture(ev.pointerId)});
 $('pet').addEventListener('pointermove',ev=>{if(!dimensionPointer||!$('pet').hasPointerCapture(ev.pointerId))return;const dx=ev.clientX-dimensionPointer.x,dy=ev.clientY-dimensionPointer.y;dimensionPointer.moved=Math.abs(dx)+Math.abs(dy)>5;
 if(state.xp>=24){rotation.yaw=dimensionPointer.yaw+dx*.012;rotation.pitch=clampRange(dimensionPointer.pitch+dy*.008,-1,1);renderVolume()}
 else{dimensionPull={x:clampRange(dx*.35,-45,45),y:clampRange(dy*.35,-45,45)};renderDimension()}});
 const finish=ev=>{if(!dimensionPointer)return;if(dimensionPointer.moved)skipStrokeUntil=Date.now()+300;dimensionPointer=null;dimensionPull={x:0,y:0};if($('pet').hasPointerCapture(ev.pointerId))$('pet').releasePointerCapture(ev.pointerId);if(state.xp>=24){state.viewRotation={...rotation};save()}renderDimension()};
 $('pet').addEventListener('pointerup',finish);$('pet').addEventListener('pointercancel',finish);
 $('pet').addEventListener('keydown',ev=>{if(state.xp<24||activity)return;const directions={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};if(directions[ev.key]){ev.preventDefault();rotation.yaw+=directions[ev.key][0];rotation.pitch=clampRange(rotation.pitch+directions[ev.key][1],-1,1);state.viewRotation={...rotation};save();renderVolume()}if(ev.key==='Home'){ev.preventDefault();rotation={yaw:-.35,pitch:-.18};state.viewRotation={...rotation};save();renderVolume()}});
}

function updateGrowingLine(points,angular){
 const immediate=typeof requestAnimationFrame!=='function'||dimensionPointer||(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 if(linePoints&&points.every((p,i)=>Math.abs(p[0]-linePoints[i][0])<.01&&Math.abs(p[1]-linePoints[i][1])<.01))return;
 if(lineTween!==null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(lineTween);
 if(immediate||!linePoints){linePoints=points;lineTween=null;$('firstLine').setAttribute('d',smoothPath(points,false,angular));return}
 const previous=linePoints.map(p=>[...p]),began=Date.now();
 const frame=()=>{const u=Math.min(1,(Date.now()-began)/900),t=1-Math.pow(1-u,3);linePoints=points.map((p,i)=>[previous[i][0]+(p[0]-previous[i][0])*t,previous[i][1]+(p[1]-previous[i][1])*t]);$('firstLine').setAttribute('d',smoothPath(linePoints,false,angular));if(u<1)lineTween=requestAnimationFrame(frame);else lineTween=null};lineTween=requestAnimationFrame(frame);
}
