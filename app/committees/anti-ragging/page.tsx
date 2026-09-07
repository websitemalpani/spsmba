import {PageHero} from '@/components/page-hero';import {getDocumentsGrouped,getSiteSettings} from '@/lib/api';import {FileText,Phone} from 'lucide-react';
export default async function AntiRagging(){const[documents,siteSettings]=await Promise.all([getDocumentsGrouped(),getSiteSettings()]);const docs=documents.find(d=>d.category.startsWith('Committees'))?.items.filter(i=>i.title.toLowerCase().includes('ragging'))??[];const phone=siteSettings?.phone||'(02425) 223181';const email=siteSettings?.email||'info@spsmba.edu.in';return <main>
<PageHero kicker="Committees" title="Anti-ragging policy." body="SPS MBA Institute maintains a zero-tolerance policy on ragging, in line with UGC regulations on curbing the menace of ragging in higher education institutions."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <div className="rounded-2xl bg-mist p-7"><div className="flex items-center gap-3 text-navy"><Phone size={18}/><p className="text-sm font-bold">Report an incident: {phone} &middot; {email}</p></div></div>
  <div className="mt-10"><p className="eyebrow">Committee documents</p><h2 className="display mt-4 text-3xl text-navy">Anti-Ragging Committee &amp; Squad, 2025&ndash;26</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{docs.map(d=><a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-5 text-sm font-bold text-navy hover:bg-mist"><FileText size={18} className="shrink-0 text-blue"/>{d.title}</a>)}</div></div>
</section>
</main>}
