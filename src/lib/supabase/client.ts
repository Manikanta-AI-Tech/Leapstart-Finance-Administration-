import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window === "undefined") {
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
        channel: () => ({ on: () => ({ subscribe: () => {} }) }),
      } as ReturnType<typeof createBrowserClient>;
    }
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }

  return createBrowserClient(url, key);
}