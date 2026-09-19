import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.set("multi.a", "a".repeat(2500), { path: "/", sameSite: "lax", maxAge: 60 });
  cookieStore.set("multi.b", "b".repeat(2500), { path: "/", sameSite: "lax", maxAge: 60 });
  cookieStore.set("multi.c", "c".repeat(2500), { path: "/", sameSite: "lax", maxAge: 60 });
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/api/cookie-test/target`);
}