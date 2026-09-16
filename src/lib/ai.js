import { buildMockResult } from "@/utils/mockResult";

const GEMINI_MODELS = {
  "content-creator": "gemini-2.0-flash",
  "admin-stok": "gemini-2.0-flash",
  "business-analyst": "gemini-2.0-flash",
};

const SYSTEM_PROMPTS = {
  "content-creator": `Kamu adalah Content Creator AI bernama Naya untuk UMKM Indonesia.
Tugasmu menghasilkan konsep feed Instagram + caption dalam Bahasa Indonesia.
Format jawaban WAJIB JSON tanpa teks lain:
{
  "summary": "ringkasan singkat 1 kalimat",
  "outputs": [ { "title": "Feed 1 — sudut konsep", "caption": "caption siap pakai dengan CTA" } ],
  "notes": "catatan singkat untuk pengguna"
}
Maksud tugas: {task}
Jika permintaan menyebut jumlah (misal "10 feed"), buat EXACTLY sejumlah itu. Jika tidak ada angka, buat 3.`,
  "admin-stok": `Kamu adalah Admin Stok AI bernama Sari untuk UMKM Indonesia.
Format jawaban WAJIB JSON:
{ "summary": "...", "outputs": ["poin hasil"], "notes": "..." }
Maksud tugas: {task}`,
  "business-analyst": `Kamu adalah Business Analyst AI bernama Bima untuk UMKM Indonesia.
Format jawaban WAJIB JSON:
{ "summary": "...", "outputs": ["poin hasil"], "notes": "..." }
Maksud tugas: {task}`,
};

function parseModelOutput(text) {
  try {
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const data = JSON.parse(cleaned);
    return {
      summary: String(data.summary ?? ""),
      outputs: Array.isArray(data.outputs) ? data.outputs : [],
      notes: String(data.notes ?? ""),
    };
  } catch {
    return null;
  }
}

export async function runAiTask({ employeeId, title, description = "" }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return { usedMock: true, result: buildMockResult(employeeId, title, 0, description) };
  }

  const model = GEMINI_MODELS[employeeId] ?? "gemini-2.0-flash";
  const systemPrompt = SYSTEM_PROMPTS[employeeId] ?? SYSTEM_PROMPTS["content-creator"];
  const prompt = systemPrompt.replace("{task}", `${title}\nDeskripsi: ${description}`);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      },
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = parseModelOutput(text);
    if (!parsed) throw new Error("Format jawaban AI tidak valid");
    return { usedMock: false, result: parsed };
  } catch (err) {
    return {
      usedMock: true,
      error: err instanceof Error ? err.message : String(err),
      result: buildMockResult(employeeId, title, 0, description),
    };
  }
}