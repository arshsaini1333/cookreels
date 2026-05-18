'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Bookmark, Share2,
  X, ChevronUp, ChevronDown, Send, Smile, MoreHorizontal,
  Clock, Check, Sparkles, Flame, ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reel {
  id: string
  gradient: string
  glow: string
  emoji: string
  recipeTitle: string
  caption: string
  creatorName: string
  creatorAvatarBg: string
  likes: number
  comments: number
  saves: number
  tags: string[]
  cookingTime: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredientsPreview: string[]
  music?: string
  isVerified?: boolean
  isAIRecommended?: boolean
  isTrending?: boolean
}

interface Comment {
  id: string
  username: string
  avatarBg: string
  text: string
  likes: number
  time: string
  replies?: number
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const REELS: Reel[] = [
  {
    id: '1',
    gradient: 'from-[#120200] via-[#220800] to-[#0a0100]',
    glow: '#c2410c',
    emoji: '🍝',
    recipeTitle: 'Creamy Garlic Pasta',
    caption: 'Restaurant-quality creamy garlic pasta in 15 mins ✨ The secret? Reserve that pasta water!',
    creatorName: 'chef_anna',
    creatorAvatarBg: 'from-pink-400 to-rose-500',
    likes: 24500, comments: 1200, saves: 8400,
    tags: ['#QuickRecipes', '#Pasta', '#Italian', '#Dinner'],
    cookingTime: '15 min', difficulty: 'Easy',
    ingredientsPreview: ['Pasta', 'Garlic', 'Heavy Cream', 'Parmesan', 'Butter', 'White Wine'],
    music: '🎵 Italian Kitchen Vibes',
    isVerified: true, isAIRecommended: true,
  },
  {
    id: '2',
    gradient: 'from-[#150500] via-[#261000] to-[#0c0200]',
    glow: '#d97706',
    emoji: '🍛',
    recipeTitle: 'Butter Chicken',
    caption: 'Silky smooth butter chicken from scratch 🧡 The most-requested recipe on my channel!',
    creatorName: 'spice_kitchen',
    creatorAvatarBg: 'from-amber-400 to-orange-500',
    likes: 87200, comments: 4300, saves: 31000,
    tags: ['#IndianFood', '#Curry', '#Dinner', '#Comfort'],
    cookingTime: '40 min', difficulty: 'Medium',
    ingredientsPreview: ['Chicken', 'Tomatoes', 'Butter', 'Cream', 'Garam Masala', 'Kashmiri Chili'],
    music: '🎵 Desi Flavors Mix',
    isVerified: true, isTrending: true,
  },
  {
    id: '3',
    gradient: 'from-[#001205] via-[#00200a] to-[#000802]',
    glow: '#059669',
    emoji: '🥑',
    recipeTitle: 'Avocado Toast Deluxe',
    caption: 'Elevated avocado toast with poached egg & microgreens 💚 Brunch perfection in 10 min.',
    creatorName: 'brunch.by.leo',
    creatorAvatarBg: 'from-green-400 to-emerald-500',
    likes: 45800, comments: 2100, saves: 19200,
    tags: ['#Healthy', '#Brunch', '#Avocado', '#QuickRecipes'],
    cookingTime: '10 min', difficulty: 'Easy',
    ingredientsPreview: ['Avocado', 'Sourdough', 'Egg', 'Microgreens', 'Chili Flakes', 'Lemon'],
    music: '🎵 Morning Chill Beats',
    isAIRecommended: true,
  },
  {
    id: '4',
    gradient: 'from-[#150010] via-[#250020] to-[#0a0008]',
    glow: '#db2777',
    emoji: '🍓',
    recipeTitle: 'Strawberry Tiramisu',
    caption: 'No-bake strawberry tiramisu that will blow your mind 🍓 A dreamy twist on the classic!',
    creatorName: 'dessert.dreams',
    creatorAvatarBg: 'from-rose-400 to-pink-500',
    likes: 134000, comments: 6700, saves: 52000,
    tags: ['#Dessert', '#Tiramisu', '#NoBake', '#Strawberry'],
    cookingTime: '25 min', difficulty: 'Easy',
    ingredientsPreview: ['Strawberries', 'Mascarpone', 'Ladyfingers', 'Cream', 'Vanilla', 'Espresso'],
    music: '🎵 Dolce Vita',
    isVerified: true, isTrending: true,
  },
  {
    id: '5',
    gradient: 'from-[#00061a] via-[#000e2d] to-[#00030d]',
    glow: '#0284c7',
    emoji: '🍣',
    recipeTitle: 'Salmon Sushi Bowl',
    caption: 'Deconstructed sushi bowl — salmon, mango & sriracha mayo 🌊 So fresh you can taste the ocean!',
    creatorName: 'tokyo.table',
    creatorAvatarBg: 'from-blue-400 to-cyan-500',
    likes: 62300, comments: 3100, saves: 27400,
    tags: ['#Sushi', '#Healthy', '#JapaneseFood', '#BowlRecipe'],
    cookingTime: '20 min', difficulty: 'Medium',
    ingredientsPreview: ['Salmon', 'Sushi Rice', 'Mango', 'Cucumber', 'Sriracha Mayo', 'Nori'],
    music: '🎵 Tokyo Nights Lo-fi',
  },
  {
    id: '6',
    gradient: 'from-[#0a0015] via-[#140025] to-[#060008]',
    glow: '#7c3aed',
    emoji: '🫐',
    recipeTitle: 'Japanese Souffle Pancakes',
    caption: '3-inch tall cloud-soft souffle pancakes 💜 Weekend breakfast goals completely achieved!',
    creatorName: 'pancake.pro',
    creatorAvatarBg: 'from-purple-400 to-violet-500',
    likes: 198000, comments: 9200, saves: 76000,
    tags: ['#Pancakes', '#Breakfast', '#Fluffy', '#Japanese'],
    cookingTime: '30 min', difficulty: 'Hard',
    ingredientsPreview: ['Flour', 'Eggs', 'Buttermilk', 'Blueberries', 'Vanilla', 'Cream of Tartar'],
    music: '🎵 Sunday Morning Jazz',
    isVerified: true, isTrending: true,
  },
]

const COMMENTS: Comment[] = [
  { id: '1', username: 'foodlover99', avatarBg: 'from-pink-400 to-rose-500', text: 'This looks absolutely incredible! Making this tonight! 😍', likes: 342, time: '2h', replies: 12 },
  { id: '2', username: 'chef_marcus', avatarBg: 'from-blue-400 to-indigo-500', text: 'Pro tip: add a pinch of nutmeg to the cream sauce. Thank me later 🙌', likes: 891, time: '4h', replies: 34 },
  { id: '3', username: 'pasta.queen', avatarBg: 'from-amber-400 to-orange-500', text: 'Just made this and my family went CRAZY for it!! Recipe of the year 🏆', likes: 1204, time: '6h', replies: 56 },
  { id: '4', username: 'home_cook_jay', avatarBg: 'from-green-400 to-emerald-500', text: 'The pasta water trick is everything! Absolute game changer 💯', likes: 445, time: '8h', replies: 8 },
  { id: '5', username: 'italian_nonna', avatarBg: 'from-red-400 to-rose-500', text: 'Bellissimo! My grandmother would be so proud 🇮🇹❤️', likes: 2100, time: '12h', replies: 89 },
  { id: '6', username: 'weeknight.chef', avatarBg: 'from-purple-400 to-violet-500', text: 'Perfect for busy weeknights. Kids absolutely loved it!', likes: 287, time: '1d', replies: 3 },
  { id: '7', username: 'gourmet_diary', avatarBg: 'from-teal-400 to-cyan-500', text: 'The texture is divine. I could eat this every single day 🌟', likes: 156, time: '2d', replies: 5 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

// ─── Difficulty Pill ──────────────────────────────────────────────────────────

function DifficultyPill({ level }: { level: Reel['difficulty'] }) {
  const s = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    Hard: 'bg-red-500/15 text-red-400 border-red-500/25',
  }[level]
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${s}`}>
      {level}
    </span>
  )
}

// ─── Glass Action Button ──────────────────────────────────────────────────────

function GlassBtn({
  label, children, count, active = false, activeClass = '', onClick,
}: {
  label: string
  children: React.ReactNode
  count?: string
  active?: boolean
  activeClass?: string
  onClick?: (e: React.MouseEvent) => void
}) {
  return (
    <motion.button
      aria-label={label}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.80 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`w-12 h-12 rounded-[18px] flex items-center justify-center border shadow-2xl transition-all duration-200 ${
          active
            ? `${activeClass} bg-white/18 border-white/20 backdrop-blur-2xl`
            : 'bg-black/45 border-white/10 backdrop-blur-2xl text-white hover:bg-white/18 hover:border-white/25'
        }`}
      >
        {children}
      </div>
      {count !== undefined && (
        <span className="text-white/90 text-[11px] font-bold drop-shadow-md leading-none">{count}</span>
      )}
    </motion.button>
  )
}

// ─── Comment Drawer ───────────────────────────────────────────────────────────

function CommentDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'top' | 'newest'>('top')
  const [text, setText] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const toggleLike = (id: string) =>
    setLikedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px]"
          />
          <motion.div
            initial={isDesktop ? { x: '100%' } : { y: '100%' }}
            animate={isDesktop ? { x: 0 } : { y: 0 }}
            exit={isDesktop ? { x: '100%' } : { y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className={`fixed z-50 flex flex-col ${
              isDesktop
                ? 'right-0 top-0 bottom-0 w-96 border-l'
                : 'bottom-0 left-0 right-0 rounded-t-3xl border-t'
            }`}
            style={{
              background: '#1E1E1F',
              borderColor: '#343438',
              maxHeight: !isDesktop ? '88vh' : undefined,
            }}
          >
            {!isDesktop && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#343438]" />
              </div>
            )}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: '#343438' }}
            >
              <span className="text-[15px] font-bold text-white tracking-tight">Comments</span>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#2B2B2D' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#343438' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2B2B2D' }}
              >
                <X size={14} className="text-[#A1A1AA]" />
              </motion.button>
            </div>

            <div
              className="flex gap-1.5 px-4 py-3 border-b"
              style={{ borderColor: '#343438' }}
            >
              {(['top', 'newest'] as const).map((t) => (
                <button
                  key={t} onClick={() => setTab(t)}
                  className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200"
                  style={{
                    background: tab === t ? '#F5C518' : 'transparent',
                    color: tab === t ? '#1A1A1A' : '#71717A',
                  }}
                >
                  {t === 'top' ? 'Top Comments' : 'Newest'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {COMMENTS.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.avatarBg} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {c.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[13px] font-semibold text-white">{c.username}</span>
                        <span className="text-[11px] ml-2" style={{ color: '#52525B' }}>{c.time}</span>
                      </div>
                      <button onClick={() => toggleLike(c.id)} className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <Heart size={13} className={likedIds.has(c.id) ? 'fill-red-500 text-red-500' : ''} style={{ color: likedIds.has(c.id) ? undefined : '#52525B' }} />
                        <span className="text-[10px]" style={{ color: '#52525B' }}>
                          {fmt(c.likes + (likedIds.has(c.id) ? 1 : 0))}
                        </span>
                      </button>
                    </div>
                    <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: '#A1A1AA' }}>{c.text}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        className="text-[11px] font-semibold transition-colors hover:text-white"
                        style={{ color: '#52525B' }}
                      >
                        Reply
                      </button>
                      {c.replies && (
                        <button
                          className="text-[11px] transition-colors hover:text-[#A1A1AA]"
                          style={{ color: '#3F3F46' }}
                        >
                          View {c.replies} replies ›
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="px-4 py-3 border-t"
              style={{ background: '#1E1E1F', borderColor: '#343438' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)' }}
                >
                  <span className="text-[11px] font-bold text-[#1A1A1A]">U</span>
                </div>
                <div
                  className="flex-1 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
                  style={{ background: '#2B2B2D', borderColor: '#343438' }}
                >
                  <input
                    value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent text-[13px] text-white outline-none"
                    style={{ caretColor: '#F5C518' }}
                  />
                  <button
                    className="transition-colors"
                    style={{ color: '#52525B' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F5C518' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#52525B' }}
                  >
                    <Smile size={16} />
                  </button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: text.trim() ? '#F5C518' : '#2B2B2D',
                    color: text.trim() ? '#1A1A1A' : '#52525B',
                    boxShadow: text.trim() ? '0 4px 16px rgba(245,197,24,0.30)' : 'none',
                  }}
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Recipe Preview Overlay ───────────────────────────────────────────────────

function RecipePreview({ reel, onClose }: { reel: Reel; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      className="absolute inset-x-3 bottom-[188px] z-30 rounded-3xl backdrop-blur-2xl p-5 shadow-2xl"
      style={{
        background: 'rgba(30,30,31,0.96)',
        border: '1px solid #343438',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {reel.recipeTitle}
          </h3>
          <div className="flex items-center gap-2.5 mt-1.5">
            <div className="flex items-center gap-1.5">
              <Clock size={11} style={{ color: '#F5C518' }} />
              <span className="text-[11px]" style={{ color: '#A1A1AA' }}>{reel.cookingTime}</span>
            </div>
            <DifficultyPill level={reel.difficulty} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80 transition-colors flex-shrink-0"
          style={{ background: '#2B2B2D' }}
        >
          <X size={13} style={{ color: '#A1A1AA' }} />
        </button>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#52525B' }}>Ingredients</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {reel.ingredientsPreview.map((ing, i) => (
          <span
            key={i}
            className="text-[12px] px-3 py-1 rounded-full border"
            style={{ color: '#A1A1AA', background: '#2B2B2D', borderColor: '#343438' }}
          >
            {ing}
          </span>
        ))}
      </div>
      <button
        className="w-full py-2.5 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
          color: '#1A1A1A',
          boxShadow: '0 4px 16px rgba(245,197,24,0.30)',
        }}
      >
        View Full Recipe <ArrowRight size={14} />
      </button>
    </motion.div>
  )
}

// ─── Reel Card ────────────────────────────────────────────────────────────────

function ReelCard({
  reel, isActive, onComment,
}: {
  reel: Reel
  isActive: boolean
  onComment: () => void
}) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 })
  const [showHeart, setShowHeart] = useState(false)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const tapRef = useRef({ count: 0, timer: null as ReturnType<typeof setTimeout> | null })

  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    const t = tapRef.current
    t.count += 1
    if (t.count >= 2) {
      if (t.timer) clearTimeout(t.timer)
      t.count = 0
      const rect = e.currentTarget.getBoundingClientRect()
      setHeartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setShowHeart(true)
      setLiked(true)
      setTimeout(() => setShowHeart(false), 900)
    } else {
      t.timer = setTimeout(() => { t.count = 0 }, 280)
    }
  }, [])

  return (
    <div
      className="relative w-full h-full flex-shrink-0 snap-start overflow-hidden select-none"
      onClick={handleTap}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`}>
        {/* Ambient glow blobs */}
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full opacity-35 blur-3xl"
          style={{ background: reel.glow }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-52 h-52 rounded-full opacity-18 blur-3xl"
          style={{ background: reel.glow }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-12 blur-2xl"
          style={{ background: reel.glow }}
        />

        {/* Blurred bg emoji */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.span
            className="text-[220px] opacity-[0.065] blur-[28px]"
            animate={isActive ? { scale: [1, 1.1, 1], rotate: [-5, 5, -5] } : { scale: 1 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {reel.emoji}
          </motion.span>
        </div>

        {/* Floating foreground emoji */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.span
            className="text-[96px] drop-shadow-2xl"
            animate={isActive ? { y: [0, -12, 0], rotate: [-2, 2, -2] } : { y: 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {reel.emoji}
          </motion.span>
        </div>

        {/* Subtle radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)' }}
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/96 via-black/8 to-black/32 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/22 via-transparent to-transparent pointer-events-none" />

      {/* Yellow top accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5C518]/25 to-transparent pointer-events-none" />

      {/* Double-tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2.0, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute pointer-events-none z-30"
            style={{ left: heartPos.x - 45, top: heartPos.y - 45 }}
          >
            <Heart size={90} className="fill-red-500 text-red-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top badges */}
      <div className="absolute top-14 left-4 z-20 flex flex-col gap-2">
        <AnimatePresence>
          {isActive && reel.isAIRecommended && (
            <motion.div
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 backdrop-blur-xl shadow-lg"
            >
              <Sparkles size={11} className="text-violet-400" />
              <span className="text-[10px] font-bold text-violet-300 tracking-wide">AI Recommended</span>
            </motion.div>
          )}
          {isActive && reel.isTrending && (
            <motion.div
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl shadow-lg"
              style={{ background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.28)' }}
            >
              <Flame size={11} style={{ color: '#F5C518' }} />
              <span className="text-[10px] font-bold tracking-wide" style={{ color: '#F5C518' }}>Trending</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right action buttons */}
      <div
        className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Creator avatar with follow button */}
        <div className="relative mb-2">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${reel.creatorAvatarBg} flex items-center justify-center ring-2 ring-white/20 shadow-xl`}>
            <span className="text-white text-sm font-bold">{reel.creatorName[0].toUpperCase()}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setFollowed((f) => !f)}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-all duration-300"
            style={{
              background: followed ? '#343438' : '#F5C518',
              color: followed ? '#F5F5F5' : '#1A1A1A',
            }}
          >
            {followed ? '✓' : '+'}
          </motion.button>
        </div>

        <GlassBtn label="Like" count={fmt(reel.likes + (liked ? 1 : 0))} active={liked} activeClass="text-red-500" onClick={() => setLiked((l) => !l)}>
          <Heart size={20} strokeWidth={liked ? 0 : 1.8} className={liked ? 'fill-red-500 text-red-500' : ''} />
        </GlassBtn>

        <GlassBtn label="Comment" count={fmt(reel.comments)} onClick={onComment}>
          <MessageCircle size={20} strokeWidth={1.8} />
        </GlassBtn>

        <GlassBtn
          label="Save"
          count={fmt(reel.saves + (saved ? 1 : 0))}
          active={saved}
          activeClass=""
          onClick={() => setSaved((s) => !s)}
        >
          <Bookmark
            size={20}
            strokeWidth={saved ? 0 : 1.8}
            style={{ color: saved ? '#F5C518' : undefined }}
            fill={saved ? '#F5C518' : 'none'}
          />
        </GlassBtn>

        <GlassBtn label="Share" count="Share">
          <Share2 size={18} strokeWidth={1.8} />
        </GlassBtn>

        <GlassBtn label="More">
          <MoreHorizontal size={18} strokeWidth={1.8} />
        </GlassBtn>
      </div>

      {/* Bottom-left: creator row + caption */}
      <div className="absolute bottom-0 left-0 right-[64px] z-20 px-3 pb-3">
        {/* Creator */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${reel.creatorAvatarBg} flex-shrink-0 flex items-center justify-center ring-2 ring-white/20 shadow-lg`}>
            <span className="text-white text-[11px] font-bold">{reel.creatorName[0].toUpperCase()}</span>
          </div>
          <span className="text-[13px] font-bold text-white">@{reel.creatorName}</span>
          {reel.isVerified && (
            <div
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#F5C518' }}
            >
              <Check size={8} strokeWidth={3} className="text-[#1A1A1A]" />
            </div>
          )}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={(e) => { e.stopPropagation(); setFollowed((f) => !f) }}
            className="ml-auto flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-300 border"
            style={followed
              ? { background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)', color: 'white' }
              : { background: '#F5C518', borderColor: 'transparent', color: '#1A1A1A' }
            }
          >
            {followed ? '✓ Following' : 'Follow'}
          </motion.button>
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ delay: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className={`text-[12px] text-white/75 leading-relaxed ${captionExpanded ? '' : 'line-clamp-1'}`}>
            {reel.caption}
          </p>
          {!captionExpanded && (
            <button
              onClick={() => setCaptionExpanded(true)}
              className="text-[11px] text-white/45 hover:text-white/70 transition-colors mt-0.5"
            >
              read more
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ReelsPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [commentOpen, setCommentOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeReel = REELS[activeIdx]

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement | null
    if (!main) return
    const orig = main.style.overflow
    main.style.overflow = 'hidden'
    return () => { main.style.overflow = orig }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const kids = Array.from(el.children) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = kids.indexOf(entry.target as HTMLElement)
            if (i !== -1) setActiveIdx(i)
          }
        }
      },
      { root: el, threshold: 0.65 },
    )
    kids.forEach((k) => io.observe(k))
    return () => io.disconnect()
  }, [])

  const scrollDir = (dir: -1 | 1) =>
    containerRef.current?.scrollBy({ top: dir * (containerRef.current?.clientHeight ?? 0), behavior: 'smooth' })

  return (
    <div className="relative -mx-4 sm:-mx-6 -mt-6 -mb-2 h-[calc(100vh-4rem)] overflow-hidden flex items-stretch justify-center">

      {/* Ambient background glow — shifts per reel */}
      <motion.div
        key={activeReel.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 75% at 50% 45%, ${activeReel.glow}22 0%, transparent 70%)`,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Desktop: nav arrows ─────────────────────────────── */}
      <div className="hidden md:flex flex-col items-center justify-center gap-4 w-20 flex-shrink-0 z-20">
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}
          onClick={() => scrollDir(-1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm"
          style={{
            background: 'rgba(43,43,45,0.70)',
            border: '1px solid #343438',
            color: '#A1A1AA',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'rgba(245,197,24,0.40)'
            el.style.color = '#F5C518'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = '#343438'
            el.style.color = '#A1A1AA'
          }}
        >
          <ChevronUp size={19} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: 2 }} whileTap={{ scale: 0.9 }}
          onClick={() => scrollDir(1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm"
          style={{
            background: 'rgba(43,43,45,0.70)',
            border: '1px solid #343438',
            color: '#A1A1AA',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'rgba(245,197,24,0.40)'
            el.style.color = '#F5C518'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = '#343438'
            el.style.color = '#A1A1AA'
          }}
        >
          <ChevronDown size={19} />
        </motion.button>
      </div>

      {/* ── Phone-frame reel container ─────────────────────── */}
      <div className="relative flex-shrink-0 h-full flex items-center py-[3px]">
        <div
          ref={containerRef}
          className="overflow-y-scroll snap-y snap-mandatory scrollbar-none md:rounded-[28px]"
          style={{
            width: 'min(340px, 100vw)',
            aspectRatio: '9/16',
            maxHeight: '100%',
            scrollbarWidth: 'none',
            boxShadow: '0 0 0 1px rgba(52,52,56,0.80), 0 0 80px rgba(0,0,0,0.70)',
          }}
        >
          {REELS.map((reel, i) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              isActive={i === activeIdx}
              onComment={() => setCommentOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* ── Right spacer ────────────────────────────────────── */}
      <div className="hidden md:block w-20 flex-shrink-0" />

      {/* ── Comment drawer ──────────────────────────────────── */}
      <CommentDrawer open={commentOpen} onClose={() => setCommentOpen(false)} />
    </div>
  )
}
