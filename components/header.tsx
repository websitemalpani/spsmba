'use client';
import Image from 'next/image';import Link from 'next/link';import {ArrowRight,ArrowUpRight,ChevronDown,Mail,MapPin,Menu,Phone,X} from 'lucide-react';import {useEffect,useState} from 'react';import {usePathname} from 'next/navigation';import type {NavItem,SiteSettings} from '@/lib/api';import {mediaUrl} from '@/lib/api';import {Sunburst} from '@/components/sunburst';

export function Header({nav,siteSettings}:{nav:NavItem[];siteSettings:SiteSettings|null}){
  const[open,setOpen]=useState(false);const pathname=usePathname();
  const phone=siteSettings?.phone||'(02425) 223181';const email=siteSettings?.email||'info@spsmba.edu.in';
  const topBarAddress=siteSettings?.topBarAddress||'Sangamner College Campus, Ghulewadi, Sangamner – 422605';
  const admissionsStatusLine=siteSettings?.admissionsStatusLine||'MBA admissions 2026–27 open';
  const logo=mediaUrl(siteSettings?.logo)||'/shikshan-logo.webp';
  const isActive=(x:NavItem)=>pathname===x.href||!!x.children?.some(c=>c.href.split('#')[0]===pathname);
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
  return <>
    <div className="bg-gradient-to-r from-navy via-navy2 to-navy text-white/60">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-2.5 text-[11px] sm:px-6">
        <span className="hidden items-center gap-2 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-gold"/>{topBarAddress}</span>
        <span className="flex items-center gap-2 sm:hidden"><span className="h-1.5 w-1.5 rounded-full bg-gold"/>{admissionsStatusLine}</span>
        <div className="hidden items-center gap-6 sm:flex"><a href={`tel:${phone.replace(/[^0-9+]/g,'')}`} className="flex items-center gap-1.5 hover:text-white"><Phone size={11}/>{phone}</a><a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white"><Mail size={11}/>{email}</a></div>
      </div>
    </div>
    <header className="sticky top-0 z-50 bg-paper/95 shadow-[0_1px_0_rgba(7,26,52,.06)] backdrop-blur-xl">
      <div className="relative overflow-hidden">
        <Sunburst className="pointer-events-none absolute -right-10 -top-16 hidden h-40 w-40 text-ember/5 sm:block" style={{animation:'rotate-slow 200s linear infinite'}}/>
        <div className="relative mx-auto flex min-h-[100px] max-w-[1320px] items-center justify-between gap-5 px-5 py-3 sm:px-6">
          <Link href="/" aria-label="SPS MBA Institute home" className="flex min-w-0 items-center gap-4">
            <Image src={logo} alt="Shikshan Prasarak Sanstha logo" width={200} height={160} priority className="h-[54px] w-auto shrink-0 object-contain sm:h-[64px]"/>
            <span className="min-w-0">
              <span className="eyebrow block !text-blue">Shikshan Prasarak Sanstha&apos;s</span>
              <strong className="display block truncate text-[23px] font-semibold leading-tight sm:text-[28px]"><span className="text-navy">M.B.A. Institute, </span><span className="text-ember">Sangamner</span></strong>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-3"><Link href="/admissions#enquire" className="focus-ring hidden items-center gap-2 bg-gradient-to-r from-ember to-gold px-6 py-4 text-[12px] font-extrabold text-navy transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ember/25 lg:flex">Apply now <ArrowUpRight size={15}/></Link><button aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)} className="focus-ring grid h-11 w-11 place-items-center bg-navy text-white xl:hidden">{open?<X size={19}/>:<Menu size={19}/>}</button></div>
        </div>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-navy via-ember to-gold"/>
      <nav aria-label="Main navigation" className="hidden bg-navy xl:block"><div className="mx-auto flex h-12 max-w-[1320px] items-center justify-center gap-0.5 px-6">{nav.map(x=>{const active=isActive(x);const cls=`group/link relative flex h-full items-center gap-1 px-2.5 text-[11px] font-bold uppercase tracking-[.08em] transition-colors ${active?'text-gold':'text-white/65 hover:text-white'}`;const bar=<span className={`absolute inset-x-2.5 bottom-0 h-[2px] bg-gradient-to-r from-ember to-gold transition-all duration-300 ${active?'w-[calc(100%-1.25rem)]':'w-0 group-hover/link:w-[calc(100%-1.25rem)]'}`}/>;
          if(!x.children?.length)return <Link className={cls} href={x.href} key={x.href}>{x.label}{bar}</Link>;
          return <div key={x.href} className="group/menu relative h-full"><Link className={cls} href={x.href} aria-haspopup="true">{x.label}<ChevronDown size={12} className="opacity-60 transition group-hover/menu:rotate-180"/>{bar}</Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-[240px] translate-y-1 border-t-2 border-gold bg-white py-2 opacity-0 shadow-xl shadow-navy/15 transition group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100">{x.children.map(c=><Link key={c.href} href={c.href} className="block px-5 py-2.5 text-[12.5px] font-semibold text-slate-600 hover:bg-mist hover:text-navy">{c.label}</Link>)}</div>
          </div>})}</div></nav>
    </header>
    {open&&<div className="fixed inset-0 top-[141px] z-40 overflow-y-auto bg-paper xl:hidden"><div className="mx-auto grid min-h-full max-w-[1200px] gap-8 px-5 py-8 lg:grid-cols-[1fr_350px] lg:px-8"><nav className="grid content-start gap-x-8 sm:grid-cols-2">{nav.map(x=><div key={x.href} className="border-b border-slate-200"><Link onClick={()=>setOpen(false)} className="group flex items-center justify-between px-2 py-4 text-lg font-bold text-slate-800 hover:text-navy" href={x.href}><span>{x.label}</span><ArrowRight size={17} className="opacity-30 transition group-hover:translate-x-1 group-hover:opacity-100"/></Link>{x.children&&<div className="-mt-2 grid pb-3 pl-4">{x.children.filter(c=>c.href!==x.href).map(c=><Link key={c.href} onClick={()=>setOpen(false)} href={c.href} className="py-1.5 text-sm font-semibold text-slate-500 hover:text-navy">{c.label}</Link>)}</div>}</div>)}</nav><aside className="h-fit bg-navy p-7 text-white"><p className="eyebrow !text-gold">Admissions 2026&ndash;27</p><h2 className="display mt-3 text-4xl font-medium">Begin your MBA journey.</h2><p className="mt-3 text-sm leading-7 text-white/70">Speak with our team about CET, CAP, eligibility and required documents.</p><Link onClick={()=>setOpen(false)} href="/admissions#enquire" className="mt-6 flex items-center justify-between bg-gradient-to-r from-ember to-gold px-5 py-4 text-sm font-extrabold text-navy">Admission enquiry <ArrowUpRight size={16}/></Link></aside></div></div>}
  </>;
}
