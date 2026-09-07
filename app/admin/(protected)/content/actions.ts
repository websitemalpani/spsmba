'use server';

import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getSection } from '@/lib/admin/registry';
import { buildDataFromForm } from '@/lib/admin/serialize';

export async function createEntry(sectionKey: string, formData: FormData) {
  await requireAdmin();
  const section = getSection(sectionKey);
  if (!section) notFound();
  const data = buildDataFromForm(section, formData);
  const row = await section.delegate.create({ data });
  if (section.afterSave) await section.afterSave(row.id, formData);
  redirect(`/admin/content/${sectionKey}`);
}

export async function updateEntry(sectionKey: string, id: number, formData: FormData) {
  await requireAdmin();
  const section = getSection(sectionKey);
  if (!section) notFound();
  const data = buildDataFromForm(section, formData);
  await section.delegate.update({ where: { id }, data });
  if (section.afterSave) await section.afterSave(id, formData);
  redirect(`/admin/content/${sectionKey}`);
}

export async function deleteEntry(sectionKey: string, id: number) {
  await requireAdmin();
  const section = getSection(sectionKey);
  if (!section) notFound();
  await section.delegate.delete({ where: { id } });
  redirect(`/admin/content/${sectionKey}`);
}
