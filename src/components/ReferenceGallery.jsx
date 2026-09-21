"use client";
import { useRef } from 'react'
import { IconUpload, IconX } from './icons'

export function UploadTrigger({ onUpload, className = '', children }) {
  const inputRef = useRef(null)

  const handleFiles = async (e) => {
    if (e.target.files?.length) {
      await onUpload(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className={className}>
        {children}
      </button>
    </>
  )
}

export default function ReferenceGallery({ refs, onUpload, onRemove }) {
  if (refs.length === 0) {
    return (
      <div>
        <UploadTrigger
          onUpload={onUpload}
          className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-violet-300 hover:bg-violet-50/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-inset ring-slate-200">
            <IconUpload width={20} height={20} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-700">Unggah foto referensi</span>
            <span className="block text-xs text-slate-400">
              Klik untuk memilih, bisa beberapa gambar sekaligus (JPG, PNG).
            </span>
          </span>
        </UploadTrigger>
        <p className="mt-2 text-xs text-slate-400">
          Foto ini akan dipakai sebagai acuan visual saat AI membuat feed konten.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {refs.map((r) => (
          <div
            key={r.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          >
            <img src={r.dataUrl} alt={r.name} className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6">
              <p className="truncate text-[11px] font-medium text-white">{r.name}</p>
              <p className="text-[10px] text-white/70">{r.size}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(r.id)}
              title="Hapus referensi"
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white transition hover:bg-rose-500"
            >
              <IconX width={12} height={12} />
            </button>
          </div>
        ))}
        <UploadTrigger
          onUpload={onUpload}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-500"
        >
          <IconUpload width={18} height={18} />
          <span className="text-[11px] font-semibold">Unggah</span>
        </UploadTrigger>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {refs.length} referensi tersimpan · Dipakai sebagai acuan visual saat membuat feed.
      </p>
    </div>
  )
}