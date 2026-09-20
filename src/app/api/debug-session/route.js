import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  return NextResponse.json({
    cookies: all.map((c) => `${c.name}=${c.value.slice(0, 40)}...`),
    names: all.map((c) => c.name),
    count: all.length,
    user: await (async () => {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        return user ? { id: user.id, email: user.email } : null;
      } catch (e) {
        return { error: String(e) };
      }
    })(),
  });
}