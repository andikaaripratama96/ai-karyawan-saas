"use client";
import { useState } from 'react'
import { Card, EmployeeAvatar, SectionHeader } from '../components/ui'
import { IconShield, IconTrash } from '../components/icons'
import { employees, employeeStatus } from '../data/mockData'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function Settings({ userName = '', userEmail = '' }) {
  const [profile, setProfile] = useState({ name: userName, email: userEmail, company: '' })
  const [prefs, setPrefs] = useState({ language: 'id', timezone: 'Asia/Jakarta' })
  const [notifs, setNotifs] = useState({
    taskDone: true,
    newTask: true,
    stokAlert: true,
    weeklyReport: false,
  })
  const [enabled, setEnabled] = useState({
    'content-creator': true,
    'admin-stok': true,
    'business-analyst': true,
  })

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Pengaturan</h2>
        <p className="mt-0.5 text-sm text-slate-500">Kelola profil, preferensi, dan AI Karyawan workspace.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <SectionHeader title="Profil Workspace" subtitle="Informasi dasar akun dan perusahaan." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Nama</label>
                <input
                  className={inputCls}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Email</label>
                <input
                  className={inputCls}
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Nama Perusahaan</label>
                <input
                  className={inputCls}
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Simpan Perubahan
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader title="Preferensi & Notifikasi" subtitle="Atur bahasa, zona waktu, dan pemberitahuan." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Bahasa</label>
                <select
                  className={inputCls}
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Zona Waktu</label>
                <select
                  className={inputCls}
                  value={prefs.timezone}
                  onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>
            </div>
            <div className="mt-5 divide-y divide-slate-100">
              {[
                { key: 'taskDone', label: 'Tugas selesai', desc: 'Diberi tahu saat AI selesai mengerjakan tugas.' },
                { key: 'newTask', label: 'Tugas baru ditugaskan', desc: 'Notifikasi saat tugas baru masuk antrian.' },
                { key: 'stokAlert', label: 'Peringatan stok menipis', desc: 'Dari Admin Stok AI ketika ada item di bawah reorder point.' },
                { key: 'weeklyReport', label: 'Laporan mingguan', desc: 'Ringkasan performa AI Karyawan setiap pekan.' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{n.label}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <Toggle checked={notifs[n.key]} onChange={(v) => setNotifs({ ...notifs, [n.key]: v })} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <IconShield width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Zona Berbahaya</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Reset seluruh data demo: tugas, riwayat, dan knowledge akan dikembalikan ke kondisi awal.
                  </p>
                </div>
              </div>
              <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100">
                <IconTrash width={15} height={15} />
                Reset Demo
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <SectionHeader title="AI Karyawan" subtitle="Aktifkan atau nonaktifkan AI." />
            <div className="space-y-4">
              {employees.map((emp) => {
                const st = employeeStatus[emp.status]
                return (
                  <div key={emp.id} className="flex items-center gap-3">
                    <EmployeeAvatar employee={emp} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-800">
                        {emp.name}
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}`} />
                      </p>
                      <p className="truncate text-xs text-slate-500">{emp.role}</p>
                    </div>
                    <Toggle
                      checked={enabled[emp.id]}
                      onChange={(v) => setEnabled({ ...enabled, [emp.id]: v })}
                    />
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader title="Paket & Kuota" subtitle="Status penggunaan bulan berjalan." />
            <p className="text-sm font-semibold text-slate-800">Business</p>
            <p className="mt-0.5 text-xs text-slate-500">
              42 dari 100 tugas digunakan bulan ini (September 2026).
            </p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> 3 AI Karyawan aktif
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Knowledge Base 10 GB
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Laporan & ekspor data
              </li>
            </ul>
            <button className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Kelola Paket
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}