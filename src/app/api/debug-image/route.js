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
  return NextResponse.json({
    envKey: key,
    result: {
      ok: result.ok,
      usedMock: result.usedMock,
      error: result.error ?? null,
      model: result.model ?? null,
      hasData: Boolean(result.dataUrl),
      dataUrlLength: result.dataUrl ? result.dataUrl.length : null,
      dataUrlMime: result.dataUrl ? result.dataUrl.split(',')[0] : null,
    },
  });
}