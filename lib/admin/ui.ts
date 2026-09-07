// Shared Tailwind class strings for the admin backend — kept in one place so
// every generated form/table looks consistent without a component library.
export const input =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus-ring focus:border-blue';
export const textarea = `${input} min-h-28`;
export const label = 'block text-xs font-bold uppercase tracking-wide text-slate-500';
export const help = 'mt-1 text-xs text-slate-400';
export const fieldWrap = 'grid gap-1.5';
export const primaryButton =
  'inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy2 disabled:opacity-50';
export const dangerButton =
  'inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100';
export const secondaryLink =
  'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50';
export const card = 'rounded-2xl border border-slate-200 bg-white p-6 sm:p-8';
export const table = 'w-full border-collapse text-left text-sm';
export const th = 'border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500';
export const td = 'border-b border-slate-100 px-4 py-3 align-top text-slate-700';
