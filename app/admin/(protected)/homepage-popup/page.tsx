import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'Homepage popup' };

async function saveHomepagePopup(formData: FormData) {
  'use server';
  await requireAdmin();
  const text = (name: string) => String(formData.get(name) ?? '').trim() || null;
  const date = (name: string) => {
    const s = String(formData.get(name) ?? '').trim();
    return s ? new Date(s) : null;
  };
  const data = {
    enabled: formData.get('enabled') === 'on',
    title: text('title'),
    message: text('message'),
    imageUrl: text('imageUrl'),
    buttonLabel: text('buttonLabel'),
    buttonHref: text('buttonHref'),
    startDate: date('startDate'),
    endDate: date('endDate'),
  };
  await prisma.homepagePopup.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  redirect('/admin/homepage-popup?saved=1');
}

export default async function HomepagePopupAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const p = await prisma.homepagePopup.findUnique({ where: { id: 1 } });
  const v = (val: string | null | undefined) => val ?? '';
  const dateVal = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : '');

  return (
    <div>
      <p className="eyebrow">Homepage</p>
      <h1 className="display mt-2 text-3xl text-navy">Announcement popup</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-500">A toggleable modal shown on the homepage, optionally scheduled.</p>
      {saved && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Saved.</p>}

      <form action={saveHomepagePopup} className={`${ui.card} mt-6 grid max-w-2xl gap-5`}>
        <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="enabled" defaultChecked={p?.enabled ?? false} className="h-4 w-4 rounded border-slate-300" />
          Enabled
        </label>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Title</label>
          <input name="title" defaultValue={v(p?.title)} className={ui.input} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Message</label>
          <textarea name="message" defaultValue={v(p?.message)} className={ui.textarea} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Image URL</label>
          <input name="imageUrl" defaultValue={v(p?.imageUrl)} className={ui.input} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Button label</label>
            <input name="buttonLabel" defaultValue={v(p?.buttonLabel)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Button link</label>
            <input name="buttonHref" defaultValue={v(p?.buttonHref)} className={ui.input} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Start date (optional)</label>
            <input type="date" name="startDate" defaultValue={dateVal(p?.startDate)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>End date (optional)</label>
            <input type="date" name="endDate" defaultValue={dateVal(p?.endDate)} className={ui.input} />
          </div>
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
