import test from 'node:test';
import assert from 'node:assert/strict';
import {distance,routeCenter,localTime,defaults} from '../src/geo.ts';
const city=(name,lat,lon,timezone)=>({name,country:'',lat,lon,timezone});
test('Dhaka–Kobe distance is about 4471 km, symmetric and zero at same point',()=>{assert.ok(Math.abs(distance(...defaults)-4471)<5);assert.equal(distance(defaults[0],defaults[0]),0);assert.equal(distance(...defaults),distance(defaults[1],defaults[0]));});
test('London–Sylhet and nearby Osaka–Kobe use actual coordinates',()=>{const london=city('London',51.5085,-.1257,'Europe/London'),sylhet=city('Sylhet',24.899,91.872,'Asia/Dhaka'),osaka=city('Osaka',34.6937,135.5023,'Asia/Tokyo');assert.ok(distance(london,sylhet)>7900&&distance(london,sylhet)<8100);assert.ok(distance(defaults[1],osaka)>20&&distance(defaults[1],osaka)<35);});
test('Date-line route takes short arc and local dates differ',()=>{const a=city('Apia',-13.85,-171.75,'Pacific/Apia'),b=city('Suva',-18.14,178.44,'Pacific/Fiji');assert.ok(routeCenter(a,b).span<10);assert.ok(distance(a,b)<1200);const n=new Date('2026-10-24T11:30:00Z');assert.notEqual(localTime(city('Honolulu',21,-157,'Pacific/Honolulu'),n).date,localTime(a,n).date);});
test('IANA time formatting follows London seasonal clock changes',()=>{const c=city('London',51,0,'Europe/London');assert.match(localTime(c,new Date('2026-07-01T12:00:00Z')).time,/1:00/);assert.match(localTime(c,new Date('2026-12-01T12:00:00Z')).time,/12:00/);});
