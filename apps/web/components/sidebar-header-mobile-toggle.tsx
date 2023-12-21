'use client';

import { useSidebar } from '@/lib/provider/sidebar';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MobileSidebarToggle() {
  const t = useTranslations('Sidebar.header');
  const { open } = useSidebar();

  return (
    <button
      type="button"
      className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      onClick={open}
    >
      <span className="sr-only">{t('open-sidebar')}</span>
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
