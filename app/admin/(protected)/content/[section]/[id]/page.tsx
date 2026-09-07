import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { getSection } from '@/lib/admin/registry';
import { SectionForm } from '@/components/admin/section-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteEntry, updateEntry } from '../../actions';

export default async function EditEntryPage({ params }: { params: Promise<{ section: string; id: string }> }) {
  await requireAdmin();
  const { section: key, id: idParam } = await params;
  const section = getSection(key);
  if (!section) notFound();
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();

  let row = await section.delegate.findUnique({ where: { id } });
  if (!row) notFound();
  if (section.afterLoad) row = await section.afterLoad(row);

  const boundUpdate = updateEntry.bind(null, key, id);
  const boundDelete = deleteEntry.bind(null, key, id);

  return (
    <div>
      <Link href={`/admin/content/${key}`} className="text-xs font-bold text-slate-400 hover:text-navy">
        ← {section.label}
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-3xl text-navy">Edit {section.label.toLowerCase()} entry</h1>
        <DeleteButton action={boundDelete} confirmText={`Delete this ${section.label.toLowerCase()} entry?`} />
      </div>
      <div className="mt-6 max-w-3xl">
        <SectionForm section={section} row={row} action={boundUpdate} submitLabel="Save changes" />
      </div>
    </div>
  );
}
