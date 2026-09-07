import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'Placements page' };

function linesToList(v: FormDataEntryValue | null) {
  return String(v ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function savePlacementsPage(formData: FormData) {
  'use server';
  await requireAdmin();
  const text = (name: string) => String(formData.get(name) ?? '').trim() || null;
  const data = {
    processSteps: linesToList(formData.get('processSteps')),
    policyRules: linesToList(formData.get('policyRules')),
    prepTitle: text('prepTitle'),
    prepBody: text('prepBody'),
    disclaimer: text('disclaimer'),
  };
  await prisma.placementsPage.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  redirect('/admin/placements-page?saved=1');
}

export default async function PlacementsPageAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const pp = await prisma.placementsPage.findUnique({ where: { id: 1 } });
  const v = (val: string | null | undefined) => val ?? '';

  return (
    <div>
      <p className="eyebrow">Page</p>
      <h1 className="display mt-2 text-3xl text-navy">Placements page</h1>
      {saved && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Saved.</p>}

      <form action={savePlacementsPage} className={`${ui.card} mt-6 grid max-w-3xl gap-5`}>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Placement process steps</label>
          <textarea name="processSteps" defaultValue={((pp?.processSteps as string[]) ?? []).join('\n')} className={ui.textarea} />
          <p className={ui.help}>One step per line, in order.</p>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Placement policy rules</label>
          <textarea name="policyRules" defaultValue={((pp?.policyRules as string[]) ?? []).join('\n')} className={ui.textarea} />
          <p className={ui.help}>One rule per line.</p>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Preparation section title</label>
          <input name="prepTitle" defaultValue={v(pp?.prepTitle)} className={ui.input} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Preparation section body</label>
          <textarea name="prepBody" defaultValue={v(pp?.prepBody)} className={ui.textarea} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Disclaimer</label>
          <textarea name="disclaimer" defaultValue={v(pp?.disclaimer)} className={ui.textarea} />
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
