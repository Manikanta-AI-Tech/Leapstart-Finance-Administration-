"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Profile } from "@/types/database";
import type { Role } from "@/lib/constants";

const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 4,
  FINANCE: 3,
  ADMISSIONS: 2,
  COUNSELLOR: 1,
  VIEWER: 0,
};

const supabase = createClient();

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["auth", "profile", user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("userId", user.id)
        .single();
      return data as Profile | null;
    },
    enabled: !!user?.id,
  });

  const signOut = useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  const hasRole = (requiredRole: Role): boolean => {
    if (!profile?.role) return false;
    return ROLE_HIERARCHY[profile.role] >= ROLE_HIERARCHY[requiredRole];
  };

  return {
    user,
    profile,
    isLoading: isUserLoading || (!!user?.id && isProfileLoading),
    isAuthenticated: !!user,
    signOut,
    hasRole,
  };
}
