import {PageHero} from '@/components/page-hero';import {YearFolders} from '@/components/year-folders';import {getDocumentYearFolders,getSiteSettings} from '@/lib/api';import {feeSchedule} from '@/lib/content';
const inr=(n?:number)=>n==null?'—':`₹${n.toLocaleString('en-IN')}`;
export default async function Fees(){const[folders,siteSettings]=await Promise.all([getDocumentYearFolders('Fees'),getSiteSettings()]);const phone=siteSettings?.phone||'(02425) 223181';const email=siteSettings?.email||'info@spsmba.edu.in';return <main>
<PageHero kicker="Fees" title="FRA-regulated fee structure." body="Fees are approved by the Fee Regulating Authority (FRA), Maharashtra. Refer to the official documents below, filed by academic year."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <p className="eyebrow">Academic year {feeSchedule.year} · शैक्षणिक वर्ष {feeSchedule.year}</p>
  <h2 className="display mt-4 text-3xl text-navy">Course-wise fees approved by FRA <span className="block text-2xl text-slate-500">शुल्क नियामक प्राधिकरणाने मंजूर केलेले अभ्यासक्रमनिहाय शुल्क</span></h2>
  <div className="mt-8 overflow-x-auto rounded-2xl border"><table className="w-full min-w-[640px] text-left text-sm">
    <thead className="bg-navy text-white"><tr>{[['Course','अभ्यासक्रम'],['Tuition fee','शिक्षण शुल्क'],['Development fee','विकास शुल्क'],['Total fee (per year)','एकूण शुल्क (प्रति वर्ष)'],['Status','स्थिती']].map(([en,mr])=><th key={en} className="px-5 py-4 font-bold">{en}<span className="block text-xs font-semibold text-white/60">{mr}</span></th>)}</tr></thead>
    <tbody className="divide-y">{feeSchedule.rows.map(r=><tr key={r.course} className="bg-white"><td className="px-5 py-4 font-extrabold text-navy">{r.course}<span className="block text-xs font-semibold text-slate-400">{r.courseMr}</span></td><td className="px-5 py-4 text-slate-600">{inr(r.tuition)}</td><td className="px-5 py-4 text-slate-600">{inr(r.development)}</td><td className="px-5 py-4 text-base font-extrabold text-navy">{inr(r.total)}</td><td className="px-5 py-4 text-xs text-slate-500">{r.note}<span className="block">{r.noteMr}</span></td></tr>)}</tbody>
  </table></div>
  <p className="mt-4 text-xs leading-6 text-slate-400">Fees are per student, as approved by the Fees Regulating Authority, Maharashtra, and are subject to change. The MCA fee is an ad-hoc fee for a newly started course. शुल्क प्रति विद्यार्थी असून शुल्क नियामक प्राधिकरण, महाराष्ट्र यांच्या मंजुरीनुसार आहे व त्यात बदल होऊ शकतो.</p>

  <h2 className="display mt-16 text-3xl text-navy">Official fee documents</h2>
  <div className="mt-6"><YearFolders folders={folders}/></div>
  <p className="mt-10 text-xs text-slate-400">For queries regarding fee payment or scholarships, call {phone} or write to {email}.</p>
</section>
</main>}
