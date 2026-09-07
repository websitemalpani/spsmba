import {PageHero} from '@/components/page-hero';import {getEvents,mediaUrl} from '@/lib/api';import Image from 'next/image';import Link from 'next/link';import {CalendarDays,MapPin} from 'lucide-react';

export const metadata={title:'Events'};

export default async function EventsIndex(){
  const events=await getEvents();
  return <main>
    <PageHero kicker="Events" title="Events at SPS MBA." body="Workshops, industrial visits, seminars and campus activities."/>
    <section className="mx-auto max-w-7xl px-5 py-20">
      {events.length===0?<p className="py-14 text-center text-sm text-slate-400">Events coming soon.</p>:
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{events.map(e=>{const image=mediaUrl(e.coverImage);const date=e.startDate?new Date(e.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):null;return <Link key={e.slug} href={`/events/${e.slug}`} className="focus-ring group block overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-44 overflow-hidden bg-mist">{image?<Image src={image} alt={e.title} fill sizes="360px" className="object-cover transition duration-500 group-hover:scale-105"/>:<div className="grid h-full place-items-center text-slate-300"><CalendarDays size={30}/></div>}</div>
        <div className="p-6">
          {date&&<p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-blue"><CalendarDays size={12}/>{date}</p>}
          <h2 className="mt-2.5 text-base font-extrabold leading-snug text-navy group-hover:text-blue">{e.title}</h2>
          {e.venue&&<p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={12}/>{e.venue}</p>}
          {e.description&&<p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-500">{e.description}</p>}
        </div>
      </Link>})}</div>}
    </section>
  </main>;
}
