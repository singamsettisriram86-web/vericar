// lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsgvvwxokqscbixhvzya.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3Z2d3hva3FzY2JpeGh2enlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzM3NDEsImV4cCI6MjEwNTQ0OTc0MX0.Pyml7AFChc4mIFIjmjTngD9RLbgSP--fra_I0-24A9I';

  return createBrowserClient(supabaseUrl, supabaseKey);
}

