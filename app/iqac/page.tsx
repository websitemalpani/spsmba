import {PageHero} from '@/components/page-hero';import {YearFolders} from '@/components/year-folders';import {getDocumentYearFolders,getIqacRecord} from '@/lib/api';
export default async function IQAC(){const[folders,iqac]=await Promise.all([getDocumentYearFolders('IQAC'),getIqacRecord()]);const objectives=iqac?.objectives??[];return <main>
<PageHero kicker="IQAC" title="Internal Quality Assurance Cell." body="Established per NAAC guidelines as a driving force for maintaining and enhancing the academic and administrative quality of the institute."/>
<section className="mx-auto max-w-7xl px-5 py-20">
  <div className="grid gap-10 lg:grid-cols-2">
    <div><p className="eyebrow">Objectives</p><h2 className="display mt-4 text-3xl text-navy">Consistent, catalytic improvement.</h2><ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">{objectives.map(o=><li key={o} className="flex gap-3"><span className="text-gold">&#8226;</span>{o}</li>)}</ul></div>
    <div><p className="eyebrow">Functions</p><h2 className="display mt-4 text-3xl text-navy">What the IQAC does.</h2><p className="mt-6 text-sm leading-7 text-slate-600">{iqac?.functionsDescription}</p></div>
  </div>
  <div className="mt-16"><p className="eyebrow">Reports</p><h2 className="display mt-4 text-3xl text-navy">IQAC documents by year</h2><div className="mt-6"><YearFolders folders={folders}/></div></div>
</section>
</main>}
