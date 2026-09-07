import type { FieldConfig, SectionConfig } from './registry';
import { slugForSection } from './registry';

// Converts a submitted <form> into the Prisma `data` payload for a section,
// applying per-field type coercion. Virtual fields (e.g. a gallery album's
// photo list) are excluded — the section's afterSave hook handles those.
export function buildDataFromForm(section: SectionConfig, formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of section.fields) {
    if (field.virtual) continue;
    const raw = formData.get(field.name);
    switch (field.type) {
      case 'checkbox':
        data[field.name] = raw === 'on';
        break;
      case 'number': {
        const n = raw !== null && raw !== '' ? Number(raw) : null;
        data[field.name] = n !== null && Number.isFinite(n) ? n : field.required ? 0 : null;
        break;
      }
      case 'date': {
        const s = String(raw ?? '').trim();
        data[field.name] = s ? new Date(s) : null;
        break;
      }
      case 'list': {
        const items = String(raw ?? '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        data[field.name] = items;
        break;
      }
      default: {
        const s = String(raw ?? '').trim();
        data[field.name] = s || null;
      }
    }
  }
  const slug = slugForSection(section, formData);
  if (slug !== undefined) data[section.slugFrom!.target] = slug;
  return data;
}

// Converts a loaded DB row's field value into a string/boolean suitable for
// an <input>/<textarea> defaultValue/defaultChecked.
export function valueForInput(field: FieldConfig, row: Record<string, unknown> | null): string | boolean {
  if (!row) return field.type === 'checkbox' ? false : '';
  const value = row[field.name];
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'list') return Array.isArray(value) ? value.join('\n') : '';
  if (field.type === 'date') {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value as string);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }
  return value === null || value === undefined ? '' : String(value);
}
