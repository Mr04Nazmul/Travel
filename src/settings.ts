import {defaults,type City} from './geo.ts';
import type {Settings} from './poster.ts';
export const initial:Settings={name:'Nazmul',quote:'A little far from home. Always close at heart.',cities:defaults,unit:'km',format:'post',theme:'ivory'};
const clip=(value:unknown,max:number,fallback='')=>typeof value==='string'?Array.from(value).slice(0,max).join(''):fallback;
export function validCity(c:unknown):c is City{
 if(!c||typeof c!=='object')return false;
 const v=c as City;
 if(typeof v.name!=='string'||!v.name.trim()||v.name.length>120||typeof v.country!=='string'||v.country.length>120||!Number.isFinite(v.lat)||Math.abs(v.lat)>85||!Number.isFinite(v.lon)||Math.abs(v.lon)>180||typeof v.timezone!=='string')return false;
 try{new Intl.DateTimeFormat('en',{timeZone:v.timezone});return true;}catch{return false;}
}
export function sanitizeSettings(value:unknown):Settings{
 const v=(value&&typeof value==='object'?value:{}) as Partial<Settings>;
 const cities=Array.isArray(v.cities)&&v.cities.length===2&&v.cities.every(validCity)?v.cities:defaults;
 return {name:clip(v.name,60,initial.name),quote:clip(v.quote,200,initial.quote),cities,unit:v.unit==='mi'?'mi':'km',format:v.format==='story'?'story':'post',theme:v.theme==='sage'?'sage':'ivory'};
}
export function readSharedSettings(raw:string):Settings{
 const v=JSON.parse(raw);
 if(!v||typeof v!=='object'||(v.cities!==undefined&&(!Array.isArray(v.cities)||v.cities.length!==2||!v.cities.every(validCity))))throw Error('This shared link is invalid. A fresh poster is ready.');
 // Shared links never import a name, personal quote or uploaded photos.
 return sanitizeSettings({unit:v.unit,theme:v.theme,format:v.format,cities:v.cities});
}
