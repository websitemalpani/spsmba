import { AdminShell } from '@/components/admin/shell';
import { requireAdmin } from '@/lib/auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
