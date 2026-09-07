'use client';
import Image from 'next/image';import Link from 'next/link';import {ArrowUpRight,X} from 'lucide-react';import {useEffect,useState} from 'react';import type {HomepagePopup} from '@/lib/api';

const STORAGE_KEY='sps-mba-popup-dismissed';

export function HomepagePopupModal({popup,image}:{popup:HomepagePopup;image:string|null}){
  const[open,setOpen]=useState(false);
  const dismissKey=`${popup.id}:${popup.updatedAt}`;

  useEffect(()=>{
    try{if(localStorage.getItem(STORAGE_KEY)===dismissKey)return}catch{}
    const timer=setTimeout(()=>setOpen(true),900);
    return()=>clearTimeout(timer);
  },[dismissKey]);

  useEffect(()=>{
    if(!open)return;
    document.body.style.overflow='hidden';
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',onKey)};
  },[open]);

  function close(){
    setOpen(false);
    try{localStorage.setItem(STORAGE_KEY,dismissKey)}catch{}
  }

  if(!open)return null;

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/70 backdrop-blur-sm p-5" role="dialog" aria-modal="true" aria-label={popup.title||'Announcement'} onClick={close}>
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e)=>e.stopPropagation()}>
      <button onClick={close} aria-label="Close" className="focus-ring absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy shadow-md transition hover:bg-white"><X size={17}/></button>
      {image&&<div className="relative h-44 w-full bg-mist"><Image src={image} alt="" fill sizes="420px" className="object-cover"/></div>}
      <div className="p-7">
        {popup.title&&<h2 className="display text-2xl font-semibold text-navy">{popup.title}</h2>}
        {popup.message&&<p className="mt-3 text-sm leading-7 text-slate-600">{popup.message}</p>}
        {popup.buttonHref&&popup.buttonLabel&&<Link href={popup.buttonHref} onClick={close} className="focus-ring mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-ember to-gold px-5 py-3.5 text-[13px] font-extrabold text-navy transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ember/25">{popup.buttonLabel}<ArrowUpRight size={16}/></Link>}
      </div>
    </div>
  </div>;
}
