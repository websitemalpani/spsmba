import Image from 'next/image';import Link from 'next/link';import {notFound} from 'next/navigation';import {ChevronRight} from 'lucide-react';import {getNewsBySlug,mediaUrl} from '@/lib/api';import type {Metadata} from 'next';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const item=await getNewsBySlug(slug);
  return {title:item?.title??'News'};
}

export default async function NewsDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const item=await getNewsBySlug(slug);
  if(!item)notFound();
  const image=mediaUrl(item.coverImage);
  const date=item.publishedDate?new Date(item.publishedDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):null;

  return <main>
    <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
      {image&&<Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-25"/>}
      <div className="noise absolute inset-0 opacity-60"/>
      <div className="relative mx-auto max-w-4xl px-5">
        <div className="mb-10 flex items-center gap-2 text-[11px] text-white/45"><Link href="/">Home</Link><ChevronRight size={12}/><span className="text-gold">News</span></div>
        <p className="eyebrow !text-gold">News</p>
        {date&&<p className="mt-4 text-xs font-bold uppercase tracking-wide text-white/50">{date}</p>}
        <h1 className="display mt-3 max-w-3xl text-4xl font-medium leading-tight md:text-5xl">{item.title}</h1>
      </div>
    </section>
    <section className="mx-auto max-w-3xl px-5 py-16">
      {item.summary&&<p className="text-lg font-medium leading-8 text-navy">{item.summary}</p>}
      {item.body&&<div className="mt-6 space-y-5 text-sm leading-8 text-slate-600">{item.body.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div>}
      <Link href="/#news" className="focus-ring mt-10 inline-flex items-center gap-2 text-sm font-extrabold text-navy">&larr; Back to news &amp; events</Link>
    </section>
  </main>;
}
