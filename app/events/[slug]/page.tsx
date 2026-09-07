import Image from 'next/image';import Link from 'next/link';import {notFound} from 'next/navigation';import {ChevronRight,MapPin} from 'lucide-react';import {getEventBySlug,mediaUrl} from '@/lib/api';import type {Metadata} from 'next';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const item=await getEventBySlug(slug);
  return {title:item?.title??'Event'};
}

export default async function EventDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const item=await getEventBySlug(slug);
  if(!item)notFound();
  const image=mediaUrl(item.coverImage);
  const gallery=(item.gallery??[]).map(mediaUrl).filter((u):u is string=>!!u);
  const dateFmt=(d?:string)=>d?new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):null;
  const start=dateFmt(item.startDate);const end=dateFmt(item.endDate);
  const dateLabel=start&&end&&end!==start?`${start} – ${end}`:start;

  return <main>
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
      {image&&<Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-25"/>}
      <div className="noise absolute inset-0 opacity-60"/>
      <div className="relative mx-auto max-w-4xl px-5">
        <div className="mb-10 flex items-center gap-2 text-[11px] text-white/45"><Link href="/">Home</Link><ChevronRight size={12}/><span className="text-gold">Events</span></div>
        <p className="eyebrow !text-gold">Event</p>
        <h1 className="display mt-3 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">{item.title}</h1>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wide text-white/60">
          {dateLabel&&<span>{dateLabel}</span>}
          {item.venue&&<span className="flex items-center gap-1.5"><MapPin size={13}/>{item.venue}</span>}
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-3xl px-5 py-16">
      {item.description&&<div className="space-y-5 text-sm leading-8 text-slate-600">{item.description.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div>}
      {gallery.length>0&&<div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{gallery.map(src=><div key={src} className="relative h-48 overflow-hidden rounded-2xl bg-mist"><Image src={src} alt="" fill sizes="360px" className="object-cover"/></div>)}</div>}
      <Link href="/#news" className="focus-ring mt-10 inline-flex items-center gap-2 text-sm font-extrabold text-navy">&larr; Back to news &amp; events</Link>
    </section>
  </main>;
}
