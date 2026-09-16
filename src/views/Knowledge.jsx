"use client";
import { useState } from 'react'
import { Card, EmployeeAvatar } from '../components/ui'
import { IconSearch, IconUpload, IconFile, IconLink, IconDownload, IconDatabase } from '../components/icons'
import { knowledge, employeeById } from '../data/mockData'

const typeFilters = ['Semua', 'CSV', 'Spreadsheet', 'Dokumen', 'PDF']

const typeStyles = {
  CSV: 'bg-emerald-100 text-emerald-700',
  Spreadsheet: 'bg-blue-100 text-blue-700',
  Dokumen: 'bg-violet-100 text-violet-700',
  PDF: 'bg-rose-100 text-rose-700',
}

export default function Knowledge() {
  const [filter, setFilter] = useState('Semua')
  const [query, setQuery] = useState('')

  const filtered = knowledge.filter((k) => {
    const matchType = filter === 'Semua' || k.type === filter
    const q = query.trim().toLowerCase()
    const matchQuery =
      !q ||
      k.name.toLowerCase().includes(q) ||
      k.category.toLowerCase().includes(q) ||
      k.relatedTo.toLowerCase().includes(q)
    return matchType && matchQuery
  })

  const totalSize = knowledge.reduce((acc, k) => acc + parseFloat(k.size.replace(',', '.')), 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Data / Knowledge</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Sumber pengetahuan yang dipakai AI Karyawan untuk bekerja.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500">
          <IconUpload width={16} height={16} />
          Unggah Data
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-2xl font-bold text-slate-900">{knowledge.length}</p>
          <p className="text-xs text-slate-500">Total File</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-slate-900">{totalSize.toFixed(1)}</p>
          <p className="text-xs text-slate-500">Total Ukuran (MB)</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-500">AI Terhubung</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-emerald-600">6/7</p>
          <p className="text-xs text-slate-500">Data Terverifikasi</p>
        </Card>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 lg:w-72">
          <IconSearch width={16} height={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari data…"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <IconDatabase width={24} height={24} className="text-slate-400" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-800">Tidak ada data ditemukan</p>
          <p className="mt-1 text-sm text-slate-500">Coba ubah filter atau unggah data baru.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {filtered.map((k) => {
            const related = k.relatedTo.split(' ')[0]
            const emp = employeeById(related.toLowerCase().includes('content')
              ? 'content-creator'
              : related.toLowerCase().includes('admin')
                ? 'admin-stok'
                : 'business-analyst')
            return (
              <div key={k.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeStyles[k.type]}`}>
                    <IconFile width={18} height={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{k.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {k.category} · {k.size} · Diperbarui {k.updatedAt}
                    </p>
                    <p className="mt-0.5 hidden truncate text-xs text-slate-400 sm:block">{k.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-slate-50 py-1 pl-1 pr-3 ring-1 ring-inset ring-slate-100">
                    <EmployeeAvatar employee={emp} size="sm" />
                    <span className="text-xs font-medium text-slate-600">{k.relatedTo}</span>
                  </div>
                  <button
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
                    title="Koneksi data"
                  >
                    <IconLink width={15} height={15} />
                  </button>
                  <button
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
                    title="Unduh"
                  >
                    <IconDownload width={15} height={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}