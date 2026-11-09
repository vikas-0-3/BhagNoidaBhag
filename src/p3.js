
/* ---------- Noida route: zones ---------- */
const LANE=2.6,SEG=48,SPZ=9,AHEAD=8,BEHIND=2;
const ZONES=[
 {id:'s18',name:'Sector 18',short:'SEC 18',sub:'DLF Mall of India and neon lanes',sky:0xff9a5a,ground:0x6a6070,road:0x2b2a35,style:'mall',pal:[0xe86a4a,0xf2b84b,0xb55a8a,0x6aa0d8],lm:[['DLF MALL OF INDIA','#c8102e','#ffffff'],['GARDENS GALLERIA','#1b2a6b','#ffd44a']],sun:0xffe08a},
 {id:'s52',name:'Sector 52 Chowk',short:'SEC 52',sub:'Aqua Line metro overhead',sky:0x8fb7e8,ground:0x77808c,road:0x30323c,style:'metro',pal:[0xd8c9a8,0xc9b6a0,0xa9b8c9,0xe0d2b4],lm:[['SECTOR 52 METRO','#00a7b5','#ffffff'],['NOIDA POLICE CHOWKI','#1b2a6b','#ffffff']],sun:0xfff3c4,station:'SECTOR 52'},
 {id:'s74',name:'Sector 74 Market',short:'SEC 74',sub:'Chaat, chai and chaos',sky:0xffc46a,ground:0x7a6a5a,road:0x34303a,style:'market',pal:[0xd96a3a,0x3a9ad9,0xe2b13a,0x8a5ad9,0x4fb36e],lm:[['74 MARKET','#e5322d','#ffffff'],['SHARMA MITHAI','#ffb400','#14121f']],sun:0xffd070},
 {id:'atta',name:'Atta Market',short:'ATTA',sub:'Sector 27 shopping lanes',sky:0xf08aa0,ground:0x76606a,road:0x30283a,style:'market',pal:[0xe84a7a,0xf2a03a,0x3ab0a0,0xb04ad9,0xe8d03a],lm:[['ATTA MARKET','#6a1b9a','#ffe27a'],['JAIN SWEETS','#2fbf71','#ffffff']],sun:0xffb0a0},
 {id:'logix',name:'Logix City Centre',short:'LOGIX',sub:'Sector 32 mall district',sky:0x6fa8e8,ground:0x6e7480,road:0x2c2e38,style:'mall',pal:[0x6aa0d8,0x9ab6d8,0x7ad0c0,0xd8b46a],lm:[['LOGIX CITY CENTRE','#0a4aa6','#ffffff'],['LOGIX BLOSSOM','#d81b60','#ffffff']],sun:0xfff8d0},
 {id:'amity',name:'Amity University',short:'AMITY',sub:'Red brick campus gate',sky:0x9ad0a0,ground:0x4a8a52,road:0x30323a,style:'campus',pal:[0xa8452f,0xb5573a,0x9a3c2a,0xc9784f],lm:[['AMITY UNIVERSITY','#7a1c1c','#ffe6a0'],['AMITY BUSINESS SCHOOL','#14121f','#ffb400']],sun:0xfff0b0},
 {id:'advant',name:'Advant Navis',short:'ADVANT',sub:'Business park, Sector 142',sky:0xb89ae8,ground:0x6a6a7c,road:0x2a2a38,style:'office',pal:[0xb8c8e0,0x9ab4d0,0xc8d4e4,0xa0c0d8],lm:[['ADVANT NAVIS','#14121f','#00c2d1'],['BUSINESS PARK','#0a4aa6','#ffffff']],sun:0xffc8e8},
 {id:'expy',name:'Noida Expressway',short:'EXPWY',sub:'Greater Noida bound. Pedal to the metal',sky:0x4a5a9a,ground:0x4a6a4a,road:0x24242c,style:'expy',pal:[0x9ab0d0,0xb0c0d8,0x8aa0c8],lm:[['NOIDA EXPRESSWAY','#0b6b3a','#ffffff'],['GREATER NOIDA >','#0b6b3a','#ffffff']],sun:0xe8e0ff,gantry:'NOIDA - GREATER NOIDA EXPWY'},
 {id:'dlf',name:'Noida City Centre',short:'CITY CTR',sub:'DLF Mall and the Blue Line',sky:0x2a2a5a,ground:0x5a5a6a,road:0x22222c,style:'metro',pal:[0xd0c0a8,0xb8a890,0xa0b0c8],lm:[['DLF MALL OF INDIA','#c8102e','#ffffff'],['NOIDA CITY CENTRE','#0a4aa6','#ffffff']],sun:0xffe8a0,station:'CITY CENTRE',night:true},
 {id:'off',name:'Sector 62 Offices',short:'SEC 62',sub:'IT hub rush hour',sky:0xff8a6a,ground:0x706a78,road:0x2a2832,style:'office',pal:[0xa0b8d8,0xc8d8e8,0xe0c8a8],lm:[['SECTOR 62 IT HUB','#14121f','#ffb400'],['TECH PARK','#00a7b5','#ffffff']],sun:0xffb070}
];
const zoneAt=i=>ZONES[Math.floor(i/SPZ)%ZONES.length];
const STY={
 mall:{w:[12,18],d:[12,16],h:[10,22],kind:'glass',off:8.5,gap:[1,4]},
 market:{w:[7,10],d:[8,10],h:[6,11],kind:'shop',off:7.8,gap:[0,1]},
 campus:{w:[10,16],d:[10,14],h:[7,14],kind:'resi',off:12,gap:[5,9]},
 office:{w:[10,16],d:[10,14],h:[24,48],kind:'glass',off:9,gap:[2,6]},
 expy:{w:[10,16],d:[10,16],h:[20,40],kind:'glass',off:20,gap:[8,14]},
 metro:{w:[9,13],d:[9,12],h:[9,20],kind:'resi',off:9.8,gap:[1,3]}
};
const SHOPS=['CHAAT CORNER','MOBILE POINT','RAJU PARANTHA','KAPOOR TAILORS','ATTA CHAKKI','MITHAI GHAR','CYCLE STORE','FRUIT CHAAT','PAN SHOP','JUICE BAR','ELECTRICALS','MOMO HUB'];
const SIGNC=[['#e5322d','#fff'],['#2fbf71','#fff'],['#ffb400','#14121f'],['#0a4aa6','#fff'],['#6a1b9a','#ffe27a']];

function tree(p,x,z,s=1,c=0x2f8a4a){cyl(.14*s,1.4*s,0x6b4a2a,x,.7*s,z,p);sph(.95*s,c,x,2.1*s,z,p);}
function lamp(p,x,z){const d=x>0?-1:1;cyl(.07,5,0x333344,x,2.5,z,p);box(1.4,.1,.2,0x333344,x+d*.6,5,z,p);box(.55,.1,.3,BM(0xfff2b0),x+d*1.2,4.93,z,p);}
function facing(side){return side>0?-Math.PI/2+.6:Math.PI/2-.6;}


const CORP=['TECHNOVA','NEXGEN SOFT','CYBERHUB','FINEDGE','CLOUDWAVE','INFOTECH','DATAWORKS','BIZ TOWER'];
const MALLN=['CINEPLEX','FOOD COURT','FASHION','ELECTRONICS','MULTIPLEX','BRANDS','SALE'];
function palm(p,x,z,s=1){cyl(.12*s,2.6*s,0x8a6a3a,x,1.3*s,z,p);for(let k=0;k<5;k++){const a=k*1.26;box(.2,.08,1.5*s,0x2f9a4a,x+Math.sin(a)*.7*s,2.7*s,z+Math.cos(a)*.7*s,p).rotation.y=a;}}
function mallBlock(g,Z,side,x,z,w,d,h){
  const fx=x-side*w/2,c=pick(Z.pal);
  bldg(w,6,d,0xffffff,'glass',g,x,0,z);                       // glass atrium podium
  bldg(w*.82,h-6,d*.82,0xffffff,'glass',g,x+side*w*.04,6,z);   // set-back upper floors
  box(w*.9,1.4,d*.9,c,x,h+.7,z,g);                              // roof band
  box(2.6,.3,5,c,fx-side*1.4,3.6,z,g);                           // entrance canopy
  for(const dz of [-2.2,2.2])box(.25,3.6,.25,0xdddddd,fx-side*2.5,1.8,z+dz,g);
  box(.3,.05,d*.8,0x2a2a35,fx-side*.3,.04,z,g);
  sign(pick(MALLN),pick(SIGNC)[0],'#ffffff',7,1.6,g,fx-side*.12,7.5,z,facing(side));
  for(const dz of [-d*.35,d*.35]){cyl(.06,6,0xbbbbbb,fx-side*3.2,3,z+dz,g);box(1.6,1,.05,pick([0xe5322d,0xffb400,0x00c2d1]),fx-side*3.2,5.4,z+dz,g);}
  palm(g,side*7,z-d*.3,1);palm(g,side*7,z+d*.3,1);
}
function officeTower(g,Z,side,x,z,w,d,h){
  const fx=x-side*w/2;
  bldg(w+2,4,d+2,0xffffff,'glass',g,x,0,z);                    // lobby podium
  bldg(w,h,d,pick([0xffffff,0xcfe6ff,0xe0e8f0]),'glass',g,x,4,z);
  box(w*.6,3,d*.6,0x3a4a5e,x,h+5.5,z,g);cyl(.08,6,0x999999,x,h+10,z,g); // crown + mast
  box(w*.5,.5,.3,BM(0xff3030),x,h+7.2,z-d*.31,g);
  sign(pick(CORP),'#14121f','#00c2d1',7,1.5,g,fx-side*.12,Math.min(h-2,14),z,facing(side));
  box(w,.8,2,0x2f7a3a,fx-side*2.5,.4,z,g);                       // hedge
  box(.2,6,.2,0xcccccc,fx-side*4,3,z+d*.35,g);box(1.4,.9,.05,0x0a4aa6,fx-side*4,5.3,z+d*.35,g);
}
function shopRow(g,Z,side,x,z,w,d,h){
  const fx=x-side*w/2,n=Math.max(2,Math.floor(d/3.4)),sw=d/n;
  bldg(w,h,d,pick(Z.pal),'shop',g,x,0,z);
  for(let k=0;k<n;k++){
    const zz=z-d/2+sw*(k+.5),sc=pick(SIGNC);
    box(.3,2.6,sw*.88,pick([0xdddddd,0x9a9aa8,0xc8b078]),fx-side*.1,1.3,zz,g);                 // rolled shutter
    for(let q=0;q<4;q++)box(1.8,.14,sw/4,q%2?0xffffff:pick([0xe5322d,0x2fbf71,0xffb400]),fx-side*1.0,3.1-q*.04,zz-sw*.375+q*sw/4,g).rotation.z=side*.25; // striped awning
    sign(pick(SHOPS),sc[0],sc[1],sw*.9,1,g,fx-side*.15,3.9,zz,facing(side));
    if(Math.random()<.6)sign(pick(['OFFER','OPEN','SALE 50%','CHAI','NEW']),'#ffffff','#e5322d',1.4,.6,g,fx-side*.2,5.2,zz,facing(side));
    if(Math.random()<.5)box(.9,.9,.7,pick([0xcfa56a,0xd8d0c0]),fx-side*1.0,.45,zz+sw*.3,g);     // crates
    if(Math.random()<.35){cyl(.04,2.2,0x555555,side*6.2,1.1,zz,g);box(2.2,.12,2.2,pick([0xe5322d,0xffb400,0x00a7b5]),side*6.2,2.3,zz,g);box(1.2,.9,.9,0xe8e0d0,side*6.2,.5,zz,g);} // umbrella stall
  }
  for(let k=0;k<5;k++)box(.18,.18,.18,BM(pick([0xffe08a,0xff8a5a,0xffffff])),fx-side*.8,5.7,z-d/2+d*k/4,g); // string lights
}
function sideBuildings(g,Z,side){
  const S=STY[Z.style];let z=-3-rnd(0,4);
  const off=S.off+(Z.style==='metro'&&side<0?9:0);
  while(z>-SEG+6){
    const w=rnd(...S.w),d=rnd(...S.d),h=rnd(...S.h),c=pick(Z.pal),x=side*(off+w/2);
    if(z-d<-SEG)break;
    const zc=z-d/2;
    if(Z.style==='mall')mallBlock(g,Z,side,x,zc,w,d,h);
    else if(Z.style==='office'||Z.style==='expy')officeTower(g,Z,side,x,zc,w,d,h);
    else if(Z.style==='market')shopRow(g,Z,side,x,zc,w,d,h);
    else{
      bldg(w,h,d,S.kind==='glass'?0xffffff:c,S.kind,g,x,0,zc);
      if(Z.style==='campus')tree(g,side*6.8,zc,1.1,0x3a9a52);
    }
    if(Math.random()<.5&&Z.style!=='expy'&&Z.style!=='market')tree(g,side*6.6,z-rnd(0,d),rnd(.7,1.1),pick([0x2f8a4a,0x3a9a52,0x58a838]));
    z-=d+rnd(...S.gap);
  }
}
function gantry(g,text,bg,fg,z){
  box(.5,7,.5,0x4a4a5a,-5.9,3.5,z,g);box(.5,7,.5,0x4a4a5a,5.9,3.5,z,g);box(12.4,.5,.5,0x4a4a5a,0,7,z,g);
  sign(text,bg,fg,10,1.8,g,0,6.1,z+.02);sign(text,bg,fg,10,1.8,g,0,6.1,z-.02,Math.PI);
}
function landmark(g,Z,side,k){
  const L=Z.lm[k];if(!L)return;const w=22,d=26,h=Z.style==='office'?36:20,x=side*(10+w/2),z=-SEG/2;
  const kind=Z.style==='campus'?'resi':'glass';
  const b=bldg(w,h,d,kind==='resi'?pick(Z.pal):0xffffff,kind,g,x,0,z);
  sign(L[0],L[1],L[2],18,4.2,g,x-side*(w/2+.15),Math.min(h-3.5,13),z,facing(side)-side*.0);
  box(w+2,1,d+2,0xdad4e8,x,.5,z,g);
  if(Z.style==='campus'){cyl(2.6,2.4,0xd8c090,x,h+1.2,z,g);sph(2.6,0xe8c860,x,h+2.4,z,g);}
  for(let q=0;q<3;q++)tree(g,side*7,z-10+q*10,1.1);
}
function viaduct(g,Z){
  const x=-9;
  box(5.4,1.3,SEG,0xcfd3da,x,8,-SEG/2,g);box(5.5,.4,SEG,0x00c2d1,x,8.9,-SEG/2,g);
  box(.3,.9,SEG,0xaab0ba,x-2.6,9.2,-SEG/2,g);box(.3,.9,SEG,0xaab0ba,x+2.6,9.2,-SEG/2,g);
  for(const zz of [-12,-36]){box(1.6,7.6,1.6,0xbfc4cc,x,3.8,zz,g);box(4.6,.8,1.6,0xbfc4cc,x,7.7,zz,g);}
  // train
  const tr=new THREE.Group();tr.position.set(x,10.1,0);g.add(tr);
  for(let c=0;c<4;c++){box(3.3,2.6,9,0xf2f6fa,0,0,-c*9.4,tr);box(3.4,.5,9.05,0x00c2d1,0,-.7,-c*9.4,tr);box(3.35,.9,9.05,0x24425a,0,.5,-c*9.4,tr);}
  tr.position.z=-rnd(0,SEG);g.userData.train=tr;
  g.userData.upd=dt=>{tr.position.z+=34*dt;if(tr.position.z>60)tr.position.z=-SEG-60;};
}
function station(g,Z){
  const x=-9,z=-SEG/2;
  box(12,.8,34,0x00a7b5,x,12.2,z,g);box(.4,3,34,0xdff6f8,x-5.8,10.6,z,g);box(.4,3,34,0xdff6f8,x+5.8,10.6,z,g);
  sign(Z.station+' METRO','#00a7b5','#ffffff',12,2.6,g,x+6.1,11,z,Math.PI/2-.4);
}
function buildSeg(i){
  const Z=zoneAt(i),j=i%SPZ,g=new THREE.Group();g.position.z=-i*SEG;g.userData={i,Z,upd:null,train:null};
  const gm=mesh(UP,M(Z.ground),300,SEG,1,0,-.03,-SEG/2,g);gm.rotation.x=-Math.PI/2;
  const rd=mesh(UP,M(Z.road),8.6,SEG,1,0,0,-SEG/2,g);rd.rotation.x=-Math.PI/2;
  for(const lx of [-1.3,1.3])for(let k=0;k<4;k++)box(.14,.03,2.6,0xf4f0e0,lx*1.0,.03,-6-k*12,g);
  box(.2,.03,SEG,0xf4f0e0,-4.2,.03,-SEG/2,g);box(.2,.03,SEG,0xf4f0e0,4.2,.03,-SEG/2,g);
  box(1.8,.25,SEG,0xc2bcd0,-5.6,.12,-SEG/2,g);box(1.8,.25,SEG,0xc2bcd0,5.6,.12,-SEG/2,g);
  if(Z.style==='expy'){ // median hedge + guardrails
    box(.5,.3,SEG,0xb0b0b8,-4.45,.15,-SEG/2,g);box(.5,.3,SEG,0xb0b0b8,4.45,.15,-SEG/2,g);
    for(let k=0;k<6;k++){tree(g,-6,-4-k*8,.8,0x3a9a52);tree(g,6,-8-k*8,.8,0x3a9a52);}
  }
  for(let k=0;k<2;k++){lamp(g,-5.9,-8-k*24);lamp(g,5.9,-20-k*24);}
  if(Z.style==='metro')viaduct(g,Z);
  sideBuildings(g,Z,-1);sideBuildings(g,Z,1);
  if(j===0)gantry(g,Z.name.toUpperCase(),'#14121f','#ffb400',-4);
  if(Z.style==='expy'&&j%3===1)gantry(g,Z.gantry,'#0b6b3a','#ffffff',-24);
  if(j===3){landmark(g,Z,1,0);if(Z.station)station(g,Z);}
  if(j===6)landmark(g,Z,Z.style==='metro'?1:-1,1);
  if(Z.style==='market'&&j%2===1){ // festive string flags across the road
    for(let k=0;k<12;k++)box(.7,.9,.05,pick([0xe5322d,0xffb400,0x2fbf71,0x00c2d1]),-5.5+k*1,6.4-Math.sin(k/11*Math.PI)*.0,-24,g);
    box(12,.04,.04,0x222222,0,6.9,-24,g);
  }
  return g;
}

/* ---------- environment blending ---------- */
const skyC=new THREE.Color(0xff9a5a),skyT=new THREE.Color(0xff9a5a);
scene.background=skyC;scene.fog=new THREE.Fog(skyC,60,230);
const sunMesh=new THREE.Mesh(new THREE.CircleGeometry(26,32),new THREE.MeshBasicMaterial({color:0xffe08a,fog:false}));scene.add(sunMesh);
function setZoneTarget(Z){skyT.set(Z.sky);sunMesh.material.color.set(Z.sun);const n=!!Z.night;hemi.intensity=n?.6:.95;sun.intensity=n?.45:.85;hemi.color.set(n?0x8a8ad8:0xffe2b8);}
