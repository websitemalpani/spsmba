'use client';import Image from 'next/image';import {ChevronLeft,ChevronRight,X} from 'lucide-react';import {useEffect,useState} from 'react';import type {Facility} from '@/lib/api';
export function FacilitiesGrid({facilities}:{facilities:Facility[]}){
  const [open,setOpen]=useState<number|null>(null);
  const [index,setIndex]=useState(0);
  const active=open!==null?facilities[open]:null;

  useEffect(()=>{
    if(!active)return;
    document.body.style.overflow='hidden';
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==='Escape')setOpen(null);
      if(e.key==='ArrowRight')setIndex(i=>(i+1)%active.photos.length);
      if(e.key==='ArrowLeft')setIndex(i=>(i-1+active.photos.length)%active.photos.length);
    };
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',onKey)};
  },[active]);

  return <>
    <div className="grid gap-5 md:grid-cols-2">{facilities.map((x,fi)=><article className="rounded-3xl bg-mist p-8" key={x.slug}><span className="eyebrow">{x.shortDescription}</span><h2 className="display mt-4 text-4xl text-navy">{x.title}</h2><p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">{x.description}</p>{x.photos.length>0&&<div className="mt-6 grid grid-cols-3 gap-2">{x.photos.slice(0,3).map((p,i)=><button key={p} onClick={()=>{setOpen(fi);setIndex(i)}} className="focus-ring relative h-24 overflow-hidden rounded-xl bg-white"><Image src={p} alt={x.title} fill sizes="200px" className="object-cover transition hover:scale-105"/>{i===2&&x.photos.length>3&&<span className="absolute inset-0 grid place-items-center bg-navy/60 text-sm font-bold text-white">+{x.photos.length-3}</span>}</button>)}</div>}</article>)}</div>

    {active&&<div className="fixed inset-0 z-[60] bg-navy/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={active.title}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8"><div><h2 className="text-sm font-extrabold text-white">{active.title}</h2><p className="text-xs text-white/50">{index+1} / {active.photos.length}</p></div><button onClick={()=>setOpen(null)} aria-label="Close" className="focus-ring grid h-10 w-10 place-items-center border border-white/20 text-white hover:bg-white hover:text-navy"><X size={18}/></button></div>
        <div className="relative flex-1 px-4 pb-6 sm:px-10">
          <div className="relative h-full w-full"><Image src={active.photos[index]} alt={`${active.title} photo ${index+1}`} fill sizes="90vw" className="object-contain"/></div>
          {active.photos.length>1&&<>
            <button onClick={()=>setIndex(i=>(i-1+active.photos.length)%active.photos.length)} aria-label="Previous photo" className="focus-ring absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 text-white hover:bg-white hover:text-navy sm:left-4"><ChevronLeft size={20}/></button>
            <button onClick={()=>setIndex(i=>(i+1)%active.photos.length)} aria-label="Next photo" className="focus-ring absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 text-white hover:bg-white hover:text-navy sm:right-4"><ChevronRight size={20}/></button>
          </>}
        </div>
        {active.photos.length>1&&<div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-5 sm:px-8">{active.photos.map((p,i)=><button key={p} onClick={()=>setIndex(i)} className={`relative h-14 w-20 shrink-0 overflow-hidden ${i===index?'ring-2 ring-gold':'opacity-50 hover:opacity-80'}`}><Image src={p} alt="" fill sizes="80px" className="object-cover"/></button>)}</div>}
      </div>
    </div>}
  </>;
}
