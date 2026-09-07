import {PageHero} from '@/components/page-hero';import {getDocumentsGrouped,getSiteSettings} from '@/lib/api';import {FileText} from 'lucide-react';
export default async function Fees(){const[documents,siteSettings]=await Promise.all([getDocumentsGrouped(),getSiteSettings()]);const docs=documents.find(d=>d.category==='Fees')?.items??[];const phone=siteSettings?.phone||'(02425) 223181';const email=siteSettings?.email||'info@spsmba.edu.in';return <main>
<PageHero kicker="Fees" title="FRA-regulated fee structure." body="Fees are approved by the Fee Regulating Authority (FRA), Maharashtra. Refer to the official documents below for the current academic year."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{docs.map(d=><a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-6 text-sm font-bold text-navy hover:bg-mist"><FileText size={18} className="shrink-0 text-blue"/>{d.title}</a>)}</div>
  <p className="mt-10 text-xs text-slate-400">For queries regarding fee payment or scholarships, call {phone} or write to {email}.</p>
</section>
</main>}
