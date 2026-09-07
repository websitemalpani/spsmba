'use client';
import {useState} from 'react';import Link from 'next/link';import {ArrowUpRight,FileText} from 'lucide-react';import type {DocGroup} from '@/lib/api';

export function NoticeBoard({documentGroups}:{documentGroups:DocGroup[]}){
  const byCategory=(cat:string)=>documentGroups.find(d=>d.category.startsWith(cat))?.items??[];
  const tabs=[
    {label:'Notices & Circulars',accent:'text-navy',bar:'bg-navy',items:[...byCategory('Committees').slice(0,3),...byCategory('IQAC')]},
    {label:'Admissions',accent:'text-blue',bar:'bg-blue',items:byCategory('Admissions')},
    {label:'Fees',accent:'text-ember',bar:'bg-ember',items:byCategory('Fees')},
    {label:'Approvals',accent:'text-maroon',bar:'bg-maroon',items:byCategory('Approvals & Affiliation').slice(0,5)}
  ];
  const[active,setActive]=useState(0);const tab=tabs[active];
  return <div className="border border-slate-200 bg-white">
    <div className="flex flex-wrap">
      {tabs.map((t,i)=><button key={t.label} onClick={()=>setActive(i)} className={`focus-ring relative flex-1 min-w-[150px] border-b border-slate-200 px-5 py-4 text-left text-[11px] font-extrabold uppercase tracking-[.08em] transition-colors sm:text-[11.5px] ${i===active?`bg-mist ${t.accent}`:'text-slate-400 hover:text-navy'}`}>
        {t.label}
        {i===active&&<span className={`absolute inset-x-0 bottom-0 h-[3px] ${t.bar}`}/>}
      </button>)}
    </div>
    <div className="divide-y divide-slate-100 px-5 sm:px-6">
      {tab.items.map(item=><a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-4 text-sm text-slate-600 hover:text-navy">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tab.bar}`}/>
        <span className="flex-1">{item.title}</span>
        <FileText size={14} className="shrink-0 text-slate-300 group-hover:text-navy"/>
      </a>)}
    </div>
    <div className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-6">
      <Link href="/notices" className="focus-ring flex items-center gap-2 text-[12px] font-extrabold text-navy">View all notices <ArrowUpRight size={14}/></Link>
    </div>
  </div>;
}
