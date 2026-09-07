import {PageHero} from '@/components/page-hero';import {getNews,mediaUrl} from '@/lib/api';import Image from 'next/image';import Link from 'next/link';import {CalendarDays,Newspaper} from 'lucide-react';

export const metadata={title:'News'};

export default async function NewsIndex(){
  const news=await getNews();
  return <main>
    <PageHero kicker="News" title="News from SPS MBA." body="Announcements, publications and updates from the institute."/>
    <section className="mx-auto max-w-7xl px-5 py-20">
      {news.length===0?<p className="py-14 text-center text-sm text-slate-400">News coming soon.</p>:
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{news.map(n=>{const image=mediaUrl(n.coverImage);const date=n.publishedDate?new Date(n.publishedDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):null;return <Link key={n.slug} href={`/news/${n.slug}`} className="focus-ring group block overflow-hidden rounded-3xl border bg-white transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-44 overflow-hidden bg-mist">{image?<Image src={image} alt={n.title} fill sizes="360px" className="object-cover transition duration-500 group-hover:scale-105"/>:<div className="grid h-full place-items-center text-slate-300"><Newspaper size={30}/></div>}</div>
        <div className="p-6">
          {date&&<p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-blue"><CalendarDays size={12}/>{date}</p>}
          <h2 className="mt-2.5 text-base font-extrabold leading-snug text-navy group-hover:text-blue">{n.title}</h2>
          {n.summary&&<p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-500">{n.summary}</p>}
        </div>
      </Link>})}</div>}
    </section>
  </main>;
}
