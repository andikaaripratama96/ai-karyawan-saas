import { IconHome, IconUsers, IconTask, IconDatabase, IconHistory, IconSettings, IconSparkles, IconX, IconLogout } from './icons'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: IconHome },
  { id: 'employees', label: 'AI Karyawan', icon: IconUsers },
  { id: 'tasks', label: 'Tugas', icon: IconTask },
  { id: 'knowledge', label: 'Data / Knowledge', icon: IconDatabase },
  { id: 'history', label: 'Riwayat', icon: IconHistory },
  { id: 'settings', label: 'Pengaturan', icon: IconSettings },
]

export default function Sidebar({ currentPage, onNavigate, open, onClose, onLogout }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <button
            className="flex items-center gap-2.5 text-left"
            onClick={() => onNavigate('dashboard')}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
              <IconSparkles width={18} height={18} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              AI Karyawan
            </span>
          </button>
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={onClose}>
            <IconX width={18} height={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Utama
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = currentPage === item.id
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id)
                      onClose()
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-white ring-1 ring-inset ring-violet-400/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon width={18} height={18} className={active ? 'text-violet-300' : ''} />
                    {item.label}
                    {item.id === 'tasks' && (
                      <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[11px] font-semibold text-violet-200">
                        4
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 p-4 ring-1 ring-inset ring-violet-400/20">
            <p className="text-sm font-semibold text-white">Paket Business</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              3 AI Karyawan aktif · Kuota tugas 42/100 bulan ini
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
            </div>
            <button
              onClick={() => onNavigate('settings')}
              className="mt-3 text-xs font-semibold text-violet-300 hover:text-violet-200"
            >
              Kelola paket →
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-xs font-bold text-white">
              RA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Rudi Aksara</p>
              <p className="truncate text-xs text-slate-500">Founder · Toko Aksara</p>
            </div>
            <button
              onClick={onLogout}
              title="Keluar"
              className="rounded-lg bg-white/5 p-2 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-300"
            >
              <IconLogout width={18} height={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}