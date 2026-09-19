import { NextResponse } from "next/server";
import { runImageGen } from "@/lib/ai";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body harus berupa JSON" }, { status: 400 });
  }

  const { prompt } = body ?? {};
  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ ok: false, error: "prompt wajib diisi" }, { status: 400 });
  }

  const { ok, usedMock, error, dataUrl, model } = await runImageGen({ prompt });
  if (!ok) {
    return NextResponse.json({ ok: false, usedMock, error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, usedMock, dataUrl, model });
}