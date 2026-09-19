import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

function loginRedirect(url, code, error = "") {
  const login = new URL("/login", url.origin);
  if (error) login.search = new URLSearchParams({ oauth_error: error });
  const res = NextResponse.redirect(login);
  res.headers.set("Cache-Control", "no-store, no-cache");
  return res;
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

  const cookieStore = await cookies();
  const tokenCookies = cookieStore
    .getAll()
    .map((c) => c.name)
    .filter((n) => n.includes("-auth-token"));

  if (tokenCookies.length === 0) {
    console.error("Auth callback: exchange succeeded but no auth-token cookie was written.");
    return loginRedirect(
      url,
      "session_not_persisted",
      "Login Google berhasil tetapi sesi tidak tersimpan di cookie browser. Coba keluar dan masuk lagi.",
    );
  }

  const redirectTo = new URL(next, url.origin);
  const res = NextResponse.redirect(redirectTo);
  res.headers.set("Cache-Control", "no-store, no-cache");
  return res;
}