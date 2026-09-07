'use client';
import * as ui from '@/lib/admin/ui';

export function DeleteButton({ action, confirmText }: { action: (formData: FormData) => void; confirmText: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className={ui.dangerButton}>
        Delete
      </button>
    </form>
  );
}
