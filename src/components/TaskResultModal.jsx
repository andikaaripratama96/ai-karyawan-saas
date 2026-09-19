"use client";
import { useEffect, useState } from 'react'
import Modal from './Modal'
import { EmployeeAvatar, StatusBadge } from './ui'
import { IconCheck, IconDownload, IconAlert, IconPencil, IconRefresh, IconX, IconSparkles } from './icons'
import FeedPreview from './FeedPreview'
import FeedConceptGrid from './FeedConceptGrid'

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100'

export default function TaskResultModal({ task, employee, onClose, onUpdateTask, onRequestRevision, refs }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [saved, setSaved] = useState(false)
  const [aiImage, setAiImage] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [quota, setQuota] = useState(null)

  useEffect(() => {
    let active = true
    fetch('/api/image')
      .then((r) => r.json())
      .then((d) => {
        if (active && d.ok) setQuota(d.quota)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  if (!task) return null

  const result = task.result
  const isDone = task.status === 'selesai'

  const firstOutput = result?.outputs?.[0]
  const previewCaption = typeof firstOutput === 'string' ? firstOutput : firstOutput?.caption

  const startEditing = () => {
    setDraft({
      summary: result?.summary ?? '',
      outputs: result?.outputs ? [...result.outputs] : [],
      notes: result?.notes ?? '',
    })
    setEditing(true)
  }

  const saveCorrection = () => {
    onUpdateTask(task.id, {
      result: {
        summary: draft.summary,
        outputs: draft.outputs.filter((o) => (typeof o === 'string' ? o.trim() !== '' : o.caption.trim() !== '')),
        notes: draft.notes,
      },
    })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const setDraftOutput = (index, value) => {
    setDraft((d) => {
      const outputs = [...d.outputs]
      if (outputs[index] && typeof outputs[index] === 'object') {
        outputs[index] = { ...outputs[index], caption: value }
      } else {
        outputs[index] = value
      }
      return { ...d, outputs }
    })
  }

  const addDraftOutput = () => {
    setDraft((d) => ({ ...d, outputs: [...d.outputs, ''] }))
  }

  const removeDraftOutput = (index) => {
    setDraft((d) => ({ ...d, outputs: d.outputs.filter((_, i) => i !== index) }))
  }

  const generateImage = async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const title = typeof firstOutput === 'string' ? firstOutput : firstOutput?.title
      const caption = typeof firstOutput === 'string' ? firstOutput : firstOutput?.caption
      const prompt = [
        `Gambar feed Instagram square profesional untuk brand produk Indonesia.`,
        `Tema: ${task.title}`,
        title ? `Judul: ${title}` : '',
        caption ? `Caption: ${caption}` : '',
        result?.notes ? `Catatan: ${result.notes}` : '',
        'Gaya: bersih, menarik, warna cerah, tanpa teks pada gambar.',
      ]
        .filter(Boolean)
        .join('\n')
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Gagal membuat gambar')
      setAiImage(data.dataUrl)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat gambar')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <Modal
      open={Boolean(task)}
      onClose={() => {
        setEditing(false)
        setAiImage(null)
        setAiError(null)
        setAiLoading(false)
        onClose()
      }}
      title={task.title}
      subtitle={`Hasil pekerjaan · ${employee?.name} ${employee?.role ?? ''}`}
      wide
    >
      <div className="space-y-5">
        <div className="flex items-start gap-2.5 rounded-xl bg-violet-50 px-4 py-3 ring-1 ring-inset ring-violet-200">
          <span className="mt-0.5 text-xs">✨</span>
          <p className="text-[13px] leading-relaxed text-violet-700">
            Hasil teks dibuat oleh <span className="font-semibold">Gemini AI</span>. Untuk
            menghasilkan <span className="font-semibold">gambar</span> feed, klik tombol
            &ldquo;Generate Gambar AI&rdquo; — <span className="font-semibold">sudah termasuk</span> dalam
            kuota langganan Anda{quota ? ` (${quota.remaining}/${quota.limit} gambar bulan ini)` : ''}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <EmployeeAvatar employee={employee} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">{employee?.name}</span>
              <StatusBadge status={task.status} />
              {saved && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <IconCheck width={12} height={12} />
                  Koreksi tersimpan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Kategori {task.category} · Dibuat {task.createdAt} · Tenggat {task.dueDate}
            </p>
          </div>
        </div>

        {isDone && task.employeeId === 'content-creator' && result && (
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-slate-800">Pratinjau Feed Instagram</p>
              <div className="flex items-center gap-2">
                {quota && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      quota.remaining > 0
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200'
                        : 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200'
                    }`}
                  >
                    Kuota: {quota.remaining}/{quota.limit} gambar/bulan
                  </span>
                )}
                <button
                  onClick={generateImage}
                  disabled={aiLoading || (quota !== null && quota.remaining <= 0)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
                >
                  <IconSparkles width={13} height={13} />
                  {aiLoading ? 'Menggambar…' : aiImage ? 'Gambar Ulang' : 'Generate Gambar AI'}
                </button>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  {refs.length} referensi
                </span>
              </div>
            </div>
            {aiError && (
              <div className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 ring-1 ring-inset ring-rose-200">
                {aiError}
              </div>
            )}
            <FeedPreview
              refs={refs}
              caption={previewCaption}
              notes={result.notes}
              aiImage={aiImage}
              loading={aiLoading}
            />
            <p className="mt-2 text-[11px] text-slate-400">
              Gambar dibuat oleh Gemini AI dan diberi watermark SynthID.
            </p>
            {typeof result.outputs?.[0] === 'object' && (
              <div className="mt-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-slate-800">
                    Moodboard {result.outputs.length} Konsep Feed + Caption
                  </p>
                </div>
                <FeedConceptGrid
                  feeds={result.outputs.map((out) => ({
                    what: out.title.split('—').pop().trim(),
                    caption: out.caption,
                  }))}
                />
              </div>
            )}
          </div>
        )}

        {result ? (
          <>
            <div
              className={`rounded-2xl p-4 ring-1 ring-inset ${
                isDone ? 'bg-emerald-50 ring-emerald-200' : 'bg-rose-50 ring-rose-200'
              }`}
            >
                <div className="flex items-start gap-2.5">
                  {isDone ? (
                    <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  ) : (
                    <IconAlert width={18} height={18} className="mt-0.5 shrink-0 text-rose-600" />
                  )}
                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {isDone ? 'Ringkasan Hasil' : 'Mengapa gagal?'}
                      </p>
                      {!editing && (
                        <button
                          onClick={startEditing}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
                        >
                          <IconPencil width={13} height={13} />
                          Koreksi
                        </button>
                      )}
                    </div>
                    {editing ? (
                      <textarea
                        rows={3}
                        value={draft?.summary ?? ''}
                        onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                        className={`mt-2 ${inputCls}`}
                      />
                    ) : (
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{result.summary}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-slate-800">Hasil yang dihasilkan</p>
                {editing ? (
                  <div className="space-y-2">
                    {draft?.outputs.map((out, i) => {
                      const isObj = typeof out === 'object'
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1 space-y-1">
                            {isObj && <p className="text-xs font-semibold text-slate-600">{out.title}</p>}
                            <textarea
                              rows={2}
                              value={isObj ? out.caption : out}
                              onChange={(e) => setDraftOutput(i, e.target.value)}
                              className={`${inputCls} w-full`}
                            />
                          </div>
                          <button
                            onClick={() => removeDraftOutput(i)}
                            className="mt-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <IconX width={14} height={14} />
                          </button>
                        </div>
                      )
                    })}
                    <button
                      onClick={addDraftOutput}
                      className="rounded-xl border border-dashed border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
                    >
                      + Tambah hasil
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {result.outputs?.map((out, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                          {i + 1}
                        </span>
                        {typeof out === 'string' ? (
                          <span className="text-sm leading-relaxed text-slate-700">{out}</span>
                        ) : (
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{out.title}</p>
                            <p className="mt-0.5 text-sm italic leading-relaxed text-slate-600">
                              “{out.caption}”
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-amber-800">Catatan AI</p>
                  {!editing && (
                    <button
                      onClick={startEditing}
                      className="text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                    >
                      Koreksi juga
                    </button>
                  )}
                </div>
                {editing ? (
                  <textarea
                    rows={2}
                    value={draft?.notes ?? ''}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                    className={`mt-2 ${inputCls} border-amber-200 focus:border-amber-400 focus:ring-amber-100`}
                  />
                ) : (
                  <p className="mt-0.5 text-sm leading-relaxed text-amber-700">{result.notes}</p>
                )}
              </div>
            </>
        ) : (
          <p className="text-sm text-slate-500">Tugas ini belum memiliki hasil.</p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={saveCorrection}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <IconCheck width={16} height={16} />
                Simpan Koreksi
              </button>
            </>
          ) : (
            <>
              {result?.outputs?.length > 0 && (
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  <IconDownload width={16} height={16} />
                  Unduh Hasil
                </button>
              )}
              {isDone && (
                <button
                  onClick={() => onRequestRevision(task.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  <IconRefresh width={16} height={16} />
                  Minta Revisi
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Tutup
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}