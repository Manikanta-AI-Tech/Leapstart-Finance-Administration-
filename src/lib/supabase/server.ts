import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During prerender/build, Supabase env vars may not be available.
    // Return a proxy that no-ops to avoid breaking the build.
    const noop = () => Promise.resolve({ data: null, error: null });
    return {
      auth: {
        getSession: noop,
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signOut: noop,
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: noop,
            maybeSingle: noop,
            order: () => ({
              range: () => Promise.resolve({ data: [], error: null }),
            }),
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
          order: () => ({
            range: () => Promise.resolve({ data: [], error: null }),
          }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => ({ select: () => ({ single: noop }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: noop }) }) }),
        delete: () => ({ eq: () => noop }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
    } as unknown as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}