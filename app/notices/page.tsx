import {PageHero} from '@/components/page-hero';import {getDocumentsGrouped} from '@/lib/api';import {FileText} from 'lucide-react';
export default async function Notices(){const documents=await getDocumentsGrouped();return <main>
<PageHero kicker="Notices" title="Notices, circulars and official documents." body="Approvals, admission notifications, fee documents, IQAC reports and committee circulars — in one place."/>
<section className="mx-auto max-w-7xl px-5 py-20 space-y-14">{documents.map(group=><div key={group.category}><h2 className="display text-2xl text-navy">{group.category}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{group.items.map(d=><a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-5 text-sm font-bold text-navy hover:bg-mist"><FileText size={17} className="shrink-0 text-blue"/>{d.title}</a>)}</div></div>)}</section>
</main>}
