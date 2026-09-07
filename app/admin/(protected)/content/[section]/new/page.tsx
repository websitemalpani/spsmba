import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { getSection } from '@/lib/admin/registry';
import { SectionForm } from '@/components/admin/section-form';
import { createEntry } from '../../actions';

export default async function NewEntryPage({ params }: { params: Promise<{ section: string }> }) {
  await requireAdmin();
  const { section: key } = await params;
  const section = getSection(key);
  if (!section) notFound();

  const boundCreate = createEntry.bind(null, key);

  return (
    <div>
      <Link href={`/admin/content/${key}`} className="text-xs font-bold text-slate-400 hover:text-navy">
        ← {section.label}
      </Link>
      <h1 className="display mt-2 text-3xl text-navy">New {section.label.toLowerCase()} entry</h1>
      <div className="mt-6 max-w-3xl">
        <SectionForm section={section} row={null} action={boundCreate} submitLabel="Create" />
      </div>
    </div>
  );
}
