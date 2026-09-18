"use client";
import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import NewTaskModal from '../components/NewTaskModal'
import Dashboard from '../views/Dashboard'
import Employees from '../views/Employees'
import Tasks from '../views/Tasks'
import Knowledge from '../views/Knowledge'
import History from '../views/History'
import Settings from '../views/Settings'
import { employees, initialTasks } from '../data/mockData'
import { readFilesAsReferences } from '../utils/upload'
import { buildMockResult, categoryFor } from '../utils/mockResult'
import { IconCheck } from '../components/icons'
import { createClient } from '../lib/supabase-client'

const pageTitles = {
  dashboard: 'Dashboard',
  employees: 'AI Karyawan',
  tasks: 'Tugas',
  knowledge: 'Data / Knowledge',
  history: 'Riwayat',
  settings: 'Pengaturan',
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function Workspace() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks] = useState(() => {
    const stored = loadState('ai-karyawan-tasks', initialTasks)
    const seedIds = new Set(initialTasks.map((t) => t.id))
    return stored.map((t) => {
      const staleContentResult =
        t.employeeId === 'content-creator' && t.result && typeof t.result.outputs?.[0] === 'string'
      if (staleContentResult) {
        return { ...t, result: buildMockResult(t.employeeId, t.title, 0, t.description ?? '') }
      }
      if (t.status === 'selesai' && !t.result) {
        return { ...t, result: buildMockResult(t.employeeId, t.title, 0, t.description ?? '') }
      }
      if (!seedIds.has(t.id) && (t.status === 'menunggu' || t.status === 'diproses')) {
        return { ...t, status: 'selesai', progress: 100, result: buildMockResult(t.employeeId, t.title, 0, t.description ?? '') }
      }
      return t
    })
  })
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [presetEmployee, setPresetEmployee] = useState('')
  const [refs, setRefs] = useState(() => loadState('ai-karyawan-refs', []))
  const [toast, setToast] = useState(null)
  const timersRef = useRef([])

  useEffect(() => {
    try {
      localStorage.setItem('ai-karyawan-refs', JSON.stringify(refs))
    } catch {}
  }, [refs])

  useEffect(() => {
    try {
      localStorage.setItem('ai-karyawan-tasks', JSON.stringify(tasks))
    } catch {}
  }, [tasks])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  const handleUploadRefs = async (files) => {
    const added = await readFilesAsReferences(files)
    setRefs((prev) => [...prev, ...added])
  }

  const handleRemoveRef = (id) => setRefs((prev) => prev.filter((r) => r.id !== id))

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
    }
    window.location.href = '/login'
  }

  const showToast = (message) => {
    setToast(message)
    const t = setTimeout(() => setToast(null), 5000)
    timersRef.current.push(t)
  }

  const openNewTask = (employeeId = '') => {
    setPresetEmployee(employeeId)
    setNewTaskOpen(true)
  }

  const runTaskSimulation = (id, employeeId, title, description = '') => {
    const refCount = refs.length

    timersRef.current.push(
      setTimeout(() => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'diproses', progress: 35 } : t)))
      }, 1500),
    )
    timersRef.current.push(
      setTimeout(() => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, progress: 70 } : t)))
      }, 3500),
    )
    ;(async () => {
      let resultData
      let message = `✓ AI selesai mengerjakan "${title}". Buka halaman Tugas untuk melihat hasil.`
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId, title, description }),
        })
        const json = await res.json()
        if (json.ok && json.result) {
          resultData = { outputs: json.result.outputs, summary: json.result.summary }
          if (json.usedMock) message = `✓ "${title}" selesai (mode demo, Gemini belum bisa dihubungi).`
        } else {
          throw new Error(json.error)
        }
      } catch {
        resultData = buildMockResult(employeeId, title, refCount, description)
      }
      timersRef.current.push(
        setTimeout(() => {
          const emp = employees.find((e) => e.id === employeeId)
          setTasks((prev) =>
            prev.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: 'selesai',
                    progress: 100,
                    result: resultData ?? buildMockResult(employeeId, title, refCount, description),
                  }
                : t,
            ),
          )
          showToast(message.includes('mode demo') ? message : `✓ ${emp?.name ?? 'AI'} selesai mengerjakan "${title}". Buka halaman Tugas untuk melihat hasil.`)
        }, 5500),
      )
    })()
  }

  const handleNewTask = (payload) => {
    const now = new Date().toISOString().slice(0, 10)
    const id = `t-${Date.now()}`
    const task = {
      id,
      ...payload,
      status: 'menunggu',
      category: categoryFor(payload.employeeId),
      createdAt: now,
      progress: 0,
    }
    setTasks((prev) => [task, ...prev])
    setPage('tasks')
    runTaskSimulation(id, payload.employeeId, payload.title, payload.description)
  }

  const createDemoFeed = () => {
    const now = new Date().toISOString().slice(0, 10)
    const id = `t-${Date.now()}`
    const task = {
      id,
      title: 'Buatkan 10 feed Instagram dan caption promosi (demo)',
      description: 'Buatkan 10 feed dan caption',
      employeeId: 'content-creator',
      category: categoryFor('content-creator'),
      status: 'proses',
      progress: 30,
      priority: 'sedang',
      createdAt: now,
      dueDate: now,
      result: null,
    }
    setTasks((prev) => [task, ...prev])
    setPage('tasks')
    runTaskSimulation(
      id,
      'content-creator',
      'Buatkan 10 feed Instagram dan caption promosi',
      'Buatkan 10 feed dan caption',
    )
    return id
  }

  const updateTask = (id, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const requestRevision = (id) => {
    updateTask(id, { status: 'diproses', progress: 45 })
    showToast('AI sedang merevisi hasil berdasarkan koreksi kamu…')
    const refCount = refs.length
    const task = tasks.find((t) => t.id === id)
    ;(async () => {
      let resultData
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: task?.employeeId ?? 'content-creator',
            title: task?.title ?? '',
            description: (task?.description ?? '') + ' — buat versi revisi dengan penyesuaian dari koreksi pengguna.',
          }),
        })
        const json = await res.json()
        if (json.ok && json.result) {
          resultData = {
            ...json.result,
            notes: 'Revisi terakhir oleh AI — hasil disesuaikan ulang berdasarkan koreksi kamu.',
          }
        }
      } catch {
      }
      const t = setTimeout(() => {
        setTasks((prev) =>
          prev.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: 'selesai',
                  progress: 100,
                  result:
                    resultData ??
                    (() => {
                      const m = buildMockResult(x.employeeId, x.title, refCount, x.description ?? '')
                      return { ...m, notes: 'Revisi terakhir oleh AI — jumlah konsep dan caption disesuaikan ulang berdasarkan koreksi kamu.' }
                    })(),
                }
              : x,
          ),
        )
        showToast('✓ Revisi selesai. Hasil sudah diperbarui.')
      }, 3200)
      timersRef.current.push(t)
    })()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          currentTitle={pageTitles[page]}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewTask={() => openNewTask()}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {page === 'dashboard' && <Dashboard onNavigate={setPage} onNewTask={() => openNewTask()} tasks={tasks} />}
            {page === 'employees' && (
              <Employees
                onGiveTask={openNewTask}
                refs={refs}
                onUploadRefs={handleUploadRefs}
                onRemoveRef={handleRemoveRef}
              />
            )}
            {page === 'tasks' && (
              <Tasks
                tasks={tasks}
                onNewTask={() => openNewTask()}
                onUpdateTask={updateTask}
                onRequestRevision={requestRevision}
                refs={refs}
                onCreateDemoFeed={createDemoFeed}
              />
            )}
            {page === 'knowledge' && <Knowledge />}
            {page === 'history' && <History />}
            {page === 'settings' && <Settings />}
          </div>
        </main>
      </div>

      <NewTaskModal
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        employees={employees}
        initialEmployeeId={presetEmployee}
        onSubmit={handleNewTask}
        refs={refs}
        onUploadRefs={handleUploadRefs}
      />

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <IconCheck width={14} height={14} />
          </span>
          <span className="min-w-0 flex-1 leading-snug">{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="shrink-0 text-slate-400 transition hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}