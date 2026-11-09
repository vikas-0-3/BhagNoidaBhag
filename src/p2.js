'use strict';
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a), rint=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;

/* ---------- storage ---------- */
const SK='bhagNoidaBhag.v1';
let save={name:'',gender:'m',best:0,coins:0,runs:0,board:[],mute:false};
try{const s=JSON.parse(localStorage.getItem(SK)||'null');if(s&&typeof s==='object')save=Object.assign(save,s);}catch(e){}
function persist(){try{localStorage.setItem(SK,JSON.stringify(save));}catch(e){}}

/* ---------- audio (all synthesized) ---------- */
const A={ctx:null,master:null,nb:null,next:0,n:0,sirenT:0,
  init(){if(this.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;this.ctx=new C();this.master=this.ctx.createGain();this.master.gain.value=save.mute?0:.55;this.master.connect(this.ctx.destination);
    const n=this.ctx.sampleRate;this.nb=this.ctx.createBuffer(1,n,n);const d=this.nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}catch(e){this.ctx=null;}},
  resume(){if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();},
  setMute(m){save.mute=m;persist();if(this.master)this.master.gain.value=m?0:.55;},
  tone(f,d,type='square',vol=.15,slide=0,delay=0){if(!this.ctx)return;const c=this.ctx,t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+d+.02);},
  noise(d,vol=.2,hp=500,delay=0,lp=0){if(!this.ctx)return;const c=this.ctx,t=c.currentTime+delay,s=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();
    s.buffer=this.nb;f.type=lp?'lowpass':'highpass';f.frequency.value=lp||hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
    s.connect(f);f.connect(g);g.connect(this.master);s.start(t,Math.random()*.5);s.stop(t+d+.02);},
  coin(){this.tone(988,.07,'square',.09);this.tone(1480,.2,'square',.09,0,.06);},
  jump(){this.tone(260,.22,'sine',.2,420);this.noise(.12,.05,2500);},
  slide(){this.noise(.35,.14,900);},
  land(){this.noise(.08,.12,200,0,600);},
  step(){this.noise(.04,.05,1800);},
  swish(){this.noise(.1,.06,3000);},
  crash(){this.noise(.55,.4,0,0,900);this.tone(140,.45,'sawtooth',.25,-100);},
  power(){[523,659,784,1047].forEach((f,i)=>this.tone(f,.14,'triangle',.16,0,i*.06));},
  honk(){this.tone(410,.3,'sawtooth',.07);this.tone(520,.3,'sawtooth',.06);},
  whistle(){this.tone(2400,.18,'sine',.1,200);this.tone(2600,.25,'sine',.1,-200,.2);},
  siren(){this.tone(700,.35,'sawtooth',.045,350);this.tone(1050,.35,'sawtooth',.045,-350,.35);},
  over(){[392,330,262,196].forEach((f,i)=>this.tone(f,.28,'square',.14,0,i*.18));},
  zone(){[392,523,659].forEach((f,i)=>this.tone(f,.2,'triangle',.14,0,i*.08));},
  // dhol-style groove: kick/hat/bass + bhairavi-ish lead, tempo follows game speed
  music(speed,on){if(!this.ctx||!on)return;const c=this.ctx;if(this.next<c.currentTime)this.next=c.currentTime+.05;
    const bpm=118+speed*1.6,sd=60/bpm/4,sc=[0,1,4,5,7,8,10,12];
    while(this.next<c.currentTime+.12){const s=this.n%16,dl=this.next-c.currentTime;
      if(s%4===0){this.tone(110,.18,'sine',.32,-70,dl);}
      if(s===6||s===14||s===11){this.tone(200,.1,'triangle',.14,-90,dl);this.noise(.05,.08,1200,dl);}
      if(s%2===1)this.noise(.03,.04,6000,dl);
      if(s%8===0||s%8===3||s%8===6){const bn=[55,55,65.4,49][(this.n>>3)%4];this.tone(bn*2,.2,'sawtooth',.07,0,dl);}
      if(s%2===0&&Math.random()<.55){const n=sc[(Math.random()*sc.length)|0];this.tone(220*Math.pow(2,n/12),.16,'square',.035,0,dl);}
      this.next+=sd;this.n++;}}
};

/* ---------- renderer / scene ---------- */
let renderer,scene,camera,hemi,sun;
try{
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  $('stage').appendChild(renderer.domElement);
}catch(e){document.body.insertAdjacentHTML('beforeend','<div class="screen"><div class="card"><h1>WebGL needed</h1><p class="hint">This browser could not start 3D graphics. Try a current Chrome, Edge, Firefox or Safari.</p></div></div>');throw e;}
scene=new THREE.Scene();
camera=new THREE.PerspectiveCamera(64,1,.1,420);
hemi=new THREE.HemisphereLight(0xffe2b8,0x3a3050,.95);scene.add(hemi);
sun=new THREE.DirectionalLight(0xffc98a,.85);sun.position.set(-30,50,-20);scene.add(sun);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<.8?78:64;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

/* ---------- helpers: materials, boxes, textures ---------- */
const UB=new THREE.BoxGeometry(1,1,1),UC=new THREE.CylinderGeometry(.5,.5,1,14),US=new THREE.SphereGeometry(.5,14,10),UP=new THREE.PlaneGeometry(1,1);
const matC={};
function M(c){return matC[c]||(matC[c]=new THREE.MeshLambertMaterial({color:c}));}
const bmatC={};
function BM(c){return bmatC[c]||(bmatC[c]=new THREE.MeshBasicMaterial({color:c}));}
function mesh(geo,mat,w,h,d,x=0,y=0,z=0,parent){const m=new THREE.Mesh(geo,mat);m.scale.set(w,h,d);m.position.set(x,y,z);if(parent)parent.add(m);return m;}
const box=(w,h,d,c,x,y,z,p)=>mesh(UB,typeof c==='number'?M(c):c,w,h,d,x,y,z,p);
const cyl=(r,h,c,x,y,z,p)=>mesh(UC,typeof c==='number'?M(c):c,r*2,h,r*2,x,y,z,p);
const sph=(r,c,x,y,z,p)=>mesh(US,typeof c==='number'?M(c):c,r*2,r*2,r*2,x,y,z,p);
const texC={};
function winTex(kind){
  if(texC[kind])return texC[kind];
  const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
  g.fillStyle='#fff';g.fillRect(0,0,128,128);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){
    const x=i*32,y=j*32;
    if(kind==='glass'){g.fillStyle='#3a6a98';g.fillRect(x+1,y+2,30,28);g.fillStyle=Math.random()<.35?'#a9e3ff':'#5d95c4';g.fillRect(x+3,y+4,26,10);g.fillStyle='#fff';g.fillRect(x,y+30,32,2);}
    else if(kind==='shop'){g.fillStyle=j===3?'#6a5640':'#56627a';g.fillRect(x+5,y+6,22,20);if(Math.random()<.4){g.fillStyle='#ffd98a';g.fillRect(x+7,y+8,18,16);}}
    else{g.fillStyle='#55607a';g.fillRect(x+6,y+6,20,20);if(Math.random()<.3){g.fillStyle='#ffd98a';g.fillRect(x+8,y+8,16,16);}g.fillStyle='#d8d0c4';g.fillRect(x+4,y+26,24,3);}
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return texC[kind]=t;
}
const bmC={};
function bMat(c,kind){const k=c+kind;return bmC[k]||(bmC[k]=new THREE.MeshLambertMaterial({color:c,map:winTex(kind)}));}
// building with window UVs scaled to real size (4 units per tile); geometry is owned so it is disposed on recycle
function bldg(w,h,d,c,kind,parent,x,y,z){
  const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv,sizes=[d,d,0,0,w,w];
  for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=f*4+v;
    if(f<2||f>3){uv.setXY(i,uv.getX(i)*(f<2?d:w)/4,uv.getY(i)*h/4);}}
  g.userData.own=true;const m=new THREE.Mesh(g,bMat(c,kind));m.position.set(x,y+h/2,z);if(parent)parent.add(m);return m;
}
const sgC={};
function signTex(text,bg,fg,w=512,h=128){
  const k=text+bg+fg+w;if(sgC[k])return sgC[k];
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=fg;g.lineWidth=6;g.strokeRect(5,5,w-10,h-10);
  let s=h*.5;g.font=`${s}px Bungee, Impact, sans-serif`;while(g.measureText(text).width>w-36&&s>10){s-=2;g.font=`${s}px Bungee, Impact, sans-serif`;}
  g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+3);
  const t=new THREE.CanvasTexture(c);t.anisotropy=4;return sgC[k]=t;
}
function sign(text,bg,fg,wd,ht,parent,x,y,z,ry=0){
  const m=new THREE.Mesh(UP,new THREE.MeshBasicMaterial({map:signTex(text,bg,fg,Math.round(256*wd/ht),256),side:THREE.DoubleSide}));
  m.material.userData.shared=true;m.scale.set(wd,ht,1);m.position.set(x,y,z);m.rotation.y=ry;if(parent)parent.add(m);return m;
}
function disposeTree(o){o.traverse(n=>{if(n.geometry&&n.geometry.userData.own)n.geometry.dispose();});}

/* ---------- characters ---------- */
function limb(parent,x,y,w,h,d,c,z=0){const p=new THREE.Group();p.position.set(x,y,z);parent.add(p);box(w,h,d,c,0,-h/2,0,p);return p;}
function makeRunner(kind){ // kind: m | f | cop | cop2
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);body.position.y=.82;
  const skin=kind[0]==='c'?0xc68a5c:0xd9976a;
  const R={root,body};
  if(kind==='m'||kind==='f'){
    const top=kind==='m'?0x00c2d1:0xe5322d,bot=kind==='m'?0x2a3f7a:0x2a2a3a;
    box(.52,.62,.3,top,0,.38,0,body);
    R.legL=limb(body,-.14,0,.2,.82,.22,bot);R.legR=limb(body,.14,0,.2,.82,.22,bot);
    box(.22,.12,.32,0xffffff,-.14,-.8,-.04,R.legL);box(.22,.12,.32,0xffffff,.14,-.8,-.04,R.legR);
    R.armL=limb(body,-.34,.62,.15,.58,.15,skin);R.armR=limb(body,.34,.62,.15,.58,.15,skin);
    box(.17,.2,.17,top,0,-.1,0,R.armL);box(.17,.2,.17,top,0,-.1,0,R.armR);
    R.head=new THREE.Group();R.head.position.y=.78;body.add(R.head);
    sph(.2,skin,0,.12,0,R.head);
    if(kind==='m'){box(.4,.14,.4,0x15151a,0,.28,.02,R.head);box(.4,.2,.1,0x15151a,0,.16,.18,R.head);box(.34,.3,.2,0xff8a00,0,.3,.34,body);/*bag*/ box(.34,.34,.18,0xff8a00,0,.4,.24,body);}
    else{box(.42,.2,.42,0x15151a,0,.24,.02,R.head);R.pony=new THREE.Group();R.pony.position.set(0,.22,.2);R.head.add(R.pony);box(.1,.4,.1,0x15151a,0,-.2,.05,R.pony);
      R.scarf=new THREE.Group();R.scarf.position.set(0,.66,.16);body.add(R.scarf);box(.56,.1,.12,0xffb400,0,0,-.02,R.scarf);box(.34,.08,.6,0xffb400,0,-.02,.34,R.scarf);}
    box(.06,.06,.04,0x15151a,-.07,.14,-.19,R.head);box(.06,.06,.04,0x15151a,.07,.14,-.19,R.head);
  }else{
    const khaki=0xb9a063,pant=0x9a8450;
    const s=kind==='cop'?1.08:1;root.scale.setScalar(s);
    box(.6,.66,.34,khaki,0,.38,0,body);box(.62,.09,.36,0x2a1c10,0,.08,0,body);box(.12,.12,.04,0xffd44a,.14,.52,-.19,body);
    R.legL=limb(body,-.16,0,.24,.82,.25,pant);R.legR=limb(body,.16,0,.24,.82,.25,pant);
    box(.26,.14,.36,0x111111,-.16,-.8,-.05,R.legL);box(.26,.14,.36,0x111111,.16,-.8,-.05,R.legR);
    R.armL=limb(body,-.38,.64,.17,.6,.17,khaki);R.armR=limb(body,.38,.64,.17,.6,.17,khaki);
    box(.17,.15,.17,skin,0,-.64,0,R.armL);box(.17,.15,.17,skin,0,-.64,0,R.armR);
    box(.08,.9,.08,0x6b4a22,0,-.5,-.34,R.armR); // lathi
    R.head=new THREE.Group();R.head.position.y=.8;body.add(R.head);
    sph(.21,skin,0,.12,0,R.head);box(.12,.05,.04,0x15151a,0,.08,-.2,R.head);box(.12,.03,.04,0x15151a,0,.0,-.2,R.head);
    box(.46,.17,.46,khaki,0,.32,0,R.head);box(.4,.04,.2,0x111111,0,.25,-.28,R.head);
  }
  // soft blob shadow
  const sh=new THREE.Mesh(UP,new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.35,depthWrite:false}));
  sh.rotation.x=-Math.PI/2;sh.scale.set(1,.8,1);sh.position.y=.03;root.add(sh);R.shadow=sh;
  R.body=body;return R;
}
// pose: run | jump | slide | stumble
function poseRunner(R,t,pose,k=1){
  const p=t*11*k,s=Math.sin(p),b=R.body;
  if(pose==='run'){
    R.legL.rotation.x=s*1.1;R.legR.rotation.x=-s*1.1;R.armL.rotation.x=-s*1.0;R.armR.rotation.x=s*1.0;
    if(R.armR&&R.root.userData.cop){R.armR.rotation.x=-1.6+s*.2;}
    b.position.y=.82+Math.abs(Math.cos(p))*.1;b.rotation.x=-.18;b.rotation.z=Math.sin(p)*.05;
  }else if(pose==='jump'){
    R.legL.rotation.x=-.9;R.legR.rotation.x=.7;R.armL.rotation.x=-2.6;R.armR.rotation.x=-2.3;b.rotation.x=-.1;b.rotation.z=0;b.position.y=.82;
  }else if(pose==='slide'){
    b.rotation.x=1.3;b.position.y=.42;R.legL.rotation.x=.1;R.legR.rotation.x=.25;R.armL.rotation.x=-2.5;R.armR.rotation.x=-2.7;b.rotation.z=0;
  }else{ // stumble
    R.legL.rotation.x=Math.sin(p*2)*1.3;R.legR.rotation.x=-Math.sin(p*2)*1.3;R.armL.rotation.x=-2+Math.sin(p*3)*.6;R.armR.rotation.x=-2-Math.sin(p*3)*.6;b.rotation.x=.25;b.position.y=.82;
  }
  if(R.pony)R.pony.rotation.x=.9+Math.sin(p*1.1)*.4;
  if(R.scarf)R.scarf.rotation.x=.35+Math.sin(p*1.3)*.35;
  if(R.head)R.head.rotation.x=pose==='slide'?-.9:0;
}
