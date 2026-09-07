import {HomeHeroSlider} from '@/components/home-hero-slider';import {CampusGallery} from '@/components/campus-gallery';import {NoticeBoard} from '@/components/notice-board';import {HomepagePopupModal} from '@/components/homepage-popup';import {BlogEventsTabs} from '@/components/blog-events-tabs';import {CountUp} from '@/components/count-up';import {Sunburst} from '@/components/sunburst';import {Reveal} from '@/components/reveal';import {getSpecializations,getFacilities,getDocumentsGrouped,getHomepageSections,getHomepagePopup,getQuickLinks,getNews,getEvents,mediaUrl} from '@/lib/api';import Link from 'next/link';import {ArrowUpRight,BookOpen,Dumbbell,Landmark,Layers,Monitor,ShieldCheck,Users,Wifi} from 'lucide-react';
const facilityIcons=[Wifi,BookOpen,Monitor,Dumbbell];
const why=[['Six decades of access','Rooted in Shikshan Prasarak Sanstha’s 1960 mission to bring rigorous education to rural Maharashtra.'],['Recognised, regulated','Affiliated to Savitribai Phule Pune University, Pune and approved by AICTE, New Delhi, DTE, MH and Govt. of Maharashtra.'],['Five ways to specialise','Marketing, Finance, HR, Operations & Supply Chain or Business Analytics — shape the MBA around your ambition.'],['Faculty who mentor','Ph.D.-qualified teachers with real industry grounding, guiding every cohort closely.']];
const whyMeta=[{Icon:Landmark,accent:'text-navy',bar:'bg-navy'},{Icon:ShieldCheck,accent:'text-blue',bar:'bg-blue'},{Icon:Layers,accent:'text-ember',bar:'bg-ember'},{Icon:Users,accent:'text-maroon',bar:'bg-maroon'}];
const specAccents=['bg-navy text-white','bg-blue text-white','bg-ember text-white','bg-maroon text-white','bg-gold text-navy'];
const placementSteps=[['Prepare','Résumé workshops, interview preparation and mock interviews.'],['Experience','Internships, live projects, industrial visits and guest lectures.'],['Grow','Personality development and practical exposure for professional confidence.']];
export default async function Home(){const[specializations,facilities,documentGroups,homeSections,popup,quickLinks,news,events]=await Promise.all([getSpecializations(),getFacilities(),getDocumentsGrouped(),getHomepageSections(),getHomepagePopup(),getQuickLinks(),getNews(3),getEvents(3)]);const[ict,library,labs,sports]=facilities;const[Ict,Book,Lab,Sport]=facilityIcons;const hasFacilityShowcase=facilities.length>=4;
const slides=homeSections.heroSlides.map(s=>({image:mediaUrl(s.image)||'',eyebrow:s.eyebrow,title:s.title,accent:s.accent,copy:s.copy,primary:s.buttonLabel,href:s.buttonHref})).filter(s=>s.image);
const campusPhotos=homeSections.photoCaptions.map(p=>({src:mediaUrl(p.image)||'',caption:p.caption})).filter(p=>p.src);
const newsCards=news.map(n=>({key:n.slug,image:mediaUrl(n.coverImage),title:n.title,date:n.publishedDate?new Date(n.publishedDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):null,excerpt:n.summary}));
const eventCards=events.map(e=>({key:e.slug,image:mediaUrl(e.coverImage),title:e.title,date:e.startDate?new Date(e.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):null,excerpt:e.description,meta:e.venue}));
return <main className="bg-paper">

{popup&&<HomepagePopupModal popup={popup} image={mediaUrl(popup.image)}/>}

<HomeHeroSlider slides={slides}/>

<div className="overflow-hidden bg-navy"><div className="ticker flex w-max py-[17px]">{[0,1].map(i=><span key={i} aria-hidden={i===1} className="flex shrink-0">{['SPPU AFFILIATED','AICTE APPROVED','DTE CODE 5521','GOVT. OF MAHARASHTRA','EST. 1960','120 SEATS / YEAR'].map(t=><span key={t} className="flex items-center"><span className="whitespace-nowrap px-[22px] text-[11.5px] font-bold uppercase tracking-[.11em] text-white/75">{t}</span><span className="text-gold">&#8226;</span></span>)}</span>)}</div></div>

{quickLinks.length>0&&<section className="mx-auto max-w-[1320px] px-5 pt-6 sm:px-6"><Reveal className="flex flex-wrap gap-2.5">{quickLinks.map(q=><Link key={q.href} href={q.href} className="focus-ring rounded-full border border-slate-200 bg-white px-4 py-2 text-[11.5px] font-bold text-navy transition hover:border-navy hover:bg-navy hover:text-white">{q.label}</Link>)}</Reveal></section>}

<section className="mx-auto max-w-[1320px] px-5 pt-10 pb-6 sm:px-6">
  <Reveal><p className="eyebrow !text-gold">Stay updated</p><h2 className="display mt-4 text-3xl font-medium text-navy">Notices &amp; announcements.</h2></Reveal>
  <Reveal delay={.08} className="mt-6"><NoticeBoard documentGroups={documentGroups}/></Reveal>
</section>

<section className="mx-auto max-w-[1320px] px-5 pb-10 sm:px-6"><Reveal className="grid grid-cols-2 gap-px overflow-hidden bg-slate-200 lg:grid-cols-4">
  <div className="relative overflow-hidden bg-paper p-6 pt-7 sm:p-8"><span className="absolute inset-x-0 top-0 h-[3px] bg-gold"/><span className="display block text-4xl font-semibold text-navy sm:text-6xl md:text-7xl"><CountUp to={1960}/></span><p className="mt-3.5 max-w-[22ch] text-xs text-slate-500">The year Shikshan Prasarak Sanstha began its mission of rural access to education.</p></div>
  <div className="relative overflow-hidden bg-paper p-6 pt-7 sm:p-8"><span className="absolute inset-x-0 top-0 h-[3px] bg-blue"/><span className="display block text-4xl font-semibold text-blue sm:text-6xl md:text-7xl"><CountUp to={120}/></span><p className="mt-3.5 text-xs text-slate-500">Seats in the MBA programme, every year.</p></div>
  <div className="relative overflow-hidden bg-paper p-6 pt-7 sm:p-8"><span className="absolute inset-x-0 top-0 h-[3px] bg-ember"/><span className="display block text-4xl font-semibold text-ember sm:text-6xl md:text-7xl"><CountUp to={5} pad2/></span><p className="mt-3.5 text-xs text-slate-500">Functional specialisations to choose from.</p></div>
  <div className="relative overflow-hidden bg-paper p-6 pt-7 sm:p-8"><span className="absolute inset-x-0 top-0 h-[3px] bg-maroon"/><span className="display block text-4xl font-semibold text-maroon sm:text-6xl md:text-7xl"><CountUp to={2}/></span><p className="mt-3.5 text-xs text-slate-500">Years, full-time, on the Ghulewadi campus.</p></div>
</Reveal></section>

<hr className="mx-auto max-w-[1320px] border-slate-200"/>

<section className="mx-auto grid max-w-[1320px] gap-6 px-5 py-16 sm:px-6 lg:grid-cols-[.62fr_1fr] lg:gap-10">
  <Reveal className="relative overflow-hidden bg-mist p-8 sm:p-10">
    <span aria-hidden className="display pointer-events-none absolute -right-4 -top-6 select-none text-[130px] font-semibold leading-none text-navy/5 sm:text-[160px]">1960</span>
    <p className="display relative max-w-[16ch] text-[28px] italic leading-[1.35] text-navy sm:text-[32px]">&ldquo;Spread Knowledge Unto the Last.&rdquo;</p>
    <p className="eyebrow relative mt-5 !text-blue">&mdash; The founding vision of Shikshan Prasarak Sanstha</p>
  </Reveal>
  <Reveal delay={.1}>
    <p className="eyebrow !text-gold">Our story</p>
    <h2 className="display mt-4 text-2xl font-medium leading-[1.15] text-navy sm:text-3xl lg:whitespace-nowrap lg:text-4xl">Six decades of access, expanded into management.</h2>
    <p className="mt-6 max-w-[60ch] text-[15px] leading-8 text-slate-500">Shikshan Prasarak Sanstha was established in 1960 to bring higher education within reach of rural communities around Sangamner. Sangamner College opened the following year, on Netaji Subhash Chandra Bose&rsquo;s birth anniversary &mdash; a first step that has since grown into arts, commerce, science and professional education, including management.</p>
    <div className="mt-8 flex flex-wrap gap-3">
      <span className="bg-navy px-4 py-2 text-[11.5px] font-bold text-white">1960 &middot; Sanstha established</span>
      <span className="bg-ember px-4 py-2 text-[11.5px] font-bold text-white">1961 &middot; Sangamner College founded</span>
      <span className="bg-gold px-4 py-2 text-[11.5px] font-bold text-navy">1965 &middot; Science courses begin</span>
    </div>
    <Link href="/about" className="focus-ring mt-8 inline-block border-b border-navy pb-1 text-[13px] font-extrabold text-navy">Read our full story &rarr;</Link>
  </Reveal>
</section>

<section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6">
  <Reveal><p className="eyebrow !text-gold">Why SPS MBA</p><h2 className="display mt-4 text-3xl font-medium text-navy sm:text-4xl lg:whitespace-nowrap">Four reasons students choose us.</h2></Reveal>
  <div className="mt-9 grid gap-px overflow-hidden bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
    {why.map(([t,d],i)=>{const{Icon,accent,bar}=whyMeta[i];return <Reveal delay={i*.05} key={t} className="relative overflow-hidden bg-paper p-8 transition-colors hover:bg-mist">
      <span className={`absolute inset-x-0 top-0 h-[3px] ${bar}`}/>
      <div className="flex items-center justify-between"><span className={`display text-3xl ${accent}`}>{String(i+1).padStart(2,'0')}</span><Icon size={22} className={accent} strokeWidth={1.6}/></div>
      <h3 className="mt-5 text-[15px] font-extrabold text-navy">{t}</h3>
      <p className="mt-3 text-[13px] leading-6 text-slate-500">{d}</p>
    </Reveal>})}
  </div>
</section>

<section className="bg-mist py-16"><div className="mx-auto max-w-[1320px] px-5 sm:px-6">
  <Reveal className="flex flex-wrap items-end justify-between gap-6">
    <div><p className="eyebrow !text-blue">Functional areas</p><h2 className="display mt-4 text-4xl font-medium text-navy">Five ways to shape your MBA.</h2></div>
    <Link href="/academics/mba" className="focus-ring border-b border-navy pb-1 text-[13px] font-extrabold text-navy">Full curriculum &rarr;</Link>
  </Reveal>
  <div className="mt-10">{specializations.map((s,i)=><Reveal delay={i*.04} key={s.slug}><div className={`group flex flex-col gap-3 border-t border-slate-200 py-6 transition-colors hover:bg-white sm:flex-row sm:items-center sm:gap-8 ${i===specializations.length-1?'border-b':''}`}>
    <span className={`display grid h-12 w-12 shrink-0 place-items-center text-lg font-bold transition-transform group-hover:scale-105 ${specAccents[i]}`}>{String(i+1).padStart(2,'0')}</span>
    <span className="display w-full shrink-0 text-2xl text-navy sm:w-[300px]">{s.name}</span>
    <span className="text-sm text-slate-500">{s.description}</span>
  </div></Reveal>)}</div>
</div></section>

{hasFacilityShowcase&&<section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6">
  <Reveal><p className="eyebrow inline-block bg-navy px-3.5 py-2 !text-gold">Campus</p><h2 className="display mt-5 text-3xl font-medium text-navy sm:text-4xl lg:whitespace-nowrap">Built for focused, active learning.</h2></Reveal>
  <div className="mt-9 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
    <Reveal delay={.05} className="relative flex flex-col justify-between gap-8 overflow-hidden bg-navy p-8 text-white transition-transform hover:-translate-y-1 lg:col-start-1 lg:row-span-2">
      <Sunburst className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 text-gold/5" style={{animation:'rotate-slow 160s linear infinite'}}/>
      <div className="relative flex items-start justify-between"><Book size={26} className="text-gold" strokeWidth={1.4}/><span className="text-[11px] font-bold text-white/25">01</span></div>
      <div className="relative"><span className="display block text-5xl font-semibold text-gold">10,000+</span><h3 className="display mt-3 text-2xl font-semibold">{library.title}</h3><p className="mt-2.5 max-w-[32ch] text-[13px] leading-7 text-white/65">{library.description}</p></div>
    </Reveal>
    <Reveal delay={.1} className="flex flex-col justify-between gap-6 border border-blue/15 bg-blue/5 p-7 transition-transform hover:-translate-y-1 lg:col-start-2 lg:row-start-1">
      <div className="flex items-start justify-between"><Ict size={24} className="text-blue" strokeWidth={1.6}/><span className="text-[11px] font-bold text-slate-300">02</span></div>
      <div><h3 className="display text-lg font-semibold text-navy">{ict.title}</h3><p className="mt-1.5 text-xs leading-6 text-slate-500">Campus-wide Wi-Fi, e-resources and an LMS with access to journals and databases.</p><div className="mt-3 flex flex-wrap gap-1.5">{['SPSS','R','AI/BI'].map(t=><span key={t} className="bg-blue/10 px-2 py-1 text-[10px] font-bold text-blue">{t}</span>)}</div></div>
    </Reveal>
    <Reveal delay={.15} className="flex flex-col justify-between gap-6 border border-ember/15 bg-ember/5 p-7 transition-transform hover:-translate-y-1 lg:col-start-3 lg:row-start-1">
      <div className="flex items-start justify-between"><Lab size={24} className="text-ember" strokeWidth={1.6}/><span className="text-[11px] font-bold text-slate-300">03</span></div>
      <div><h3 className="display text-lg font-semibold text-navy">{labs.title}</h3><p className="mt-1.5 text-xs leading-6 text-slate-500">{labs.description}</p></div>
    </Reveal>
    <Reveal delay={.2} className="flex items-center gap-6 border border-maroon/15 bg-maroon/5 p-7 transition-transform hover:-translate-y-1 lg:col-span-2 lg:col-start-2 lg:row-start-2">
      <Sport size={28} className="shrink-0 text-maroon" strokeWidth={1.5}/>
      <div className="flex-1"><div className="flex items-center justify-between"><h3 className="display text-lg font-semibold text-navy">{sports.title}</h3><span className="text-[11px] font-bold text-slate-300">04</span></div><p className="mt-1.5 text-xs leading-6 text-slate-500">{sports.description}</p></div>
    </Reveal>
  </div>
</section>}

<section className="bg-mist py-16"><div className="mx-auto max-w-[1320px] px-5 sm:px-6">
  <Reveal><p className="eyebrow !text-blue">Campus life</p><h2 className="display mt-4 text-3xl font-medium text-navy sm:text-4xl lg:whitespace-nowrap">A closer look around SPS MBA.</h2></Reveal>
  <div className="mt-9"><CampusGallery photos={campusPhotos} facilityTitles={facilities.map(f=>f.title)}/></div>
</div></section>

<section id="news" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6">
  <Reveal><p className="eyebrow !text-gold">From the institute</p><h2 className="display mt-4 text-3xl font-medium text-navy sm:text-4xl lg:whitespace-nowrap">News &amp; events.</h2></Reveal>
  <Reveal delay={.08} className="mt-8"><BlogEventsTabs news={newsCards} events={eventCards}/></Reveal>
</section>

<section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6">
  <Reveal className="flex flex-wrap items-end justify-between gap-6">
    <div><p className="eyebrow !text-gold">Beyond the classroom</p><h2 className="display mt-4 text-3xl font-medium text-navy sm:text-4xl lg:whitespace-nowrap">Preparing for the career after.</h2></div>
    <Link href="/placements" className="focus-ring border-b border-navy pb-1 text-[13px] font-extrabold text-navy">Placement support &rarr;</Link>
  </Reveal>
  <div className="mt-9 grid gap-5 md:grid-cols-3">{placementSteps.map(([t,d],i)=><Reveal delay={i*.05} key={t} className="bg-mist p-8"><h3 className="display text-3xl text-navy">{t}</h3><p className="mt-4 text-sm leading-7 text-slate-500">{d}</p></Reveal>)}</div>
</section>

<section className="relative overflow-hidden bg-navy py-16 text-white"><div className="noise absolute inset-0 opacity-60"/><Sunburst className="pointer-events-none absolute -right-32 -top-32 h-[440px] w-[440px] text-white/5" style={{animation:'rotate-slow 200s linear infinite'}}/><div className="relative mx-auto max-w-[1320px] px-5 sm:px-6">
  <Reveal>
    <p className="eyebrow !text-gold">Admissions 2026&ndash;27</p>
    <h2 className="display mt-5 text-4xl font-medium leading-[1.02] sm:text-5xl lg:whitespace-nowrap lg:text-6xl">Begin the next chapter.</h2>
    <p className="mt-6 max-w-[52ch] text-sm leading-8 text-white/60">Five steps stand between you and an SPS MBA &mdash; CET registration through to confirmed admission. Our team can walk you through CAP, eligibility and documentation.</p>
  </Reveal>
  <Reveal delay={.1} className="mt-10 flex flex-wrap border-t border-white/15 pt-9">
    {['Register','Appear for CET','Submit preferences','Verify documents','Confirm admission'].map((x,i)=><div key={x} className={`flex-1 min-w-[140px] pr-5 ${i>0?'border-l border-white/15 pl-5':''}`}><span className="display text-xl text-gold">{String(i+1).padStart(2,'0')}</span><p className="mt-3 text-xs text-white/70">{x}</p></div>)}
  </Reveal>
  <Link href="/admissions#enquire" className="focus-ring mt-9 inline-flex items-center gap-2.5 bg-gradient-to-r from-ember to-gold px-6 py-4 text-[13px] font-extrabold text-navy transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ember/20">Start your admission enquiry <ArrowUpRight size={16}/></Link>
</div></section>

</main>}
