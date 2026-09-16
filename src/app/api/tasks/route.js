import { NextResponse } from "next/server";
import { runAiTask } from "@/lib/ai";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body harus berupa JSON" }, { status: 400 });
  }

  const { employeeId, title, description = "" } = body ?? {};
  if (!employeeId || !title || !title.trim()) {
    return NextResponse.json(
      { ok: false, error: "employeeId dan title wajib diisi" },
      { status: 400 },
    );
  }

  const { usedMock, result, error } = await runAiTask({ employeeId, title, description });
  return NextResponse.json({ ok: true, usedMock, result, error });
}