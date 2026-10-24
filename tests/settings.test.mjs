import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeSettings,readSharedSettings,initial} from '../src/settings.ts';
test('Corrupt browser drafts fall back to valid format, units and geographic defaults',()=>{assert.deepEqual(sanitizeSettings(null),initial);const s=sanitizeSettings({name:42,quote:null,format:'invalid',unit:'driving',theme:'broken',cities:[{lat:NaN}]});assert.deepEqual(s,initial);});
test('Bengali and emoji draft content retains complete Unicode characters within limits',()=>{const s=sanitizeSettings({name:'🌷'.repeat(100),quote:'বাংলা '.repeat(100)});assert.equal(Array.from(s.name).length,60);assert.equal(Array.from(s.quote).length,200);assert.ok(!s.name.includes('\ufffd'));});
test('Style links omit private names and quotes and work without city locations',()=>{const s=readSharedSettings(JSON.stringify({name:'private',quote:'private',format:'story',theme:'sage',unit:'mi'}));assert.equal(s.name,initial.name);assert.equal(s.quote,initial.quote);assert.equal(s.format,'story');assert.equal(s.theme,'sage');assert.deepEqual(s.cities,initial.cities);});
test('Invalid shared coordinates and zones are rejected rather than crashing the renderer',()=>{assert.throws(()=>readSharedSettings('{'));assert.throws(()=>readSharedSettings(JSON.stringify({cities:[{...initial.cities[0],timezone:'fake/zone'},initial.cities[1]]})));});
