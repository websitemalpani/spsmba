'use client';
import Image from 'next/image';import Link from 'next/link';import {useState} from 'react';import {ArrowUpRight,CalendarDays,MapPin,Newspaper} from 'lucide-react';

export type BlogCard={key:string;image:string|null;title:string;date:string|null;excerpt?:string;meta?:string|null};

export function BlogEventsTabs({news,events}:{news:BlogCard[];events:BlogCard[]}){
  const tabs=[{label:'News',href:'/news',items:news},{label:'Events',href:'/events',items:events}];
  const[active,setActive]=useState(0);
  const tab=tabs[active];

  return <div>
    <div className="flex gap-2 border-b border-slate-200">{tabs.map((t,i)=><button key={t.label} onClick={()=>setActive(i)} className={`focus-ring relative px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[.08em] transition-colors ${i===active?'text-navy':'text-slate-400 hover:text-navy'}`}>{t.label}{i===active&&<span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-ember to-gold"/>}</button>)}</div>

    {tab.items.length===0?
      <p className="py-14 text-center text-sm text-slate-400">{tab.label} coming soon.</p>
    :<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tab.items.map(item=><Link key={item.key} href={`${tab.href}/${item.key}`} className="focus-ring group block overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-44 overflow-hidden bg-mist">{item.image?<Image src={item.image} alt={item.title} fill sizes="360px" className="object-cover transition duration-500 group-hover:scale-105"/>:<div className="grid h-full place-items-center text-slate-300">{active===0?<Newspaper size={30}/>:<CalendarDays size={30}/>}</div>}</div>
        <div className="p-6">
          {item.date&&<p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-blue"><CalendarDays size={12}/>{item.date}</p>}
          <h3 className="mt-2.5 text-base font-extrabold leading-snug text-navy group-hover:text-blue">{item.title}</h3>
          {item.meta&&<p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={12}/>{item.meta}</p>}
          {item.excerpt&&<p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-500">{item.excerpt}</p>}
        </div>
      </Link>)}</div>}

    {tab.items.length>0&&<div className="mt-8 text-center"><Link href={tab.href} className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-[12px] font-extrabold text-navy transition hover:border-navy hover:bg-navy hover:text-white">View all {tab.label.toLowerCase()}<ArrowUpRight size={15}/></Link></div>}
  </div>;
}
