export type City={name:string;country:string;region?:string;lat:number;lon:number;timezone:string};
export const rad=(n:number)=>n*Math.PI/180;
export function distance(a:City,b:City){const dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;return 6371.0088*2*Math.asin(Math.sqrt(Math.min(1,h)));}
export function routeCenter(a:City,b:City){const delta=((b.lon-a.lon+540)%360)-180;return {lon:a.lon+delta/2,span:Math.abs(delta)};}
export function localTime(c:City,now:Date){return {time:new Intl.DateTimeFormat('en',{timeZone:c.timezone,hour:'numeric',minute:'2-digit',hour12:true}).format(now),date:new Intl.DateTimeFormat('en',{timeZone:c.timezone,month:'short',day:'numeric',year:'numeric'}).format(now)};}
export const defaults:City[]=[{name:'Dhaka',country:'Bangladesh',lat:23.8103,lon:90.4125,timezone:'Asia/Dhaka'},{name:'Kobe',country:'Japan',lat:34.6901,lon:135.1956,timezone:'Asia/Tokyo'}];
