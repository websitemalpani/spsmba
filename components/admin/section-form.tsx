import type { FieldConfig, SectionConfig } from '@/lib/admin/registry';
import { valueForInput } from '@/lib/admin/serialize';
import * as ui from '@/lib/admin/ui';

function FieldInput({ field, row }: { field: FieldConfig; row: Record<string, unknown> | null }) {
  const value = valueForInput(field, row);
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
        <input type="checkbox" name={field.name} defaultChecked={value as boolean} className="h-4 w-4 rounded border-slate-300" />
        {field.label}
      </label>
    );
  }
  if (field.type === 'textarea' || field.type === 'list') {
    return (
      <div className={ui.fieldWrap}>
        <label className={ui.label} htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-ember"> *</span>}
        </label>
        <textarea id={field.name} name={field.name} required={field.required} defaultValue={value as string} className={ui.textarea} />
        {field.help && <p className={ui.help}>{field.help}</p>}
      </div>
    );
  }
  return (
    <div className={ui.fieldWrap}>
      <label className={ui.label} htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-ember"> *</span>}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        required={field.required}
        defaultValue={value as string}
        className={ui.input}
      />
      {field.help && <p className={ui.help}>{field.help}</p>}
    </div>
  );
}

export function SectionForm({
  section,
  row,
  action,
  submitLabel,
}: {
  section: SectionConfig;
  row: Record<string, unknown> | null;
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  const checkboxes = section.fields.filter((f) => f.type === 'checkbox');
  const rest = section.fields.filter((f) => f.type !== 'checkbox');
  return (
    <form action={action} className={`${ui.card} grid gap-5`}>
      <div className="grid gap-5 sm:grid-cols-2">
        {rest.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.type === 'list' ? 'sm:col-span-2' : undefined}>
            <FieldInput field={f} row={row} />
          </div>
        ))}
      </div>
      {checkboxes.length > 0 && <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-5">{checkboxes.map((f) => <FieldInput key={f.name} field={f} row={row} />)}</div>}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <button type="submit" className={ui.primaryButton}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
