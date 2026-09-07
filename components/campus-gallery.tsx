'use client';
import Image from 'next/image';import {motion} from 'framer-motion';import {ArrowLeft,ArrowRight,BookOpen,Dumbbell,Monitor,Wifi} from 'lucide-react';import {useRef} from 'react';

const FACILITY_VISUALS:Record<string,{Icon:typeof Wifi;tint:string}>={
  'ICT Facilities':{Icon:Wifi,tint:'from-blue to-navy'},
  'Library':{Icon:BookOpen,tint:'from-ember to-gold'},
  'Computer Labs':{Icon:Monitor,tint:'from-navy to-blue'},
  'Sports & Wellness':{Icon:Dumbbell,tint:'from-maroon to-ember'}
};

export function CampusGallery({photos,facilityTitles}:{photos:{src:string;caption?:string}[];facilityTitles:string[]}){
  const facilityCards=facilityTitles.map(title=>({title,...(FACILITY_VISUALS[title]||{Icon:Wifi,tint:'from-slate-500 to-slate-700'})}));
  const track=useRef<HTMLDivElement>(null);
  const scroll=(dir:number)=>track.current?.scrollBy({left:dir*260,behavior:'smooth'});
  return <div>
    <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
      {photos.map(p=><motion.div whileHover={{scale:1.02}} transition={{duration:.4}} key={p.src} className="group relative h-[220px] w-[190px] shrink-0 snap-start overflow-hidden sm:w-[210px]">
        <Image src={p.src} alt={p.caption||''} fill sizes="210px" className="object-cover transition duration-700 group-hover:scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent"/>
        <p className="display absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">{p.caption}</p>
      </motion.div>)}
      {facilityCards.map(f=><motion.div whileHover={{scale:1.02}} transition={{duration:.4}} key={f.title} className={`flex h-[220px] w-[150px] shrink-0 snap-start flex-col justify-between bg-gradient-to-br ${f.tint} p-5 text-white`}>
        <f.Icon size={22} strokeWidth={1.4}/>
        <h3 className="display text-base font-semibold leading-tight">{f.title}</h3>
      </motion.div>)}
    </div>
    <div className="mt-4 flex items-center justify-between">
      <p className="text-xs text-slate-400">Drag or scroll to explore &rarr;</p>
      <div className="flex gap-2">
        <button onClick={()=>scroll(-1)} aria-label="Scroll left" className="focus-ring grid h-9 w-9 place-items-center border border-slate-200 transition hover:bg-navy hover:text-white"><ArrowLeft size={15}/></button>
        <button onClick={()=>scroll(1)} aria-label="Scroll right" className="focus-ring grid h-9 w-9 place-items-center border border-slate-200 transition hover:bg-navy hover:text-white"><ArrowRight size={15}/></button>
      </div>
    </div>
  </div>;
}
