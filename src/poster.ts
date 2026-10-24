import {geoMercator,geoPath,geoInterpolate} from 'd3-geo';
import {feature} from 'topojson-client';
import {distance,routeCenter,localTime,type City} from './geo.ts';
export type Photo={url:string;credit:string;source?:string;x:number;y:number;zoom:number};
export type Settings={name:string;quote:string;cities:City[];unit:'km'|'mi';format:'post'|'story';theme:'ivory'|'sage'};
let world:any;
export async function loadWorld(){if(!world){const r=await fetch(`${((import.meta as any).env?.BASE_URL || './')}assets/world.json`);if(!r.ok)throw Error('The map could not load. Please retry.');world=feature(await r.json(), 'countries' as any);}return world;}
export async function assets(){await Promise.all([loadWorld(),document.fonts.load('400 40px Poster'),document.fonts.load('400 40px Bengali')]);}
const images=new Map<string,Promise<HTMLImageElement>>();
export function getImage(url:string){if(!images.has(url))images.set(url,new Promise((resolve,reject)=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>resolve(im);im.onerror=()=>{images.delete(url);reject(Error('A photo could not load. Remove or replace it before exporting.'));};im.src=url;}));return images.get(url)!;}
export async function drawPoster(canvas:HTMLCanvasElement,s:Settings,photos:(Photo|null)[],scale=1,now=new Date()){
 await assets();const ims=await Promise.all(photos.map(p=>p?getImage(p.url):null));const H=s.format==='story'?1920:1350;canvas.width=1080*scale;canvas.height=H*scale;const c=canvas.getContext('2d')!;c.scale(scale,scale);const green='#0b3025',gold='#a17b37';
 c.fillStyle=s.theme==='sage'?'#e6e8d9':'#f7f0df';c.fillRect(0,0,1080,H);
 const glow=c.createRadialGradient(540,H,50,540,H,H);glow.addColorStop(0,'#d3ad6c44');glow.addColorStop(1,'#fff9ed00');c.fillStyle=glow;c.fillRect(0,0,1080,H);
 function text(t:string,x:number,y:number,size:number,color=green,font='Poster',max=960,align:CanvasTextAlign='center'){c.fillStyle=color;c.textAlign=align;let z=size;do{c.font=`400 ${z}px ${font}, Bengali, serif`;if(c.measureText(t).width<=max)break;z-=1;}while(z>12);c.fillText(t,x,y);}
 function line(y:number,w=230){c.strokeStyle=gold;c.lineWidth=1;c.beginPath();c.moveTo(540-w/2,y);c.lineTo(540+w/2,y);c.stroke();}
 text('T W O   C I T I E S .   O N E   H E A R T .',540,54,19);line(78,280);text('♥',540,88,24,gold);
 text(s.name.trim()?`${s.name.trim()}’s story`:'Your story, across the world',540,134,36);
 const d=distance(s.cities[0],s.cities[1])*(s.unit==='mi'?0.621371:1);text(`Home is ${Math.round(d).toLocaleString()} ${s.unit} away`,540,223,90);text('S T R A I G H T - L I N E   D I S T A N C E',540,254,13,gold);
 const mapTop=280,mapH=s.format==='story'?990:460;
 const mid=routeCenter(s.cities[0],s.cities[1]);const proj=geoMercator().rotate([-mid.lon,0]).center([0,(s.cities[0].lat+s.cities[1].lat)/2]).translate([540,mapTop+mapH/2]);
 const route=geoInterpolate([s.cities[0].lon,s.cities[0].lat],[s.cities[1].lon,s.cities[1].lat]);
 const samples=Array.from({length:101},(_,i)=>proj(route(i/100))!);const xs=samples.map(p=>p[0]),ys=samples.map(p=>p[1]);
 const dx=Math.max(...xs)-Math.min(...xs),dy=Math.max(...ys)-Math.min(...ys);const k=Math.min(800/Math.max(dx,2),(mapH-270)/Math.max(dy,2));proj.scale(proj.scale()*k);
 const fit=Array.from({length:101},(_,i)=>proj(route(i/100))!);const fx=fit.map(p=>p[0]),fy=fit.map(p=>p[1]);const tr=proj.translate();proj.translate([tr[0]+540-(Math.min(...fx)+Math.max(...fx))/2,tr[1]+mapTop+205+(mapH-270)/2-(Math.min(...fy)+Math.max(...fy))/2]);
 c.save();c.beginPath();c.rect(0,mapTop,1080,mapH);c.clip();const path=geoPath(proj,c);c.beginPath();path(world);c.fillStyle='#b4bea099';c.fill();c.strokeStyle='#b9985a88';c.lineWidth=.7;c.stroke();
 const pts=s.cities.map(a=>proj([a.lon,a.lat])!);const interpolate=geoInterpolate([s.cities[0].lon,s.cities[0].lat],[s.cities[1].lon,s.cities[1].lat]);c.beginPath();for(let i=0;i<=100;i++){const p=proj(interpolate(i/100))!;i?c.lineTo(...p):c.moveTo(...p);}c.strokeStyle=green;c.lineWidth=3;c.setLineDash([3,9]);c.stroke();c.setLineDash([]);const plane=proj(interpolate(.5))!;c.save();c.translate(plane[0],plane[1]-12);c.rotate(-.12);c.beginPath();c.moveTo(22,0);c.lineTo(4,-4);c.lineTo(-5,-19);c.lineTo(-11,-19);c.lineTo(-7,-3);c.lineTo(-20,-6);c.lineTo(-24,-2);c.lineTo(-11,3);c.lineTo(-20,9);c.lineTo(-17,12);c.lineTo(-4,6);c.lineTo(-8,20);c.lineTo(-2,20);c.lineTo(6,4);c.closePath();c.fillStyle=green;c.fill();c.restore();
 pts.forEach((p,i)=>{c.beginPath();c.arc(p[0],p[1],13,0,Math.PI*2);c.fillStyle=green;c.fill();c.strokeStyle='#fff8e6';c.lineWidth=4;c.stroke();c.beginPath();c.moveTo(p[0]-9,p[1]+8);c.lineTo(p[0],p[1]+28);c.lineTo(p[0]+9,p[1]+8);c.fillStyle=green;c.fill();text(s.cities[i].name.toLocaleUpperCase(),p[0]+(Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1])<160?(i?80:-80):0),p[1]+54,24,green,'Poster',300);});c.restore();
 function photo(i:number,x:number,y:number,w:number,h:number,round=false){c.save();c.beginPath();round?c.arc(x+w/2,y+h/2,w/2,0,Math.PI*2):c.roundRect(x,y,w,h,16);c.clip();c.fillStyle='#d8d7c0';c.fillRect(x,y,w,h);const im=ims[i],p=photos[i];if(im&&p){const r=Math.max(w/im.width,h/im.height)*p.zoom;const iw=im.width*r,ih=im.height*r;c.drawImage(im,x-(iw-w)*p.x/100,y-(ih-h)*p.y/100,iw,ih);}else{const gr=c.createLinearGradient(x,y,x+w,y+h);gr.addColorStop(0,'#698376');gr.addColorStop(1,'#183d32');c.fillStyle=gr;c.fillRect(x,y,w,h);text('⌂',x+w/2,y+h*.5,48,'#e7d7ae');text(s.cities[i].name,x+w/2,y+h*.76,24,'#fff4db','Poster',w-20);}c.restore();c.strokeStyle='#fff9ed';c.lineWidth=5;c.beginPath();round?c.arc(x+w/2,y+h/2,w/2,0,Math.PI*2):c.roundRect(x,y,w,h,16);c.stroke();}
 photo(0,72,mapTop+20,244,160);photo(1,764,mapTop+20,244,160);
 const qY=mapTop+mapH+60;text('Different skies. The same moon.',540,qY,64);line(qY+32,220);c.save();c.fillStyle=gold;c.beginPath();c.arc(540,qY+32,13,0,Math.PI*2);c.fill();c.fillStyle=s.theme==='sage'?'#e6e8d9':'#f7f0df';c.beginPath();c.arc(546,qY+27,12,0,Math.PI*2);c.fill();c.restore();
 const cardY=qY+65;[0,1].forEach(i=>{const x=92+i*460;c.strokeStyle=gold;c.lineWidth=1;c.beginPath();c.roundRect(x,cardY,436,200,20);c.stroke();photo(i,x+23,cardY+27,142,142,true);text(s.cities[i].name.toLocaleUpperCase(),x+294,cardY+45,29,green,'Poster',235);text(i?'WHERE I AM':'HOME',x+294,cardY+73,15,gold);const t=localTime(s.cities[i],now);text(t.time,x+294,cardY+126,48,green,'Poster',240);text(t.date,x+294,cardY+157,17,green);});
 // Wrapped Unicode quote uses the same locally hosted fonts in preview and export.
 const words=Array.from(s.quote);let rows:string[]=[],z=26;do{rows=[];let row='';c.font=`${z}px Poster, Bengali, serif`;for(const ch of words){if(c.measureText(row+ch).width>850){rows.push(row);row=ch;}else row+=ch;}if(row)rows.push(row);if(rows.length<=3)break;z--;}while(z>14);rows.slice(0,3).forEach((r,i)=>text(r,540,cardY+242+i*30,z));
 // Original decorative landscape: a shared moon above an abstract horizon, not a claimed city photo.
 const horizon=H-120;
 const sky=c.createLinearGradient(0,horizon-45,0,H);sky.addColorStop(0,'#d7bd8b00');sky.addColorStop(1,'#c0a77755');c.fillStyle=sky;c.fillRect(0,horizon-45,1080,H-horizon+45);
 c.fillStyle='#e7c783';c.beginPath();c.arc(540,horizon-4,22,0,Math.PI*2);c.fill();c.fillStyle='#fff5ceaa';c.beginPath();c.arc(534,horizon-10,8,0,Math.PI*2);c.fill();
 for(let layer=0;layer<3;layer++){c.beginPath();c.moveTo(0,H);for(let x=0;x<=1080;x+=20){const y=horizon+layer*24+Math.sin(x*.009+layer*2)*22+Math.cos(x*.023+layer)*10;c.lineTo(x,y);}c.lineTo(1080,H);c.closePath();c.fillStyle=['#6e7d7477','#37544a99','#193f33'][layer];c.fill();}
 const foot=H-42;line(foot-26,160);text('M A K E  Y O U R  O W N  ·  H O M E ,  F A R  A W A Y',540,foot,13,'#f0dfb5');text('Geography: Natural Earth · Hossain Najmul',540,foot+21,11,'#dacba6');
 photos.forEach((p,i)=>{if(p?.source)text(`${s.cities[i].name}: ${p.credit}`,540,H-105+i*12,10,'#eee0bc','Poster',950);});
}
