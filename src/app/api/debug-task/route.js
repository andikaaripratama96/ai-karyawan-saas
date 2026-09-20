import { NextResponse } from "next/server";
import { runAiTask } from "@/lib/ai";

export async function POST(request) {
  let title = "Buat 3 konsep feed Instagram untuk produk keripik";
  try {
    const body = await request.json();
    if (body?.title) title = body.title;
  } catch {}
  const key = process.env.GEMINI_API_KEY ? "ADA (" + process.env.GEMINI_API_KEY.slice(0, 14) + "...)" : "TIDAK ADA";
  const result = await runAiTask({ employeeId: "content-creator", title, description: "tes debug" });
  return NextResponse.json({ envKey: key, usedMock: result.usedMock, error: result.error ?? null, result });
}