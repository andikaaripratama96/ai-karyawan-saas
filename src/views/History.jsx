"use client";
import { useState } from 'react'
import { Card, StatusBadge, EmployeeAvatar } from '../components/ui'
import TaskResultModal from '../components/TaskResultModal'
import { IconEye, IconSearch, IconRefresh } from '../components/icons'
import { historyLog, employeeById, initialTasks } from '../data/mockData'

export default function History() {
  const [query, setQuery] = useState('')
  const [resultTask, setResultTask] = useState(null)

  const filtered = historyLog.filter((h) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      h.action.toLowerCase().includes(q) ||
      h.at.toLowerCase().includes(q) ||
      (employeeById(h.employeeId)?.name ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Riwayat</h2>
          <p className="mt-0.5 text-sm text-slate-500">Jejak aktivitas dan hasil pekerjaan AI Karyawan.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
          <IconRefresh width={16} height={16} />
          Muat Ulang
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:w-96">
          <IconSearch width={16} height={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari riwayat aktivitas…"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <p className="text-sm text-slate-500">{filtered.length} catatan aktivitas</p>
      </div>

      <Card className="p-5">
        <ol className="relative space-y-6">
          {filtered.map((h, i) => {
            const emp = employeeById(h.employeeId)
            const relatedTask = h.taskId ? initialTasks.find((t) => t.id === h.taskId) : null
            const canView = relatedTask && (relatedTask.status === 'selesai' || relatedTask.status === 'gagal')
            return (
              <li key={h.id} className="relative flex gap-4">
                {i < filtered.length - 1 && (
                  <span className="absolute left-[19px] top-12 h-[calc(100%-40px)] w-px bg-slate-200" />
                )}
                <EmployeeAvatar employee={emp} size="md" className="relative z-10 ring-4 ring-white" />
                <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{emp?.name ?? 'Sistem'}</span>
                    {relatedTask && <StatusBadge status={relatedTask.status} />}
                    <span className="ml-auto text-xs text-slate-400">{h.at}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{h.action}</p>
                  {relatedTask && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-violet-600">{relatedTask.title}</span>
                      {canView && (
                        <button
                          onClick={() => setResultTask(relatedTask)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
                        >
                          <IconEye width={12} height={12} />
                          Lihat Hasil
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      <TaskResultModal
        task={resultTask}
        employee={resultTask ? employeeById(resultTask.employeeId) : null}
        onClose={() => setResultTask(null)}
      />
    </div>
  )
}