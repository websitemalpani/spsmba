'use client';
import Image from 'next/image';import {ChevronLeft,ChevronRight,X} from 'lucide-react';import {useEffect,useState} from 'react';

type Album={title:string,photos:string[]};

export function GalleryLightbox({albums}:{albums:Album[]}){
  const[open,setOpen]=useState<number|null>(null);
  const[index,setIndex]=useState(0);
  const album=open!==null?albums[open]:null;

  useEffect(()=>{
    if(open===null)return;
    document.body.style.overflow='hidden';
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==='Escape')setOpen(null);
      if(e.key==='ArrowRight')setIndex(i=>(i+1)%album!.photos.length);
      if(e.key==='ArrowLeft')setIndex(i=>(i-1+album!.photos.length)%album!.photos.length);
    };
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',onKey)};
  },[open,album]);

  return <>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{albums.map((a,i)=><button key={a.title} onClick={()=>{setOpen(i);setIndex(0)}} className="group overflow-hidden rounded-3xl border bg-white text-left"><div className="relative h-56 overflow-hidden bg-mist"><Image src={a.photos[0]} alt={a.title} fill sizes="400px" className="object-cover transition duration-500 group-hover:scale-105"/></div><div className="p-6"><h2 className="text-lg font-extrabold text-navy">{a.title}</h2><p className="mt-1 text-xs text-slate-400">{a.photos.length} photo{a.photos.length>1?'s':''}</p></div></button>)}</div>

    {album&&<div className="fixed inset-0 z-[60] bg-navy/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={album.title}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8"><div><h2 className="text-sm font-extrabold text-white">{album.title}</h2><p className="text-xs text-white/50">{index+1} / {album.photos.length}</p></div><button onClick={()=>setOpen(null)} aria-label="Close" className="focus-ring grid h-10 w-10 place-items-center border border-white/20 text-white hover:bg-white hover:text-navy"><X size={18}/></button></div>
        <div className="relative flex-1 px-4 pb-6 sm:px-10">
          <div className="relative h-full w-full"><Image src={album.photos[index]} alt={`${album.title} photo ${index+1}`} fill sizes="90vw" className="object-contain"/></div>
          {album.photos.length>1&&<>
            <button onClick={()=>setIndex(i=>(i-1+album.photos.length)%album.photos.length)} aria-label="Previous photo" className="focus-ring absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 text-white hover:bg-white hover:text-navy sm:left-4"><ChevronLeft size={20}/></button>
            <button onClick={()=>setIndex(i=>(i+1)%album.photos.length)} aria-label="Next photo" className="focus-ring absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 text-white hover:bg-white hover:text-navy sm:right-4"><ChevronRight size={20}/></button>
          </>}
        </div>
        {album.photos.length>1&&<div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-5 sm:px-8">{album.photos.map((p,i)=><button key={p} onClick={()=>setIndex(i)} className={`relative h-14 w-20 shrink-0 overflow-hidden ${i===index?'ring-2 ring-gold':'opacity-50 hover:opacity-80'}`}><Image src={p} alt="" fill sizes="80px" className="object-cover"/></button>)}</div>}
      </div>
    </div>}
  </>;
}
