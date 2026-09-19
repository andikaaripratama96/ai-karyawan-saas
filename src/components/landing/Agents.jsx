import Link from "next/link";
import { aiAgents } from "./data";

export default function Agents() {
  return (
    <section id="ai" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Bayangkan Punya Tim Digital yang Siap Membantu
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Tidak semua pekerjaan harus dilakukan secara manual. Dengan AI
            Karyawan, Anda dapat menggunakan berbagai AI dengan tugas dan
            keahlian berbeda.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiAgents.map((agent) => (
            <div
              key={agent.role}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl ring-1 ring-blue-100">
                  {agent.emoji}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{agent.role}</h3>
              </div>
              <p className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                Bantu mengerjakan
              </p>
              <ul className="mt-3 space-y-2">
                {agent.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-none text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-center gap-1.5 text-[13px] font-medium text-blue-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-7m-1-4-9 9" />
                </svg>
                {agent.note}
              </p>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-6 text-center">
            <span className="text-3xl">🤖</span>
            <h4 className="mt-3 text-lg font-bold text-slate-900">Dan masih banyak lagi</h4>
            <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-600">
              Semakin banyak AI yang tersedia, semakin banyak pekerjaan yang dapat dibantu.
            </p>
            <LinkButton />
          </div>
        </div>
      </div>
    </section>
  );
}

function LinkButton() {
  return (
    <Link
      href="/login"
      className="mt-5 inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Pekerjakan AI
    </Link>
  );
}