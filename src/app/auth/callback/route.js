import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

function loginRedirect(url, code, error = "") {
  const login = new URL("/login", url.origin);
  if (error) login.search = new URLSearchParams({ oauth_error: error });
  return NextResponse.redirect(login);
}

export async function GET(request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return loginRedirect(url, "missing_code", "Kode OAuth tidak diterima dari Google.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return loginRedirect(url, "exchange_error", error.message);
  }

  const redirectTo = new URL(next, url.origin);
  return NextResponse.redirect(redirectTo);
}