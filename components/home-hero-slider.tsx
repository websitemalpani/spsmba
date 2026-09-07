'use client';

import Image from 'next/image';
import Link from 'next/link';
import {AnimatePresence,motion,useReducedMotion,useScroll,useTransform} from 'framer-motion';
import {ArrowRight,ArrowUpRight,CheckCircle2,ChevronLeft,ChevronRight,Pause,Play,Sparkles} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';
import {Sunburst} from '@/components/sunburst';

export type Slide={image:string;eyebrow?:string;title:string;accent?:string;copy?:string;primary?:string;href?:string};

export function HomeHeroSlider({slides}:{slides:Slide[]}){
  const [active,setActive]=useState(0);const[playing,setPlaying]=useState(true);const section=useRef<HTMLElement>(null);const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:section,offset:['start start','end start']});const imageY=useTransform(scrollYProgress,[0,1],['0%','22%']);const copyY=useTransform(scrollYProgress,[0,1],['0%','-10%']);
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setActive(v=>(v+1)%slides.length),6500);return()=>clearInterval(timer)},[playing]);
  const move=(step:number)=>setActive(v=>(v+step+slides.length)%slides.length);const slide=slides[active];
  if(!slide)return null;
  return <section ref={section} aria-roledescription="carousel" aria-label="SPS MBA highlights" className="relative min-h-[560px] overflow-hidden bg-navy text-white lg:min-h-[640px]">
    <AnimatePresence initial={false} mode="sync">{slides.map((item,i)=>i===active&&<motion.div key={item.image} initial={{opacity:0,scale:1.05}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:reduced?0:.9}} className="absolute inset-0"><motion.div style={{y:reduced?0:imageY}} className="absolute -inset-y-[12%] inset-x-0"><Image src={item.image} alt="SPS MBA Institute campus" fill priority={i===0} sizes="100vw" className="object-cover"/></motion.div></motion.div>)}</AnimatePresence>
    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/10"/><div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-navy/10"/>

    <motion.div style={{y:reduced?0:copyY}} className="relative mx-auto flex min-h-[560px] max-w-[1320px] items-center px-5 py-14 lg:min-h-[640px] lg:px-6">
      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait"><motion.div key={active} initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:reduced?0:.65,ease:[.22,.7,.22,1]}}>
          <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[.16em] backdrop-blur-md"><Sparkles size={13} className="text-gold"/>{slide.eyebrow}</div>
          <h1 className="display text-[15vw] font-medium leading-[.94] sm:text-6xl md:text-7xl lg:text-[5.2rem]">{slide.title}<br/><span className="bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent">{slide.accent}</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 md:text-base md:leading-8">{slide.copy}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={slide.href||'/admissions#enquire'} className="focus-ring flex items-center gap-2.5 bg-gradient-to-r from-ember to-gold px-6 py-4 text-[13px] font-extrabold text-navy transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ember/20">{slide.primary||'Learn more'}<ArrowUpRight size={16}/></Link>
            <Link href="/about" className="focus-ring flex items-center gap-2.5 border border-white/30 bg-white/10 px-6 py-4 text-[13px] font-bold backdrop-blur transition hover:bg-white hover:text-navy">Discover SPS<ArrowRight size={15}/></Link>
          </div>
        </motion.div></AnimatePresence>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-wider text-white/60">
          <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-gold"/>SPPU affiliated</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-gold"/>AICTE approved</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-gold"/>120 seats</span>
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-ember to-gold px-3 py-1.5 tracking-[.14em] text-navy shadow-md shadow-ember/20">DTE Code: 5521</span>
        </div>
      </div>
    </motion.div>

    <div className="absolute bottom-24 right-6 hidden w-[210px] border border-white/15 bg-navy/70 p-5 backdrop-blur-xl lg:block xl:right-12">
      <Sunburst className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 text-gold/20" style={{animation:'rotate-slow 160s linear infinite'}}/>
      <p className="eyebrow !text-gold">Est. 1960</p>
      <p className="mt-3 text-[13px] leading-6 text-white/70">Shikshan Prasarak Sanstha&rsquo;s six-decade mission of rural access to education.</p>
      <div className="mt-4 flex justify-between border-t border-white/15 pt-3 text-[11px] text-white/50"><span>120 seats</span><span>5 specialisations</span></div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-navy/55 backdrop-blur-xl"><div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-2.5 lg:px-6"><div className="flex items-center gap-2"><button onClick={()=>move(-1)} aria-label="Previous slide" className="grid h-7 w-7 place-items-center border border-white/30 transition hover:bg-white hover:text-navy"><ChevronLeft size={13}/></button><button onClick={()=>setPlaying(!playing)} aria-label={playing?'Pause slideshow':'Play slideshow'} className="grid h-7 w-7 place-items-center border border-white/30 transition hover:bg-white hover:text-navy">{playing?<Pause size={11}/>:<Play size={11}/>}</button><button onClick={()=>move(1)} aria-label="Next slide" className="grid h-7 w-7 place-items-center border border-white/30 transition hover:bg-white hover:text-navy"><ChevronRight size={13}/></button></div><div className="flex items-center gap-2">{slides.map((_,i)=><button key={i} onClick={()=>setActive(i)} aria-label={`Go to slide ${i+1}`} aria-current={i===active} className={`h-[3px] transition-all ${i===active?'w-10 bg-gradient-to-r from-ember to-gold':'w-4 bg-white/30 hover:bg-white/60'}`}/>)}</div><span className="hidden text-[9px] font-bold uppercase tracking-[.18em] text-white/45 sm:block">0{active+1} / 0{slides.length}</span></div></div>
  </section>;
}
