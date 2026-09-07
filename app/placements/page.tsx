import {PageHero} from '@/components/page-hero';import {getTestimonials,getPlacementsPage,mediaUrl} from '@/lib/api';import Image from 'next/image';import {UserRound} from 'lucide-react';

export default async function Placements(){const[alumni,pp]=await Promise.all([getTestimonials('Alumni'),getPlacementsPage()]);const process=pp?.processSteps??[];const rules=pp?.policyRules??[];return <main>
<PageHero kicker="Placements" title="Preparing for the conversation—and the career beyond it." body="Career preparation at SPS includes résumé workshops, mock interviews, personality development and industry engagement."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <p className="eyebrow">Placement process</p>
  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{process.map((x,i)=><div key={x} className="rounded-2xl bg-mist p-6"><span className="text-xs font-black text-blue">0{i+1}</span><p className="mt-4 text-sm font-bold text-navy">{x}</p></div>)}</div>

  <div className="mt-16 grid gap-10 lg:grid-cols-3">
    <div className="lg:col-span-2"><h2 className="display text-3xl text-navy">{pp?.prepTitle}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{pp?.prepBody}</p></div>
    <div><h3 className="text-sm font-extrabold text-navy">Placement policy</h3><ul className="mt-4 space-y-3 text-xs leading-6 text-slate-500">{rules.map(r=><li key={r} className="flex gap-2"><span className="text-gold">&#8226;</span>{r}</li>)}</ul></div>
  </div>

  <div className="mt-20"><p className="eyebrow">Recently placed</p><h2 className="display mt-4 text-4xl text-navy">Our students, out in the field.</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{alumni.map(a=>{const photo=mediaUrl(a.photo);return <article key={a.name} className="overflow-hidden rounded-3xl border bg-white"><div className="relative grid h-44 place-items-center overflow-hidden bg-mist">{photo?<Image src={photo} alt={a.name} fill sizes="280px" className="object-contain"/>:<UserRound className="text-slate-300" size={36}/>}</div><div className="p-5"><h3 className="text-sm font-extrabold text-navy">{a.name}</h3><p className="mt-1 text-xs font-bold text-blue">{a.role}</p><p className="mt-1 text-xs text-slate-500">{a.company}</p></div></article>})}</div></div>

  <p className="mt-10 text-xs text-slate-400">{pp?.disclaimer}</p>
</section>
</main>}
