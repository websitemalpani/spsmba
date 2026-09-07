'use client';
import Image from 'next/image';import Link from 'next/link';import {ArrowRight,ArrowUpRight,Mail,MapPin,Menu,Phone,X} from 'lucide-react';import {useEffect,useState} from 'react';import {usePathname} from 'next/navigation';import type {NavItem,SiteSettings} from '@/lib/api';import {mediaUrl} from '@/lib/api';import {Sunburst} from '@/components/sunburst';

export function Header({nav,siteSettings}:{nav:NavItem[];siteSettings:SiteSettings|null}){
  const[open,setOpen]=useState(false);const pathname=usePathname();
  const phone=siteSettings?.phone||'(02425) 223181';const email=siteSettings?.email||'info@spsmba.edu.in';
  const topBarAddress=siteSettings?.topBarAddress||'Sangamner College Campus, Ghulewadi, Sangamner – 422605';
  const admissionsStatusLine=siteSettings?.admissionsStatusLine||'MBA admissions 2026–27 open';
  const logo=mediaUrl(siteSettings?.logo)||'/shikshan-logo.webp';
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
      <nav aria-label="Main navigation" className="hidden bg-navy xl:block"><div className="mx-auto flex h-12 max-w-[1320px] items-center justify-center gap-1 px-6">{nav.map(x=>{const active=pathname===x.href;return <Link className={`group relative flex h-full items-center px-3 text-[11px] font-bold uppercase tracking-[.1em] transition-colors ${active?'text-gold':'text-white/65 hover:text-white'}`} href={x.href} key={x.href}>{x.label}<span className={`absolute inset-x-3 bottom-0 h-[2px] bg-gradient-to-r from-ember to-gold transition-all duration-300 ${active?'w-[calc(100%-1.5rem)]':'w-0 group-hover:w-[calc(100%-1.5rem)]'}`}/></Link>})}</div></nav>
    </header>
    {open&&<div className="fixed inset-0 top-[141px] z-40 overflow-y-auto bg-paper xl:hidden"><div className="mx-auto grid min-h-full max-w-[1200px] gap-8 px-5 py-8 lg:grid-cols-[1fr_350px] lg:px-8"><nav className="grid content-start gap-x-8 sm:grid-cols-2">{nav.map(x=><Link onClick={()=>setOpen(false)} className="group flex items-center justify-between border-b border-slate-200 px-2 py-4 text-lg font-bold text-slate-800 hover:text-navy" href={x.href} key={x.href}><span>{x.label}</span><ArrowRight size={17} className="opacity-30 transition group-hover:translate-x-1 group-hover:opacity-100"/></Link>)}</nav><aside className="h-fit bg-navy p-7 text-white"><p className="eyebrow !text-gold">Admissions 2026&ndash;27</p><h2 className="display mt-3 text-4xl font-medium">Begin your MBA journey.</h2><p className="mt-3 text-sm leading-7 text-white/70">Speak with our team about CET, CAP, eligibility and required documents.</p><Link onClick={()=>setOpen(false)} href="/admissions#enquire" className="mt-6 flex items-center justify-between bg-gradient-to-r from-ember to-gold px-5 py-4 text-sm font-extrabold text-navy">Admission enquiry <ArrowUpRight size={16}/></Link></aside></div></div>}
  </>;
}
