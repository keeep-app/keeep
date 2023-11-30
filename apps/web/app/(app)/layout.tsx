import { SupabaseProvider } from '@/lib/provider/supabase';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SupabaseProvider>{children}</SupabaseProvider>;
}
