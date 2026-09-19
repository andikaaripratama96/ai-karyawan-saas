import { Card, EmployeeAvatar, StatusBadge, ProgressBar, SectionHeader } from '../components/ui'
import { IconUsers, IconTask, IconCheck, IconDatabase, IconPlus, IconClock, IconSparkles } from '../components/icons'
import { employees, employeeById } from '../data/mockData'

const quickActions = [
  {
    id: 'content-creator',
    employee: 'content-creator',
    title: 'Buat draft konten',
    desc: 'Caption, artikel, atau naskah video',
  },
  {
    id: 'admin-stok',
    employee: 'admin-stok',
    title: 'Cek laporan stok',
    desc: 'Rekonsiliasi & reorder point',
  },
  {
    id: 'business-analyst',
    employee: 'business-analyst',
    title: 'Analisis penjualan',
    desc: 'Insight & proyeksi bisnis',
  },
]

export default function Dashboard({ onNavigate, onNewTask, tasks, knowledge = [], userName = '' }) {
  const activeTasks = tasks.filter((t) => t.status === 'menunggu' || t.status === 'diproses')
  const doneTasks = tasks.filter((t) => t.status === 'selesai')
  const recentTasks = [...tasks].slice(0, 5)
  const employeeActivity = employees.map((e) => {
    const done = tasks.filter((t) => t.employeeId === e.id && t.status === 'selesai').length
    const total = tasks.filter((t) => t.employeeId === e.id).length
    return { ...e, done, total }
  })
  const weekly = [
    { day: 'Sen', count: 2 },
    { day: 'Sel', count: 4 },
    { day: 'Rab', count: 3 },
    { day: 'Kam', count: 5 },
    { day: 'Jum', count: 6 },
    { day: 'Sab', count: 3 },
    { day: 'Min', count: 1 },
  ]
  const maxCount = Math.max(...weekly.map((w) => w.count))

  const stats = [
    { label: 'AI Karyawan Aktif', value: employees.length, icon: IconUsers, tone: 'from-violet-500 to-fuchsia-500', sub: '3 spesialis siap bekerja' },
    { label: 'Tugas Aktif', value: activeTasks.length, icon: IconTask, tone: 'from-blue-500 to-indigo-500', sub: 'menunggu & diproses' },
    { label: 'Tugas Selesai', value: doneTasks.length, icon: IconCheck, tone: 'from-emerald-500 to-teal-500', sub: 'minggu ini' },
    { label: 'Data Knowledge', value: knowledge.length, icon: IconDatabase, tone: 'from-amber-500 to-orange-500', sub: 'file terhubung' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <IconSparkles width={14} height={14} /> Workspace {userName ? `· ${userName}` : ''}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Selamat datang kembali, {(userName || 'Rudi').split(' ')[0]} 👋
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-slate-300">
              Semua AI Karyawan kamu siap bekerja. Beri tugas dan pantau hasilnya dalam satu tempat.
            </p>
          </div>
          <button
            onClick={onNewTask}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-400 hover:to-fuchsia-400"
          >
            <IconPlus width={16} height={16} />
            Beri Tugas Baru
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {employeeActivity.map((e) => (
            <button
              key={e.id}
              onClick={() => onNavigate('employees')}
              className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-left ring-1 ring-inset ring-white/10 transition hover:bg-white/10"
            >
              <EmployeeAvatar employee={e} size="md" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{e.name}</span>
                <span className="block text-[11px] text-slate-400">{e.done}/{e.total} tugas selesai</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${s.tone}`}>
                <s.icon width={18} height={18} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{s.value}</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-700">{s.label}</p>
            <p className="text-xs text-slate-400">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader
            title="Tugas Terbaru"
            subtitle="Pekerjaan yang sedang berjalan dan terbaru"
            action={
              <button onClick={() => onNavigate('tasks')} className="text-sm font-semibold text-violet-600 hover:text-violet-500">
                Lihat semua →
              </button>
            }
          />
          <div className="divide-y divide-slate-100">
            {recentTasks.map((t) => {
              const emp = employeeById(t.employeeId)
              return (
                <button
                  key={t.id}
                  onClick={() => onNavigate('tasks')}
                  className="flex w-full items-center gap-3 py-3 text-left first:pt-0 last:pb-0"
                >
                  <EmployeeAvatar employee={emp} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{t.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="truncate">{emp?.name}</span>
                      <span>·</span>
                      <IconClock width={12} height={12} />
                      {t.dueDate}
                    </p>
                    {t.status === 'selesai' && t.result?.summary && (
                      <p className="mt-1 truncate text-xs text-slate-400">
                        <span className="font-semibold text-emerald-600">Hasil:</span> {t.result.summary}
                      </p>
                    )}
                  </div>
                  <div className="w-28 shrink-0">
                    <ProgressBar value={t.progress} />
                  </div>
                  <StatusBadge status={t.status} />
                </button>
              )
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Aktivitas Pekan Ini" subtitle="Tugas yang diselesaikan" />
            <div className="flex h-32 items-end justify-between gap-2">
              {weekly.map((w) => (
                <div key={w.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full flex-1 items-end rounded-lg bg-slate-50">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-violet-500 to-fuchsia-400 transition-all"
                      style={{ height: `${(w.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{w.day}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Mulai Cepat" subtitle="Aksi yang sering dipakai" />
            <div className="space-y-2">
              {quickActions.map((q) => {
                const emp = employeeById(q.employee)
                return (
                  <button
                    key={q.id}
                    onClick={onNewTask}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-violet-300 hover:bg-violet-50/50"
                  >
                    <EmployeeAvatar employee={emp} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-800">{q.title}</span>
                      <span className="block truncate text-xs text-slate-500">{q.desc}</span>
                    </span>
                    <span className="text-slate-300">→</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}