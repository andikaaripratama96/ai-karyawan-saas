import { buildMockResult, extractCount } from "@/utils/mockResult";

const GEMINI_MODELS = {
  "content-creator": ["gemini-flash-lite-latest", "gemini-flash-latest"],
  "admin-stok": ["gemini-flash-lite-latest", "gemini-flash-latest"],
  "business-analyst": ["gemini-flash-lite-latest", "gemini-flash-latest"],
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
Cari angka jumlah feed pada kalimat tugas (misal "2 feed", "3 konten", "10 feed"). HITUNG berapa jumlahnya, lalu buat EXACTLY sejumlah itu — tidak lebih, tidak kurang. Jika tidak ada angka sama sekali, buat 3.`,
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

  const models = GEMINI_MODELS[employeeId] ?? ["gemini-flash-lite-latest", "gemini-flash-latest"];
  const systemPrompt = SYSTEM_PROMPTS[employeeId] ?? SYSTEM_PROMPTS["content-creator"];
  const prompt = systemPrompt.replace("{task}", `${title}\nDeskripsi: ${description}`);
  let lastErr;

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
          signal: controller.signal,
        },
      );
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`Gemini ${res.status}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const parsed = parseModelOutput(text);
      if (!parsed) throw new Error("Format jawaban AI tidak valid");
      if (employeeId === "content-creator") {
        const wanted = extractCount(title, description);
        parsed.outputs = parsed.outputs.slice(0, wanted);
        while (parsed.outputs.length < wanted) {
          const i = parsed.outputs.length;
          parsed.outputs.push({
            title: `Feed ${i + 1} — konsep pendukung`,
            caption: `Feed ke-${i + 1} dari "${title}" — siap dikembangkan.`,
          });
        }
      }
      return { usedMock: false, result: parsed };
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }

  return {
    usedMock: true,
    error: lastErr,
    result: buildMockResult(employeeId, title, 0, description),
  };
}

const IMAGE_MODELS = [
  "gemini-3.1-flash-image",
  "gemini-2.5-flash-image",
];

export async function runImageGen({ prompt, referenceImages = [] }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return { ok: false, usedMock: true, error: "GEMINI_API_KEY belum diatur" };
  }

  const requestParts = [];
  for (const ref of referenceImages) {
    const m = /^data:([^;]+);base64,(.+)$/.exec(ref || "");
    if (m) requestParts.push({ inlineData: { mimeType: m[1], data: m[2] } });
  }
  requestParts.push({ text: prompt });

  let lastErr;
  for (const model of IMAGE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: requestParts }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"],
              imageConfig: { aspectRatio: "1:1", imageSize: "1K" },
            },
          }),
          signal: controller.signal,
        },
      );
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`Gemini gambar ${res.status}`);

      const data = await res.json();
      const resultParts = data?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = resultParts.find((p) => p.inlineData?.data);
      if (!imagePart) throw new Error("Respons tanpa gambar");

      const mimeType = imagePart.inlineData.mimeType || "image/png";
      const dataUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;
      return { ok: true, usedMock: false, dataUrl, model };
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }

  return { ok: false, usedMock: true, error: lastErr };
}