import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { sections } from '@/lib/admin/registry';
import { logoutAction } from '@/app/admin/session-actions';

const singletons = [
  { href: '/admin/site-settings', label: 'Site settings' },
  { href: '/admin/about-page', label: 'About page' },
  { href: '/admin/placements-page', label: 'Placements page' },
  { href: '/admin/homepage-popup', label: 'Homepage popup' },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-navy text-white lg:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="eyebrow !text-gold">SPS MBA</p>
            <p className="display mt-1 text-lg font-semibold">Admin</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-5 text-sm">
            <Link href="/admin" className="block rounded-lg px-3 py-2 font-bold text-white/85 hover:bg-white/10">
              Dashboard
            </Link>
            <Link href="/admin/enquiries" className="block rounded-lg px-3 py-2 font-bold text-white/85 hover:bg-white/10">
              Admission enquiries
            </Link>
            <p className="mt-5 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">Pages</p>
            {singletons.map((s) => (
              <Link key={s.href} href={s.href} className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white">
                {s.label}
              </Link>
            ))}
            <p className="mt-5 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">Content</p>
            {sections.map((s) => (
              <Link key={s.key} href={`/admin/content/${s.key}`} className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white">
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-h-screen flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-navy">
              ← Back to site
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500">{email}</span>
              <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-navy">
                  <LogOut size={14} /> Log out
                </button>
              </form>
            </div>
          </header>
          <main className="p-6 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
