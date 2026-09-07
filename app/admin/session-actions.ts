'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { clearSessionCookie, createSessionToken, setSessionCookie, verifyPassword } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '') || '/admin';

  const user = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createSessionToken({ adminId: user.id, email: user.email });
  await setSessionCookie(token);
  redirect(next);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect('/admin/login');
}
