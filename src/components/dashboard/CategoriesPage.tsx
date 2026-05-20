'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  Search, SlidersHorizontal, Bookmark, Heart, Play, Clock,
  Star, ChevronLeft, ChevronRight, ArrowRight, Flame, Zap,
  TrendingUp, Users, Hash, Plus, X, ChevronDown,
  Camera, Utensils, Eye, MessageCircle,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

/* ─── Types ───── */

interface Recipe {
  id: number
  title: string
  description: string
  image: string
  cuisine: string
  time: string
  calories: number
  rating: number
  ratingCount: number
  creator: string
  creatorEmoji: string
  tags: string[]
  isVeg: boolean
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface Reel {
  id: number
  title: string
  thumbnail: string
  creator: string
  creatorEmoji: string
  likes: string
  comments: string
  duration: string
  views: string
  trending: boolean
  gradient: string
  emoji: string
}

/* ─── Animation Variants ─────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay },
})

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
}

/* ─── Static Data ────────────────────────────────────────────── */

const CATEGORY_TABS = [
  { id: 'all',          label: 'All',          emoji: '✨' },
  { id: 'breakfast',    label: 'Breakfast',    emoji: '🍳' },
  { id: 'lunch',        label: 'Lunch',        emoji: '🍱' },
  { id: 'dinner',       label: 'Dinner',       emoji: '🍽️' },
  { id: 'snacks',       label: 'Snacks',       emoji: '🍿' },
  { id: 'healthy',      label: 'Healthy',      emoji: '🥗' },
  { id: 'desserts',     label: 'Desserts',     emoji: '🍰' },
  { id: 'drinks',       label: 'Drinks',       emoji: '🥤' },
  { id: 'italian',      label: 'Italian',      emoji: '🍕' },
  { id: 'street-food',  label: 'Street Food',  emoji: '🌮' },
  { id: 'north-indian', label: 'North Indian', emoji: '🍛' },
  { id: 'south-indian', label: 'South Indian', emoji: '🥞' },
  { id: 'chinese',      label: 'Chinese',      emoji: '🍜' },
  { id: 'vegan',        label: 'Vegan',        emoji: '🌱' },
  { id: 'high-protein', label: 'High Protein', emoji: '💪' },
  { id: 'quick-meals',  label: 'Quick Meals',  emoji: '⚡' },
  { id: 'bbq',          label: 'BBQ & Grilled', emoji: '🔥' },
  { id: 'bakery',       label: 'Bakery',       emoji: '🥐' },
  { id: 'kids',         label: 'Kids Special', emoji: '🧒' },
  { id: 'salads',       label: 'Salads',       emoji: '🥙' },
  { id: 'trending',     label: 'Trending',     emoji: '📈' },
]

const RECIPES: Recipe[] = [
  {
    id: 1, title: 'Butter Chicken Masala',
    description: 'Velvety tomato-cream sauce with tender chicken & fenugreek',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
    cuisine: 'Punjabi', time: '40 min', calories: 420, rating: 4.9, ratingCount: 2847,
    creator: 'Arjun Sharma', creatorEmoji: '👨‍🍳',
    tags: ['Non-Veg', 'Spicy', 'North Indian'], isVeg: false, difficulty: 'Medium',
  },
  {
    id: 2, title: 'Avocado Poached Egg Toast',
    description: 'Sourdough with whipped feta, poached egg & chilli flakes',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
    cuisine: 'Continental', time: '15 min', calories: 280, rating: 4.7, ratingCount: 1234,
    creator: 'Priya Mehta', creatorEmoji: '👩‍🍳',
    tags: ['Veg', 'Healthy', 'Breakfast'], isVeg: true, difficulty: 'Easy',
  },
  {
    id: 3, title: 'Truffle Mushroom Tagliatelle',
    description: 'Al dente pasta with black truffle cream & aged parmesan',
    image: 'https://images.unsplash.com/photo-1551183053-bf91798d047b?w=600&q=80',
    cuisine: 'Italian', time: '25 min', calories: 520, rating: 4.8, ratingCount: 987,
    creator: 'Marco Rossi', creatorEmoji: '🧑‍🍳',
    tags: ['Veg', 'Italian', 'Pasta'], isVeg: true, difficulty: 'Medium',
  },
  {
    id: 4, title: 'Crispy Masala Dosa',
    description: 'Fermented rice crepe with spiced potato filling & coconut chutney',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=600&q=80',
    cuisine: 'South Indian', time: '30 min', calories: 320, rating: 4.9, ratingCount: 3421,
    creator: 'Ananya Iyer', creatorEmoji: '👩‍🍳',
    tags: ['Veg', 'South Indian', 'Breakfast'], isVeg: true, difficulty: 'Hard',
  },
  {
    id: 5, title: 'Smash Burger Deluxe',
    description: 'Double smashed patty with caramelized onions & chipotle mayo',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    cuisine: 'American', time: '20 min', calories: 680, rating: 4.8, ratingCount: 1876,
    creator: 'Rahul Singh', creatorEmoji: '👨‍🍳',
    tags: ['Non-Veg', 'Street Food', 'Quick'], isVeg: false, difficulty: 'Easy',
  },
  {
    id: 6, title: 'Rainbow Buddha Bowl',
    description: 'Quinoa with roasted veggies, tahini dressing & sesame seeds',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    cuisine: 'Fusion', time: '25 min', calories: 340, rating: 4.6, ratingCount: 765,
    creator: 'Shreya Kapoor', creatorEmoji: '👩‍🍳',
    tags: ['Vegan', 'Healthy', 'Salad'], isVeg: true, difficulty: 'Easy',
  },
  {
    id: 7, title: 'Hyderabadi Dum Biryani',
    description: 'Slow-cooked basmati sealed with dough, saffron & caramelised onions',
    image: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=600&q=80',
    cuisine: 'Hyderabadi', time: '90 min', calories: 580, rating: 5.0, ratingCount: 4521,
    creator: 'Rohit Verma', creatorEmoji: '👨‍🍳',
    tags: ['Non-Veg', 'North Indian', 'Special'], isVeg: false, difficulty: 'Hard',
  },
  {
    id: 8, title: 'Margherita Pizza',
    description: 'Hand-stretched base with San Marzano tomatoes & fresh mozzarella',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    cuisine: 'Italian', time: '35 min', calories: 460, rating: 4.7, ratingCount: 2103,
    creator: 'Sofia Conti', creatorEmoji: '👩‍🍳',
    tags: ['Veg', 'Italian', 'Pizza'], isVeg: true, difficulty: 'Medium',
  },
  {
    id: 9, title: 'Mango Alphonso Lassi',
    description: 'Chilled Alphonso mango blended with hung curd & cardamom',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80',
    cuisine: 'Indian', time: '10 min', calories: 190, rating: 4.7, ratingCount: 654,
    creator: 'Deepa Patel', creatorEmoji: '👩‍🍳',
    tags: ['Veg', 'Drinks', 'Quick'], isVeg: true, difficulty: 'Easy',
  },
  {
    id: 10, title: 'Chettinad Chicken Curry',
    description: 'Fiery South Indian curry with freshly stone-ground spice blend',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    cuisine: 'South Indian', time: '45 min', calories: 480, rating: 4.8, ratingCount: 1432,
    creator: 'Kavitha Reddy', creatorEmoji: '👩‍🍳',
    tags: ['Non-Veg', 'South Indian', 'Spicy'], isVeg: false, difficulty: 'Hard',
  },
  {
    id: 11, title: 'Sourdough Focaccia',
    description: 'Pillowy Italian bread with rosemary, sea salt & extra virgin olive oil',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    cuisine: 'Italian', time: '4 hr', calories: 230, rating: 4.6, ratingCount: 543,
    creator: 'Luca Ferrari', creatorEmoji: '🧑‍🍳',
    tags: ['Veg', 'Bakery', 'Italian'], isVeg: true, difficulty: 'Medium',
  },
  {
    id: 12, title: 'Choco Lava Cake',
    description: 'Warm chocolate cake with molten centre & vanilla ice cream',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80',
    cuisine: 'French', time: '20 min', calories: 390, rating: 4.9, ratingCount: 3102,
    creator: 'Riya Bose', creatorEmoji: '👩‍🍳',
    tags: ['Veg', 'Desserts', 'Quick'], isVeg: true, difficulty: 'Medium',
  },
]

const REELS: Reel[] = [
  {
    id: 1, title: 'Perfect Biryani in 90 mins 🍚',
    thumbnail: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=400&q=80',
    creator: 'Arjun S.', creatorEmoji: '👨‍🍳', likes: '48.2k', comments: '1.2k',
    duration: '0:58', views: '2.1M', trending: true,
    gradient: 'from-orange-500 to-rose-600', emoji: '🍛',
  },
  {
    id: 2, title: '5-min Breakfast That Slaps 🍳',
    thumbnail: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80',
    creator: 'Priya M.', creatorEmoji: '👩‍🍳', likes: '31.5k', comments: '890',
    duration: '0:45', views: '1.4M', trending: true,
    gradient: 'from-amber-500 to-orange-600', emoji: '🍳',
  },
  {
    id: 3, title: 'Street Style Pav Bhaji 🌮',
    thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
    creator: 'Kavitha R.', creatorEmoji: '👩‍🍳', likes: '27.3k', comments: '654',
    duration: '1:12', views: '980k', trending: false,
    gradient: 'from-pink-500 to-fuchsia-600', emoji: '🌮',
  },
  {
    id: 4, title: 'Restaurant-Style Pasta 🍝',
    thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91798d047b?w=400&q=80',
    creator: 'Marco R.', creatorEmoji: '🧑‍🍳', likes: '19.8k', comments: '423',
    duration: '2:03', views: '756k', trending: false,
    gradient: 'from-emerald-500 to-teal-600', emoji: '🍝',
  },
  {
    id: 5, title: 'Viral Smash Burger Technique 🍔',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    creator: 'Rahul S.', creatorEmoji: '👨‍🍳', likes: '63.4k', comments: '2.1k',
    duration: '1:30', views: '3.2M', trending: true,
    gradient: 'from-red-500 to-rose-600', emoji: '🍔',
  },
  {
    id: 6, title: 'Dalgona Coffee Revival ☕',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    creator: 'Sana B.', creatorEmoji: '👩‍🍳', likes: '22.6k', comments: '567',
    duration: '0:55', views: '1.1M', trending: false,
    gradient: 'from-yellow-500 to-amber-600', emoji: '☕',
  },
]

const CATEGORY_SECTIONS = [
  {
    id: 'breakfast', title: 'Breakfast Ideas', emoji: '🍳',
    description: 'Start your day with energy-packed morning meals',
    gradient: 'from-amber-400 to-orange-500',
    recipeIds: [2, 4, 1, 9],
    reelIndex: 1,
  },
  {
    id: 'italian', title: 'Italian Classics', emoji: '🍕',
    description: 'Authentic flavors straight from the Italian kitchen',
    gradient: 'from-green-500 to-emerald-600',
    recipeIds: [3, 8, 11, 6],
    reelIndex: 3,
  },
  {
    id: 'north-indian', title: 'North Indian Delights', emoji: '🍛',
    description: 'Rich curries and aromatic dishes from the heartland',
    gradient: 'from-orange-500 to-rose-500',
    recipeIds: [1, 7, 9, 5],
    reelIndex: 0,
  },
  {
    id: 'quick-meals', title: 'Quick & Easy Meals', emoji: '⚡',
    description: 'Delicious meals ready in 30 minutes or less',
    gradient: 'from-sky-400 to-indigo-500',
    recipeIds: [2, 5, 9, 12],
    reelIndex: 1,
  },
]

const TRENDING_CREATORS = [
  { name: 'Arjun Sharma',  handle: '@arjuncooks',   followers: '284k', emoji: '👨‍🍳', specialty: 'Punjabi Cuisine' },
  { name: 'Priya Mehta',   handle: '@priyakitchen',  followers: '193k', emoji: '👩‍🍳', specialty: 'Healthy Recipes' },
  { name: 'Marco Rossi',   handle: '@marcocooks',    followers: '312k', emoji: '🧑‍🍳', specialty: 'Italian Cuisine' },
  { name: 'Ananya Iyer',   handle: '@ananyafood',    followers: '156k', emoji: '👩‍🍳', specialty: 'South Indian'   },
  { name: 'Rohit Verma',   handle: '@rohitbiryani',  followers: '241k', emoji: '👨‍🍳', specialty: 'Biryani Expert' },
]

const TRENDING_HASHTAGS = [
  '#BiryaniLove', '#QuickMeals', '#VeganVibes', '#StreetFood',
  '#HealthyEats', '#DessertGoals', '#PastaLovers', '#MasalaChef',
  '#BreakfastVibes', '#FoodReel',
]

const TRENDING_SEARCHES = [
  'Butter Chicken', 'Avocado Toast', 'Dal Makhani',
  'Pasta Carbonara', 'Masala Dosa', 'Buddha Bowl', 'Smash Burger',
]

/* ─── Hero Banner ─────────────────────────────────────────────── */

const FLOAT_EMOJIS = ['🍕','🍛','🥗','🍰','🍜','🥤','🌮','🍳','🍔','🥐','🥑','🍱']

function HeroBanner() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <section
      className="relative overflow-hidden rounded-3xl min-h-[340px] sm:min-h-[420px] flex items-center"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #1E1E1F 0%, #1A1A1B 35%, #1E1E1F 65%, #1A1A1B 100%)'
          : 'linear-gradient(135deg, #FFFDF5 0%, #FFF8E1 30%, #FFFAED 65%, #FFFFF5 100%)',
      }}
    >
      {/* Ambient glow mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? [
                'radial-gradient(ellipse 80% 60% at 18% 55%, rgba(245,197,24,0.14) 0%, transparent 60%)',
                'radial-gradient(ellipse 55% 70% at 82% 25%, rgba(245,197,24,0.06) 0%, transparent 55%)',
                'radial-gradient(ellipse 45% 45% at 60% 85%, rgba(125,187,145,0.06) 0%, transparent 50%)',
              ].join(',')
            : [
                'radial-gradient(ellipse 80% 60% at 18% 55%, rgba(245,197,24,0.15) 0%, transparent 60%)',
                'radial-gradient(ellipse 55% 70% at 82% 25%, rgba(245,197,24,0.08) 0%, transparent 55%)',
                'radial-gradient(ellipse 45% 45% at 60% 85%, rgba(125,187,145,0.08) 0%, transparent 50%)',
              ].join(','),
        }}
      />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${dark ? '#F5C518' : '#F5C518'} 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          opacity: dark ? 0.03 : 0.055,
        }}
      />

      {/* Border accent */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ border: dark ? '1px solid rgba(245,197,24,0.12)' : '1.5px solid rgba(245,197,24,0.20)' }}
      />

      {/* Floating food emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {FLOAT_EMOJIS.map((em, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl sm:text-3xl"
            style={{
              left: `${6 + (i * 8.2) % 88}%`,
              top:  `${8 + (i * 15.7) % 78}%`,
              opacity: dark
                ? 0.08 + (i % 4) * 0.025
                : 0.14 + (i % 4) * 0.04,
            }}
            animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 3.5 + (i % 3) * 1.2, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          >
            {em}
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 max-w-2xl">
        {/* Pill badge */}
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
          style={{
            background: dark ? 'rgba(245,197,24,0.10)' : 'rgba(245,197,24,0.10)',
            borderColor: dark ? 'rgba(245,197,24,0.28)' : 'rgba(245,197,24,0.28)',
          }}
        >
          <Flame size={12} style={{ color: 'var(--cr-accent)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--cr-accent)' }}>
            21 Categories · 500+ Recipes · Daily Reels
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.08)}
          className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight mb-4 ${
            dark ? 'text-[#F5F5F5]' : 'text-[#1A1A1A]'
          }`}
        >
          Discover Recipes<br />
          <span
            className="animate-gradient-x bg-clip-text text-transparent"
            style={{
              backgroundImage: dark
                ? 'linear-gradient(90deg, #F5C518, #FFD84D, #F5C518, #FFB800)'
                : 'linear-gradient(90deg, #F5C518, #FFD84D, #F5C518, #e6b800)',
              backgroundSize: '200% 200%',
            }}
          >
            You&apos;ll Love
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          {...fadeUp(0.15)}
          className={`text-sm sm:text-base max-w-md leading-relaxed mb-7 ${
            dark ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          Explore trending reels, delicious recipes, and categories crafted for every craving.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{
              background: dark ? 'linear-gradient(135deg, #F5C518, #FFB800)' : 'linear-gradient(135deg, #F5C518, #FFD84D)',
              boxShadow: dark ? '0 8px 24px rgba(245,197,24,0.38)' : '0 8px 24px rgba(245,197,24,0.45)',
              color: 'var(--cr-btn-text)',
            }}
          >
            <Play size={14} fill="white" /> Explore Reels
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border ${
              dark ? 'text-[#F5F5F5]' : 'text-zinc-700'
            }`}
            style={{
              borderColor: dark ? 'rgba(245,197,24,0.30)' : 'rgba(245,197,24,0.35)',
              background:   dark ? 'rgba(245,197,24,0.07)' : 'rgba(245,197,24,0.07)',
            }}
          >
            <Utensils size={14} /> Browse Recipes
          </motion.button>
        </motion.div>
      </div>

      {/* Right: floating stat cards */}
      <div className="absolute right-6 bottom-6 hidden md:flex flex-col gap-2">
        {[
          { label: 'Active Chefs', value: '12.4k', icon: '👨‍🍳' },
          { label: 'Recipes',      value: '2.8k+', icon: '📖' },
          { label: 'Reels Today', value: '340+',  icon: '🎬' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl backdrop-blur-sm"
            style={{
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.80)',
              border: dark
                ? '1px solid rgba(245,197,24,0.12)'
                : '1px solid rgba(245,197,24,0.20)',
            }}
          >
            <span className="text-sm leading-none">{s.icon}</span>
            <div>
              <div className={`text-xs font-bold leading-none ${dark ? 'text-[#F5F5F5]' : 'text-[#1A1A1A]'}`}>
                {s.value}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Category Tabs ──────────────────────────────────────────── */

function CategoryTabs({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const rowRef    = useRef<HTMLDivElement>(null)
  const dragging  = useRef(false)
  const startX    = useRef(0)
  const scrollLeft = useRef(0)
  const moved     = useRef(false)

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current   = true
    moved.current      = false
    startX.current     = e.pageX - (rowRef.current?.offsetLeft ?? 0)
    scrollLeft.current = rowRef.current?.scrollLeft ?? 0
    if (rowRef.current) rowRef.current.style.cursor = 'grabbing'
  }
  const stopDrag = () => {
    dragging.current = false
    if (rowRef.current) rowRef.current.style.cursor = 'grab'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !rowRef.current) return
    e.preventDefault()
    const x    = e.pageX - rowRef.current.offsetLeft
    const walk = (x - startX.current) * 1.4
    if (Math.abs(walk) > 4) moved.current = true
    rowRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <div className="sticky top-0 z-30 -mx-1 px-1 py-3 bg-[#FFFDF5]/92 dark:bg-[#1E1E1F]/92 backdrop-blur-md">
      <div
        ref={rowRef}
        className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5 select-none"
        style={{ touchAction: 'pan-x', cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onMouseMove={onMouseMove}
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => { if (!moved.current) onChange(tab.id) }}
              className={`flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                isActive
                  ? 'dark:text-white text-[#1A1A1A]'
                  : 'text-zinc-600 dark:text-zinc-400 bg-white dark:bg-[#2B2B2D]/70 border border-zinc-200/80 dark:border-[#343438] hover:border-[#F5C518]/35 dark:hover:border-[#F5C518]/35'
              }`}
              style={isActive ? {
                background: dark ? 'linear-gradient(135deg, #F5C518, #FFB800)' : 'linear-gradient(135deg, #F5C518, #FFD84D)',
                boxShadow: dark ? '0 0 18px 4px rgba(245,197,24,0.28)' : '0 0 18px 4px rgba(245,197,24,0.30)',
              } : {}}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Search & Filters ───────────────────────────────────────── */

function SearchFilters({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const filters = [
    { label: 'Time',       options: ['< 15 min', '15–30 min', '30–60 min', '60+ min'] },
    { label: 'Difficulty', options: ['Easy', 'Medium', 'Hard'] },
    { label: 'Cuisine',    options: ['Indian', 'Italian', 'Chinese', 'Continental', 'Street Food'] },
    { label: 'Diet',       options: ['Veg', 'Non-Veg', 'Vegan', 'High Protein'] },
  ]

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 160)}
          placeholder="Search recipes, reels, cuisines, ingredients…"
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm font-medium bg-white dark:bg-[#2B2B2D]/80 border border-zinc-200/80 dark:border-[#343438] text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#F5C518]/50 dark:focus:border-[#F5C518]/50 focus:ring-2 focus:ring-[#F5C518]/18 dark:focus:ring-[#F5C518]/18"
        />
        {query && (
          <button
            onClick={() => onQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X size={14} />
          </button>
        )}

        {/* Trending suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && !query && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#2B2B2D] border border-zinc-200/80 dark:border-[#343438] shadow-xl z-50 overflow-hidden"
            >
              <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-[#343438]/70">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Trending Searches</span>
              </div>
              {TRENDING_SEARCHES.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => onQuery(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <TrendingUp size={13} style={{ color: 'var(--cr-accent)' }} />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {filters.map((f) => (
          <div key={f.label} className="relative flex-none">
            <button
              onClick={() => setOpenFilter(openFilter === f.label ? null : f.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                openFilter === f.label
                  ? 'border-[#F5C518]/50 dark:border-[#F5C518]/50 text-[#B38B00] dark:text-[#F5C518]'
                  : 'bg-white dark:bg-[#2B2B2D]/80 border-zinc-200/80 dark:border-[#343438] text-zinc-600 dark:text-zinc-400 hover:border-[#F5C518]/30 dark:hover:border-[#F5C518]/30'
              }`}
              style={openFilter === f.label ? { background: 'var(--cr-accent-soft)' } : {}}
            >
              {f.label}
              <ChevronDown size={11} className={`transition-transform duration-200 ${openFilter === f.label ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {openFilter === f.label && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-0 mt-1.5 min-w-[148px] rounded-xl bg-white dark:bg-[#2B2B2D] border border-zinc-200/80 dark:border-[#343438] shadow-xl z-50 py-1 overflow-hidden"
                >
                  {f.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setOpenFilter(null)}
                      className="w-full px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <button
          className="flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
          style={{ background: 'var(--cr-accent-soft)', borderColor: 'var(--cr-accent-border)', color: 'var(--cr-accent)' }}
        >
          <SlidersHorizontal size={11} /> More Filters
        </button>
      </div>
    </div>
  )
}

/* ─── Recipe Card ────────────────────────────────────────────── */

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      variants={cardReveal}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#2B2B2D] border border-zinc-200/60 dark:border-[#343438] shadow-sm hover:shadow-lg hover:shadow-[#F5C518]/8 dark:hover:shadow-[#F5C518]/8 cursor-pointer transition-shadow duration-300"
    >
      {/* Food image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick preview */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-[11px] font-semibold backdrop-blur-sm border"
            style={{ background: 'rgba(0,0,0,0.50)', borderColor: 'rgba(255,255,255,0.18)' }}
          >
            <Eye size={11} /> Quick Preview
          </button>
        </div>

        {/* Veg / Non-Veg badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: recipe.isVeg ? '#7DBB91' : 'var(--cr-accent)' }}
          >
            {recipe.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={(e) => { e.stopPropagation(); setLiked((v) => !v) }}
            className="p-1.5 rounded-full backdrop-blur-sm transition-colors"
            style={{ background: liked ? 'rgba(239,68,68,0.88)' : 'rgba(0,0,0,0.42)' }}
          >
            <Heart size={12} fill={liked ? 'white' : 'none'} stroke="white" strokeWidth={2.2} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={(e) => { e.stopPropagation(); setSaved((v) => !v) }}
            className="p-1.5 rounded-full backdrop-blur-sm transition-colors"
            style={{ background: saved ? 'rgba(125,187,145,0.92)' : 'rgba(0,0,0,0.42)' }}
          >
            <Bookmark size={12} fill={saved ? 'white' : 'none'} stroke="white" strokeWidth={2.2} />
          </motion.button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--cr-accent)' }}>
            {recipe.cuisine}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
            <Clock size={9} /> {recipe.time}
          </span>
        </div>

        <h3 className="font-heading text-[13px] font-bold text-zinc-800 dark:text-zinc-100 leading-snug mb-1.5 line-clamp-1">
          {recipe.title}
        </h3>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={11} fill="var(--cr-accent)" stroke="var(--cr-accent)" />
            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{recipe.rating}</span>
            <span className="text-[10px] text-zinc-400">({recipe.ratingCount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={9} className="text-zinc-400" />
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{recipe.calories} cal</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Reel Card ──────────────────────────────────────────────── */

function ReelCard({ reel }: { reel: Reel }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [liked, setLiked] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      variants={cardReveal}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
      className="group relative rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-[#343438] shadow-sm hover:shadow-lg cursor-pointer min-h-[180px] sm:min-h-[200px]"
      style={{ aspectRatio: '9/16' }}
    >
      {/* Thumbnail */}
      <Image
        src={reel.thumbnail}
        alt={reel.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 16vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <motion.div
          whileHover={{ scale: 1.12 }}
          className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: dark ? 'rgba(245,197,24,0.88)' : 'rgba(245,197,24,0.92)' }}
        >
          <Play size={16} fill="white" className="ml-0.5" />
        </motion.div>
      </div>

      {/* Trending badge */}
      {reel.trending && (
        <div className="absolute top-2.5 left-2.5">
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: dark ? 'linear-gradient(135deg, #F5C518, #FFB800)' : 'linear-gradient(135deg, #F5C518, #FFD84D)', color: '#1A1A1A' }}
          >
            <Flame size={8} /> TRENDING
          </span>
        </div>
      )}

      {/* Duration */}
      <div className="absolute top-2.5 right-2.5">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/55 backdrop-blur-sm">
          {reel.duration}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-xs font-bold text-white mb-1.5 line-clamp-2 leading-snug">{reel.title}</p>

        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm leading-none">{reel.creatorEmoji}</span>
          <span className="text-[10px] font-semibold text-zinc-300">{reel.creator}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); setLiked((v) => !v) }}
            className="flex items-center gap-0.5"
          >
            <Heart
              size={11}
              fill={liked ? (dark ? '#F5C518' : '#F5C518') : 'none'}
              stroke={liked ? (dark ? '#F5C518' : '#F5C518') : 'white'}
              strokeWidth={2}
              className="transition-transform hover:scale-125"
            />
            <span className="text-[10px] text-zinc-300 font-medium">{reel.likes}</span>
          </button>
          <div className="flex items-center gap-0.5">
            <MessageCircle size={11} stroke="white" strokeWidth={2} />
            <span className="text-[10px] text-zinc-300 font-medium">{reel.comments}</span>
          </div>
          <div className="flex items-center gap-0.5 ml-auto">
            <Eye size={10} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
            <span className="text-[10px] text-zinc-400 font-medium">{reel.views}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Mixed Discovery Grid ───────────────────────────────────── */

function MixedGrid({ query, activeTab }: { query: string; activeTab: string }) {
  const tabTagMap: Record<string, string> = {
    breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks',
    healthy: 'Healthy', desserts: 'Desserts', drinks: 'Drinks', italian: 'Italian',
    'street-food': 'Street Food', 'north-indian': 'North Indian', 'south-indian': 'South Indian',
    chinese: 'Chinese', vegan: 'Vegan', 'high-protein': 'High Protein', 'quick-meals': 'Quick',
    bbq: 'BBQ', bakery: 'Bakery', kids: 'Kids', salads: 'Salad', trending: 'Special',
  }

  const filtered = RECIPES.filter((r) => {
    const matchesSearch = !query || (
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )
    const matchesTab = activeTab === 'all' || r.tags.some((t) =>
      t.toLowerCase().includes((tabTagMap[activeTab] ?? '').toLowerCase())
    )
    return matchesSearch && matchesTab
  })

  const mixed: Array<{ type: 'recipe'; data: Recipe } | { type: 'reel'; data: Reel }> = []
  let ri = 0
  let li = 0
  for (let i = 0; mixed.length < 12 && (ri < filtered.length || li < REELS.length); i++) {
    if ((i + 1) % 3 === 0 && li < REELS.length) {
      mixed.push({ type: 'reel', data: REELS[li++] })
    } else if (ri < filtered.length) {
      mixed.push({ type: 'recipe', data: filtered[ri++] })
    } else if (li < REELS.length) {
      mixed.push({ type: 'reel', data: REELS[li++] })
    }
  }

  if (mixed.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="text-5xl">🔍</div>
        <p className="font-heading text-lg font-bold text-zinc-700 dark:text-zinc-300">No results found</p>
        <p className="text-sm text-zinc-400">Try a different search term or category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {mixed.map((item, i) =>
        item.type === 'recipe' ? (
          <RecipeCard key={`rec-${item.data.id}-${i}`} recipe={item.data} />
        ) : (
          <ReelCard key={`rel-${item.data.id}-${i}`} reel={item.data} />
        )
      )}
    </div>
  )
}

/* ─── Category Carousel Section ──────────────────────────────── */

function CategoryCarousel({ section }: { section: typeof CATEGORY_SECTIONS[0] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })
  }

  const recipes = section.recipeIds
    .map((id) => RECIPES.find((r) => r.id === id))
    .filter((r): r is Recipe => !!r)

  const reel = REELS[section.reelIndex % REELS.length]

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE }}
      className="space-y-4"
    >
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center text-sm shadow-md`}
            >
              {section.emoji}
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
              {section.title}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 ml-9">{section.description}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white dark:bg-[#2B2B2D] border border-zinc-200/80 dark:border-[#343438] text-zinc-500 hover:border-[#F5C518]/45 dark:hover:border-[#F5C518]/45 hover:text-[#F5C518] dark:hover:text-[#F5C518] transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white dark:bg-[#2B2B2D] border border-zinc-200/80 dark:border-[#343438] text-zinc-500 hover:border-[#F5C518]/45 dark:hover:border-[#F5C518]/45 hover:text-[#F5C518] dark:hover:text-[#F5C518] transition-all"
          >
            <ChevronRight size={14} />
          </button>
          <button
            className="flex items-center gap-1 text-xs font-semibold ml-1 hover:opacity-75 transition-opacity"
            style={{ color: 'var(--cr-accent)' }}
          >
            View All <ArrowRight size={11} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
        {recipes.map((recipe, i) => (
          <div key={recipe.id} className="flex-none w-52 sm:w-56">
            <RecipeCard recipe={recipe} />
          </div>
        ))}
        <div className="flex-none w-36 sm:w-40">
          <ReelCard reel={reel} />
        </div>
      </div>
    </motion.section>
  )
}

/* ─── Trending Section ───────────────────────────────────────── */

function TrendingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })

  return (
    <section ref={ref} className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingUp size={18} style={{ color: 'var(--cr-accent)' }} />
            <h2 className="font-heading text-xl sm:text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
              Trending on CookReels
            </h2>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 ml-[26px]">
            Most watched reels &amp; viral recipes this week
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-75 transition-opacity" style={{ color: 'var(--cr-accent)' }}>
          See all <ArrowRight size={11} />
        </button>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3"
      >
        {REELS.map((reel, i) => (
          <motion.div key={reel.id} variants={cardReveal}>
            <ReelCard reel={reel} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ─── Personalized Section ───────────────────────────────────── */

function PersonalizedSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })

  return (
    <section ref={ref} className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg leading-none">✨</span>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
              Made For You
            </h2>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 ml-7">
            Personalized picks based on your taste preferences
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-75 transition-opacity" style={{ color: 'var(--cr-accent)' }}>
          Refresh <ArrowRight size={11} />
        </button>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {RECIPES.slice(6).map((recipe, i) => (
          <motion.div key={recipe.id} variants={cardReveal}>
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ─── Discovery Sidebar ──────────────────────────────────────── */

function DiscoverySidebar() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <aside className="hidden xl:flex flex-col gap-5 w-60 flex-none self-start sticky top-[72px]">
      {/* Top Creators */}
      <div className="rounded-2xl bg-white dark:bg-[#2B2B2D] border border-zinc-200/60 dark:border-[#343438] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} style={{ color: 'var(--cr-accent)' }} />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Top Creators</h3>
        </div>
        <div className="space-y-3">
          {TRENDING_CREATORS.map((c) => (
            <div key={c.handle} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-none"
                style={{ background: 'var(--cr-accent-soft)', border: '1px solid var(--cr-accent-border)' }}
              >
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-100 truncate">{c.name}</div>
                <div className="text-[10px] text-zinc-400 truncate">{c.specialty} · {c.followers}</div>
              </div>
              <button
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-none transition-colors hover:bg-[#F5C518] dark:hover:bg-[#F5C518] hover:text-[#1A1A1A] dark:hover:text-[#1A1A1A]"
                style={{ background: 'var(--cr-accent-soft)', color: 'var(--cr-accent)', border: '1px solid var(--cr-accent-border)' }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Hashtags */}
      <div className="rounded-2xl bg-white dark:bg-[#2B2B2D] border border-zinc-200/60 dark:border-[#343438] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <Hash size={14} style={{ color: 'var(--cr-accent)' }} />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_HASHTAGS.map((tag) => (
            <button
              key={tag}
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-[#343438] text-zinc-600 dark:text-zinc-400 hover:border-[#F5C518]/40 dark:hover:border-[#F5C518]/40 hover:text-[#B38B00] dark:hover:text-[#F5C518] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Picks promo card */}
      <div
        className="rounded-2xl overflow-hidden relative p-4 min-h-[130px] flex flex-col justify-between"
        style={{
          background: dark
            ? 'linear-gradient(135deg, #1E1E1F, #2B2B2D)'
            : 'linear-gradient(135deg, #FFFDF5, #FFF8E1, #FFFAED)',
          border: dark ? '1px solid rgba(245,197,24,0.12)' : '1.5px solid rgba(245,197,24,0.22)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: dark
              ? 'radial-gradient(ellipse at 25% 55%, rgba(245,197,24,0.22), transparent 65%)'
              : 'radial-gradient(ellipse at 25% 55%, rgba(245,197,24,0.18), transparent 65%)',
          }}
        />
        <div className="relative z-10">
          <div className="text-2xl mb-2">🌿</div>
          <div className={`text-xs font-bold mb-0.5 ${dark ? 'text-[#F5F5F5]' : 'text-[#1A1A1A]'}`}>
            Seasonal Picks
          </div>
          <div className={`text-[10px] leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Fresh ingredients, bold flavors for the season
          </div>
        </div>
        <button
          className="relative z-10 mt-3 self-start text-[10px] font-bold px-3 py-1 rounded-full transition-colors"
          style={{
            background: 'var(--cr-accent-soft)',
            color: 'var(--cr-accent)',
            border: '1px solid var(--cr-accent-border)',
          }}
        >
          Explore Now →
        </button>
      </div>
    </aside>
  )
}

/* ─── Floating Action Button ─────────────────────────────────── */

function FloatingFAB() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [open, setOpen] = useState(false)

  const actions = [
    { icon: Camera,   label: 'Upload Reel' },
    { icon: Utensils, label: 'Add Recipe'  },
  ]

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2 lg:bottom-8 lg:right-6">
      <AnimatePresence>
        {open && actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.82 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg whitespace-nowrap"
            style={{
              background: dark ? 'linear-gradient(135deg, #F5C518, #FFB800)' : 'linear-gradient(135deg, #F5C518, #FFD84D)',
              color: '#1A1A1A',
            }}
          >
            <action.icon size={13} /> {action.label}
          </motion.button>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.91 }}
        onClick={() => setOpen((v) => !v)}
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-xl animate-pulse-glow"
        style={{ background: dark ? 'linear-gradient(135deg, #F5C518, #FFB800)' : 'linear-gradient(135deg, #F5C518, #FFD84D)' }}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        >
          <Plus size={22} style={{ color: '#1A1A1A' }} />
        </motion.div>
      </motion.button>
    </div>
  )
}

/* ─── Page Export ────────────────────────────────────────────── */

export function CategoriesPage({ username }: { username?: string }) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const sectionLabel = searchQuery
    ? `Results for "${searchQuery}"`
    : activeTab === 'all'
    ? 'Discover & Explore'
    : CATEGORY_TABS.find((t) => t.id === activeTab)?.label ?? 'Explore'

  return (
    <div className="relative min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 py-5 space-y-7">
        <HeroBanner />
        <CategoryTabs active={activeTab} onChange={setActiveTab} />
        <SearchFilters query={searchQuery} onQuery={setSearchQuery} />

        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 space-y-10">
            <section>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                    {sectionLabel}
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {searchQuery ? 'Matching recipes and reels' : 'Reels and recipes mixed for you'}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#2B2B2D] border border-zinc-200/80 dark:border-[#343438] text-zinc-600 dark:text-zinc-400 hover:border-[#F5C518]/35 dark:hover:border-[#F5C518]/35 hover:text-[#F5C518] dark:hover:text-[#F5C518] transition-colors">
                  Popular <ChevronDown size={10} />
                </button>
              </div>

              <MixedGrid query={searchQuery} activeTab={activeTab} />
            </section>

            {CATEGORY_SECTIONS.map((section) => (
              <CategoryCarousel key={section.id} section={section} />
            ))}

            <TrendingSection />
            <PersonalizedSection />
          </div>

          <DiscoverySidebar />
        </div>
      </div>

      <FloatingFAB />
    </div>
  )
}
