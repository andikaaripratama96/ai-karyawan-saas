import { NextResponse } from "next/server";
import { runImageGen } from "@/lib/ai";

export async function POST(request) {
  let prompt = "logo sederhana";
  try {
    const body = await request.json();
    if (body?.prompt) prompt = body.prompt;
  } catch {}
  const key = process.env.GEMINI_API_KEY ? "ADA (" + process.env.GEMINI_API_KEY.slice(0, 14) + "...)" : "TIDAK ADA";
  const result = await runImageGen({ prompt });
  if (!result.ok) {
    return NextResponse.json({
      envKey: key,
      result: { ok: false, usedMock: result.usedMock, error: result.error ?? null },
    });
  }
  return NextResponse.json({
    envKey: key,
    result: {
      ok: true,
      usedMock: false,
      error: null,
      model: result.model,
      fullDataUrlPrefix: result.dataUrl ? result.dataUrl.slice(0, 40) : null,
      fullDataUrlLength: result.dataUrl ? result.dataUrl.length : null,
      dataUrl: result.dataUrl ?? null,
    },
  });
}