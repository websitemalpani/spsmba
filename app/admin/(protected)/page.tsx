import Link from 'next/link';
import { prisma } from '@/lib/db';
import { sections } from '@/lib/admin/registry';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'Admin dashboard' };

export default async function AdminDashboard() {
  const [enquiryCount, newEnquiryCount] = await Promise.all([
    prisma.admissionEnquiry.count(),
    prisma.admissionEnquiry.count({ where: { status: 'New' } }),
  ]);

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 className="display mt-2 text-3xl text-navy">Content dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Manage everything the public site reads from the database. Changes appear on the live site immediately — every
        page renders fresh on each request.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/enquiries" className={`${ui.card} block transition hover:-translate-y-0.5 hover:shadow-soft`}>
          <p className="text-xs font-bold uppercase tracking-wide text-blue">Admission enquiries</p>
          <p className="display mt-3 text-4xl text-navy">{enquiryCount}</p>
          <p className="mt-2 text-xs text-slate-400">{newEnquiryCount} new, unreviewed</p>
        </Link>
        {sections.map((s) => (
          <Link key={s.key} href={`/admin/content/${s.key}`} className={`${ui.card} block transition hover:-translate-y-0.5 hover:shadow-soft`}>
            <p className="text-sm font-extrabold text-navy">{s.label}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
