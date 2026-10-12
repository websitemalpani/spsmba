import {ChevronDown,FileText,Folder,FolderOpen} from 'lucide-react';import type {YearFolder} from '@/lib/api';
// Academic-year "folders" for document lists. Native <details> so it works without client JS;
// the newest year opens by default.
export function YearFolders({folders,empty='Documents will be published here soon.'}:{folders:YearFolder[];empty?:string}){
  if(!folders.length)return <p className="rounded-xl border border-dashed p-6 text-sm text-slate-400">{empty}</p>;
  return <div className="space-y-3">{folders.map((f,i)=><details key={f.year} open={i===0} className="group rounded-2xl border bg-white">
    <summary className="focus-ring flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
      <Folder size={20} className="shrink-0 text-gold group-open:hidden"/><FolderOpen size={20} className="hidden shrink-0 text-gold group-open:block"/>
      <span className="flex-1 text-sm font-extrabold text-navy">{f.year}</span>
      <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-bold text-slate-500">{f.items.length} {f.items.length===1?'file':'files'}</span>
      <ChevronDown size={16} className="shrink-0 text-slate-400 transition group-open:rotate-180"/>
    </summary>
    <div className="grid gap-2 border-t px-5 py-4 sm:grid-cols-2">{f.items.map(d=><a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-navy hover:bg-mist"><FileText size={17} className="shrink-0 text-blue"/>{d.title}</a>)}</div>
  </details>)}</div>;
}
