const iconCls = "text-slate-900 drop-shadow-sm"

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
      <path d="M12 20.5 4.7 13a5 5 0 1 1 7-7l.3.3.3-.3a5 5 0 1 1 7 7L12 20.5Z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1L3 20l1.1-5.1A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

export default function FeedPreview({ refs, caption, notes }) {
  const cover = refs && refs.length > 0 ? refs[0].dataUrl : null
  const captionText = typeof caption === 'string' && caption ? caption : 'Caption hasil AI akan tampil di sini.'
  const comment = 'Klik untuk melihat komentar…'

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
          N
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-800">naya.content</p>
          <p className="text-[11px] text-slate-400">Disusun oleh Content Creator AI</p>
        </div>
        <span className="text-lg leading-none text-slate-300">•••</span>
      </div>

      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {cover ? (
          <img src={cover} alt="Referensi feed" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-slate-100 px-6 text-center">
            <span className="text-5xl">✨</span>
            <p className="text-sm font-semibold text-slate-600">Pratinjau visual feed</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Unggah foto referensi pada profil Naya agar preview memakai gambar brand kamu.
            </p>
          </div>
        )}
      </div>

      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-rose-500"><HeartIcon /></span>
          <span className="text-slate-900"><CommentIcon /></span>
          <span className="text-slate-900"><SendIcon /></span>
          <span className="ml-auto text-lg leading-none">🔖</span>
        </div>
        <p className="mt-2 text-[13px] font-semibold text-slate-800">1.024 suka</p>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
          <b>naya.content</b> {captionText}
        </p>
        <p className="mt-1 text-xs text-slate-400">Lihat semua 27 komentar</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{comment}</p>
        {notes && <p className="mt-2 border-t border-slate-100 pt-2 text-[11px] text-slate-400">{notes}</p>}
      </div>
    </div>
  )
}