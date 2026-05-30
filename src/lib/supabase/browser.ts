"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  const { anonKey, configured, url } = getSupabaseConfig();

  if (!configured || !url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(url, anonKey);
}

