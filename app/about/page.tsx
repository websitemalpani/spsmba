import {PageHero} from '@/components/page-hero';import {LeaderMessage,leadersFrom} from '@/components/leader-messages';import {getAboutPage} from '@/lib/api';
export default async function About(){const a=await getAboutPage();return <main>
<PageHero kicker="About" title="A six-decade commitment to access, excellence and progress." body="Shikshan Prasarak Sanstha was established to bring higher education within reach of rural communities around Sangamner."/>

<section className="mx-auto max-w-7xl px-5 py-24"><div className="grid gap-14 lg:grid-cols-2"><div><p className="eyebrow">{a?.foundationEyebrow}</p><h2 className="display mt-4 text-4xl text-navy">{a?.foundationTitle}</h2></div><div className="space-y-5 text-sm leading-8 text-slate-600">{a?.foundationBody?.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div></div><div className="mt-20 grid gap-4 md:grid-cols-3">{(a?.timeline??[]).map(({year,text})=><article className="rounded-3xl bg-mist p-8" key={year}><b className="display text-5xl text-blue">{year}</b><p className="mt-6 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section>

<section className="bg-navy py-24 text-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2"><div><p className="eyebrow !text-gold">{a?.missionEyebrow}</p><h2 className="display mt-4 text-4xl">{a?.missionTitle}</h2></div><div className="space-y-5 text-sm leading-8 text-white/70"><p>{a?.missionBody}</p><p className="display text-2xl italic text-gold">&ldquo;{a?.missionQuote}&rdquo;</p></div></div></section>

<section id="vision" className="bg-gold py-24"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2"><div><p className="eyebrow !text-navy/50">Vision statement</p><h2 className="display mt-4 text-5xl text-navy">&ldquo;Spread Knowledge Unto the Last&rdquo;</h2></div><p className="text-sm leading-8 text-navy/70">{a?.visionBody}</p></div></section>

<section className="mx-auto max-w-7xl space-y-24 px-5 py-24">{leadersFrom(a).map(l=><LeaderMessage key={l.id} leader={l}/>)}</section>

<section className="bg-mist py-16"><div className="mx-auto max-w-7xl px-5 text-center"><p className="text-xs text-slate-500">{a?.approvalsNote}</p></div></section>
</main>}
