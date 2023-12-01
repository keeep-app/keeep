import { SupabaseProvider } from '@/lib/provider/supabase';
import { Toaster } from '@/components/ui/toaster';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      {children}
      <Toaster />
    </SupabaseProvider>
  );
}
