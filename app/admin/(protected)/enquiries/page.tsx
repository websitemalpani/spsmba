import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { DeleteButton } from '@/components/admin/delete-button';
import { StatusSelect } from '@/components/admin/status-select';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'Admission enquiries' };

const STATUSES = ['New', 'Contacted', 'Follow-up', 'Admitted', 'Rejected', 'Closed'];

async function updateStatus(id: number, formData: FormData) {
  'use server';
  await requireAdmin();
  const status = String(formData.get('status') ?? 'New');
  await prisma.admissionEnquiry.update({ where: { id }, data: { status } });
}

async function deleteEnquiry(id: number) {
  'use server';
  await requireAdmin();
  await prisma.admissionEnquiry.delete({ where: { id } });
}

export default async function EnquiriesPage() {
  await requireAdmin();
  const enquiries = await prisma.admissionEnquiry.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <p className="eyebrow">Admissions</p>
      <h1 className="display mt-2 text-3xl text-navy">Admission enquiries</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-500">Submissions from the Admissions and Contact page enquiry forms.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>Received</th>
              <th className={ui.th}>Name</th>
              <th className={ui.th}>Contact</th>
              <th className={ui.th}>City</th>
              <th className={ui.th}>Specialization</th>
              <th className={ui.th}>Message</th>
              <th className={ui.th}>Status</th>
              <th className={ui.th}></th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 && (
              <tr>
                <td className={ui.td} colSpan={8}>
                  No enquiries yet.
                </td>
              </tr>
            )}
            {enquiries.map((e) => {
              const boundUpdate = updateStatus.bind(null, e.id);
              const boundDelete = deleteEnquiry.bind(null, e.id);
              return (
                <tr key={e.id}>
                  <td className={ui.td}>{e.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className={ui.td}>{e.name}</td>
                  <td className={ui.td}>
                    <div>{e.mobile}</div>
                    <div className="text-xs text-slate-400">{e.email}</div>
                  </td>
                  <td className={ui.td}>{e.city ?? '—'}</td>
                  <td className={ui.td}>{e.specialization ?? '—'}</td>
                  <td className={`${ui.td} max-w-xs`}>{e.message ?? '—'}</td>
                  <td className={ui.td}>
                    <StatusSelect action={boundUpdate} defaultValue={e.status} options={STATUSES} />
                  </td>
                  <td className={ui.td}>
                    <DeleteButton action={boundDelete} confirmText="Delete this enquiry?" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
