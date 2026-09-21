import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { runImageGen } from "@/lib/ai";
import { getImageQuota, consumeImageQuota, refundImageQuota } from "@/lib/supabase-data";

async function logEvent(supabase, kind, payload = {}) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("debug_log").insert({
      user_id: user?.id ?? null,
      kind,
      payload,
    });
  } catch {
    // Logging tidak boleh menggagalkan permintaan utama.
  }
}

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

  const { prompt, referenceImages, aspectRatio } = body ?? {};
  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ ok: false, error: "prompt wajib diisi" }, { status: 400 });
  }
  const VALID_ASPECTS = ["1:1", "4:5", "9:16"];
  const ratio = VALID_ASPECTS.includes(aspectRatio) ? aspectRatio : "1:1";

  const refs = Array.isArray(referenceImages)
    ? referenceImages.filter((r) => typeof r === "string" && r.startsWith("data:image")).slice(0, 4)
    : [];

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Sesi tidak ditemukan. Silakan masuk kembali." }, { status: 401 });
  }

  await logEvent(supabase, "image_post_start", { promptLen: prompt.length });

  let consumption;
  try {
    consumption = await consumeImageQuota(supabase);
  } catch (err) {
    await logEvent(supabase, "image_quota_error", { message: String(err?.message ?? err) });
    return NextResponse.json({ ok: false, error: "Gagal memeriksa kuota gambar." }, { status: 500 });
  }

  if (!consumption.ok) {
    return NextResponse.json(
      { ok: false, usedMock: true, error: `Kuota gambar bulan ini sudah habis (${consumption.limit}/${consumption.limit}).`, quota: consumption },
      { status: 429 },
    );
  }

  const { ok, usedMock, error, dataUrl, model } = await runImageGen({ prompt, referenceImages: refs, aspectRatio: ratio });
  if (!ok) {
    await logEvent(supabase, "image_gen_failed", { model, error: error ?? null });
    try {
      await refundImageQuota(supabase);
      await logEvent(supabase, "image_refunded", { reason: "gen_failed" });
    } catch {
      await logEvent(supabase, "image_refund_error", {});
    }
    return NextResponse.json({ ok: false, usedMock, error }, { status: 502 });
  }

  await logEvent(supabase, "image_gen_ok", { model, dataUrlLen: dataUrl?.length ?? 0 });

  return NextResponse.json({ ok: true, usedMock, dataUrl, model, quota: consumption });
}