"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30 * 1000, retry: 1 } } }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" expand={false} visibleToasts={5}
            toastOptions={{ className: "!bg-white dark:!bg-neutral-900 !border !border-neutral-200 dark:!border-neutral-700 !shadow-lg !rounded-md !text-sm", duration: 4000 }} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
