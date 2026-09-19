import { businessTypes, manualTasks, betterTasks } from "./data";

export function ReduceWork() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Kurangi Pekerjaan Manual
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Bayangkan waktu yang biasanya digunakan untuk.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-white p-7 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-sm">❌</span>
              Pekerjaan berulang
            </h3>
            <ul className="mt-5 space-y-3">
              {manualTasks.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px] text-slate-600">
                  <span className="text-sm text-rose-500">✕</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm">✅</span>
              Jadi bebas waktu untuk
            </h3>
            <ul className="mt-5 space-y-3">
              {betterTasks.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="text-sm text-emerald-500">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-lg text-slate-700">
          Anda fokus menjalankan bisnis. <span className="font-semibold text-blue-600">AI membantu mengerjakan pekerjaannya.</span>
        </p>
      </div>
    </section>
  );
}

export function BusinessTypes() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Cocok untuk Berbagai Jenis Bisnis
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {businessTypes.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <span className="text-3xl">{b.emoji}</span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}