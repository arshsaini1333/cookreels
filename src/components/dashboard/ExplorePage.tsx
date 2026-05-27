'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Heart, Eye, Bookmark, Play,
  Users, Flame, Star, Clock, ChefHat, Filter, X, TrendingUp,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────── */

type Tab = 'All' | 'Recent' | 'Trending' | 'By Friends' | 'Recipes' | 'Reels'

interface Card {
  id: number
  type: 'reel' | 'recipe'
  title: string
  creator: string
  likes: string
  views: string
  time: string
  duration?: string
  rating?: number
  tags: string[]
  gradient: string
  emoji: string
  trending?: boolean
  friendActivity?: string
  imgHeight: number
}

/* ─── Static data ────────────────────────────────────────── */

const TABS: Tab[] = ['All', 'Recent', 'Trending', 'By Friends', 'Recipes', 'Reels']

const FRIENDS_ACTIVITY = [
  { id: 1, name: 'Priya',   emoji: '👩',    action: 'saved',   recipe: 'Dum Biryani' },
  { id: 2, name: 'Rohit',   emoji: '👨',    action: 'liked',   recipe: 'Butter Chicken' },
  { id: 3, name: 'Ananya',  emoji: '👩‍🦱', action: 'posted',  recipe: 'Mango Lassi Reel' },
  { id: 4, name: 'Arjun',   emoji: '🧑',    action: 'cooked',  recipe: 'Masala Dosa' },
  { id: 5, name: 'Kavitha', emoji: '👩‍🦳', action: 'saved',   recipe: 'Shrikhand Parfait' },
]

const CARDS: Card[] = [
  {
    id: 1, type: 'reel',
    title: 'Butter Chicken in 15 Minutes',
    creator: 'Arjun Sharma',
    likes: '48.2k', views: '1.2M', time: '2 mins ago',
    duration: '0:58',
    tags: ['Quick', 'Chicken'],
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    emoji: '🍛', trending: true,
    friendActivity: 'Priya liked this',
    imgHeight: 220,
  },
  {
    id: 2, type: 'recipe',
    title: 'Hyderabadi Dum Biryani',
    creator: 'Priya Mehta',
    likes: '31.5k', views: '890k', time: '5h ago',
    rating: 4.9,
    tags: ['Biryani', 'Rice'],
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    emoji: '🍚',
    imgHeight: 160,
  },
  {
    id: 3, type: 'reel',
    title: 'Mango Shrikhand Parfait',
    creator: 'Kavitha Rao',
    likes: '27.3k', views: '560k', time: 'Yesterday',
    duration: '0:45',
    tags: ['Dessert', 'Mango'],
    gradient: 'from-pink-400 via-fuchsia-500 to-purple-600',
    emoji: '🥭', trending: true,
    imgHeight: 190,
  },
  {
    id: 4, type: 'recipe',
    title: 'Dal Makhani Dhaba Style',
    creator: 'Meera Kapoor',
    likes: '19.8k', views: '430k', time: '3h ago',
    rating: 4.8,
    tags: ['Dal', 'Vegetarian'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    emoji: '🫕',
    friendActivity: 'Rohit saved this',
    imgHeight: 180,
  },
  {
    id: 5, type: 'reel',
    title: 'Crispy Masala Dosa',
    creator: 'Ananya Iyer',
    likes: '22.6k', views: '710k', time: '1h ago',
    duration: '0:55',
    tags: ['SouthIndian', 'Breakfast'],
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    emoji: '🥞',
    imgHeight: 240,
  },
  {
    id: 6, type: 'recipe',
    title: 'Chettinad Chicken Curry',
    creator: 'Rajan Pillai',
    likes: '14.1k', views: '290k', time: 'Yesterday',
    rating: 4.7,
    tags: ['Spicy', 'SouthIndian'],
    gradient: 'from-red-500 via-rose-600 to-pink-600',
    emoji: '🍗', trending: true,
    imgHeight: 160,
  },
  {
    id: 7, type: 'reel',
    title: 'Street Style Pav Bhaji',
    creator: 'Neha Singh',
    likes: '33.7k', views: '1.1M', time: '30 mins ago',
    duration: '1:15',
    tags: ['StreetFood', 'Mumbai'],
    gradient: 'from-red-400 via-orange-500 to-amber-500',
    emoji: '🌮',
    friendActivity: 'Ananya posted this',
    imgHeight: 175,
  },
  {
    id: 8, type: 'recipe',
    title: 'Gulab Jamun Cheesecake',
    creator: 'Aisha Khan',
    likes: '41.9k', views: '1.5M', time: '4h ago',
    rating: 5.0,
    tags: ['Fusion', 'Dessert'],
    gradient: 'from-pink-500 via-rose-500 to-red-400',
    emoji: '🍮', trending: true,
    imgHeight: 210,
  },
  {
    id: 9, type: 'reel',
    title: 'Keto Palak Paneer',
    creator: 'Vikram Anand',
    likes: '11.2k', views: '200k', time: '2h ago',
    duration: '2:10',
    tags: ['Healthy', 'Keto'],
    gradient: 'from-green-400 via-emerald-500 to-teal-600',
    emoji: '🥬',
    imgHeight: 195,
  },
  {
    id: 10, type: 'recipe',
    title: 'Rasgulla Rasmalai Fusion',
    creator: 'Sunita Das',
    likes: '25.4k', views: '640k', time: '6h ago',
    rating: 4.8,
    tags: ['Bengali', 'Dessert'],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    emoji: '🍬',
    imgHeight: 155,
  },
  {
    id: 11, type: 'reel',
    title: 'Rajasthani Laal Maas',
    creator: 'Deepak Rathore',
    likes: '18.9k', views: '380k', time: '8h ago',
    duration: '1:40',
    tags: ['Rajasthani', 'Mutton'],
    gradient: 'from-red-600 via-orange-600 to-amber-600',
    emoji: '🐑', trending: true,
    imgHeight: 230,
  },
  {
    id: 12, type: 'recipe',
    title: 'Cold Brew Coffee Cake',
    creator: 'Tanya Mehta',
    likes: '29.1k', views: '820k', time: '12h ago',
    rating: 4.9,
    tags: ['Baking', 'Coffee'],
    gradient: 'from-amber-800 via-yellow-700 to-amber-600',
    emoji: '☕',
    imgHeight: 170,
  },
]

const SKELETON_HEIGHTS = [220, 160, 190, 175, 240, 155, 210, 195, 170, 180, 230, 160]

/* ─── Animation presets ──────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
}

/* ─── Skeleton card ──────────────────────────────────────── */

function SkeletonCard({ height }: { height: number }) {
  return (
    <div className="break-inside-avoid mb-4 rounded-[20px] overflow-hidden bg-white dark:bg-[#1A1D24]/90 border border-[#E8E8E8]/70 dark:border-white/6 shadow-card-light dark:shadow-card-dark">
      <div
        className="relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
        style={{ height }}
      >
        <div className="absolute inset-0 skeleton-light dark:skeleton" />
      </div>
      <div className="p-3.5 space-y-2.5">
        <div className="h-3 bg-zinc-200/80 dark:bg-white/8 rounded-full w-3/4" />
        <div className="h-2 bg-zinc-100 dark:bg-white/5 rounded-full w-1/2" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 w-14 bg-zinc-100 dark:bg-white/5 rounded-full" />
          <div className="h-4 w-16 bg-zinc-100 dark:bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/* ─── Explore card ───────────────────────────────────────── */

function ExploreCard({
  card, isSaved, isLiked, onSave, onLike,
}: {
  card: Card
  isSaved: boolean
  isLiked: boolean
  onSave: () => void
  onLike: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={cardReveal}
      className="break-inside-avoid mb-4 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -5, scale: 1.015 } : { y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={[
          'relative rounded-[20px] overflow-hidden',
          'bg-white dark:bg-[#1A1D24]/90 backdrop-blur-sm',
          'border border-[#E8E8E8]/70 dark:border-white/6',
          'shadow-card-light dark:shadow-card-dark',
          hovered ? 'shadow-card-light-hover dark:shadow-card-dark-hover' : '',
          card.trending ? 'ring-1 ring-[#F5C518]/40 dark:ring-[#FF6B35]/20' : '',
        ].join(' ')}
      >
        {/* ── Gradient image area ── */}
        <div
          className={`relative bg-gradient-to-br ${card.gradient} overflow-hidden`}
          style={{ height: card.imgHeight }}
        >
          {/* Subtle noise overlay for texture */}
          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Emoji focal point */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={hovered ? { scale: 1.15 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <span className="text-[72px] drop-shadow-2xl select-none leading-none">
              {card.emoji}
            </span>
          </motion.div>

          {/* Bottom fade for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* ── Top badges row ── */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {card.trending ? (
              <div className="flex items-center gap-1 bg-[#FF6B35] text-white text-[9px] font-black tracking-wider px-2 py-1 rounded-full shadow-lg shadow-orange-500/50 animate-pulse-glow">
                <Flame className="w-2.5 h-2.5" />
                TRENDING
              </div>
            ) : (
              <div />
            )}

            {card.type === 'reel' && card.duration && (
              <div className="flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-1 rounded-full">
                <Play className="w-2 h-2 fill-white" />
                {card.duration}
              </div>
            )}
            {card.type === 'recipe' && card.rating && (
              <div className="flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-1 rounded-full">
                <Star className="w-2 h-2 fill-[#FF6B35] text-[#FF6B35]" />
                {card.rating}
              </div>
            )}
          </div>

          {/* ── Title / time at bottom of image ── */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-semibold text-[13px] leading-snug mb-1 line-clamp-2 drop-shadow-sm">
              {card.title}
            </h3>
            <p className="text-white/60 text-[10px] flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 shrink-0" />
              {card.time}
            </p>
          </div>

          {/* ── Play overlay for reels ── */}
          {card.type === 'reel' && (
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key="play-overlay"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-2xl">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* ── Card body ── */}
        <div className="p-3">
          {/* Creator row + actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--cr-accent) 0%, var(--cr-accent-2) 100%)' }}>
                <ChefHat className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {card.creator}
              </span>
            </div>

            <div className="flex items-center gap-0.5 shrink-0 ml-1">
              <button
                onClick={e => { e.stopPropagation(); onLike() }}
                className={[
                  'p-1.5 rounded-lg transition-colors duration-200',
                  isLiked
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40',
                ].join(' ')}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onSave() }}
                className={[
                  'p-1.5 rounded-lg transition-colors duration-200',
                  isSaved
                    ? 'text-[#F5C518] dark:text-[#e8952a] bg-[#FFFAED] dark:bg-orange-950/40'
                    : 'text-zinc-400 hover:text-[#F5C518] dark:hover:text-[#e8952a] hover:bg-[#FFFAED] dark:hover:bg-orange-950/40',
                ].join(' ')}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[10px] text-zinc-500 dark:text-zinc-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Heart className="w-2.5 h-2.5" />
              {card.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-2.5 h-2.5" />
              {card.views}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {card.tags.map(tag => (
              <span
                key={tag}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5C518]/12 dark:bg-[#FF6B35]/12 text-[#B38B00] dark:text-[#FF6B35]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Friend activity pill */}
          {card.friendActivity && (
            <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 animate-pulse" />
              <p className="text-[10px] text-[#B38B00] dark:text-[#e8952a] font-medium truncate">
                {card.friendActivity}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main component ─────────────────────────────────────── */

export function ExplorePage({ username }: { username?: string }) {
  const [activeTab, setActiveTab]       = useState<Tab>('All')
  const [search, setSearch]             = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [loading, setLoading]           = useState(true)
  const [saved, setSaved]               = useState<Set<number>>(new Set([2]))
  const [liked, setLiked]               = useState<Set<number>>(new Set([1, 5]))

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [])

  const toggleSave = (id: number) =>
    setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const toggleLike = (id: number) =>
    setLiked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const filteredCards = CARDS.filter(card => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      card.title.toLowerCase().includes(q) ||
      card.creator.toLowerCase().includes(q) ||
      card.tags.some(t => t.toLowerCase().includes(q))
    const matchTab =
      activeTab === 'All'        ? true :
      activeTab === 'Reels'      ? card.type === 'reel' :
      activeTab === 'Recipes'    ? card.type === 'recipe' :
      activeTab === 'Trending'   ? !!card.trending :
      activeTab === 'By Friends' ? !!card.friendActivity :
      true
    return matchSearch && matchTab
  })

  const showFriends = (activeTab === 'All' || activeTab === 'By Friends') && !loading

  return (
    <div className="max-w-6xl">

      {/* ── Page title ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-6"
      >
        <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
          Explore
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Discover recipes &amp; reels from the CookReels community
        </p>
      </motion.div>

      {/* ── Floating search bar ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
        className="relative mb-5"
      >
        <div
          className={[
            'relative flex items-center gap-3 px-4 py-3 rounded-2xl',
            'transition-all duration-300 backdrop-blur-md border',
            searchFocused
              ? 'border-[#F5C518]/50 dark:border-[#FF6B35]/50 shadow-lg shadow-[#F5C518]/12 dark:shadow-[#FF6B35]/12 bg-white dark:bg-[#1A1D24]/95'
              : 'border-[#E8E8E8]/80 dark:border-white/8 bg-white dark:bg-[#1A1D24]/80 shadow-sm',
          ].join(' ')}
        >
          <Search
            className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
              searchFocused ? 'text-[#F5C518] dark:text-[#e8952a]' : 'text-zinc-400'
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search recipes, chefs, ingredients…"
            className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setSearch('')}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Warm glow beneath search when focused */}
        <AnimatePresence>
          {searchFocused && (
            <motion.div
              key="glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#F5C518]/15 dark:from-[#FF6B35]/15 to-[#FFD84D]/12 dark:to-[#FFC857]/12 blur-2xl"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Category tabs ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.13, ease: EASE }}
        className="mb-5"
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'relative shrink-0 px-4 py-2 rounded-full text-sm font-semibold',
                'transition-colors duration-200 select-none',
                activeTab === tab
                  ? 'text-[#1A1A1A]'
                  : 'bg-zinc-900 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-700 text-white hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:border-zinc-600 dark:hover:border-zinc-600',
              ].join(' ')}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F5C518] to-[#FFB800] shadow-md shadow-[#F5C518]/35"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Friends activity strip ────────────────────────── */}
      <AnimatePresence mode="wait">
        {showFriends && (
          <motion.div
            key="friends-strip"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.32 }}
          >
            <div className="rounded-2xl bg-gradient-to-r from-[#F5C518]/10 via-[#F5C518]/6 to-[#FFD84D]/5 dark:from-[#FF6B35]/8 dark:to-[#FFC857]/4 border border-[#F5C518]/20 dark:border-[#FF6B35]/14 p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <Users className="w-3.5 h-3.5 text-[#B38B00] dark:text-[#e8952a]" />
                <span className="text-[10px] font-black tracking-widest text-[#B38B00] dark:text-[#FF6B35] uppercase">
                  Friends Activity
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-0.5">
                {FRIENDS_ACTIVITY.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: EASE }}
                    className="shrink-0 flex items-center gap-2 bg-white dark:bg-[#1A1D24]/80 backdrop-blur-sm rounded-xl px-2.5 py-2 border border-[#E8E8E8]/80 dark:border-white/7 shadow-sm hover:shadow-md hover:border-[#F5C518]/35 dark:hover:border-[#f6c68b]/20 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-base leading-none">{f.emoji}</span>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap leading-none mb-0.5">
                        {f.name}{' '}
                        <span className="font-normal text-zinc-500 dark:text-zinc-400">
                          {f.action}
                        </span>
                      </p>
                      <p className="text-[9px] text-[#B38B00] dark:text-[#FF6B35] truncate max-w-[90px]">
                        {f.recipe}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section meta row ──────────────────────────────── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            {activeTab === 'Trending'   && <TrendingUp className="w-3.5 h-3.5 text-[#F5C518] dark:text-[#e8952a]" />}
            {activeTab === 'Recent'     && <Clock      className="w-3.5 h-3.5 text-[#F5C518] dark:text-[#e8952a]" />}
            {activeTab === 'By Friends' && <Users      className="w-3.5 h-3.5 text-[#F5C518] dark:text-[#e8952a]" />}
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {filteredCards.length}
              </span>{' '}
              {activeTab === 'All'
                ? 'posts'
                : activeTab === 'By Friends'
                ? 'from friends'
                : activeTab.toLowerCase()}
            </span>
          </div>

          <button className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-[#F5C518] dark:hover:text-[#FF6B35] transition-colors px-2.5 py-1.5 rounded-xl hover:bg-[#F5C518]/8 dark:hover:bg-[#FF6B35]/10">
            <Filter className="w-3 h-3" />
            Filter
          </button>
        </motion.div>
      )}

      {/* ── Masonry grid ──────────────────────────────────── */}
      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {SKELETON_HEIGHTS.map((h, i) => (
            <SkeletonCard key={i} height={h} />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          <span className="text-6xl mb-4">🍽️</span>
          <p className="font-heading font-bold text-zinc-700 dark:text-zinc-300 text-lg mb-1">
            Nothing found
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Try a different tab or search term
          </p>
        </motion.div>
      ) : (
        <motion.div
          key={`${activeTab}-${search}`}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        >
          {filteredCards.map(card => (
            <ExploreCard
              key={card.id}
              card={card}
              isSaved={saved.has(card.id)}
              isLiked={liked.has(card.id)}
              onSave={() => toggleSave(card.id)}
              onLike={() => toggleLike(card.id)}
            />
          ))}
        </motion.div>
      )}

      {/* ── Bottom breathing room ─────────────────────────── */}
      <div className="h-10" />
    </div>
  )
}
