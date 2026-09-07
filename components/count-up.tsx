'use client';
import {animate,useInView} from 'framer-motion';import {useEffect,useRef} from 'react';
export function CountUp({to,prefix='',suffix='',pad2=false,duration=1.6}:{to:number,prefix?:string,suffix?:string,pad2?:boolean,duration?:number}){
  const ref=useRef<HTMLSpanElement>(null);
  const inView=useInView(ref,{once:true,margin:'-80px'});
  useEffect(()=>{
    if(!inView||!ref.current)return;
    const el=ref.current;
    const controls=animate(0,to,{duration,ease:[.16,.8,.3,1],onUpdate(v){const n=Math.round(v);el.textContent=prefix+(pad2?String(n).padStart(2,'0'):n.toString())+suffix}});
    return()=>controls.stop();
  },[inView,to,duration,prefix,suffix,pad2]);
  return <span ref={ref}>{prefix}{pad2?'00':'0'}{suffix}</span>;
}
