import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsgvvwxokqscbixhvzya.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3Z2d3hva3FzY2JpeGh2enlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzM3NDEsImV4cCI6MjEwNTQ0OTc0MX0.Pyml7AFChc4mIFIjmjTngD9RLbgSP--fra_I0-24A9I',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user?.email) {
      const email = data.user.email.toLowerCase();
      const displayName =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        email.split('@')[0];

      // Ensure user account exists in Supabase DB with 1 Free Credit
      try {
        await prisma.userAccount.upsert({
          where: { email },
          update: { name: displayName },
          create: {
            email,
            name: displayName,
            credits: 1, // 1 Free Inspection Credit on signup
          },
        });
      } catch (dbErr) {
        console.warn('Could not upsert user account on oauth callback:', dbErr);
      }

      // Build redirect response and attach user session cookies so client immediately reflects it
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set('vericar_user_email', email, { path: '/', maxAge: 60 * 60 * 24 * 30 });
      response.cookies.set('vericar_user_name', displayName, { path: '/', maxAge: 60 * 60 * 24 * 30 });
      return response;
    }
  }

  // Fallback return to home
  return NextResponse.redirect(`${origin}/`);
}

