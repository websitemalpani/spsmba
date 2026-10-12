import type {Metadata} from 'next';import Link from 'next/link';import {PageHero} from '@/components/page-hero';import {getDocumentsGrouped,getFaculty} from '@/lib/api';import {FileText} from 'lucide-react';
export const metadata:Metadata={title:'MCA Program'};
export default async function MCA(){const[faculty,documents]=await Promise.all([getFaculty(),getDocumentsGrouped()]);const mcaFaculty=faculty.filter(f=>f.department==='MCA');const docs=(documents.find(d=>d.category.startsWith('Approvals'))?.items??[]).filter(d=>d.title.includes('MCA'));return <main>
<PageHero kicker="Academics / MCA" title="Master of Computer Applications." body="A postgraduate, two-year full-time MCA programme affiliated to Savitribai Phule Pune University."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Duration','2 years'],['Mode','Full time'],['Pattern','Semester'],['Affiliation','SPPU, Pune']].map(x=><div className="rounded-2xl bg-mist p-6" key={x[0]}><p className="text-xs text-slate-400">{x[0]}</p><p className="mt-2 text-xl font-extrabold text-navy">{x[1]}</p></div>)}</div>
  <p className="mt-6 text-sm text-slate-500">Delivered at the Sangamner College campus, Pune–Nashik Highway (NH-50), Sangamner.</p>

  {docs.length>0&&<div className="mt-16"><p className="eyebrow">Approvals</p><h2 className="display mt-4 text-3xl text-navy">MCA approval &amp; affiliation</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{docs.map(d=><a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-5 text-sm font-bold text-navy hover:bg-mist"><FileText size={18} className="shrink-0 text-blue"/>{d.title}</a>)}</div></div>}

  {mcaFaculty.length>0&&<div className="mt-16"><p className="eyebrow">Faculty</p><h2 className="display mt-4 text-3xl text-navy">MCA faculty</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{mcaFaculty.map(f=><li key={f.slug} className="rounded-2xl border p-5"><p className="text-sm font-extrabold text-navy">{f.name}</p><p className="mt-1 text-xs font-bold text-blue">{f.designation}</p><p className="mt-2 text-xs leading-5 text-slate-500">{f.qualification}</p></li>)}</ul><Link href="/faculty" className="focus-ring mt-6 inline-block border-b border-navy pb-1 text-[13px] font-extrabold text-navy">All faculty &rarr;</Link></div>}

  <div className="mt-16 flex flex-wrap gap-3"><Link href="/admissions" className="focus-ring bg-navy px-5 py-3 text-[13px] font-extrabold text-white">Admissions</Link><Link href="/admissions#lists" className="focus-ring border border-navy px-5 py-3 text-[13px] font-extrabold text-navy">Merit list</Link></div>
</section>
</main>}
