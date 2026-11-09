
/* ---------- obstacles, coins, power-ups, particles ---------- */
const CAR_COLS=[0xe5322d,0xf4f4f4,0x2b6fd9,0xbcbcc6,0x23232f,0xffb400,0x2fbf71];
function mkCar(){const g=new THREE.Group(),c=pick(CAR_COLS);
  box(1.9,.7,4.2,c,0,.65,0,g);box(1.6,.6,2.2,c,0,1.2,.2,g);box(1.64,.42,2.05,0x2a3a4a,0,1.24,.2,g);
  for(const sx of [-.95,.95])for(const sz of [-1.3,1.3])box(.3,.6,.62,0x111111,sx,.3,sz,g);
  box(.35,.2,.06,BM(0xfff2c0),-.6,.72,-2.12,g);box(.35,.2,.06,BM(0xfff2c0),.6,.72,-2.12,g);
  box(.35,.2,.06,BM(0xff2a2a),-.6,.72,2.12,g);box(.35,.2,.06,BM(0xff2a2a),.6,.72,2.12,g);
  return {g,hw:.95,hd:2.1,y0:0,y1:1.55};}
function mkAuto(){const g=new THREE.Group();
  box(1.5,.8,2.5,0x1f9e55,0,.75,.1,g);box(1.4,.12,2.2,0xffd400,0,1.85,.2,g);
  for(const sx of [-.68,.68])box(.08,1,.08,0x222222,sx,1.3,.95,g);for(const sx of [-.68,.68])box(.08,1,.08,0x222222,sx,1.3,-.5,g);
  box(1.3,.7,.8,0x2a2a35,0,1.15,.55,g);box(.9,.5,.9,0x1f9e55,0,1.0,-1.0,g);
  box(.3,.3,.3,0x111111,0,.28,-1.15,g);box(.3,.3,.3,0x111111,-.78,.28,1.0,g);box(.3,.3,.3,0x111111,.78,.28,1.0,g);
  box(.3,.15,.06,BM(0xff2a2a),0,.9,1.38,g);
  return {g,hw:.85,hd:1.4,y0:0,y1:1.9};}
function mkBus(){const g=new THREE.Group(),c=pick([0xe8601c,0x1f7a4a,0x2a62c8]);
  box(2.4,2.6,9,c,0,1.9,0,g);box(2.42,.35,9.02,0xffffff,0,1.0,0,g);box(2.44,.9,8.4,0x24425a,0,2.6,0,g);box(2.3,.3,8.8,0x333,0,.3,0,g);
  for(const sz of [-3,3])for(const sx of [-1.2,1.2])box(.3,.9,1.2,0x111,sx,.45,sz,g);
  sign('NOIDA-DELHI','#111','#ffd44a',2,.5,g,0,3.4,4.52);sign('NOIDA-DELHI','#111','#ffd44a',2,.5,g,0,3.4,-4.52,Math.PI);
  return {g,hw:1.2,hd:4.5,y0:0,y1:3.2};}
function mkCow(){const g=new THREE.Group();
  box(1,.9,1.8,0xf1efe6,0,1.05,0,g);box(.5,.4,.5,0x8a5a32,.2,1.2,.3,g);box(.4,.3,.5,0x8a5a32,-.25,1.3,-.5,g);
  box(.45,.5,.6,0xf1efe6,0,1.5,-1.0,g);box(.3,.2,.3,0xd8a8a0,0,1.35,-1.35,g);box(.08,.22,.08,0xeee,.2,1.85,-.95,g);box(.08,.22,.08,0xeee,-.2,1.85,-.95,g);
  box(.5,.35,.4,0xf1efe6,0,1.25,-.75,g);box(.08,.8,.08,0xd8d0c0,0,.9,.95,g);
  for(const sx of [-.3,.3])for(const sz of [-.6,.6])box(.15,.65,.15,0xe6e0d0,sx,.32,sz,g);
  return {g,hw:.6,hd:1.2,y0:0,y1:1.9};}
function mkBarrier(){const g=new THREE.Group();
  for(const sx of [-1,1])box(.14,.95,.5,0x444455,sx,.47,0,g);
  for(let k=0;k<6;k++)box(.4,.3,.12,k%2?0xe5322d:0xffffff,-1+k*.4+.2,.8,0,g);
  for(let k=0;k<6;k++)box(.4,.3,.12,k%2?0xffffff:0xe5322d,-1+k*.4+.2,.45,0,g);
  sign('POLICE','#0a4aa6','#ffffff',1.2,.3,g,0,1.15,0);
  return {g,hw:1.3,hd:.35,y0:0,y1:1.0};}
function mkBar(){const g=new THREE.Group(),t=pick(['MEGA SALE','WELCOME','DIWALI OFFER','FRESH CHAI','ROAD WORK','BIG SALE']),sc=pick(SIGNC);
  for(const sx of [-1.28,1.28])box(.14,2.3,.14,0x444455,sx,1.15,0,g);
  box(2.7,.7,.14,0x444455,0,1.6,0,g);sign(t,sc[0],sc[1],2.5,.6,g,0,1.6,.09);sign(t,sc[0],sc[1],2.5,.6,g,0,1.6,-.09,Math.PI);
  return {g,hw:1.3,hd:.2,y0:1.2,y1:2.0};}
const OBS={car:mkCar,auto:mkAuto,bus:mkBus,cow:mkCow,barrier:mkBarrier,bar:mkBar};
let obs=[],coinsA=[],pows=[],parts=[];
const COINGEO=new THREE.CylinderGeometry(.34,.34,.07,16);COINGEO.rotateX(Math.PI/2);
const COINMAT=new THREE.MeshLambertMaterial({color:0xffc400,emissive:0x6a4a00});
function addObs(type,lane,zz,vz=0){
  const o=OBS[type]();const x=lane*LANE;
  if(vz>0)o.g.rotation.y=Math.PI;
  o.g.position.set(x,0,zz);scene.add(o.g);
  Object.assign(o,{type,x,z:zz,vz,hit:false,honk:false});obs.push(o);return o;
}
function addCoin(x,y,zz){const m=new THREE.Mesh(COINGEO,COINMAT);m.position.set(x,y,zz);scene.add(m);coinsA.push({m,x,y,z:zz,fly:false});}
function coinLine(lane,zz,n,y=.9){for(let k=0;k<n;k++)addCoin(lane*LANE,y,zz-k*2.2);}
function coinArc(lane,zz,n){for(let k=0;k<n;k++)addCoin(lane*LANE,.9+Math.sin(k/(n-1)*Math.PI)*1.7,zz-k*1.6);}
const PTYPES={
  magnet:{label:'MAG',bg:'#e5322d',fg:'#fff',dur:10,name:'COIN MAGNET'},
  x2:{label:'2X',bg:'#ffb400',fg:'#14121f',dur:12,name:'DOUBLE PAISA'},
  shield:{label:'SAFE',bg:'#00a7b5',fg:'#fff',dur:12,name:'HELMET SHIELD'},
  sneak:{label:'JUMP',bg:'#2fbf71',fg:'#fff',dur:10,name:'SUPER SNEAKERS'}
};
function addPow(type,lane,zz){
  const T=PTYPES[type],tex=signTex(T.label,T.bg,T.fg,128,128);
  const m=new THREE.Mesh(UB,new THREE.MeshBasicMaterial({map:tex}));m.scale.set(.95,.95,.95);m.position.set(lane*LANE,1.3,zz);
  const halo=new THREE.Mesh(US,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.25}));halo.scale.set(1.8,1.8,1.8);m.add(halo);halo.scale.set(1.9,1.9,1.9);
  scene.add(m);pows.push({m,type,x:lane*LANE,z:zz});
}
const PGEO=UB;
function burst(x,y,z,color,n=8,sp=5){
  for(let i=0;i<n;i++){const m=new THREE.Mesh(PGEO,BM(color));m.scale.setScalar(rnd(.08,.2));m.position.set(x,y,z);scene.add(m);
    parts.push({m,vx:rnd(-sp,sp),vy:rnd(1,sp+2),vz:rnd(-sp,sp),life:rnd(.4,.8)});}
}
function stepParts(dt){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;p.vy-=16*dt;p.m.position.x+=p.vx*dt;p.m.position.y=Math.max(.05,p.m.position.y+p.vy*dt);p.m.position.z+=p.vz*dt;
  if(p.life<=0){scene.remove(p.m);parts.splice(i,1);}}}
function clearWorldObjs(){
  for(const o of obs){scene.remove(o.g);}obs=[];
  for(const c of coinsA)scene.remove(c.m);coinsA=[];
  for(const p of pows)scene.remove(p.m);pows=[];
  for(const p of parts)scene.remove(p.m);parts=[];
}

/* spawning: patterns scale with difficulty d in 0..1 */
let nextSpawn=0,dn=0;
function spawnRow(zz,d){
  const L=[-1,0,1],free=pick(L),r=Math.random(),onc=()=>Math.random()<.12+.28*d?rnd(9,15):0;
  let extra=0;
  if(r<.2){const l=pick(L),t=pick(['car','auto','cow','barrier','bar']);addObs(t,l,zz,t==='car'?onc():0);coinLine(pick(L.filter(x=>x!==l)),zz,5);}
  else if(r<.5){L.filter(l=>l!==free).forEach(l=>{const t=pick(['car','auto','cow','car','bus']);addObs(t,l,zz+rnd(-2,2),t==='car'?onc():0);if(t==='bus')extra=6;});coinLine(free,zz,7);}
  else if(r<.62){L.forEach(l=>addObs('barrier',l,zz));coinArc(pick(L),zz+5,8);}
  else if(r<.73){L.forEach(l=>addObs('bar',l,zz));coinLine(0,zz+4,6);}
  else if(r<.85){const l=pick(L.filter(x=>x!==free));addObs('bus',l,zz);coinLine(free,zz+4,8);extra=8;
    const o=pick(L.filter(x=>x!==free&&x!==l));addObs(pick(['car','auto','barrier']),o,zz+rnd(-3,3));}
  else{L.forEach((l,i)=>{if(l!==free)addObs(pick(['car','auto','cow','barrier','bar']),l,zz-i*9);});coinLine(free,zz-8,9);extra=10;}
  if(Math.random()<.07)addPow(pick(Object.keys(PTYPES)),free,zz-14);
  return extra;
}
