import { IconBell, IconMenu, IconPlus, IconSearch } from './icons'

const APP_VERSION = 'v1.4-hotfix9'

export default function Header({ currentTitle, onOpenSidebar, onNewTask, userName = '', userEmail = '' }) {
  const initials = (userName.split(' ').map((w) => w[0]).slice(0, 2).join('') || userEmail[0] || 'A').toUpperCase()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <button
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        onClick={onOpenSidebar}
      >
        <IconMenu width={20} height={20} />
      </button>

      <h1 className="hidden text-lg font-semibold tracking-tight text-slate-900 sm:block">
        {currentTitle}
      </h1>

      <div className="mx-3 hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
        <IconSearch width={16} height={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Cari tugas, AI, atau data…"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={onNewTask}
          className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:from-violet-500 hover:to-fuchsia-500 sm:inline-flex"
        >
          <IconPlus width={16} height={16} />
          Beri Tugas
        </button>
        <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
          <IconBell width={18} height={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:bg-slate-50 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-xs font-bold text-white">
            {initials}
          </div>
          <span className="hidden pr-1 text-left xl:block">
            <span className="block max-w-[140px] truncate text-[13px] font-semibold leading-tight text-slate-800">{userName}</span>
            <span className="block text-[11px] text-slate-500">Workspace Admin</span>
          </span>
        </button>
        <span className="mr-1 hidden rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200 sm:inline-block">
          {APP_VERSION}
        </span>
        <button
          onClick={onNewTask}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-2.5 text-white shadow-md shadow-violet-500/25 sm:hidden"
        >
          <IconPlus width={18} height={18} />
        </button>
      </div>
    </header>
  )
}