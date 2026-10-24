import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
const CLIENT='ca-pub-3728341118830943';
type Choice='allow'|'deny'|null;
function saved():Choice{try{const v=localStorage.getItem('hfa-ad-choice');return v==='allow'||v==='deny'?v:null;}catch{return null;}}
export function AdPreferences(){
 const [choice,Choice]=useState<Choice>(saved),[open,Open]=useState(()=>!saved()),[unavailable,Unavailable]=useState(false);
 const [mount,Mount]=useState<HTMLElement|null>(null);
 useEffect(()=>Mount(document.getElementById('advertising-area')),[]);
 useEffect(()=>{
  if(choice!=='allow'||!mount)return;
  // Request non-personalized ads. Google's regional CMP and serving eligibility still apply.
  const windowWithAds=window as typeof window & {adsbygoogle?:unknown[] & {requestNonPersonalizedAds?:number}};
  windowWithAds.adsbygoogle=windowWithAds.adsbygoogle||[];
  windowWithAds.adsbygoogle.requestNonPersonalizedAds=1;
  const request=()=>{const unit=document.querySelector<HTMLElement>('ins[data-hfa-unit]');if(unit&&!unit.dataset.hfaRequested){unit.dataset.hfaRequested='true';try{windowWithAds.adsbygoogle!.push({});}catch{Unavailable(true);}}};
  if(document.querySelector('script[data-hfa-ads]')){request();return;}
  const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.dataset.hfaAds='true';script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;script.onload=request;script.onerror=()=>Unavailable(true);document.head.appendChild(script);
 },[choice,mount]);
 function choose(value:'allow'|'deny'){try{localStorage.setItem('hfa-ad-choice',value);}catch{}const revoke=choice==='allow'&&value==='deny';Choice(value);Open(false);if(revoke)location.reload();}
 return <>{choice==='allow'&&mount&&!unavailable&&createPortal(<aside className="advertising-slot" aria-label="Advertisement"><small>Advertisement</small><ins className="adsbygoogle" style={{display:'block'}} data-hfa-unit="true" data-ad-client={CLIENT} data-ad-slot="1630336858" data-ad-format="auto" data-full-width-responsive="true"/></aside>,mount)}<button className="privacy-link" onClick={()=>Open(true)}>Ad privacy choices</button>{open&&<section className="ad-preferences" aria-label="Advertising privacy choices"><b>A choice about optional ads</b><p>Google may use cookies and process device and network information to serve and measure ads. Our app does not upload your photos to Google.</p><p>You can create and download your poster with ads turned off. <a href="./privacy.html">Read our privacy notice ↗</a></p><div className="two"><button className="secondary" onClick={()=>choose('deny')}>Continue without ads</button><button className="primary" onClick={()=>choose('allow')}>Allow ads</button></div>{unavailable&&<p>Advertising is unavailable. Your poster tools still work.</p>}</section>}</>;
}
