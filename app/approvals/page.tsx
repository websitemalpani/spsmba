import type {Metadata} from 'next';import {PageHero} from '@/components/page-hero';import {YearFolders} from '@/components/year-folders';import {getDocumentYearFolders} from '@/lib/api';
export const metadata:Metadata={title:'Approval & Affiliation'};
export default async function Approvals(){const folders=await getDocumentYearFolders('Approvals & Affiliation','Permissions & standing documents');return <main>
<PageHero kicker="Approval & Affiliation" title="Approvals and affiliation, year by year." body="Affiliated to Savitribai Phule Pune University and approved by AICTE, New Delhi, DTE Maharashtra and the Government of Maharashtra. Documents are filed by academic year."/>
<section className="mx-auto max-w-7xl px-5 py-20"><YearFolders folders={folders}/></section>
</main>}
