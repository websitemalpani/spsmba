import Image from 'next/image';import Link from 'next/link';import {UserRound} from 'lucide-react';import {mediaUrl,type AboutPage} from '@/lib/api';
type Leader={id:string;label:string;quote?:string|null;body?:string|null;name?:string|null;title?:string|null;photo?:string|null};
// Chairman's and Director's messages. A message without body text is not shown.
export function leadersFrom(a:AboutPage|null):Leader[]{
  if(!a)return[];
  return [
    {id:'chairman',label:'Chairman’s message',quote:a.chairmanQuote,body:a.chairmanBody,name:a.chairmanName,title:a.chairmanTitle,photo:a.chairmanPhoto},
    {id:'director',label:'Director’s message',quote:a.directorQuote,body:a.directorBody,name:a.directorName,title:a.directorTitle,photo:a.directorPhoto}
  ].filter(l=>l.body);
}
export function LeaderMessage({leader,compact=false}:{leader:Leader;compact?:boolean}){const photo=mediaUrl(leader.photo);
  return <article id={compact?undefined:leader.id} className={compact?'flex flex-col gap-8 bg-white p-7 sm:flex-row sm:items-center':'scroll-mt-40'}>
    {compact?<>
      <div className="relative h-72 w-full shrink-0 overflow-hidden bg-mist sm:w-60">{photo?<Image src={photo} alt={leader.name||''} fill sizes="(min-width:640px) 240px, 100vw" className="object-cover object-top"/>:<UserRound className="m-auto h-full text-slate-300" size={36}/>}</div>
      <div><p className="eyebrow !text-blue">{leader.label}</p>{leader.quote&&<p className="display mt-3 text-xl italic leading-snug text-navy">&ldquo;{leader.quote}&rdquo;</p>}<p className="mt-3 line-clamp-4 text-[13px] leading-6 text-slate-500">{leader.body}</p><p className="mt-4 text-sm font-bold text-navy">{leader.name}</p><p className="text-xs text-slate-400">{leader.title}</p><Link href={`/about#${leader.id}`} className="focus-ring mt-3 inline-block border-b border-navy pb-0.5 text-[12px] font-extrabold text-navy">Read full message &rarr;</Link></div>
    </>:<>
      <p className="eyebrow">{leader.label}</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start"><div className="relative h-[340px] overflow-hidden rounded-3xl bg-mist">{photo&&<Image src={photo} alt={leader.name||''} fill sizes="280px" className="object-contain"/>}</div><div>{leader.quote&&<p className="display text-3xl italic leading-snug text-navy">&ldquo;{leader.quote}&rdquo;</p>}<div className="mt-6 space-y-4 text-sm leading-8 text-slate-600">{leader.body?.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div><p className="mt-8 text-sm font-bold text-navy">{leader.name}</p><p className="text-xs text-slate-400">{leader.title}</p></div></div>
    </>}
  </article>;
}
