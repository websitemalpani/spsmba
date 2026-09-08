import {PageHero} from '@/components/page-hero';import {getCdcMembers,getDocumentsGrouped} from '@/lib/api';import {FileText,Users} from 'lucide-react';
export default async function CollegeDevelopmentCommittee(){const[members,documents]=await Promise.all([getCdcMembers(),getDocumentsGrouped()]);const docs=documents.find(d=>d.category.startsWith('Committees'))?.items.filter(i=>i.title.toLowerCase().includes('college development'))??[];return <main>
<PageHero kicker="Committees" title="College Development Committee." body="Constituted to guide institutional growth, academic quality and infrastructure development of the institute."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <div className="flex items-center gap-3 text-navy"><Users size={18}/><p className="eyebrow !mb-0">Members</p></div>
  <h2 className="display mt-4 text-3xl text-navy">College Development Committee (CDC)</h2>
  <div className="mt-8 overflow-hidden rounded-2xl border">
    <table className="w-full text-sm">
      <tbody>
        {members.map((m,i)=><tr key={m.name} className={i%2?'bg-mist':''}><td className="w-10 px-5 py-3 text-slate-400">{i+1}</td><td className="px-5 py-3 font-bold text-navy">{m.name}</td><td className="px-5 py-3 text-right text-slate-500">{m.role}</td></tr>)}
      </tbody>
    </table>
  </div>
  {docs.length>0&&<div className="mt-16"><p className="eyebrow">Document</p><h2 className="display mt-4 text-3xl text-navy">Committee notification</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{docs.map(d=><a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-5 text-sm font-bold text-navy hover:bg-mist"><FileText size={18} className="shrink-0 text-blue"/>{d.title}</a>)}</div></div>}
</section>
</main>}
