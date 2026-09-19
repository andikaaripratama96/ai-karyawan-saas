import { testimonials } from "./data";

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-blue-50/50 to-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Apa Kata Pengguna AI Karyawan
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Cerita dari para pemilik bisnis yang sudah dibantu AI Karyawan.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <svg className="h-8 w-8 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="mt-3 text-[16px] leading-relaxed text-slate-700">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl ring-1 ring-blue-100">
                  {t.emoji}
                </span>
                <div>
                  <div className="text-[15px] font-bold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
                <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-amber-500">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 0 0-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.286-3.957a1 1 0 0 0-.363-1.118L1.52 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69L9.05 2.927z" />
                  </svg>
                  5.0
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}