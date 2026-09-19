import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { runImageGen } from "@/lib/ai";
import { getImageQuota, consumeImageQuota, refundImageQuota } from "@/lib/supabase-data";

export async function GET() {
  try {
    const supabase = await createClient();
    const quota = await getImageQuota(supabase);
    return NextResponse.json({ ok: true, quota });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal memeriksa kuota gambar." }, { status: 401 });
  }
}

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

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Sesi tidak ditemukan. Silakan masuk kembali." }, { status: 401 });
  }

  let consumption;
  try {
    consumption = await consumeImageQuota(supabase);
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal memeriksa kuota gambar." }, { status: 500 });
  }

  if (!consumption.ok) {
    return NextResponse.json(
      { ok: false, usedMock: true, error: `Kuota gambar bulan ini sudah habis (${consumption.limit}/${consumption.limit}).`, quota: consumption },
      { status: 429 },
    );
  }

  const { ok, usedMock, error, dataUrl, model } = await runImageGen({ prompt });
  if (!ok) {
    try {
      await refundImageQuota(supabase);
    } catch {
      // Abaikan kegagalan refund, jangan halangi response utama.
    }
    return NextResponse.json({ ok: false, usedMock, error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, usedMock, dataUrl, model, quota: consumption });
}