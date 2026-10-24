// Offline integration check of the production renderer; not a browser mockup.
import {createCanvas,GlobalFonts,Image} from '@napi-rs/canvas';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {drawPoster} from '../src/poster.ts';
import {defaults} from '../src/geo.ts';
GlobalFonts.registerFromPath('public/assets/serif.ttf','Poster');
GlobalFonts.registerFromPath('public/assets/bengali.ttf','Bengali');
globalThis.Image=Image;
globalThis.document={fonts:{load:async()=>[]}};
globalThis.fetch=async()=>({ok:true,json:async()=>JSON.parse(await fs.readFile('public/assets/world.json','utf8'))});
const base={name:'Nazmul',quote:'A little far from home. Always close at heart.',cities:defaults,unit:'km',format:'post',theme:'ivory'};
const photos=[{url:await fs.readFile('public/assets/dhaka.jpg'),credit:'Md. Ishtiaque Mahmood Rohan · CC BY 3.0 (cropped)',source:'https://commons.wikimedia.org/wiki/File:Dhaka_Skyline_at_Night.jpg',x:50,y:50,zoom:1},{url:await fs.readFile('public/assets/kobe.jpg'),credit:'Martin Falbisoner · CC BY-SA 4.0 (cropped)',source:'https://commons.wikimedia.org/wiki/File:Kobe_Port_Tower_and_Maritime_Museum,_November_2016.jpg',x:50,y:50,zoom:1}];
const city=(name,lat,lon,timezone)=>({name,country:'',lat,lon,timezone});
const cases=[['dhaka-kobe',base,photos,1],['story',{...base,format:'story'},photos,1],['bengali',{...base,name:'নাজমুল হোসাইন — A very long name with two homes',quote:'দূরে থাকলেও আমার হৃদয়ে সবসময় তুমি আছো। '.repeat(4)},[null,null],1],['london-sylhet',{...base,cities:[city('London',51.5085,-.1257,'Europe/London'),city('Sylhet',24.899,91.872,'Asia/Dhaka')]},[null,null],1],['nearby',{...base,cities:[defaults[1],city('Osaka',34.6937,135.5023,'Asia/Tokyo')]},[null,null],1],['dateline',{...base,cities:[city('Apia',-13.85,-171.75,'Pacific/Apia'),city('Suva',-18.14,178.44,'Pacific/Fiji')]},[null,null],1],['high-res',base,photos,2]];
await fs.mkdir('/tmp/travel-qa',{recursive:true});
for(const [name,s,p,scale] of cases){const c=createCanvas(1,1);await drawPoster(c,s,p,scale,new Date('2026-10-24T08:00:00Z'));assert.equal(c.width,1080*scale);assert.equal(c.height,(s.format==='story'?1920:1350)*scale);await fs.writeFile(`/tmp/travel-qa/${name}.png`,c.toBuffer('image/png'));console.log(`${name}: ${c.width} × ${c.height}`);}
