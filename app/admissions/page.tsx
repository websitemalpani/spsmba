import {PageHero} from '@/components/page-hero';import {EnquiryForm} from '@/components/enquiry-form';import {getActiveAdmission,getDocumentsGrouped} from '@/lib/api';import {FileText} from 'lucide-react';

export default async function Admissions(){
  const[admission,documents]=await Promise.all([getActiveAdmission(),getDocumentsGrouped()]);
  const steps=admission?.steps??[];const docs=admission?.documentsRequired??[];
  const notices=documents.find(d=>d.category.startsWith('Admissions'))?.items.filter(i=>i.featured)??[];
  return <main>
<PageHero kicker="Admissions" title="Five clear steps to your SPS MBA." body="Admissions follow the rules and schedule of the Maharashtra Admission Regulating Authority and State Common Entrance Test Cell."/>
<section id="process" className="mx-auto max-w-7xl px-5 py-20">
  <div className="flex flex-wrap items-center justify-between gap-4"><p className="eyebrow">Admission process (CAP)</p>{admission?.instituteCode&&<span className="rounded-full bg-mist px-4 py-1.5 text-xs font-bold text-navy">Institute Code: {admission.instituteCode}</span>}</div>
  <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{steps.map((x,i)=><div className="rounded-2xl border p-6" key={x}><span className="text-xs font-black text-blue">STEP 0{i+1}</span><p className="mt-5 text-sm font-bold text-navy">{x}</p></div>)}</div>

  <div className="mt-16 grid gap-10 lg:grid-cols-2">
    <div>
      <h2 className="display text-4xl text-navy">Eligibility</h2>
      <p className="mt-5 text-sm leading-8 text-slate-600">{admission?.notes}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-mist p-5"><p className="text-xs text-slate-400">General category</p><p className="mt-1 text-lg font-extrabold text-navy">{admission?.eligibilityGeneral}</p></div><div className="rounded-xl bg-mist p-5"><p className="text-xs text-slate-400">Reserved category</p><p className="mt-1 text-lg font-extrabold text-navy">{admission?.eligibilityReserved}</p></div></div>
      <h3 className="mt-8 text-sm font-extrabold text-navy">Documents required (originals + 2 attested copies)</h3>
      <ul className="mt-4 grid gap-2 text-xs leading-6 text-slate-500 sm:grid-cols-2">{docs.map(d=><li key={d} className="flex gap-2"><span className="text-gold">&#8226;</span>{d}</li>)}</ul>
      {admission?.cetCellUrl&&<a className="mt-6 inline-block text-sm font-bold text-blue" href={admission.cetCellUrl} rel="noreferrer" target="_blank">Visit Maharashtra CET Cell &#8599;</a>}
      <div className="mt-8 space-y-2">{notices.map(n=><a key={n.href} href={n.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-4 text-sm font-bold text-navy hover:bg-mist"><FileText size={17} className="shrink-0 text-blue"/>{n.title}</a>)}</div>
    </div>
    <div id="enquire" className="h-fit rounded-3xl bg-mist p-7"><h2 className="mb-6 text-xl font-extrabold text-navy">Admission enquiry</h2><EnquiryForm/></div>
  </div>
</section>
</main>;
}
