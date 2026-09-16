export function StatusBadge({ status }) {
  const meta = {
    menunggu: { label: 'Menunggu', cls: 'bg-amber-50 text-amber-700 ring-amber-200', pulse: false },
    diproses: { label: 'Sedang Dikerjakan', cls: 'bg-blue-50 text-blue-700 ring-blue-200', pulse: true },
    selesai: { label: 'Selesai', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', pulse: false },
    gagal: { label: 'Gagal', cls: 'bg-rose-50 text-rose-700 ring-rose-200', pulse: false },
  }
  const m = meta[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${m.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${m.pulse ? 'animate-pulse' : ''}`} />
      {m.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const meta = {
    tinggi: { label: 'Tinggi', cls: 'bg-rose-50 text-rose-600 ring-rose-200' },
    sedang: { label: 'Sedang', cls: 'bg-orange-50 text-orange-600 ring-orange-200' },
    rendah: { label: 'Rendah', cls: 'bg-slate-100 text-slate-600 ring-slate-200' },
  }
  const m = meta[priority]
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${m.cls}`}>
      {m.label}
    </span>
  )
}

export function EmployeeAvatar({ employee, size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-xl',
    xl: 'h-20 w-20 text-3xl',
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-white ${employee?.color} ${sizes[size]}`}
      title={employee?.name}
    >
      {employee?.emoji}
    </div>
  )
}

export function ProgressBar({ value, color = 'bg-gradient-to-r from-violet-500 to-fuchsia-500' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}