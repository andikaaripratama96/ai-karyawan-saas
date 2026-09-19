import Link from "next/link";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            AI
          </span>
          <span className="text-[15px] font-bold tracking-tight text-slate-900">
            AI Karyawan
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#ai" className="transition hover:text-blue-600">
            AI Karyawan
          </a>
          <a href="#cara-kerja" className="transition hover:text-blue-600">
            Cara Kerja
          </a>
          <a href="#harga" className="transition hover:text-blue-600">
            Harga
          </a>
          <a href="#faq" className="transition hover:text-blue-600">
            FAQ
          </a>
        </nav>
        <Link
          href="/login"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[13px] font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Satu platform. Banyak pekerjaan. Lebih hemat waktu.
        </span>
        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[2.75rem]">
          Punya Bisnis, Tapi Terlalu Banyak Pekerjaan?{" "}
          <span className="text-blue-600">Biarkan AI Mengerjakannya.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
          AI Karyawan adalah aplikasi web yang menghadirkan berbagai AI Employee
          untuk membantu pekerjaan bisnis Anda — mulai dari membuat konten,
          mengelola stok, menghitung transaksi, menganalisis bisnis, hingga
          membantu pekerjaan akuntansi.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 sm:w-auto"
          >
            🚀 Coba Sekarang
          </Link>
          <a
            href="#ai"
            className="inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 sm:w-auto"
          >
            Lihat AI Karyawan
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-500">
          {["🎨 Content Creator", "📦 Admin Stok", "🧾 Kasir", "📊 Business Analyst", "💰 Akuntan"].map(
            (item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 ring-1 ring-slate-200">
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}