import Link from "next/link";
import { faqs } from "./data";

export function CtaBanner() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-5">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-8 py-14 text-center shadow-xl shadow-blue-600/25">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-400/30 blur-2xl" />
          <h2 className="relative text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Pekerjakan AI untuk Pekerjaan yang Berulang
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg leading-relaxed text-blue-100">
            Mulai bangun tim digital Anda sendiri bersama AI Karyawan.
          </p>
          <p className="relative mt-5 text-lg font-semibold text-white">
            Mulai dari Rp199.000/bulan
          </p>
          <Link
            href="/login"
            className="relative mt-8 inline-flex items-center rounded-full bg-white px-8 py-3.5 text-[15px] font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
          >
            🚀 Mulai Berlangganan
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-gradient-to-b from-white to-blue-50/40 py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          ❓ FAQ
        </h2>
        <div className="mt-12 space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm open:border-blue-200 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-slate-900">
                {f.q}
                <svg
                  className="h-5 w-5 flex-none text-blue-600 transition group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-white py-24 text-center">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Pekerjaan Bertambah? Tambahkan AI ke Tim Anda.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Content Creator, Admin Stok, Kasir, Business Analyst, Akuntan, dan
          lebih banyak AI Karyawan yang akan datang.
        </p>
        <p className="mt-3 text-lg text-slate-600">
          Satu platform untuk membantu berbagai pekerjaan bisnis.{" "}
          <span className="font-semibold text-blue-600">Mulai dari Rp199.000/bulan.</span>
        </p>
        <Link
          href="/login"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
        >
          Coba AI Karyawan Sekarang
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
            AI
          </span>
          <span className="text-sm font-bold text-slate-900">AI Karyawan</span>
        </div>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} AI Karyawan. Satu platform untuk berbagai pekerjaan bisnis.
        </p>
      </div>
    </footer>
  );
}