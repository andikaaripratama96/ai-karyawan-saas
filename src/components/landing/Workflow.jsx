import { workSteps, platformRows } from "./data";

export function Workflow() {
  return (
    <section id="cara-kerja" className="scroll-mt-20 bg-gradient-to-b from-white to-blue-50/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Bukan Sekadar Chatbot. Berikan Tugas, AI Mengerjakannya.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Tidak perlu terus-menerus mencari prompt atau memulai percakapan
            dari nol. Pilih AI Karyawan, berikan tugas, hasilnya siap untuk
            ditinjau.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {workSteps.map((step, i) => (
            <div key={step} className="relative flex flex-col items-center lg:items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-600/25">
                {i + 1}
              </div>
              {i < workSteps.length - 1 && (
                <div className="my-3 hidden h-px w-full bg-gradient-to-r from-blue-300 to-transparent lg:block" />
              )}
              <p className="mt-2 text-center text-[15px] font-semibold text-slate-800 lg:text-left">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Platform() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Satu Aplikasi untuk Banyak Kebutuhan Bisnis
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Daripada menggunakan banyak tools untuk pekerjaan yang berbeda-beda,
            AI Karyawan menyatukannya dalam satu platform.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {platformRows.map((row, i) => (
            <div
              key={row[0]}
              className={`flex items-center justify-between gap-4 px-6 py-4 ${
                i !== platformRows.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <span className="text-[15px] text-slate-600">{row[0]}</span>
              <span className="rounded-full bg-blue-50 px-4 py-1.5 text-[15px] font-semibold text-blue-700 ring-1 ring-blue-100">
                {row[1]}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[15px] text-slate-500">
          Semakin banyak AI Karyawan yang tersedia, semakin banyak pekerjaan yang dapat dibantu.
        </p>
      </div>
    </section>
  );
}