'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Play, Heart, Star, Clock, Bookmark, ArrowRight,
  ChefHat, Flame, Edit3, Quote, Plus,
} from 'lucide-react'

/* ─── Props ──── */

interface DashboardCardsProps {
  username?: string
}

/* ─── Animation variants ──────*/

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
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 26 },
  },
}

/* ─── Data ──── */

const trendingReels = [
  { id: 1, title: 'Butter Chicken Masala', creator: 'Arjun S.', likes: '48.2k', duration: '0:58', emoji: '🍛', gradient: 'from-orange-500 to-rose-500' },
  { id: 2, title: 'Hyderabadi Dum Biryani', creator: 'Priya M.', likes: '31.5k', duration: '1:12', emoji: '🍚', gradient: 'from-amber-500 to-orange-600' },
  { id: 3, title: 'Alphonso Mango Shrikhand', creator: 'Kavitha R.', likes: '27.3k', duration: '0:45', emoji: '🥭', gradient: 'from-pink-400 to-fuchsia-600' },
  { id: 4, title: 'Tandoori Raan Masterclass', creator: 'Rohit V.', likes: '19.8k', duration: '2:03', emoji: '🍖', gradient: 'from-red-500 to-rose-600' },
  { id: 5, title: 'Dal Makhani — Dhaba Style', creator: 'Meera K.', likes: '14.1k', duration: '1:30', emoji: '🫕', gradient: 'from-emerald-400 to-teal-600' },
  { id: 6, title: 'Crispy Masala Dosa', creator: 'Ananya I.', likes: '22.6k', duration: '0:55', emoji: '🥞', gradient: 'from-yellow-400 to-amber-500' },
]

const categories = [
  { id: 1, name: 'Breakfast', emoji: '☀️', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-400/30' },
  { id: 2, name: 'Sweet Dish', emoji: '🍰', gradient: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-400/30' },
  { id: 3, name: 'Shakes', emoji: '🥤', gradient: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-400/30' },
  { id: 4, name: 'Dinner', emoji: '🍽️', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' },
  { id: 5, name: 'Spicy', emoji: '🌶️', gradient: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/30' },
  { id: 6, name: 'Snacks', emoji: '🍿', gradient: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-400/30' },
  { id: 7, name: 'Healthy', emoji: '🥗', gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-400/30' },
  { id: 8, name: 'Street Food', emoji: '🌮', gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-400/30' },
  { id: 9, name: 'Desserts', emoji: '🍨', gradient: 'from-pink-500 to-purple-500', shadow: 'shadow-pink-500/30' },
  { id: 10, name: 'Quick Meals', emoji: '⚡', gradient: 'from-sky-400 to-indigo-500', shadow: 'shadow-sky-400/30' },
]

const recommended = [
  {
    id: 1, title: 'Paneer Makhani', desc: 'Velvety tomato-cream sauce with soft cottage cheese & fenugreek', time: '35 min',
    rating: 4.9, creator: 'Arjun Sharma', saved: false,
    gradient: 'from-amber-600 via-orange-500 to-yellow-400', emoji: '🧀',
  },
  {
    id: 2, title: 'Hyderabadi Dum Biryani', desc: 'Slow-cooked basmati sealed with dough, saffron & caramelised onions', time: '90 min',
    rating: 4.9, creator: 'Rohit Verma', saved: true,
    gradient: 'from-orange-500 via-amber-400 to-yellow-300', emoji: '🍚',
  },
  {
    id: 3, title: 'Alphonso Mango Lassi', desc: 'Chilled Alphonso mango blended with hung curd & cardamom', time: '10 min',
    rating: 4.7, creator: 'Priya Mehta', saved: false,
    gradient: 'from-yellow-400 via-amber-300 to-orange-300', emoji: '🥭',
  },
  {
    id: 4, title: 'Chettinad Chicken Curry', desc: 'Fiery South Indian curry with freshly stone-ground spices', time: '45 min',
    rating: 4.8, creator: 'Kavitha Reddy', saved: false,
    gradient: 'from-red-600 via-rose-500 to-orange-400', emoji: '🍛',
  },
  {
    id: 5, title: 'Masala Chai French Toast', desc: 'Brioche soaked in spiced chai custard, pan-caramelised golden', time: '15 min',
    rating: 4.6, creator: 'Vikram Nair', saved: true,
    gradient: 'from-amber-500 via-orange-400 to-yellow-300', emoji: '🫖',
  },
  {
    id: 6, title: 'Gulab Jamun Lava Cake', desc: 'Warm rose-syrup molten centre with saffron rabri ice cream', time: '25 min',
    rating: 5.0, creator: 'Deepa Patel', saved: false,
    gradient: 'from-rose-600 via-pink-500 to-fuchsia-400', emoji: '🍮',
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
  { id: 1, title: 'Weeknight Dinners', count: 12, gradient: 'from-violet-500 to-purple-600' },
  { id: 2, title: 'Dessert Goals', count: 8, gradient: 'from-pink-400 to-rose-500' },
  { id: 3, title: 'Healthy & Light', count: 15, gradient: 'from-emerald-400 to-teal-500' },
]

/* ─── Section Title ──────────────────────────────────────── */

function SectionTitle({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
          {label}
        </h2>
        {sub && <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>}
      </div>
      <button
        className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
        style={{ color: '#f6c68b' }}
      >
        See all <ArrowRight size={12} />
      </button>
    </div>
  )
}

/* ─── Hero Highlights panel ──────────────────────────────── */

const spotlightDishes = [
  { emoji: '🍛', name: 'Butter Chicken', cuisine: 'Punjabi', time: '40 min', tip: 'Marinate overnight for deep flavour.' },
  { emoji: '🍚', name: 'Dum Biryani', cuisine: 'Hyderabadi', time: '90 min', tip: 'Seal the pot with dough — dum is everything.' },
  { emoji: '🥞', name: 'Masala Dosa', cuisine: 'South Indian', time: '30 min', tip: 'Ferment the batter 12 hrs for the tang.' },
  { emoji: '🫕', name: 'Dal Makhani', cuisine: 'Punjabi', time: '6 hrs', tip: 'Slow cook on a tawa overnight.' },
]

/* ─── Hero Section ── */

function HeroSection({ username }: { username: string }) {
  const [greeting, setGreeting] = useState('Good Morning')
  const [spotIdx, setSpotIdx] = useState(0)

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good Morning')
    else if (h < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSpotIdx(i => (i + 1) % spotlightDishes.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f6c68b]/12 to-[#f6c68b]/4 dark:from-[#f6c68b]/10 dark:to-[#f6c68b]/3 border border-[#f6c68b]/20 dark:border-[#f6c68b]/15 p-5 sm:p-7"
    >
      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #f6c68b 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

      {/* Blurred blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#f6c68b]/15 dark:bg-[#f6c68b]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-[#f6c68b]/8 dark:bg-[#f6c68b]/5 blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-8">
        <div className="flex-1 min-w-0 max-w-lg">
          {/* Greeting pill */}
          <motion.div
            {...heroItem(0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6c68b]/15 dark:bg-[#f6c68b]/12 border border-[#f6c68b]/25 dark:border-[#f6c68b]/20 mb-4"
          >
            <span className="text-sm">👋</span>
            <span className="text-xs font-semibold" style={{ color: '#c48a3a' }}>
              <span className="dark:hidden">{greeting}, {username}</span>
              <span className="hidden dark:inline" style={{ color: '#f6c68b' }}>{greeting}, {username}</span>
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            {...heroItem(0.08)}
            className="font-heading text-3xl sm:text-4xl xl:text-5xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight"
            style={{ lineHeight: '58px', letterSpacing: '1px' }}
          >
            Cook Something{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #f6c68b 0%, #c48a3a 100%)' }}
            >
              Amazing
            </span>{' '}
            Today
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...heroItem(0.16)}
            className="mt-4 text-sm sm:text-base leading-none font-medium tracking-wide"
          >
            <span className="text-zinc-500 dark:text-zinc-400">Short recipes</span>
            <span className="mx-2" style={{ color: '#f6c68b' }}>·</span>
            <span className="text-zinc-800 dark:text-zinc-100 font-bold italic">Big Flavors</span>
            <span className="mx-2" style={{ color: '#f6c68b' }}>·</span>
            <span className="text-zinc-500 dark:text-zinc-400">Endless Inspiration</span>
          </motion.p>

          {/* CTA */}
          <motion.div {...heroItem(0.24)} className="mt-7 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg animate-pulse-glow transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #f6c68b 0%, #e8952a 100%)',
                boxShadow: '0 8px 24px rgba(246,198,139,0.40)',
              }}
            >
              <Flame size={16} />
              Explore Reels
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                <ArrowRight size={15} />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus size={15} />
              New Reel
            </motion.button>
          </motion.div>
        </div>

        {/* Recipe Spotlight */}
        <motion.div
          {...heroItem(0.28)}
          className="hidden md:flex flex-col w-44 xl:w-48 flex-shrink-0"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2.5">
            Recipe Spotlight
          </p>

          <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg">
            {/* Amber top strip */}
            <div className="h-[2px] w-full bg-gradient-to-r from-[#f6c68b] to-[#e8952a]" />

            {/* Emoji hero area */}
            <div className="flex items-center justify-center h-20 bg-gradient-to-b from-[#f6c68b]/10 to-transparent text-5xl select-none">
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

            {/* Info */}
            <div className="px-3 pb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={spotIdx + '-info'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p className="font-heading text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
                    {spotlightDishes[spotIdx].name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f6c68b]/15 text-[#c48a3a] dark:text-[#f6c68b] font-semibold">
                      {spotlightDishes[spotIdx].cuisine}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
                      <Clock size={9} />
                      {spotlightDishes[spotIdx].time}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed italic">
                    &ldquo;{spotlightDishes[spotIdx].tip}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {spotlightDishes.map((_, i) => (
              <button
                key={i}
                onClick={() => setSpotIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === spotIdx ? 16 : 5,
                  height: 5,
                  background: i === spotIdx ? '#f6c68b' : '#d4d4d8',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

    </motion.section>
  )
}

/* ─── Trending Reels ─────────────────────────────────────── */

function TrendingReels() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <SectionTitle label="Trending Reels" sub="What the community is watching right now" />

      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden">
        {trendingReels.map((reel, i) => (
          <motion.div
            key={reel.id}
            variants={cardReveal}
            custom={i * 0.06}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative flex-shrink-0 w-36 sm:w-40 rounded-2xl overflow-hidden cursor-pointer group aspect-[9/15] shadow-lg hover:shadow-2xl [scroll-snap-align:start] transition-shadow duration-300"
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`} />
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

            {/* Emoji center */}
            <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
              {reel.emoji}
            </div>

            {/* Play overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <motion.div
                initial={{ scale: 0.7 }}
                whileHover={{ scale: 1 }}
                className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center"
              >
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </motion.div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <p className="text-xs font-bold text-white leading-tight line-clamp-2">{reel.title}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-white/75">{reel.creator}</span>
                <div className="flex items-center gap-1">
                  <Heart size={10} className="text-rose-300" fill="currentColor" />
                  <span className="text-[10px] text-white/80">{reel.likes}</span>
                </div>
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[9px] text-white font-semibold">
              {reel.duration}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Browse Categories ──────────────────────────────────── */

function BrowseCategories() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [active, setActive] = useState<number | null>(null)

  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <SectionTitle label="Browse Categories" sub="Find recipes by what you're craving" />

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            variants={cardReveal}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActive(active === cat.id ? null : cat.id)}
            className={`relative flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-2xl cursor-pointer [scroll-snap-align:start] transition-all duration-200 ${active === cat.id ? 'ring-2 ring-offset-1 ring-[#f6c68b] dark:ring-offset-zinc-950' : ''}`}
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.gradient} transition-opacity`}
              style={{ opacity: active === cat.id ? 1 : 0.88 }} />

            {/* Glow on hover */}
            <div className={`absolute inset-0 rounded-2xl ${cat.shadow} blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

            <span className="relative z-10 text-2xl select-none">{cat.emoji}</span>
            <span className="relative z-10 text-xs font-bold text-white whitespace-nowrap drop-shadow-sm">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}

/* ─── Recommended For You ────────────────────────────────── */

function RecommendedSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [saved, setSaved] = useState<Set<number>>(new Set(recommended.filter(r => r.saved).map(r => r.id)))

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
            custom={i * 0.07}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="group rounded-3xl overflow-hidden cursor-pointer bg-white dark:bg-zinc-800/70 border border-zinc-100/80 dark:border-zinc-700/40 shadow-md hover:shadow-xl hover:shadow-zinc-300/40 dark:hover:shadow-black/40 transition-shadow duration-300"
          >
            {/* Image / gradient area */}
            <div className="relative h-44 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${recipe.gradient} group-hover:scale-105 transition-transform duration-500`} />
              {/* Texture */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <span className="absolute inset-0 flex items-center justify-center text-6xl select-none">
                {recipe.emoji}
              </span>

              {/* Save button */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSaved(prev => {
                    const next = new Set(prev)
                    next.has(recipe.id) ? next.delete(recipe.id) : next.add(recipe.id)
                    return next
                  })
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${saved.has(recipe.id) ? 'bg-[#f6c68b] shadow-lg shadow-[#f6c68b]/40' : 'bg-white/25 border border-white/40 hover:bg-white/40'}`}
              >
                <Bookmark
                  size={14}
                  className={saved.has(recipe.id) ? 'text-stone-800' : 'text-white'}
                  fill={saved.has(recipe.id) ? 'currentColor' : 'none'}
                />
              </motion.button>

              {/* Time badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                <Clock size={11} className="text-white/80" />
                <span className="text-[10px] text-white font-semibold">{recipe.time}</span>
              </div>
            </div>

            {/* Card body */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-1 group-hover:text-[#c48a3a] dark:group-hover:text-[#f6c68b] transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star size={12} style={{ color: '#f6c68b' }} fill="#f6c68b" />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{recipe.rating}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                {recipe.desc}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f6c68b] to-orange-500 flex items-center justify-center">
                    <ChefHat size={11} className="text-white" />
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{recipe.creator}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-[#f6c68b]/12 text-[#c48a3a] dark:bg-[#f6c68b]/10 dark:text-[#f6c68b] border border-[#f6c68b]/25 hover:bg-[#f6c68b] hover:text-stone-900 transition-all duration-200"
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

/* ─── Profile Card (sidebar) ─────────────────────────────── */

function ProfileCard({ username }: { username: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-white/60 dark:border-zinc-700/40 shadow-xl shadow-zinc-200/40 dark:shadow-black/30 p-5"
    >
      {/* Header gradient */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-br from-[#f6c68b]/25 via-orange-500/10 to-rose-500/10 dark:from-[#f6c68b]/15" />

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-16 h-16 rounded-full mb-3 bg-gradient-to-br from-[#f6c68b] to-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/30 ring-4 ring-white dark:ring-zinc-800"
        >
          <ChefHat size={28} className="text-white" strokeWidth={1.8} />
        </motion.div>

        <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200">{username}</h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 mb-4">
          Passionate home cook ✨
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          {[
            { val: '284', label: 'Posts' },
            { val: '12.4k', label: 'Followers' },
            { val: '193', label: 'Following' },
          ].map(({ val, label }) => (
            <div key={label}
              className="flex flex-col items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-700/50">
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{val}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Edit profile button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-600/40 hover:border-[#f6c68b]/40 hover:text-[#c48a3a] dark:hover:text-[#f6c68b] transition-all duration-200"
        >
          <Edit3 size={12} />
          Edit Profile
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── Saved Collections (sidebar) ───────────────────────── */

function SavedCollections() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-white/60 dark:border-zinc-700/40 shadow-xl shadow-zinc-200/40 dark:shadow-black/30 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#f6c68b]/15 flex items-center justify-center">
            <Bookmark size={13} style={{ color: '#f6c68b' }} />
          </div>
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Saved</h4>
        </div>
        <button className="text-[10px] font-semibold transition-opacity hover:opacity-70" style={{ color: '#f6c68b' }}>
          View all
        </button>
      </div>

      <div className="space-y-2.5">
        {savedCollections.map((col) => (
          <motion.div
            key={col.id}
            whileHover={{ x: 3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/40 transition-colors duration-150"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${col.gradient} flex-shrink-0 shadow-sm`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{col.title}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{col.count} recipes</p>
            </div>
            <ArrowRight size={13} className="text-zinc-300 dark:text-zinc-600 flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Quote Card (sidebar) ───────────────────────────────── */

function QuoteCard() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(Math.floor(Math.random() * cookingQuotes.length))
  }, [])

  /* Preload every image once on mount so they're cached before the user taps */
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
      transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setIdx(i => (i + 1) % cookingQuotes.length)}
      className="relative rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-zinc-200/40 dark:shadow-black/40 min-h-[168px] group"
    >
      {/* Background food image — key on idx so image & quote swap together */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={imgSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/58 group-hover:bg-black/48 transition-colors duration-300" />

      {/* Quote icon */}
      <div className="absolute top-4 left-4 opacity-50">
        <Quote size={22} className="text-white" />
      </div>

      <div className="relative z-10 p-5 pt-11 flex flex-col gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-[15px] font-semibold text-white leading-relaxed italic"
          >
            &ldquo;{cookingQuotes[idx]}&rdquo;
          </motion.p>
        </AnimatePresence>

        <p className="text-xs text-white/55 font-medium">Tap for another quote ✨</p>
      </div>
    </motion.div>
  )
}

/* ─── Right Sidebar ──────────────────────────────────────── */

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

/* ─── Main export ────────────────────────────────────────── */

export function DashboardCards({ username = 'Chef' }: DashboardCardsProps) {
  return (
    <div className="flex gap-5 xl:gap-7 pb-8">
      {/* Main 80% */}
      <div className="flex-1 min-w-0 space-y-10">
        <HeroSection username={username} />
        <TrendingReels />
        <BrowseCategories />
        <RecommendedSection />
      </div>

      {/* Right sidebar 20% */}
      <RightSidebar username={username} />
    </div>
  )
}
