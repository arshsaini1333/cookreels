'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Play, Heart, Star, Clock, Bookmark, ArrowRight,
  ChefHat, Flame, Edit3, Quote, Plus, TrendingUp, Zap,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

/* ─── Types ───────────────────────────────────────────────── */

interface DashboardCardsProps {
  username?: string
}

/* ─── Animation presets ───────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const heroItem = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay },
})

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 26 },
  },
}

/* ─── Data ────────────────────────────────────────────────── */

const trendingReels = [
  {
    id: 1, title: 'Butter Chicken Masala', creator: 'Arjun S.', likes: '48.2k', duration: '0:58',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
    gradient: 'from-orange-600 to-rose-600',
  },
  {
    id: 2, title: 'Hyderabadi Dum Biryani', creator: 'Priya M.', likes: '31.5k', duration: '1:12',
    image: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=400&q=80',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    id: 3, title: 'Alphonso Mango Lassi', creator: 'Kavitha R.', likes: '27.3k', duration: '0:45',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=400&q=80',
    gradient: 'from-pink-400 to-fuchsia-600',
  },
  {
    id: 4, title: 'Tandoori Raan Masterclass', creator: 'Rohit V.', likes: '19.8k', duration: '2:03',
    image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&q=80',
    gradient: 'from-red-600 to-rose-700',
  },
  {
    id: 5, title: 'Dal Makhani Dhaba Style', creator: 'Meera K.', likes: '14.1k', duration: '1:30',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 6, title: 'Crispy Masala Dosa', creator: 'Ananya I.', likes: '22.6k', duration: '0:55',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400&q=80',
    gradient: 'from-yellow-500 to-amber-600',
  },
]

const categories = [
  { id: 1, name: 'Breakfast',   emoji: '☀️', gradient: 'from-amber-400 to-orange-500',    shadow: 'shadow-amber-400/35'  },
  { id: 2, name: 'Desserts',    emoji: '🍰', gradient: 'from-pink-400 to-rose-500',        shadow: 'shadow-pink-400/35'   },
  { id: 3, name: 'Shakes',      emoji: '🥤', gradient: 'from-cyan-400 to-blue-500',        shadow: 'shadow-cyan-400/35'   },
  { id: 4, name: 'Dinner',      emoji: '🍽️', gradient: 'from-violet-500 to-purple-600',    shadow: 'shadow-violet-400/35' },
  { id: 5, name: 'Spicy',       emoji: '🌶️', gradient: 'from-red-500 to-rose-600',         shadow: 'shadow-red-400/35'    },
  { id: 6, name: 'Snacks',      emoji: '🍿', gradient: 'from-yellow-400 to-amber-500',     shadow: 'shadow-yellow-400/35' },
  { id: 7, name: 'Healthy',     emoji: '🥗', gradient: 'from-green-400 to-emerald-600',    shadow: 'shadow-green-400/35'  },
  { id: 8, name: 'Street Food', emoji: '🌮', gradient: 'from-orange-400 to-amber-600',     shadow: 'shadow-orange-400/35' },
  { id: 9, name: 'Italian',     emoji: '🍕', gradient: 'from-lime-400 to-green-600',       shadow: 'shadow-lime-400/35'   },
  { id: 10, name: 'Quick',      emoji: '⚡', gradient: 'from-sky-400 to-indigo-500',       shadow: 'shadow-sky-400/35'    },
]

const recommended = [
  {
    id: 1, title: 'Paneer Makhani', desc: 'Velvety tomato-cream sauce with soft cottage cheese & fenugreek',
    time: '35 min', rating: 4.9, creator: 'Arjun Sharma', saved: false,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
    gradient: 'from-amber-600 via-orange-500 to-yellow-400', tag: 'Punjabi',
  },
  {
    id: 2, title: 'Hyderabadi Dum Biryani', desc: 'Slow-cooked basmati sealed with dough, saffron & caramelised onions',
    time: '90 min', rating: 4.9, creator: 'Rohit Verma', saved: true,
    image: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=600&q=80',
    gradient: 'from-orange-500 via-amber-400 to-yellow-300', tag: 'Hyderabadi',
  },
  {
    id: 3, title: 'Alphonso Mango Lassi', desc: 'Chilled Alphonso mango blended with hung curd & cardamom',
    time: '10 min', rating: 4.7, creator: 'Priya Mehta', saved: false,
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80',
    gradient: 'from-yellow-400 via-amber-300 to-orange-300', tag: 'Drinks',
  },
  {
    id: 4, title: 'Chettinad Chicken Curry', desc: 'Fiery South Indian curry with freshly stone-ground spices',
    time: '45 min', rating: 4.8, creator: 'Kavitha Reddy', saved: false,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    gradient: 'from-red-600 via-rose-500 to-orange-400', tag: 'South Indian',
  },
  {
    id: 5, title: 'Avocado Poached Toast', desc: 'Sourdough with whipped feta, poached egg & chilli flakes',
    time: '15 min', rating: 4.6, creator: 'Vikram Nair', saved: true,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
    gradient: 'from-amber-500 via-orange-400 to-yellow-300', tag: 'Breakfast',
  },
  {
    id: 6, title: 'Choco Lava Cake', desc: 'Warm chocolate cake with molten centre & vanilla ice cream',
    time: '20 min', rating: 5.0, creator: 'Deepa Patel', saved: false,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80',
    gradient: 'from-rose-600 via-pink-500 to-fuchsia-400', tag: 'Desserts',
  },
]

const cookingQuotes = [
  'Masala is the soul of Indian cooking.',
  'Every spice carries a thousand-year story.',
  'Good biryani needs patience, not shortcuts.',
  'In India, food is love served on a thali.',
  'The secret? Slow cook and trust the process.',
  'Ghee makes everything better — always.',
]

const quoteImages = [
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=480&q=80',
  'https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=480&q=80',
  'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=480&q=80',
  'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=480&q=80',
  'https://images.unsplash.com/photo-1728910156510-77488f19b152?w=480&q=80',
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=480&q=80',
]

const savedCollections = [
  { id: 1, title: 'Weeknight Dinners', count: 12, gradient: 'from-violet-500 to-purple-600', emoji: '🍽️' },
  { id: 2, title: 'Dessert Goals',     count: 8,  gradient: 'from-pink-400 to-rose-500',     emoji: '🍰' },
  { id: 3, title: 'Healthy & Light',   count: 15, gradient: 'from-emerald-400 to-teal-500',  emoji: '🥗' },
]

const spotlightDishes = [
  { emoji: '🍛', name: 'Butter Chicken', cuisine: 'Punjabi',     time: '40 min', tip: 'Marinate overnight for deep flavour.' },
  { emoji: '🍚', name: 'Dum Biryani',    cuisine: 'Hyderabadi',  time: '90 min', tip: 'Seal the pot with dough — dum is everything.' },
  { emoji: '🥞', name: 'Masala Dosa',   cuisine: 'South Indian', time: '30 min', tip: 'Ferment the batter 12 hrs for the tang.' },
  { emoji: '🫕', name: 'Dal Makhani',   cuisine: 'Punjabi',      time: '6 hrs',  tip: 'Slow cook on a tawa overnight.' },
]

/* ─── Section Title ───────────────────────────────────────── */

function SectionTitle({ label, sub }: { label: string; sub?: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2
          className="font-heading text-xl sm:text-2xl font-black tracking-tight"
          style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}
        >
          {label}
        </h2>
        {sub && (
          <p className="text-sm mt-0.5" style={{ color: isDark ? '#71717A' : '#9CA3AF' }}>
            {sub}
          </p>
        )}
      </div>
      <button
        className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
        style={{ color: 'var(--cr-accent)' }}
      >
        See all <ArrowRight size={12} />
      </button>
    </div>
  )
}

/* ─── Hero Section ────────────────────────────────────────── */

function HeroSection({ username }: { username: string }) {
  const [greeting, setGreeting] = useState('Good Morning')
  const [spotIdx, setSpotIdx] = useState(0)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening')
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSpotIdx(i => (i + 1) % spotlightDishes.length), 3200)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[28px]"
      style={{ minHeight: 220 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=75)',
        }}
      />
      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/58 to-black/28" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      {/* Warm yellow tint */}
      <div className="absolute inset-0" style={{ background: 'rgba(245,197,24,0.04)' }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none dot-grid text-white"
        style={{ backgroundSize: '28px 28px' }}
      />

      {/* Top yellow accent bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5C518]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-8 p-6 sm:p-8">
        <div className="flex-1 min-w-0 max-w-lg">
          {/* Greeting pill */}
          <motion.div
            {...heroItem(0)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-5"
          >
            <span className="text-sm">👋</span>
            <span className="text-xs font-semibold text-white/90">
              {greeting}, {username}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            {...heroItem(0.08)}
            className="font-heading text-3xl sm:text-4xl xl:text-[44px] font-black text-white tracking-tight leading-[1.15]"
          >
            Cook Something{' '}
            <span
              className="animate-gradient-x bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #F5C518, #FFD84D, #FF9F1C, #F5C518)',
                backgroundSize: '200% 100%',
              }}
            >
              Amazing
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...heroItem(0.15)}
            className="mt-3 text-sm sm:text-base font-medium text-white/60 leading-relaxed"
          >
            Short recipes · Big flavors · Endless inspiration
          </motion.p>

          {/* Stats row */}
          <motion.div {...heroItem(0.2)} className="flex items-center gap-4 mt-4">
            {[
              { icon: TrendingUp, val: '12.4k', label: 'Creators' },
              { icon: Flame,      val: '340+',  label: 'Reels today' },
              { icon: Zap,        val: '2.8k+', label: 'Recipes' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={12} className="text-[#F5C518] flex-shrink-0" />
                <span className="text-xs font-bold text-white">{val}</span>
                <span className="text-xs text-white/45 hidden sm:inline">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div {...heroItem(0.25)} className="mt-6 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-[#1A1A1A]"
              style={{
                background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
                boxShadow: '0 8px 24px rgba(245,197,24,0.40)',
              }}
            >
              <Flame size={15} />
              Explore Reels
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ArrowRight size={14} />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white/12 text-white border border-white/22 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
            >
              <Plus size={14} />
              New Reel
            </motion.button>
          </motion.div>
        </div>

        {/* Recipe Spotlight */}
        <motion.div
          {...heroItem(0.3)}
          className="hidden md:flex flex-col w-44 xl:w-48 flex-shrink-0"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2.5">
            Recipe Spotlight
          </p>

          <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-black/35 backdrop-blur-xl shadow-2xl">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#F5C518] to-[#FF9F1C]" />

            <div className="flex items-center justify-center h-20 bg-gradient-to-b from-white/5 to-transparent text-5xl select-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={spotIdx + '-emoji'}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {spotlightDishes[spotIdx].emoji}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="px-3 pb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={spotIdx + '-info'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p className="font-heading text-sm font-bold text-white leading-snug">
                    {spotlightDishes[spotIdx].name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5C518]/20 text-[#F5C518] font-semibold">
                      {spotlightDishes[spotIdx].cuisine}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 font-medium flex items-center gap-1">
                      <Clock size={9} />
                      {spotlightDishes[spotIdx].time}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-2 leading-relaxed italic">
                    &ldquo;{spotlightDishes[spotIdx].tip}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {spotlightDishes.map((_, i) => (
              <button
                key={i}
                onClick={() => setSpotIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === spotIdx ? 16 : 5,
                  height: 5,
                  background: i === spotIdx ? '#F5C518' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

/* ─── Trending Reels ──────────────────────────────────────── */

function TrendingReels() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <SectionTitle label="Trending Reels" sub="What the community is watching right now" />

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none [scroll-snap-type:x_mandatory]">
        {trendingReels.map((reel, i) => (
          <motion.div
            key={reel.id}
            variants={cardReveal}
            custom={i}
            whileHover={{ y: -7, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="relative flex-shrink-0 w-36 sm:w-40 rounded-[20px] overflow-hidden cursor-pointer group [scroll-snap-align:start]"
            style={{
              aspectRatio: '9/15',
              boxShadow: isDark
                ? '0 4px 24px rgba(0,0,0,0.50), 0 0 0 1px rgba(52,52,56,0.70)'
                : '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(232,232,232,0.60)',
            }}
          >
            {/* Food photo */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${reel.image})` }}
            />
            {/* Gradient fallback & overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient} opacity-40`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

            {/* Inner border */}
            <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <motion.div
                initial={{ scale: 0.7 }}
                whileHover={{ scale: 1 }}
                className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center"
              >
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </motion.div>
            </div>

            {/* Duration badge */}
            <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/45 backdrop-blur-sm text-[9px] text-white font-bold">
              {reel.duration}
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 inset-x-0 p-3">
              <p className="text-xs font-bold text-white leading-tight line-clamp-2 mb-1">{reel.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/65">{reel.creator}</span>
                <div className="flex items-center gap-1">
                  <Heart size={10} className="text-rose-300" fill="currentColor" />
                  <span className="text-[10px] text-white/75">{reel.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Browse Categories ───────────────────────────────────── */

function BrowseCategories() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [active, setActive] = useState<number | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <SectionTitle label="Browse Categories" sub="Find recipes by what you're craving" />

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none [scroll-snap-type:x_mandatory]">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            variants={cardReveal}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActive(active === cat.id ? null : cat.id)}
            className={`relative flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-2xl cursor-pointer [scroll-snap-align:start] transition-all duration-200 ${
              active === cat.id
                ? 'ring-2 ring-offset-2 ring-[#F5C518]'
                : ''
            }`}
            style={{
              ringOffsetColor: isDark ? '#1E1E1F' : '#F5F5F5',
            } as React.CSSProperties}
          >
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.gradient} transition-opacity shadow-lg ${cat.shadow}`}
              style={{ opacity: active === cat.id ? 1 : 0.9 }}
            />
            <span className="relative z-10 text-2xl select-none drop-shadow-md">{cat.emoji}</span>
            <span className="relative z-10 text-xs font-bold text-white whitespace-nowrap tracking-wide drop-shadow-sm">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Recommended For You ─────────────────────────────────── */

function RecommendedSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [saved, setSaved] = useState<Set<number>>(
    new Set(recommended.filter(r => r.saved).map(r => r.id))
  )
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <SectionTitle label="Recommended For You" sub="Curated picks based on your taste" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {recommended.map((recipe, i) => (
          <motion.article
            key={recipe.id}
            variants={cardReveal}
            custom={i}
            whileHover={{ y: -7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="group rounded-[24px] overflow-hidden cursor-pointer transition-shadow duration-300"
            style={{
              background: isDark ? '#2B2B2D' : '#FFFFFF',
              border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
              boxShadow: isDark
                ? '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,52,56,0.80)'
                : '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.boxShadow = isDark
                ? '0 8px 40px rgba(0,0,0,0.60), 0 0 0 1px rgba(245,197,24,0.18), 0 0 32px rgba(245,197,24,0.06)'
                : '0 8px 24px rgba(0,0,0,0.09), 0 24px 48px rgba(0,0,0,0.07), 0 0 0 1px rgba(245,197,24,0.12)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.boxShadow = isDark
                ? '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,52,56,0.80)'
                : '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)'
            }}
          >
            {/* Image area */}
            <div className="relative h-48 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${recipe.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${recipe.gradient} opacity-25`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Cuisine tag */}
              <div className="absolute top-3 left-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#1A1A1A]"
                  style={{
                    background: 'rgba(245,197,24,0.90)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {recipe.tag}
                </span>
              </div>

              {/* Save button */}
              <motion.button
                whileTap={{ scale: 0.86 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSaved(prev => {
                    const next = new Set(prev)
                    next.has(recipe.id) ? next.delete(recipe.id) : next.add(recipe.id)
                    return next
                  })
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200"
                style={saved.has(recipe.id)
                  ? { background: '#7DBB91', boxShadow: '0 4px 12px rgba(125,187,145,0.40)' }
                  : { background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)' }
                }
              >
                <Bookmark
                  size={15}
                  className="text-white"
                  fill={saved.has(recipe.id) ? 'currentColor' : 'none'}
                />
              </motion.button>

              {/* Time badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm">
                <Clock size={10} className="text-white/80" />
                <span className="text-[10px] text-white font-semibold">{recipe.time}</span>
              </div>
            </div>

            {/* Card body */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3
                  className="text-sm font-bold leading-snug line-clamp-1 transition-colors group-hover:text-[#F5C518]"
                  style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}
                >
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star size={12} style={{ fill: '#F5C518', stroke: '#F5C518' }} />
                  <span className="text-xs font-bold" style={{ color: isDark ? '#A1A1AA' : '#666666' }}>
                    {recipe.rating}
                  </span>
                </div>
              </div>

              <p
                className="text-xs leading-relaxed line-clamp-2 mb-3"
                style={{ color: isDark ? '#71717A' : '#9CA3AF' }}
              >
                {recipe.desc}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)' }}
                  >
                    <ChefHat size={11} className="text-[#1A1A1A]" />
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: isDark ? '#A1A1AA' : '#666666' }}
                  >
                    {recipe.creator}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200"
                  style={{
                    color: '#F5C518',
                    borderColor: 'rgba(245,197,24,0.28)',
                    background: 'rgba(245,197,24,0.09)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = '#F5C518'
                    el.style.borderColor = '#F5C518'
                    el.style.color = '#1A1A1A'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'rgba(245,197,24,0.09)'
                    el.style.borderColor = 'rgba(245,197,24,0.28)'
                    el.style.color = '#F5C518'
                  }}
                >
                  View Recipe
                </motion.button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Profile Card ────────────────────────────────────────── */

function ProfileCard({ username }: { username: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
      className="relative rounded-[24px] overflow-hidden backdrop-blur-xl p-5"
      style={{
        background: isDark ? '#2B2B2D' : '#FFFFFF',
        border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,52,56,0.80)'
          : '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)',
      }}
    >
      {/* Header accent */}
      <div
        className="absolute top-0 inset-x-0 h-24"
        style={{ background: 'linear-gradient(160deg, rgba(245,197,24,0.07) 0%, transparent 100%)' }}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="w-16 h-16 rounded-full mb-3 flex items-center justify-center shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
            boxShadow: `0 8px 24px rgba(245,197,24,0.35), 0 0 0 4px ${isDark ? '#2B2B2D' : '#FFFFFF'}`,
          }}
        >
          <ChefHat size={28} className="text-[#1A1A1A]" strokeWidth={1.8} />
        </motion.div>

        <h3 className="text-sm font-black" style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}>
          {username}
        </h3>
        <p className="text-xs mt-0.5 mb-4" style={{ color: isDark ? '#71717A' : '#9CA3AF' }}>
          Passionate home cook ✨
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          {[
            { val: '284', label: 'Posts' },
            { val: '12.4k', label: 'Followers' },
            { val: '193', label: 'Following' },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="flex flex-col items-center p-2 rounded-xl"
              style={{
                background: isDark ? 'rgba(52,52,56,0.50)' : '#FFF3BF',
                border: `1px solid ${isDark ? '#343438' : 'rgba(245,197,24,0.18)'}`,
              }}
            >
              <span className="text-sm font-black" style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}>
                {val}
              </span>
              <span className="text-[10px]" style={{ color: isDark ? '#71717A' : '#9CA3AF' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Edit profile */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: isDark ? 'rgba(52,52,56,0.50)' : '#F3F4F6',
            border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
            color: isDark ? '#A1A1AA' : '#666666',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'rgba(245,197,24,0.45)'
            el.style.color = '#F5C518'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = isDark ? '#343438' : '#E8E8E8'
            el.style.color = isDark ? '#A1A1AA' : '#666666'
          }}
        >
          <Edit3 size={12} />
          Edit Profile
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── Saved Collections ───────────────────────────────────── */

function SavedCollections() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.25, ease: EASE }}
      className="rounded-[24px] backdrop-blur-xl p-5"
      style={{
        background: isDark ? '#2B2B2D' : '#FFFFFF',
        border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,52,56,0.80)'
          : '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(125,187,145,0.15)' }}
          >
            <Bookmark size={13} style={{ color: '#7DBB91' }} />
          </div>
          <h4 className="text-sm font-bold" style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}>
            Saved
          </h4>
        </div>
        <button
          className="text-[10px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'var(--cr-accent)' }}
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {savedCollections.map((col) => (
          <motion.div
            key={col.id}
            whileHover={{ x: 3 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors duration-150"
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.background = isDark ? 'rgba(52,52,56,0.50)' : '#FFF3BF'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.background = 'transparent'
            }}
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${col.gradient} flex-shrink-0 flex items-center justify-center text-lg shadow-sm`}
            >
              {col.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: isDark ? '#A1A1AA' : '#666666' }}
              >
                {col.title}
              </p>
              <p className="text-[10px]" style={{ color: isDark ? '#52525B' : '#9CA3AF' }}>
                {col.count} recipes
              </p>
            </div>
            <ArrowRight size={12} style={{ color: isDark ? '#52525B' : '#D1D5DB' }} className="flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Quote Card ──────────────────────────────────────────── */

function QuoteCard() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(Math.floor(Math.random() * cookingQuotes.length))
  }, [])

  useEffect(() => {
    quoteImages.forEach(src => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  const imgSrc = quoteImages[idx % quoteImages.length]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
      onClick={() => setIdx(i => (i + 1) % cookingQuotes.length)}
      className="relative rounded-[24px] overflow-hidden cursor-pointer min-h-[172px] group"
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.20)',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={imgSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/62 group-hover:bg-black/52 transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      {/* Yellow quote accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#F5C518]/60 to-transparent" />

      <div className="absolute top-4 left-4 opacity-50" style={{ color: '#F5C518' }}>
        <Quote size={22} />
      </div>

      <div className="relative z-10 p-5 pt-11 flex flex-col gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-[14px] font-semibold text-white leading-relaxed italic"
          >
            &ldquo;{cookingQuotes[idx]}&rdquo;
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-white/45 font-medium">Tap for another quote ✨</p>
      </div>
    </motion.div>
  )
}

/* ─── Right Sidebar ───────────────────────────────────────── */

function RightSidebar({ username }: { username: string }) {
  return (
    <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
      <div className="sticky top-6 space-y-4">
        <ProfileCard username={username} />
        <SavedCollections />
        <QuoteCard />
      </div>
    </aside>
  )
}

/* ─── Main export ─────────────────────────────────────────── */

export function DashboardCards({ username = 'Chef' }: DashboardCardsProps) {
  return (
    <div className="flex gap-5 xl:gap-7 pb-8">
      <div className="flex-1 min-w-0 space-y-10">
        <HeroSection username={username} />
        <TrendingReels />
        <BrowseCategories />
        <RecommendedSection />
      </div>
      <RightSidebar username={username} />
    </div>
  )
}
