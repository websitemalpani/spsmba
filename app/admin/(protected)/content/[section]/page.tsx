import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { getSection } from '@/lib/admin/registry';
import { valueForInput } from '@/lib/admin/serialize';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteEntry } from '../actions';
import * as ui from '@/lib/admin/ui';

export default async function ContentListPage({ params }: { params: Promise<{ section: string }> }) {
  await requireAdmin();
  const { section: key } = await params;
  const section = getSection(key);
  if (!section) notFound();

  const rows = await section.delegate.findMany({ orderBy: section.orderBy });
  const columns = section.fields.filter((f) => section.listColumns.includes(f.name));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display mt-2 text-3xl text-navy">{section.label}</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">{section.description}</p>
        </div>
        <Link href={`/admin/content/${key}/new`} className={ui.primaryButton}>
          <Plus size={16} /> New
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className={ui.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.name} className={ui.th}>
                  {c.label}
                </th>
              ))}
              <th className={ui.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className={ui.td} colSpan={columns.length + 1}>
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((row: Record<string, unknown>) => {
              const id = row.id as number;
              const boundDelete = deleteEntry.bind(null, key, id);
              return (
                <tr key={id}>
                  {columns.map((c) => {
                    const val = valueForInput(c, row);
                    return (
                      <td key={c.name} className={ui.td}>
                        {c.type === 'checkbox' ? (val ? 'Yes' : 'No') : String(val).slice(0, 140) || '—'}
                      </td>
                    );
                  })}
                  <td className={`${ui.td} whitespace-nowrap`}>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/content/${key}/${id}`} className={ui.secondaryLink}>
                        Edit
                      </Link>
                      <DeleteButton action={boundDelete} confirmText={`Delete this ${section.label.toLowerCase()} entry?`} />
                    </div>
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
