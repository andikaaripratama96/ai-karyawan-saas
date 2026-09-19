"use client";
import { useState } from 'react'
import { Card, EmployeeAvatar, StatusBadge, SectionHeader } from '../components/ui'
import Modal from '../components/Modal'
import ReferenceGallery, { UploadTrigger } from '../components/ReferenceGallery'
import { IconPlus, IconCheck, IconLink, IconClock, IconSparkles, IconUpload } from '../components/icons'
import { employees, employeeStatus } from '../data/mockData'

function EmployeeProfileModal({ employee, onClose, onGiveTask, refs, onUploadRefs, onRemoveRef, tasks }) {
  if (!employee) return null
  const st = employeeStatus[employee.status]
  const empTasks = tasks.filter((t) => t.employeeId === employee.id)

  return (
    <Modal
      open={Boolean(employee)}
      onClose={onClose}
      title="Profil AI Karyawan"
      subtitle={employee.role}
      wide
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 p-5 text-white sm:flex-row sm:items-center">
          <EmployeeAvatar employee={employee} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xl font-bold tracking-tight">{employee.name}</h4>
              <span className={`flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ring-white/15`}>
                <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-300">{employee.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {employee.skills.map((s) => (
                <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-violet-100 ring-1 ring-inset ring-white/10">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onGiveTask(employee.id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-400 hover:to-fuchsia-400"
          >
            <IconPlus width={16} height={16} />
            Beri Tugas
          </button>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">{employee.description}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Tugas Selesai', value: employee.stats.tasksDone },
            { label: 'Tugas Aktif', value: employee.stats.activeTasks },
            { label: 'Rating', value: `⭐ ${employee.stats.rating}` },
            { label: 'Rata-rata Waktu', value: employee.stats.avgTime },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="text-lg font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <SectionHeader title="Kemampuan" />
            <ul className="space-y-2">
              {employee.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <IconCheck width={12} height={12} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="Sumber Data Terhubung" />
            <ul className="space-y-2">
              {employee.connectedSources.map((s) => (
                <li key={s} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700">
                  <IconLink width={15} height={15} className="shrink-0 text-violet-500" />
                  <span className="truncate">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {employee.id === 'content-creator' && (
          <div>
            <SectionHeader
              title="Referensi Konten (acuan feed)"
              subtitle="Unggah foto/gambar sebagai referensi visual. AI akan memakai referensi ini saat membuat desain feed."
            />
            <ReferenceGallery refs={refs} onUpload={onUploadRefs} onRemove={onRemoveRef} />
          </div>
        )}

        <div>
          <SectionHeader title={`Tugas ${employee.name}`} subtitle="Tugas yang pernah atau sedang dikerjakan" />
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
            {empTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                <IconClock width={15} height={15} className="shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.category} · Tenggat {t.dueDate}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function Employees({ onGiveTask, refs, onUploadRefs, onRemoveRef, tasks = [] }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">AI Karyawan</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Kelola tim AI yang bekerja membantu bisnismu.{' '}
            <span className="inline-flex items-center gap-1 font-medium text-violet-600">
              <IconSparkles width={13} height={13} /> {employees.length} karyawan aktif
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((emp) => {
          const st = employeeStatus[emp.status]
          const active = tasks.filter((t) => t.employeeId === emp.id && (t.status === 'menunggu' || t.status === 'diproses')).length
          return (
            <Card key={emp.id} className="flex flex-col overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${emp.color}`} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar employee={emp} size="lg" />
                    <div>
                      <p className="flex items-center gap-2 text-base font-bold text-slate-900">
                        {emp.name}
                        <span className={`h-2 w-2 rounded-full ${st.dot}`} title={st.label} />
                      </p>
                      <p className="text-sm font-medium text-violet-600">{emp.role}</p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">{emp.tagline}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {emp.skills.slice(0, 4).map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>

                {emp.id === 'content-creator' && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">Referensi Feed</p>
                      <span className="text-[11px] text-slate-400">{refs.length} foto</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {refs.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {refs.map((r) => (
                            <img
                              key={r.id}
                              src={r.dataUrl}
                              alt={r.name}
                              onClick={() => setSelected(emp)}
                              title={r.name}
                              className="h-14 w-14 shrink-0 cursor-pointer rounded-lg border border-slate-200 object-cover"
                            />
                          ))}
                        </div>
                      )}
                      <UploadTrigger
                        onUpload={onUploadRefs}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-600"
                      >
                        <IconUpload width={15} height={15} />
                        Unggah Foto Referensi
                      </UploadTrigger>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-base font-bold text-slate-900">{emp.stats.tasksDone}</p>
                    <p className="text-[11px] text-slate-500">Selesai</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{active}</p>
                    <p className="text-[11px] text-slate-500">Aktif</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">⭐ {emp.stats.rating}</p>
                    <p className="text-[11px] text-slate-500">Rating</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 pt-1">
                  <button
                    onClick={() => setSelected(emp)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-700"
                  >
                    Lihat Profil
                  </button>
                  <button
                    onClick={() => onGiveTask(emp.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500"
                  >
                    <IconPlus width={15} height={15} />
                    Beri Tugas
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <EmployeeProfileModal
        employee={selected}
        onClose={() => setSelected(null)}
        onGiveTask={(id) => {
          setSelected(null)
          onGiveTask(id)
        }}
        refs={refs}
        onUploadRefs={onUploadRefs}
        onRemoveRef={onRemoveRef}
        tasks={tasks}
      />
    </div>
  )
}