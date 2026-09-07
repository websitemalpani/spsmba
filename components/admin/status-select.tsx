'use client';

export function StatusSelect({
  action,
  defaultValue,
  options,
}: {
  action: (formData: FormData) => void;
  defaultValue: string;
  options: string[];
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold"
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
