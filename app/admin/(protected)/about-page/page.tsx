import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'About page' };

async function saveAboutPage(formData: FormData) {
  'use server';
  await requireAdmin();
  const text = (name: string) => String(formData.get(name) ?? '').trim() || null;

  const timeline = String(formData.get('timeline') ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [year, ...rest] = line.split('|');
      return { year: (year ?? '').trim(), text: rest.join('|').trim(), order: i };
    })
    .filter((t) => t.year && t.text);

  const data = {
    foundationEyebrow: text('foundationEyebrow'),
    foundationTitle: text('foundationTitle'),
    foundationBody: text('foundationBody'),
    missionEyebrow: text('missionEyebrow'),
    missionTitle: text('missionTitle'),
    missionBody: text('missionBody'),
    missionQuote: text('missionQuote'),
    visionBody: text('visionBody'),
    chairmanQuote: text('chairmanQuote'),
    chairmanBody: text('chairmanBody'),
    chairmanName: text('chairmanName'),
    chairmanTitle: text('chairmanTitle'),
    chairmanPhotoUrl: text('chairmanPhotoUrl'),
    approvalsNote: text('approvalsNote'),
  };

  await prisma.timelineItem.deleteMany({ where: { aboutPageId: 1 } });
  await prisma.aboutPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...data, timeline: { create: timeline } },
    update: { ...data, timeline: { create: timeline } },
  });
  redirect('/admin/about-page?saved=1');
}

export default async function AboutPageAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const a = await prisma.aboutPage.findUnique({ where: { id: 1 }, include: { timeline: { orderBy: { order: 'asc' } } } });
  const v = (val: string | null | undefined) => val ?? '';

  return (
    <div>
      <p className="eyebrow">Page</p>
      <h1 className="display mt-2 text-3xl text-navy">About page</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-500">History, mission, vision and the chairman's message.</p>
      {saved && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Saved.</p>}

      <form action={saveAboutPage} className={`${ui.card} mt-6 grid max-w-3xl gap-5`}>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-blue">Foundation</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Eyebrow</label>
            <input name="foundationEyebrow" defaultValue={v(a?.foundationEyebrow)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Title</label>
            <input name="foundationTitle" defaultValue={v(a?.foundationTitle)} className={ui.input} />
          </div>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Body</label>
          <textarea name="foundationBody" defaultValue={v(a?.foundationBody)} className={ui.textarea} />
          <p className={ui.help}>Separate paragraphs with a blank line.</p>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Timeline</label>
          <textarea name="timeline" defaultValue={(a?.timeline ?? []).map((t) => `${t.year}|${t.text}`).join('\n')} className={ui.textarea} />
          <p className={ui.help}>One per line, as Year|Description — e.g. 1960|Shikshan Prasarak Sanstha established</p>
        </div>

        <h2 className="mt-3 text-sm font-extrabold uppercase tracking-wide text-blue">Mission &amp; vision</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Mission eyebrow</label>
            <input name="missionEyebrow" defaultValue={v(a?.missionEyebrow)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Mission title</label>
            <input name="missionTitle" defaultValue={v(a?.missionTitle)} className={ui.input} />
          </div>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Mission body</label>
          <textarea name="missionBody" defaultValue={v(a?.missionBody)} className={ui.textarea} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Mission quote</label>
          <input name="missionQuote" defaultValue={v(a?.missionQuote)} className={ui.input} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Vision statement body</label>
          <textarea name="visionBody" defaultValue={v(a?.visionBody)} className={ui.textarea} />
        </div>

        <h2 className="mt-3 text-sm font-extrabold uppercase tracking-wide text-blue">Chairman&rsquo;s message</h2>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Quote</label>
          <textarea name="chairmanQuote" defaultValue={v(a?.chairmanQuote)} className={ui.textarea} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Body</label>
          <textarea name="chairmanBody" defaultValue={v(a?.chairmanBody)} className={ui.textarea} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Name</label>
            <input name="chairmanName" defaultValue={v(a?.chairmanName)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Title</label>
            <input name="chairmanTitle" defaultValue={v(a?.chairmanTitle)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Photo URL</label>
            <input name="chairmanPhotoUrl" defaultValue={v(a?.chairmanPhotoUrl)} className={ui.input} />
          </div>
        </div>

        <div className={ui.fieldWrap}>
          <label className={ui.label}>Approvals note (footer of page)</label>
          <textarea name="approvalsNote" defaultValue={v(a?.approvalsNote)} className={ui.textarea} />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <button type="submit" className={ui.primaryButton}>
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
