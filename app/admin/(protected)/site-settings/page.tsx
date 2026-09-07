import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'Site settings' };

async function saveSiteSettings(formData: FormData) {
  'use server';
  await requireAdmin();

  const text = (name: string) => String(formData.get(name) ?? '').trim() || null;

  const socialLinks = String(formData.get('socialLinks') ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [platform, url] = line.split('|').map((s) => s.trim());
      return { platform: platform || 'Website', url: url || platform, order: i };
    });

  await prisma.socialLink.deleteMany({ where: { siteSettingId: 1 } });
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      instituteName: text('instituteName'),
      shortName: text('shortName'),
      tagline: text('tagline'),
      phone: text('phone'),
      email: text('email'),
      address: text('address'),
      footerText: text('footerText'),
      topBarAddress: text('topBarAddress'),
      admissionsStatusLine: text('admissionsStatusLine'),
      logoUrl: text('logoUrl'),
      faviconUrl: text('faviconUrl'),
      metaTitle: text('metaTitle'),
      metaDescription: text('metaDescription'),
      keywords: text('keywords'),
      socialLinks: { create: socialLinks },
    },
    update: {
      instituteName: text('instituteName'),
      shortName: text('shortName'),
      tagline: text('tagline'),
      phone: text('phone'),
      email: text('email'),
      address: text('address'),
      footerText: text('footerText'),
      topBarAddress: text('topBarAddress'),
      admissionsStatusLine: text('admissionsStatusLine'),
      logoUrl: text('logoUrl'),
      faviconUrl: text('faviconUrl'),
      metaTitle: text('metaTitle'),
      metaDescription: text('metaDescription'),
      keywords: text('keywords'),
      socialLinks: { create: socialLinks },
    },
  });
  redirect('/admin/site-settings?saved=1');
}

export default async function SiteSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 }, include: { socialLinks: { orderBy: { order: 'asc' } } } });
  const v = (val: string | null | undefined) => val ?? '';

  return (
    <div>
      <p className="eyebrow">Global</p>
      <h1 className="display mt-2 text-3xl text-navy">Site settings</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-500">Institute name, contact details, top bar copy, footer text and SEO defaults.</p>
      {saved && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Saved.</p>}

      <form action={saveSiteSettings} className={`${ui.card} mt-6 grid max-w-3xl gap-5`}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Institute name</label>
            <input name="instituteName" defaultValue={v(s?.instituteName)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Short name</label>
            <input name="shortName" defaultValue={v(s?.shortName)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Tagline</label>
            <input name="tagline" defaultValue={v(s?.tagline)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Phone</label>
            <input name="phone" defaultValue={v(s?.phone)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Email</label>
            <input name="email" defaultValue={v(s?.email)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Logo URL</label>
            <input name="logoUrl" defaultValue={v(s?.logoUrl)} className={ui.input} />
            <p className={ui.help}>Leave blank to use the built-in Shikshan Prasarak Sanstha logo.</p>
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Favicon URL</label>
            <input name="faviconUrl" defaultValue={v(s?.faviconUrl)} className={ui.input} />
          </div>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Address</label>
          <textarea name="address" defaultValue={v(s?.address)} className={ui.textarea} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Top bar address (desktop)</label>
            <input name="topBarAddress" defaultValue={v(s?.topBarAddress)} className={ui.input} />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label}>Admissions status line (mobile top bar)</label>
            <input name="admissionsStatusLine" defaultValue={v(s?.admissionsStatusLine)} className={ui.input} />
          </div>
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Footer text</label>
          <input name="footerText" defaultValue={v(s?.footerText)} className={ui.input} />
        </div>
        <div className={ui.fieldWrap}>
          <label className={ui.label}>Social links</label>
          <textarea
            name="socialLinks"
            defaultValue={(s?.socialLinks ?? []).map((l) => `${l.platform}|${l.url}`).join('\n')}
            className={ui.textarea}
          />
          <p className={ui.help}>One per line, as Platform|URL — e.g. Facebook|https://facebook.com/... Supported platforms: Facebook, Instagram, YouTube.</p>
        </div>
        <div className="grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div className={ui.fieldWrap}>
            <label className={ui.label}>SEO meta title</label>
            <input name="metaTitle" defaultValue={v(s?.metaTitle)} className={ui.input} />
          </div>
          <div className={`${ui.fieldWrap} sm:col-span-2`}>
            <label className={ui.label}>SEO meta description</label>
            <input name="metaDescription" defaultValue={v(s?.metaDescription)} className={ui.input} />
          </div>
          <div className={`${ui.fieldWrap} sm:col-span-3`}>
            <label className={ui.label}>SEO keywords</label>
            <input name="keywords" defaultValue={v(s?.keywords)} className={ui.input} />
          </div>
        </div>
        <div className="border-t border-slate-100 pt-5">
          <button type="submit" className={ui.primaryButton}>
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
