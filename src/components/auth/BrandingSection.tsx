import type { ReactNode } from 'react'

type Feature = {
  icon: ReactNode
  label: string
}

const features: Feature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#f6c68b]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
      </svg>
    ),
    label: 'Create stunning cooking reels in minutes',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#f6c68b]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    label: 'Share recipes with a vibrant community',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[#f6c68b]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    label: 'Discover trending dishes worldwide',
  },
]

export default function BrandingSection() {
  return (
    <div className="hidden lg:flex flex-col justify-center w-[44%] px-10 xl:px-16 py-10 animate-fade-in">
      {/* Logo mark */}
      <div className="flex items-center gap-3 mb-8 xl:mb-10">
        <div className="w-11 h-11 rounded-2xl bg-[#f6c68b] flex items-center justify-center shadow-lg shadow-[#f6c68b]/20 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-stone-900">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
        </div>
        <span className="text-white/50 text-xs tracking-[0.25em] uppercase font-semibold">CookReels</span>
      </div>

      {/* Main headline — staggered entrance */}
      <div className="mb-3 xl:mb-4">
        <h1
          className="font-heading text-[3.25rem] xl:text-[4rem] font-extrabold text-white leading-none tracking-tight animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          Cook.
        </h1>
        <h1
          className="font-heading text-[3.25rem] xl:text-[4rem] font-extrabold text-[#f6c68b] leading-none tracking-tight animate-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          Create.
        </h1>
        <h1
          className="font-heading text-[3.25rem] xl:text-[4rem] font-extrabold text-white leading-none tracking-tight animate-slide-up"
          style={{ animationDelay: '0.35s' }}
        >
          Inspire.
        </h1>
      </div>

      {/* Subtext */}
      <p
        className="text-white/45 text-sm font-light tracking-[0.2em] uppercase mb-8 xl:mb-10 animate-slide-up"
        style={{ animationDelay: '0.45s' }}
      >
        Where recipes become reels
      </p>

      {/* Accent line */}
      <div
        className="flex items-center gap-3 mb-7 xl:mb-9 animate-fade-in"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="h-px w-14 bg-[#f6c68b]/60 rounded-full" />
        <div className="h-px w-7 bg-white/15 rounded-full" />
        <div className="h-px w-3 bg-white/8 rounded-full" />
      </div>

      {/* Feature list */}
      <div className="space-y-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 animate-slide-up"
            style={{ animationDelay: `${0.55 + i * 0.1}s` }}
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
              {feature.icon}
            </div>
            <span className="text-white/55 text-sm">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
