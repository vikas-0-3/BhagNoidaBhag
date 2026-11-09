
/* ---------- game state ---------- */
scene.add(sun.target);
let state='menu',z=-60,speed=0,time=0,score=0,bonus=0,coinCount=0,dist=0,gap=15,shake=0,caughtT=0,sirenT=0,curZone=-1,stepPh=0,toastT=0,zoneT=0;
const P={x:0,y:0,vy:0,lane:0,slide:0,stumble:0,tilt:0};
let power={magnet:0,x2:0,shield:0,sneak:0};
let player,cop1,cop2;
const segs=new Map();
function mkCops(){cop1=makeRunner('cop');cop2=makeRunner('cop2');cop1.root.userData.cop=cop2.root.userData.cop=true;scene.add(cop1.root,cop2.root);}
function mkPlayer(){if(player)scene.remove(player.root);player=makeRunner(save.gender);scene.add(player.root);}
function updateSegs(){
  const ci=Math.floor(-z/SEG);
  for(let i=Math.max(0,ci-BEHIND);i<=ci+AHEAD;i++)if(!segs.has(i)){const s=buildSeg(i);scene.add(s);segs.set(i,s);}
  for(const [i,s] of segs)if(i<ci-BEHIND-1||i>ci+AHEAD+2){scene.remove(s);disposeTree(s);segs.delete(i);}
  for(const s of segs.values())if(s.userData.upd)s.userData.upd(lastDt);
}
let lastDt=.016;
function resetRun(){
  clearWorldObjs();for(const s of segs.values()){scene.remove(s);disposeTree(s);}segs.clear();
  z=-60;speed=0;time=0;score=0;bonus=0;coinCount=0;dist=0;gap=15;shake=0;caughtT=0;curZone=-1;
  Object.assign(P,{x:0,y:0,vy:0,lane:0,slide:0,stumble:0,tilt:0});power={magnet:0,x2:0,shield:0,sneak:0};
  nextSpawn=z-90;mkPlayer();updateSegs();setZoneTarget(zoneAt(Math.floor(-z/SEG)));skyC.copy(skyT);
}

/* ---------- HUD ---------- */
const hudEls={score:$('hScore'),dist:$('hDist'),coins:$('hCoins'),pBar:$('pBar')},chipEls={};
for(const k in PTYPES){const c=document.createElement('div');c.className='chip';c.style.color=PTYPES[k].bg;c.hidden=true;c.innerHTML=PTYPES[k].name+'<i></i>';$('chips').appendChild(c);chipEls[k]=c;}
const routeEl=$('route');ZONES.forEach(Z=>{const d=document.createElement('div');d.className='st';d.textContent=Z.short;routeEl.appendChild(d);});
function updRoute(zi){[...routeEl.children].forEach((d,i)=>{d.className='st'+(i<zi?' done':i===zi?' cur':'');});}
function toast(t,ms=1200){const e=$('toast');e.textContent=t;e.classList.add('on');toastT=ms/1000;}
function showZone(Z){$('zone').querySelector('.z1').textContent=Z.name;$('zone').querySelector('.z2').textContent=Z.sub;$('zone').classList.add('on');zoneT=2.8;}
let lastS=-1,lastC=-1,lastD=-1;
function updHud(){
  if(score!==lastS){hudEls.score.textContent=score.toLocaleString('en-IN');lastS=score;}
  const d=Math.floor(dist);if(d!==lastD){hudEls.dist.textContent=d;lastD=d;}
  if(coinCount!==lastC){hudEls.coins.textContent=coinCount;lastC=coinCount;}
  hudEls.pBar.style.width=clamp(1-(gap-3)/12,0,1)*100+'%';
  for(const k in PTYPES){const v=power[k]>0;chipEls[k].hidden=!v;if(v)chipEls[k].lastChild.style.width=Math.min(100,power[k]/PTYPES[k].dur*100)+'%';}
}

/* ---------- actions ---------- */
function air(){return P.y>.001||P.vy>0;}
function moveLane(d){if(state!=='run')return;const n=clamp(P.lane+d,-1,1);if(n!==P.lane){P.lane=n;A.swish();}}
function doJump(){if(state!=='run'||air())return;P.vy=power.sneak>0?13.6:10.4;P.y=.002;P.slide=0;A.jump();burst(P.x,.1,z,0xcfc6b8,5,2);}
function doSlide(){if(state!=='run')return;if(air())P.vy=-20;P.slide=.75;A.slide();}
function onHit(o){
  o.hit=true;
  if(power.shield>0){power.shield=0;burst(o.x,1,o.z,0x00c2d1,16,7);A.crash();toast('HELMET SAVED YOU!');return;}
  A.crash();A.honk();shake=.7;P.stumble=.9;gap-=6;burst(P.x,1,z,0xff6a3a,14,6);
  const f=$('flash');f.style.opacity=.55;setTimeout(()=>f.style.opacity=0,120);
  if(gap<=3)beginCaught();else toast('POLICE CLOSING IN!',1000);
}
function beginCaught(){state='caught';caughtT=0;A.whistle();A.over();$('hud').hidden=false;}
function gameOver(){
  state='over';
  save.runs++;save.coins+=coinCount;const nb=score>save.best;if(nb)save.best=score;
  save.board.push({n:save.name||'Runner',s:score,d:Math.floor(dist)});save.board.sort((a,b)=>b.s-a.s);save.board=save.board.slice(0,5);persist();
  const Z=zoneAt(Math.floor(-z/SEG));
  $('oSub').textContent='Constable ji caught '+(save.name||'you')+' near '+Z.name+'.';
  $('oScore').textContent=score.toLocaleString('en-IN');$('oDist').textContent=Math.floor(dist);$('oCoins').textContent=coinCount;
  $('oNew').textContent=nb?'New personal best!':'Best: '+save.best.toLocaleString('en-IN');
  renderBoard($('oBoard'));$('hud').hidden=true;$('over').hidden=false;
}
function renderBoard(el){
  el.innerHTML='';const b=save.board;
  if(!b.length){el.innerHTML='<li><span>No runs yet</span><span>Be the first</span></li>';return;}
  b.forEach((e,i)=>{const li=document.createElement('li');const a=document.createElement('span'),c=document.createElement('span');a.textContent=(i+1)+'. '+e.n;c.textContent=e.s.toLocaleString('en-IN')+' ('+e.d+'m)';li.append(a,c);el.appendChild(li);});
}

/* ---------- per-frame ---------- */
function env(dt){
  skyC.lerp(skyT,Math.min(1,dt*.9));scene.fog.color.copy(skyC);
  sun.position.set(-30,50,z-20);sun.target.position.set(0,0,z);
  sunMesh.position.set(0,36,camera.position.z-350);
  updateSegs();
}
function posCops(dt,k){
  const tx=P.x,vis=3+(gap-3)*.22;
  cop1.root.position.set(lerp(cop1.root.position.x,tx,Math.min(1,dt*5)),0,z+vis);
  cop2.root.position.set(lerp(cop2.root.position.x,tx+(tx>0?-LANE:LANE)*.55,Math.min(1,dt*4)),0,z+vis+2.4);
  poseRunner(cop1,time+.3,'run',k);poseRunner(cop2,time+.9,'run',k*.95);
}
function update(dt){
  time+=dt;const diff=clamp(time/160,0,1),Z=zoneAt(Math.floor(-z/SEG));
  let target=16+diff*17+(Z.style==='expy'?2.5:0);
  if(P.stumble>0){P.stumble-=dt;target*=.5;}
  speed+=(target-speed)*Math.min(1,dt*2.2);
  const dz=speed*dt;z-=dz;dist=-z-60;
  // lateral + jump + slide
  const tx=P.lane*LANE,px=P.x;P.x+=(tx-P.x)*Math.min(1,dt*13);P.tilt=lerp(P.tilt,clamp(-(P.x-px)/dt*.05,-.5,.5),.25);
  if(air()){P.vy-=30*dt;P.y+=P.vy*dt;if(P.y<=0){P.y=0;P.vy=0;A.land();burst(P.x,.1,z,0xcfc6b8,5,2);}}
  if(P.slide>0)P.slide-=dt;
  for(const k in power)if(power[k]>0)power[k]=Math.max(0,power[k]-dt);
  if(gap<15-diff*4&&P.stumble<=0)gap=Math.min(15-diff*4,gap+.75*dt);
  // spawn
  while(nextSpawn>z-170){const ex=spawnRow(nextSpawn,diff);nextSpawn-=Math.max(17,speed*(1.5-.55*diff))+ex+rnd(0,6);}
  // obstacles
  const ph=P.slide>0?.7:1.75;
  for(let i=obs.length-1;i>=0;i--){const o=obs[i];
    if(o.vz){o.z+=o.vz*dt;o.g.position.z=o.z;if(!o.honk&&z-o.z<48&&z-o.z>0){o.honk=true;A.honk();}}
    if(!o.hit&&Math.abs(o.x-P.x)<o.hw+.3&&Math.abs(o.z-z)<o.hd+.3&&P.y<o.y1&&P.y+ph>o.y0){onHit(o);if(state!=='run')return;}
    if(o.z>z+18){scene.remove(o.g);obs.splice(i,1);}
  }
  // coins
  for(let i=coinsA.length-1;i>=0;i--){const c=coinsA[i];c.m.rotation.y+=dt*5;
    if(power.magnet>0&&!c.fly&&Math.abs(c.z-z)<14&&Math.abs(c.x-P.x)<8)c.fly=true;
    if(c.fly){const k=Math.min(1,dt*9);c.x+=(P.x-c.x)*k;c.y+=(P.y+.9-c.y)*k;c.z+=(z-c.z)*k;}
    c.m.position.set(c.x,c.y,c.z);
    if(Math.abs(c.x-P.x)<1.1&&Math.abs(c.z-z)<1.3&&Math.abs(c.y-(P.y+.9))<1.4){
      coinCount++;bonus+=power.x2>0?20:10;A.coin();burst(c.x,c.y,c.z,0xffc400,3,3);scene.remove(c.m);coinsA.splice(i,1);
    }else if(c.z>z+12){scene.remove(c.m);coinsA.splice(i,1);}
  }
  for(let i=pows.length-1;i>=0;i--){const p=pows[i];p.m.rotation.y+=dt*2.5;p.m.position.y=1.3+Math.sin(time*4+i)*.2;
    if(Math.abs(p.x-P.x)<1.2&&Math.abs(p.z-z)<1.4&&P.y<2.4){power[p.type]=PTYPES[p.type].dur;A.power();toast(PTYPES[p.type].name+'!');burst(p.x,1.3,p.z,0xffffff,12,5);scene.remove(p.m);pows.splice(i,1);}
    else if(p.z>z+12){scene.remove(p.m);pows.splice(i,1);}
  }
  score=Math.floor(dist)+bonus;
  // zone change
  const zi=Math.floor(Math.floor(-z/SEG)/SPZ);
  if(zi!==curZone){const first=curZone<0;curZone=zi;const ZZ=ZONES[zi%ZONES.length];setZoneTarget(ZZ);showZone(ZZ);updRoute(zi%ZONES.length);if(!first)A.zone();}
  // police ambience
  sirenT-=dt;if(gap<9&&sirenT<=0){A.siren();sirenT=.75;}
  // footsteps
  stepPh+=dt*speed*.5;if(stepPh>2.2){stepPh=0;if(!air()&&P.slide<=0)A.step();}
  A.music(speed,true);
  animate(dt);
  env(dt);updHud();
}
function animate(dt){
  const pose=P.stumble>0?'stumble':P.slide>0?'slide':air()?'jump':'run';
  const r=player.root;r.position.set(P.x,P.y,z);r.rotation.z=P.tilt*.5;r.rotation.y=clamp(-(P.lane*LANE-P.x)*.12,-.4,.4);
  player.shadow.position.y=.03-P.y;player.shadow.scale.set(1-P.y*.12,.8-P.y*.1,1);
  poseRunner(player,time,pose,clamp(speed/20,.7,1.5));
  posCops(dt,clamp(speed/18,.8,1.5));
  if(shake>0)shake=Math.max(0,shake-dt*2.2);
  const sx=(Math.random()-.5)*shake*.5,sy=(Math.random()-.5)*shake*.5;
  camera.position.set(P.x*.55+sx,4.6+P.y*.35+sy,z+8.8);
  camera.lookAt(P.x*.35,1.5+P.y*.25,z-9);
  const bf=camera.aspect<.8?78:64;const f=bf+speed*.22;if(Math.abs(camera.fov-f)>.1){camera.fov=f;camera.updateProjectionMatrix();}
}
function updateCaught(dt){
  caughtT+=dt;time+=dt;speed=Math.max(0,speed-40*dt);z-=speed*dt;gap=lerp(gap,1.5,Math.min(1,dt*4));
  P.vy=0;P.y=0;P.stumble=1;
  animate(dt);env(dt);
  if(caughtT>1.6)gameOver();
}
function updateMenu(dt){
  time+=dt;z-=9*dt;
  const r=player.root;r.position.set(0,0,z);r.rotation.set(0,0,0);poseRunner(player,time,'run',.85);
  gap=10;P.x=0;posCops(dt,.85);
  const ang=time*.25;camera.position.set(3.3+Math.sin(ang)*.8,2.0,z-5.4);camera.lookAt(0,1.1,z+3);
  const f=camera.aspect<.8?80:60;if(Math.abs(camera.fov-f)>.1){camera.fov=f;camera.updateProjectionMatrix();}
  const zi=Math.floor(Math.floor(-z/SEG)/SPZ);setZoneTarget(ZONES[zi%ZONES.length]);
  env(dt);
}

/* ---------- flow ---------- */
function startGame(){
  const nm=$('name').value.trim().slice(0,14)||'Runner';save.name=nm;persist();
  A.init();A.resume();resetRun();state='run';speed=13;
  $('hName').textContent=nm;$('menu').hidden=true;$('over').hidden=true;$('pause').hidden=true;$('hud').hidden=false;
  updRoute(0);lastS=lastC=lastD=-1;toast('BHAAG '+nm.toUpperCase()+'!',1400);A.whistle();
}
function toMenu(){
  state='menu';$('hud').hidden=true;$('over').hidden=true;$('pause').hidden=true;$('menu').hidden=false;
  resetRun();refreshMenu();
}
function pauseGame(){if(state!=='run')return;state='paused';$('pause').hidden=false;}
function resumeGame(){if(state!=='paused')return;state='run';$('pause').hidden=true;A.resume();}
function refreshMenu(){$('mBest').textContent=save.best.toLocaleString('en-IN');$('mCoins').textContent=save.coins;$('mRuns').textContent=save.runs;renderBoard($('mBoard'));}
function setGender(g){save.gender=g;$('gM').setAttribute('aria-pressed',g==='m');$('gF').setAttribute('aria-pressed',g==='f');persist();if(state==='menu')mkPlayer();}

$('gM').onclick=()=>setGender('m');$('gF').onclick=()=>setGender('f');
$('bPlay').onclick=startGame;$('bAgain').onclick=startGame;$('bMenu').onclick=toMenu;$('bQuit').onclick=toMenu;
$('bPause').onclick=pauseGame;$('bResume').onclick=resumeGame;
$('bMute').onclick=()=>{A.init();A.setMute(!save.mute);$('bMute').style.opacity=save.mute?.45:1;};
$('name').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')startGame();});
addEventListener('keydown',e=>{
  if(e.target&&e.target.id==='name')return;
  const k=e.key;
  if(state==='run'){
    if(k==='ArrowLeft'||k==='a'||k==='A'){moveLane(-1);e.preventDefault();}
    else if(k==='ArrowRight'||k==='d'||k==='D'){moveLane(1);e.preventDefault();}
    else if(k==='ArrowUp'||k==='w'||k==='W'||k===' '){doJump();e.preventDefault();}
    else if(k==='ArrowDown'||k==='s'||k==='S'){doSlide();e.preventDefault();}
    else if(k==='Escape'||k==='p'||k==='P')pauseGame();
  }else if(state==='paused'&&(k==='Escape'||k==='p'||k==='P'))resumeGame();
  else if((state==='over')&&k==='Enter')startGame();
});
// swipe / drag
let sw=null;const stage=$('stage');
stage.addEventListener('pointerdown',e=>{sw={x:e.clientX,y:e.clientY};});
stage.addEventListener('pointermove',e=>{
  if(!sw||state!=='run')return;const dx=e.clientX-sw.x,dy=e.clientY-sw.y,T=26;
  if(Math.abs(dx)>T&&Math.abs(dx)>Math.abs(dy)){moveLane(dx>0?1:-1);sw={x:e.clientX,y:e.clientY};}
  else if(dy<-T){doJump();sw={x:e.clientX,y:e.clientY};}
  else if(dy>T){doSlide();sw={x:e.clientX,y:e.clientY};}
});
addEventListener('pointerup',()=>sw=null);addEventListener('pointercancel',()=>sw=null);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();});

/* ---------- boot ---------- */
let last=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(.05,(now-last)/1000);last=now;lastDt=dt;
  if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').classList.remove('on');}
  if(zoneT>0){zoneT-=dt;if(zoneT<=0)$('zone').classList.remove('on');}
  if(state==='run')update(dt);else if(state==='caught')updateCaught(dt);else if(state==='menu')updateMenu(dt);
  renderer.render(scene,camera);
}
function boot(){
  $('name').value=save.name||'';setGender(save.gender==='f'?'f':'m');$('bMute').style.opacity=save.mute?.45:1;
  mkCops();resetRun();refreshMenu();requestAnimationFrame(frame);
}
window.__bnb={get state(){return state},get z(){return z},get speed(){return speed},get gap(){return gap},get obs(){return obs.length},get score(){return score},start:startGame,P,godmode(){gap=99;},tp(i){z=-i*SEG-4;nextSpawn=z-90;clearWorldObjs();}};
const fontP=document.fonts&&document.fonts.load?Promise.race([document.fonts.load('40px Bungee'),new Promise(r=>setTimeout(r,1500))]):Promise.resolve();
fontP.catch(()=>{}).then(boot);
