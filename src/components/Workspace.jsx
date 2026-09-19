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
import { employees } from '../data/mockData'
import { readFilesAsReferences } from '../utils/upload'
import { buildMockResult, categoryFor } from '../utils/mockResult'
import { IconCheck } from '../components/icons'
import { createClient } from '../lib/supabase-client'
import {
  fetchTasks,
  createTask,
  updateTask,
  fetchKnowledge,
  addKnowledge,
  removeKnowledge,
  fetchHistory,
  addHistory,
  fetchUser,
} from '../lib/supabase-data'

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
  const [tasks, setTasks] = useState([])
  const [knowledge, setKnowledge] = useState([])
  const [history, setHistory] = useState([])
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
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

  const showToast = (message) => {
    setToast(message)
    const t = setTimeout(() => setToast(null), 5000)
    timersRef.current.push(t)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUser()
        if (!user) {
          window.location.href = '/login'
          return
        }
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
        const [taskRows, knowledgeRows, historyRows] = await Promise.all([
          fetchTasks(),
          fetchKnowledge(),
          fetchHistory(),
        ])
        setTasks(taskRows)
        setKnowledge(knowledgeRows)
        setHistory(historyRows)
      } catch (err) {
        console.error('Gagal memuat data:', err)
        showToast('Gagal memuat data dari database.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
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

  const openNewTask = (employeeId = '') => {
    setPresetEmployee(employeeId)
    setNewTaskOpen(true)
  }

  const applyTaskUpdate = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    updateTask(id, patch).catch((err) => console.error(`Gagal menyimpan tugas ${id}:`, err))
  }

  const runTaskSimulation = (id, employeeId, title, description = '') => {
    const refCount = refs.length

    timersRef.current.push(
      setTimeout(() => {
        applyTaskUpdate(id, { status: 'diproses', progress: 35 })
      }, 1500),
    )
    timersRef.current.push(
      setTimeout(() => {
        applyTaskUpdate(id, { progress: 70 })
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
          applyTaskUpdate(id, {
            status: 'selesai',
            progress: 100,
            result: resultData ?? buildMockResult(employeeId, title, refCount, description),
          })
          addHistory({
            employeeId,
            action: `Menyelesaikan tugas "${title}"`,
          }).catch(() => {})
          setHistory((prev) => [{ id: `h-${Date.now()}`, employeeId, action: `Menyelesaikan tugas "${title}"`, at: 'Baru saja' }, ...prev])
          showToast(message.includes('mode demo') ? message : `✓ ${emp?.name ?? 'AI'} selesai mengerjakan "${title}". Buka halaman Tugas untuk melihat hasil.`)
        }, 5500),
      )
    })()
  }

  const handleNewTask = async (payload) => {
    try {
      const task = await createTask({
        title: payload.title,
        description: payload.description,
        employeeId: payload.employeeId,
        priority: payload.priority,
        category: categoryFor(payload.employeeId),
        dueDate: payload.dueDate,
        status: 'menunggu',
        progress: 0,
      })
      setTasks((prev) => [task, ...prev])
      addHistory({
        employeeId: task.employeeId,
        action: `Memulai tugas "${task.title}"`,
      }).catch(() => {})
      setHistory((prev) => [{ id: `h-${Date.now()}`, employeeId: task.employeeId, action: `Memulai tugas "${task.title}"`, at: 'Baru saja' }, ...prev])
      setPage('tasks')
      runTaskSimulation(task.id, payload.employeeId, payload.title, payload.description)
    } catch (err) {
      console.error('Gagal membuat tugas:', err)
      showToast('Gagal menyimpan tugas ke database.')
    }
  }

  const createDemoFeed = async () => {
    const now = new Date().toISOString().slice(0, 10)
    try {
      const task = await createTask({
        title: 'Buatkan 10 feed Instagram dan caption promosi (demo)',
        description: 'Buatkan 10 feed dan caption',
        employeeId: 'content-creator',
        category: categoryFor('content-creator'),
        status: 'diproses',
        progress: 30,
        priority: 'sedang',
        dueDate: now,
      })
      setTasks((prev) => [task, ...prev])
      setPage('tasks')
      runTaskSimulation(
        task.id,
        'content-creator',
        'Buatkan 10 feed Instagram dan caption promosi',
        'Buatkan 10 feed dan caption',
      )
      return task.id
    } catch (err) {
      console.error('Gagal membuat tugas demo:', err)
      showToast('Gagal menyimpan tugas demo.')
      return null
    }
  }

  const updateTaskLocal = (id, patch) => {
    applyTaskUpdate(id, patch)
  }

  const requestRevision = (id) => {
    applyTaskUpdate(id, { status: 'diproses', progress: 45 })
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
        const m = buildMockResult(task?.employeeId ?? 'content-creator', task?.title ?? '', refCount, task?.description ?? '')
        const finalResult =
          resultData ?? { ...m, notes: 'Revisi terakhir oleh AI — jumlah konsep dan caption disesuaikan ulang berdasarkan koreksi kamu.' }
        applyTaskUpdate(id, { status: 'selesai', progress: 100, result: finalResult })
        addHistory({
          employeeId: task?.employeeId ?? 'content-creator',
          action: `Merevisi hasil tugas "${task?.title ?? ''}"`,
        }).catch(() => {})
        setHistory((prev) => [{ id: `h-${Date.now()}`, employeeId: task?.employeeId ?? 'content-creator', action: `Merevisi hasil tugas "${task?.title ?? ''}"`, at: 'Baru saja' }, ...prev])
        showToast('✓ Revisi selesai. Hasil sudah diperbarui.')
      }, 3200)
      timersRef.current.push(t)
    })()
  }

  const handleUploadKnowledge = async (files) => {
    const file = files?.[0]
    if (!file) return
    try {
      await addKnowledge({
        name: file.name,
        fileType: file.type || file.name.split('.').pop()?.toUpperCase() || 'Dokumen',
      })
      const rows = await fetchKnowledge()
      setKnowledge(rows)
      showToast(`✓ "${file.name}" ditambahkan ke Knowledge Base.`)
    } catch (err) {
      console.error('Gagal menambah knowledge:', err)
      showToast('Gagal menambah file ke Knowledge Base.')
    }
  }

  const handleRemoveKnowledge = async (id) => {
    try {
      await removeKnowledge(id)
      const rows = await fetchKnowledge()
      setKnowledge(rows)
      showToast('File dihapus dari Knowledge Base.')
    } catch (err) {
      console.error('Gagal menghapus knowledge:', err)
      showToast('Gagal menghapus file.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-sm">Memuat data…</p>
        </div>
      </div>
    )
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
            {page === 'dashboard' && (
              <Dashboard
                onNavigate={setPage}
                onNewTask={() => openNewTask()}
                tasks={tasks}
                knowledge={knowledge}
                userName={userName}
              />
            )}
            {page === 'employees' && (
              <Employees
                onGiveTask={openNewTask}
                refs={refs}
                onUploadRefs={handleUploadRefs}
                onRemoveRef={handleRemoveRef}
                tasks={tasks}
              />
            )}
            {page === 'tasks' && (
              <Tasks
                tasks={tasks}
                onNewTask={() => openNewTask()}
                onUpdateTask={updateTaskLocal}
                onRequestRevision={requestRevision}
                refs={refs}
                onCreateDemoFeed={createDemoFeed}
              />
            )}
            {page === 'knowledge' && (
              <Knowledge
                knowledge={knowledge}
                onUpload={handleUploadKnowledge}
                onRemove={handleRemoveKnowledge}
              />
            )}
            {page === 'history' && (
              <History history={history} tasks={tasks} />
            )}
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