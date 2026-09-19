"use client";
import { useState } from 'react'
import { Card, EmployeeAvatar, StatusBadge, PriorityBadge, ProgressBar } from '../components/ui'
import TaskResultModal from '../components/TaskResultModal'
import { IconPlus, IconSearch, IconEye } from '../components/icons'
import { employeeById } from '../data/mockData'

const filters = [
  { id: 'semua', label: 'Semua' },
  { id: 'menunggu', label: 'Menunggu' },
  { id: 'diproses', label: 'Diproses' },
  { id: 'selesai', label: 'Selesai' },
  { id: 'gagal', label: 'Gagal' },
]

export default function Tasks({
  tasks,
  onNewTask,
  onUpdateTask,
  onRequestRevision,
  refs,
  onCreateDemoFeed,
  initialResultTaskId = null,
}) {
  const [filter, setFilter] = useState('semua')
  const [query, setQuery] = useState('')
  const [resultTaskId, setResultTaskId] = useState(initialResultTaskId)

  const resultTask = resultTaskId ? tasks.find((t) => t.id === resultTaskId) : null

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === 'semua' || t.status === filter
    const q = query.trim().toLowerCase()
    const matchQuery =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (employeeById(t.employeeId)?.name ?? '').toLowerCase().includes(q)
    return matchFilter && matchQuery
  })

  const counts = {
    semua: tasks.length,
    menunggu: tasks.filter((t) => t.status === 'menunggu').length,
    diproses: tasks.filter((t) => t.status === 'diproses').length,
    selesai: tasks.filter((t) => t.status === 'selesai').length,
    gagal: tasks.filter((t) => t.status === 'gagal').length,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Tugas</h2>
          <p className="mt-0.5 text-sm text-slate-500">Berikan pekerjaan dan pantau progres AI Karyawan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={async () => setResultTaskId(await onCreateDemoFeed())}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            <IconEye width={16} height={16} />
            Lihat Contoh Hasil (10 Feed)
          </button>
          <button
            onClick={onNewTask}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500"
          >
            <IconPlus width={16} height={16} />
            Beri Tugas Baru
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                filter === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 text-xs ${filter === f.id ? 'text-slate-400' : 'text-slate-400'}`}>
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 lg:w-72">
          <IconSearch width={16} height={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tugas atau AI…"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            🗂️
          </div>
          <p className="mt-4 text-base font-semibold text-slate-800">Tidak ada tugas ditemukan</p>
          <p className="mt-1 text-sm text-slate-500">Coba ubah filter atau beri tugas baru.</p>
          <button
            onClick={onNewTask}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <IconPlus width={15} height={15} />
            Beri Tugas
          </button>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {filtered.map((t) => {
            const emp = employeeById(t.employeeId)
            const canView = t.status === 'selesai' || t.status === 'gagal'
            return (
              <div key={t.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <EmployeeAvatar employee={emp} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{t.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="font-medium text-violet-600">{emp?.name}</span>
                      <span>·</span>
                      <span>{t.category}</span>
                      <span>·</span>
                      <span>Tenggat {t.dueDate}</span>
                    </div>
                    {t.status === 'selesai' && t.result?.summary && (
                      <p className="mt-1 truncate text-xs text-slate-400">
                        <span className="font-semibold text-emerald-600">Hasil:</span> {t.result.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="hidden w-24 md:block">
                    <ProgressBar
                      value={t.progress}
                      color={
                        t.status === 'diproses'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                      }
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-400">
                      {t.status === 'diproses' ? 'AI sedang bekerja…' : `${t.progress}%`}
                    </p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                  {canView && (
                    <button
                      onClick={() => setResultTaskId(t.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
                    >
                      <IconEye width={14} height={14} />
                      Hasil
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </Card>
      )}

      <TaskResultModal
        task={resultTask}
        employee={resultTask ? employeeById(resultTask.employeeId) : null}
        onClose={() => setResultTaskId(null)}
        onUpdateTask={onUpdateTask}
        onRequestRevision={onRequestRevision}
        refs={refs}
      />
    </div>
  )
}