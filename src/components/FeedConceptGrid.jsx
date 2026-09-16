const gradients = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-indigo-500',
  'from-rose-500 to-orange-400',
  'from-emerald-500 to-teal-400',
  'from-amber-400 to-pink-500',
  'from-blue-500 to-cyan-400',
  'from-lime-500 to-emerald-400',
  'from-fuchsia-500 to-rose-500',
  'from-indigo-500 to-violet-400',
  'from-orange-400 to-amber-400',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-fuchsia-400',
]

const emojis = ['🛍️', '✨', '🎁', '📸', '🏷️', '🚀', '💡', '🔥', '🌿', '💜', '👀', '🛒']

export default function FeedConceptGrid({ feeds }) {
  if (!feeds || feeds.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {feeds.map((feed, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className={`relative flex aspect-square w-full items-center justify-center bg-gradient-to-br ${gradients[i % gradients.length]}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 text-6xl backdrop-blur-sm">
                {feed.emoji ?? emojis[i % emojis.length]}
              </span>
            </div>
            <div className="absolute right-2 top-2 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              Feed {i + 1}
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] font-semibold text-white/80">
              @naya.content
            </div>
            <div className="relative z-10 px-3 text-center text-[11px] font-semibold leading-snug text-white drop-shadow-sm">
              {feed.what ?? feed.title}
            </div>
          </div>
          <div className="px-2.5 pb-2.5 pt-2">
            <p className="line-clamp-3 text-[11px] italic leading-snug text-slate-600">
              “{feed.caption}”
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}