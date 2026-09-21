"use client";
import { useState } from 'react'
import Modal from './Modal'
import { EmployeeAvatar } from './ui'
import { UploadTrigger } from './ReferenceGallery'
import { IconSend, IconUpload } from './icons'

const emptyForm = { title: '', description: '', employeeId: '', priority: 'sedang', dueDate: '' }

export default function NewTaskModal({ open, onClose, employees, initialEmployeeId = '', onSubmit, refs, onUploadRefs, onRemoveRef }) {
  const [form, setForm] = useState({ ...emptyForm, employeeId: initialEmployeeId })
  const [lastPreset, setLastPreset] = useState(initialEmployeeId)
  const [error, setError] = useState('')

  if (open && initialEmployeeId && lastPreset !== initialEmployeeId) {
    setLastPreset(initialEmployeeId)
    setForm({ ...emptyForm, employeeId: initialEmployeeId })
    setError('')
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const today = new Date().toISOString().slice(0, 10)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Judul tugas wajib diisi.')
      return
    }
    if (!form.employeeId) {
      setError('Pilih AI Karyawan yang akan mengerjakan.')
      return
    }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || 'Tanpa deskripsi tambahan.',
      employeeId: form.employeeId,
      priority: form.priority,
      dueDate: form.dueDate || today,
    })
    setForm({ ...emptyForm, employeeId: initialEmployeeId })
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Beri Tugas Baru" subtitle="Pilih AI Karyawan dan jelaskan pekerjaannya.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Judul Tugas *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Contoh: Buat caption promo akhir bulan"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Jelaskan detail pekerjaan, referensi, atau target yang diinginkan…"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">AI Karyawan *</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {employees.map((emp) => {
              const active = form.employeeId === emp.id
              return (
                <button
                  type="button"
                  key={emp.id}
                  onClick={() => set('employeeId', emp.id)}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                    active
                      ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-100'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <EmployeeAvatar employee={emp} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-slate-800">{emp.name}</span>
                    <span className="block truncate text-[11px] text-slate-500">{emp.role}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Prioritas</label>
            <select
              value={form.priority}
              onChange={(e) => set('priority', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            >
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Tenggat</label>
            <input
              type="date"
              value={form.dueDate}
              min={today}
              onChange={(e) => set('dueDate', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-slate-700">
            Referensi Foto
            {form.employeeId === 'content-creator' && (
              <span className="text-[11px] font-medium text-violet-500">acuan untuk feed</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            {refs.map((r) => (
              <div key={r.id} className="relative">
                <img
                  src={r.dataUrl}
                  alt={r.name}
                  title={r.name}
                  className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveRef?.(r.id)}
                  title="Hapus foto ini"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm transition hover:bg-rose-600"
                >
                  ×
                </button>
              </div>
            ))}
            <UploadTrigger
              onUpload={onUploadRefs}
              className="flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-slate-200 bg-white text-slate-400 transition hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-500"
            >
              <IconUpload width={16} height={16} />
              <span className="text-[10px] font-semibold">Unggah</span>
            </UploadTrigger>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Foto tersimpan sebagai referensi Content Creator saat membuat feed konten.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-600 ring-1 ring-inset ring-rose-200">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500"
          >
            <IconSend width={16} height={16} />
            Kirim Tugas
          </button>
        </div>
      </form>
    </Modal>
  )
}