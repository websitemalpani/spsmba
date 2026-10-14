import {PageHero} from '@/components/page-hero';import {YearFolders} from '@/components/year-folders';import {getDocumentYearFolders,getSiteSettings} from '@/lib/api';
export default async function Fees(){const[folders,siteSettings]=await Promise.all([getDocumentYearFolders('Fees'),getSiteSettings()]);const phone=siteSettings?.phone||'(02425) 223181';const email=siteSettings?.email||'info@spsmba.edu.in';return <main>
<PageHero kicker="Fees" title="FRA-regulated fee structure." body="Fees are approved by the Fee Regulating Authority (FRA), Maharashtra. Refer to the official documents below, filed by academic year."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <YearFolders folders={folders}/>
  <p className="mt-10 text-xs text-slate-400">For queries regarding fee payment or scholarships, call {phone} or write to {email}.</p>
</section>
</main>}
