'use client';

import { useStore } from '@/store/useStore';
import { ChevronLeft } from 'lucide-react';

export function MobileSidebarToggle() {
  const openSidebar = useStore(state => state.sidebar.open);

  return (
    <button
      type="button"
      className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      onClick={openSidebar}
    >
      <span className="sr-only">Open sidebar</span>
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
