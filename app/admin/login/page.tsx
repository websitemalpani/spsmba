import { AlertCircle } from 'lucide-react';
import { loginAction } from '@/app/admin/session-actions';
import * as ui from '@/lib/admin/ui';

export const metadata = { title: 'Admin login' };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  return (
    <div className="grid min-h-screen place-items-center bg-navy px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-soft">
        <p className="eyebrow">SPS MBA</p>
        <h1 className="display mt-2 text-2xl text-navy">Admin login</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage site content.</p>
        {error && (
          <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700">
            <AlertCircle size={17} className="shrink-0" />
            Invalid email or password.
          </div>
        )}
        <form action={loginAction} className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={next || '/admin'} />
          <div className={ui.fieldWrap}>
            <label className={ui.label} htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required className={ui.input} autoFocus />
          </div>
          <div className={ui.fieldWrap}>
            <label className={ui.label} htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" required className={ui.input} />
          </div>
          <button type="submit" className={`${ui.primaryButton} mt-2 justify-center`}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
