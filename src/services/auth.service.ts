import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const authService = {
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { data, error };
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
  },

  async getProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("userId", userId)
      .single();
    return data;
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
