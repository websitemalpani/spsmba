import {PageHero} from '@/components/page-hero';import {activities} from '@/lib/content';
export default function Students(){return <main>
<PageHero kicker="Student Corner" title="Learning that goes beyond the syllabus." body="Assessment, experiential learning and professional-development activities woven through the MBA curriculum."/>
<section id="activities" className="mx-auto max-w-7xl px-5 py-20">
  <p className="eyebrow">Activities</p><h2 className="display mt-4 max-w-2xl text-4xl text-navy">Classroom, and well beyond it.</h2>
  <div className="mt-10 flex flex-wrap gap-3">{activities.map(a=><span key={a} className="rounded-full border px-4 py-2 text-xs font-bold text-navy">{a}</span>)}</div>
  <p className="mt-10 text-xs text-slate-400">For student, alumni, parent, employer or faculty feedback, or grievance registration, please contact the institute at (02425) 223181 or info@spsmba.edu.in.</p>
</section>
</main>}
