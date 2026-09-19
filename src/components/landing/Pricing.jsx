import Link from "next/link";
import { plans } from "./data";

export function Pricing() {
  return (
    <section id="harga" className="scroll-mt-20 bg-gradient-to-b from-blue-50/50 to-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Satu Langganan. Banyak AI Karyawan.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Pilih masa langganan sesuai kebutuhan bisnis Anda.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 shadow-sm transition hover:-translate-y-1 ${
                plan.badge2
                  ? "border-blue-300 bg-white shadow-lg shadow-blue-600/10"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.badge2 && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                  ⭐ Paling Hemat
                </span>
              )}
              <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span>{plan.emoji}</span>
                {plan.name}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-500">/paket</span>
              </div>
              {plan.badge && (
                <span
                  className={`mt-3 inline-flex self-start rounded-full px-3 py-1 text-xs font-bold ${
                    plan.badge2
                      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                      : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                  }`}
                >
                  {plan.badge}
                </span>
              )}
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">
                {plan.desc}
              </p>
              <Link
                href="/login"
                className={`mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.badge2
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
                    : "border border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}