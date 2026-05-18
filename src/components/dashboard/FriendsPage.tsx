'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Bell, MessageCircle, UserPlus, ChefHat, Users,
  Heart, Play, Flame, Check, TrendingUp, Radio,
  Sparkles, MapPin,
} from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────── */

type Tab = 'Friends' | 'Following' | 'Followers' | 'Add Friends'

interface Friend {
  id: number
  name: string
  username: string
  bio: string
  cuisineTag: string
  level: string
  mutuals: number
  online: boolean
  lastActive: string
  avatar: string
  avatarBg: string
  recipes: { emoji: string; gradient: string }[]
}

interface Creator {
  id: number
  name: string
  username: string
  verified: boolean
  followers: string
  specialty: string
  status: 'cooking' | 'live' | 'trending' | null
  recipe: { title: string; emoji: string; gradient: string }
  avatar: string
  avatarBg: string
}

interface Follower {
  id: number
  name: string
  username: string
  sharedInterest: string
  compatibility: number
  avatar: string
  avatarBg: string
  followedBack: boolean
}

interface Suggestion {
  id: number
  name: string
  username: string
  specialty: string
  mutuals: number
  label: string
  labelGradient: string
  avatar: string
  avatarBg: string
  added: boolean
}

/* ─── Animation variants ─────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 26 },
  },
}

const fadeSlide = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay },
})

/* ─── Static data ────────────────────────────────────────── */

const TABS: { label: Tab; count: number }[] = [
  { label: 'Friends',    count: 120 },
  { label: 'Following',  count: 340 },
  { label: 'Followers',  count: 420 },
  { label: 'Add Friends', count: 0 },
]

const FRIENDS: Friend[] = [
  {
    id: 1, name: 'Priya Mehta', username: '@priyacooks',
    bio: 'Obsessed with South Indian flavors & slow cooking rituals',
    cuisineTag: '🍛 Indian', level: 'Home Chef Pro',
    mutuals: 8, online: true, lastActive: 'Posted a pasta reel 2h ago',
    avatar: '👩‍🍳', avatarBg: 'from-pink-400 to-rose-500',
    recipes: [
      { emoji: '🍛', gradient: 'from-orange-500 to-red-500' },
      { emoji: '🥘', gradient: 'from-amber-400 to-orange-500' },
      { emoji: '🍚', gradient: 'from-yellow-400 to-amber-500' },
    ],
  },
  {
    id: 2, name: 'Arjun Sharma', username: '@arjunspice',
    bio: 'Tandoor master | Mughlai cuisine enthusiast & weekend warrior',
    cuisineTag: '🔥 Mughlai', level: 'Spice Wizard',
    mutuals: 15, online: true, lastActive: 'Liked Biryani recipe 1h ago',
    avatar: '👨‍🍳', avatarBg: 'from-amber-400 to-orange-600',
    recipes: [
      { emoji: '🍖', gradient: 'from-red-500 to-rose-600' },
      { emoji: '🫕', gradient: 'from-amber-500 to-orange-600' },
      { emoji: '🥙', gradient: 'from-orange-400 to-amber-500' },
    ],
  },
  {
    id: 3, name: 'Kavitha Rao', username: '@kavikitchen',
    bio: 'Dessert architect & mango season obsessive ✨',
    cuisineTag: '🍰 Desserts', level: 'Sweet Specialist',
    mutuals: 6, online: false, lastActive: 'Active 3h ago',
    avatar: '👩‍🦳', avatarBg: 'from-fuchsia-400 to-purple-500',
    recipes: [
      { emoji: '🥭', gradient: 'from-pink-400 to-fuchsia-600' },
      { emoji: '🍮', gradient: 'from-yellow-400 to-amber-500' },
      { emoji: '🍨', gradient: 'from-purple-400 to-pink-500' },
    ],
  },
  {
    id: 4, name: 'Rohit Verma', username: '@rohitgrills',
    bio: 'BBQ weekends & coastal seafood adventures every season',
    cuisineTag: '🦐 Coastal', level: 'Grill Champion',
    mutuals: 11, online: true, lastActive: 'Going live in 30 mins!',
    avatar: '🧑‍🍳', avatarBg: 'from-teal-400 to-cyan-500',
    recipes: [
      { emoji: '🦞', gradient: 'from-teal-500 to-cyan-600' },
      { emoji: '🍤', gradient: 'from-sky-400 to-blue-500' },
      { emoji: '🐟', gradient: 'from-blue-400 to-indigo-500' },
    ],
  },
  {
    id: 5, name: 'Ananya Iyer', username: '@ananyaeats',
    bio: 'Fusion food creator | Kerala x Italian experiments',
    cuisineTag: '🌍 Fusion', level: 'Fusion Artist',
    mutuals: 9, online: false, lastActive: 'Active 5h ago',
    avatar: '👩‍🦱', avatarBg: 'from-violet-400 to-indigo-500',
    recipes: [
      { emoji: '🍝', gradient: 'from-violet-500 to-purple-600' },
      { emoji: '🌮', gradient: 'from-green-400 to-emerald-500' },
      { emoji: '🫔', gradient: 'from-lime-400 to-green-500' },
    ],
  },
  {
    id: 6, name: 'Meera Krishnan', username: '@meeramasala',
    bio: 'Traditional Chettinad recipes & temple food preservation',
    cuisineTag: '🌶️ Chettinad', level: 'Spice Explorer',
    mutuals: 4, online: true, lastActive: 'Uploaded a new reel 30m ago',
    avatar: '👩', avatarBg: 'from-red-400 to-rose-500',
    recipes: [
      { emoji: '🍲', gradient: 'from-red-500 to-rose-600' },
      { emoji: '🥣', gradient: 'from-orange-400 to-amber-500' },
      { emoji: '🫙', gradient: 'from-amber-400 to-yellow-500' },
    ],
  },
]

const FOLLOWING: Creator[] = [
  {
    id: 1, name: 'Chef Vikram Nair', username: '@vikramchef',
    verified: true, followers: '1.2M', specialty: 'Coastal Indian Cuisine',
    status: 'live',
    recipe: { title: 'Kerala Fish Moilee', emoji: '🐟', gradient: 'from-teal-500 to-cyan-600' },
    avatar: '👨‍🍳', avatarBg: 'from-teal-500 to-cyan-600',
  },
  {
    id: 2, name: 'Sanjeev Kapoor', username: '@sanjeevkapoor',
    verified: true, followers: '8.4M', specialty: 'Pan-Indian Master Chef',
    status: 'trending',
    recipe: { title: 'Dal Makhani Classic', emoji: '🫕', gradient: 'from-amber-500 to-orange-600' },
    avatar: '🧑‍🍳', avatarBg: 'from-amber-500 to-orange-600',
  },
  {
    id: 3, name: 'Lata Foodie', username: '@latafoodlab',
    verified: false, followers: '240k', specialty: 'Street Food & Chaats',
    status: 'cooking',
    recipe: { title: 'Pani Puri Revolution', emoji: '🫙', gradient: 'from-pink-400 to-rose-500' },
    avatar: '👩‍🦰', avatarBg: 'from-pink-500 to-rose-600',
  },
  {
    id: 4, name: 'Rajesh Kumar', username: '@rajeshbiryani',
    verified: true, followers: '560k', specialty: 'Hyderabadi Biryani Expert',
    status: null,
    recipe: { title: 'Dum Biryani Masterclass', emoji: '🍚', gradient: 'from-amber-400 to-orange-500' },
    avatar: '👨', avatarBg: 'from-orange-500 to-amber-600',
  },
  {
    id: 5, name: 'Divya Nambiar', username: '@divyaplate',
    verified: false, followers: '180k', specialty: 'Kerala Sadya & Heritage Recipes',
    status: null,
    recipe: { title: 'Avial & Thoran Platter', emoji: '🥗', gradient: 'from-green-400 to-emerald-500' },
    avatar: '👩', avatarBg: 'from-green-400 to-emerald-500',
  },
]

const FOLLOWERS_DATA: Follower[] = [
  { id: 1, name: 'Simran Kaur',    username: '@simraneats',   sharedInterest: 'You both love Punjabi food',   compatibility: 92, avatar: '👩‍🦱', avatarBg: 'from-purple-400 to-fuchsia-500', followedBack: false },
  { id: 2, name: 'Dev Malhotra',   username: '@devchops',     sharedInterest: 'Both watched sushi reels',     compatibility: 78, avatar: '👨‍🦲', avatarBg: 'from-sky-400 to-blue-500',       followedBack: true  },
  { id: 3, name: 'Pooja Pillai',   username: '@poojakitchen', sharedInterest: 'You both love Italian food',   compatibility: 85, avatar: '👩',    avatarBg: 'from-green-400 to-emerald-500', followedBack: false },
  { id: 4, name: 'Nikhil Soni',    username: '@nikhilgrill',  sharedInterest: 'Mutual love for BBQ reels',    compatibility: 71, avatar: '🧑‍🦱', avatarBg: 'from-orange-400 to-amber-500',  followedBack: false },
  { id: 5, name: 'Aisha Qureshi',  username: '@aishabakes',   sharedInterest: 'Both saved dessert recipes',   compatibility: 88, avatar: '👩‍🦳', avatarBg: 'from-pink-400 to-rose-500',     followedBack: true  },
  { id: 6, name: 'Karan Johar',    username: '@karancooks',   sharedInterest: 'You both follow Chef Vikram',  compatibility: 67, avatar: '👨',    avatarBg: 'from-indigo-400 to-violet-500', followedBack: false },
]

const SUGGESTIONS: Suggestion[] = [
  { id: 1, name: 'Tanvi Shah',     username: '@tanvibakes',   specialty: 'French Pastry',       mutuals: 12, label: 'Perfect Match',       labelGradient: 'from-[#f6c68b] to-[#e8952a]',   avatar: '👩‍🍳', avatarBg: 'from-pink-400 to-rose-500',     added: false },
  { id: 2, name: 'Karan Mehta',    username: '@karanspices',  specialty: 'Rajasthani Cuisine',  mutuals: 8,  label: 'Popular in Your City', labelGradient: 'from-violet-500 to-purple-600',  avatar: '👨‍🍳', avatarBg: 'from-violet-500 to-purple-600', added: false },
  { id: 3, name: 'Divya Nair',     username: '@divyaplate',   specialty: 'Kerala Cuisine',      mutuals: 5,  label: 'You May Know',         labelGradient: 'from-teal-500 to-cyan-600',      avatar: '👩',    avatarBg: 'from-teal-400 to-cyan-500',    added: false },
  { id: 4, name: 'Sameer Khan',    username: '@sameercooks',  specialty: 'Mughlai & Awadhi',    mutuals: 14, label: 'Perfect Match',       labelGradient: 'from-[#f6c68b] to-[#e8952a]',   avatar: '🧑‍🍳', avatarBg: 'from-amber-500 to-orange-600', added: false },
  { id: 5, name: 'Riya Desai',     username: '@riyadesserts', specialty: 'Modern Desserts',     mutuals: 3,  label: 'Trending Creator',    labelGradient: 'from-pink-500 to-fuchsia-600',  avatar: '👩‍🦰', avatarBg: 'from-fuchsia-400 to-pink-500', added: false },
  { id: 6, name: 'Aditya Kulkarni', username: '@adichef',     specialty: 'Maharashtrian Food',  mutuals: 7,  label: 'Nearby Foodie',       labelGradient: 'from-green-500 to-emerald-600', avatar: '👨',    avatarBg: 'from-green-500 to-teal-600',   added: false },
]

const ACTIVITY = [
  { id: 1, text: 'Emma liked your burger reel',           time: '2m',  emoji: '❤️' },
  { id: 2, text: 'Alex started following you',            time: '15m', emoji: '✨' },
  { id: 3, text: 'Sophia uploaded a dessert reel',        time: '1h',  emoji: '🍰' },
  { id: 4, text: 'Raj saved your biryani recipe',         time: '2h',  emoji: '🔖' },
  { id: 5, text: 'Meera invited you to a cook-off',       time: '3h',  emoji: '🍳' },
  { id: 6, text: 'Priya commented on your pasta reel',   time: '4h',  emoji: '💬' },
]

const ONLINE_FRIENDS = [
  { name: 'Priya',  avatar: '👩‍🍳', avatarBg: 'from-pink-400 to-rose-500'    },
  { name: 'Arjun',  avatar: '👨‍🍳', avatarBg: 'from-amber-400 to-orange-500' },
  { name: 'Rohit',  avatar: '🧑‍🍳', avatarBg: 'from-teal-400 to-cyan-500'   },
  { name: 'Meera',  avatar: '👩',    avatarBg: 'from-red-400 to-rose-500'     },
]

const TRENDING_RECIPES = [
  { title: 'Butter Chicken Masala', likes: '48.2k', emoji: '🍛', gradient: 'from-orange-500 to-red-500'   },
  { title: 'Hyderabadi Biryani',    likes: '31.5k', emoji: '🍚', gradient: 'from-amber-400 to-orange-500' },
  { title: 'Mango Shrikhand',       likes: '27.3k', emoji: '🥭', gradient: 'from-pink-400 to-fuchsia-500' },
]

const LIVE_SESSIONS = [
  { name: 'Rohit Verma',  event: 'BBQ Masterclass',       time: 'In 30 min',  avatarBg: 'from-teal-400 to-cyan-500',    avatar: '🧑‍🍳' },
  { name: 'Kavitha Rao',  event: 'Dessert Reel Live',     time: 'Tomorrow',   avatarBg: 'from-fuchsia-400 to-purple-500', avatar: '👩‍🦳' },
  { name: 'Chef Vikram',  event: 'Kerala Fish Masterclass', time: 'In 2 days', avatarBg: 'from-teal-500 to-cyan-600',    avatar: '👨‍🍳' },
]

/* ─── Sub-components ─────────────────────────────────────── */

function FriendCard({ friend }: { friend: Friend }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={cardReveal}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-3xl p-5 shadow-md hover:shadow-xl hover:shadow-[#F5C518]/12 dark:hover:shadow-[#f6c68b]/12 transition-shadow duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Ambient glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#F5C518]/6 dark:bg-[#f6c68b]/6 blur-2xl group-hover:bg-[#F5C518]/14 dark:group-hover:bg-[#f6c68b]/14 transition-all duration-500 pointer-events-none" />

      {/* Online badge */}
      {friend.online && (
        <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
        </span>
      )}

      {/* Avatar */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${friend.avatarBg} flex items-center justify-center text-2xl shadow-lg mb-3`}>
        {friend.avatar}
      </div>

      {/* Name + bio */}
      <div className="mb-3">
        <h3 className="font-heading font-bold text-zinc-900 dark:text-zinc-100 text-[15px] leading-tight">{friend.name}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{friend.username}</p>
        <p className="text-zinc-600 dark:text-zinc-300 text-xs mt-2 leading-relaxed line-clamp-2">{friend.bio}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 bg-[#F5C518]/15 dark:bg-[#f6c68b]/15 text-[#B38B00] dark:text-[#f6c68b] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#F5C518]/25 dark:border-[#f6c68b]/25">
          {friend.cuisineTag}
        </span>
        <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 text-[10px] font-medium px-2.5 py-1 rounded-full">
          <ChefHat className="w-2.5 h-2.5" />{friend.level}
        </span>
      </div>

      {/* Mutuals */}
      <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mb-3 flex items-center gap-1">
        <Users className="w-3 h-3" />{friend.mutuals} mutual friends
      </p>

      {/* Recipe previews */}
      <div className="flex gap-1.5 mb-3">
        {friend.recipes.map((r, i) => (
          <div key={i} className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-base shadow-sm`}>
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Last active */}
      <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mb-4 italic">{friend.lastActive}</p>

      {/* Action buttons */}
      <AnimatePresence mode="wait">
        {hovered ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] text-[#1A1A1A] dark:text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-[#F5C518]/30 dark:shadow-[#e8952a]/25"
              >
                <MessageCircle className="w-3.5 h-3.5" />Message
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-700/70 text-zinc-700 dark:text-zinc-200 text-xs font-semibold py-2.5 rounded-xl"
              >
                <Play className="w-3.5 h-3.5" />Profile
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-1.5 bg-[#F5C518]/12 dark:bg-[#f6c68b]/12 border border-[#F5C518]/30 dark:border-[#f6c68b]/30 text-[#B38B00] dark:text-[#f6c68b] text-xs font-semibold py-2 rounded-xl"
            >
              <ChefHat className="w-3.5 h-3.5" />Invite to Cook
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] text-[#1A1A1A] dark:text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-[#F5C518]/30 dark:shadow-[#e8952a]/25">
              <MessageCircle className="w-3.5 h-3.5" />Message
            </button>
            <button className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-700/70 text-zinc-600 dark:text-zinc-300 py-2.5 px-3 rounded-xl">
              <Users className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CreatorCard({ creator }: { creator: Creator }) {
  const [following, setFollowing] = useState(true)

  const statusConfig = {
    live:     { label: '● Live Now',         bg: 'bg-red-500' },
    cooking:  { label: '🍳 Cooking Now',     bg: 'bg-[#e8952a]' },
    trending: { label: '🔥 Trending',        bg: 'bg-violet-500' },
  }

  const status = creator.status ? statusConfig[creator.status] : null

  return (
    <motion.div
      variants={cardReveal}
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="flex items-center gap-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:shadow-[#F5C518]/8 dark:hover:shadow-[#f6c68b]/8 transition-shadow duration-300"
    >
      {/* Avatar + verified badge */}
      <div className="relative shrink-0">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${creator.avatarBg} flex items-center justify-center text-2xl shadow-md`}>
          {creator.avatar}
        </div>
        {creator.verified && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] flex items-center justify-center shadow-sm">
            <Check className="w-2.5 h-2.5 text-[#1A1A1A] dark:text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight truncate">{creator.name}</h3>
          {status && (
            <span className={`inline-flex items-center gap-1 ${status.bg} text-white text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0`}>
              {status.label}
            </span>
          )}
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{creator.username} · {creator.followers} followers</p>
        <p className="text-zinc-600 dark:text-zinc-300 text-xs mt-1 truncate">{creator.specialty}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${creator.recipe.gradient} flex items-center justify-center text-xs shadow-sm`}>
            {creator.recipe.emoji}
          </div>
          <span className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate">{creator.recipe.title}</span>
        </div>
      </div>

      {/* Follow toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setFollowing(f => !f)}
        className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${following
          ? 'bg-zinc-100 dark:bg-zinc-700/70 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600'
          : 'bg-gradient-to-r from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] text-[#1A1A1A] dark:text-white shadow-md shadow-[#F5C518]/30 dark:shadow-[#e8952a]/25'
        }`}
      >
        {following ? 'Following' : 'Follow'}
      </motion.button>
    </motion.div>
  )
}

function FollowerCard({ follower, onFollowBack }: { follower: Follower; onFollowBack: (id: number) => void }) {
  return (
    <motion.div
      variants={cardReveal}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:shadow-[#F5C518]/8 dark:hover:shadow-[#f6c68b]/8 transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${follower.avatarBg} flex items-center justify-center text-xl shadow-md shrink-0`}>
          {follower.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{follower.name}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">{follower.username}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => onFollowBack(follower.id)}
          className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors ${follower.followedBack
            ? 'bg-zinc-100 dark:bg-zinc-700/70 text-zinc-500 dark:text-zinc-400'
            : 'bg-gradient-to-r from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] text-[#1A1A1A] dark:text-white shadow-md shadow-[#F5C518]/30 dark:shadow-[#e8952a]/25'
          }`}
        >
          {follower.followedBack ? 'Following' : 'Follow Back'}
        </motion.button>
      </div>

      {/* Shared interest pill */}
      <div className="bg-[#F5C518]/10 dark:bg-[#f6c68b]/8 border border-[#F5C518]/20 dark:border-[#f6c68b]/20 rounded-xl px-3 py-2 flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-[#B38B00] dark:text-[#e8952a] shrink-0" />
        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">{follower.sharedInterest}</p>
        <span className="ml-auto text-[10px] font-bold text-[#B38B00] dark:text-[#e8952a] shrink-0">{follower.compatibility}%</span>
      </div>
    </motion.div>
  )
}

function SuggestionCard({ suggestion, onAdd }: { suggestion: Suggestion; onAdd: (id: number) => void }) {
  return (
    <motion.div
      variants={cardReveal}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-3xl p-5 shadow-md hover:shadow-xl hover:shadow-[#F5C518]/10 dark:hover:shadow-[#f6c68b]/10 transition-shadow duration-300 overflow-hidden w-52 shrink-0"
    >
      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#F5C518]/8 dark:bg-[#f6c68b]/8 blur-2xl pointer-events-none" />

      {/* Smart label */}
      <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${suggestion.labelGradient} text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm mb-3`}>
        <Sparkles className="w-2.5 h-2.5" />{suggestion.label}
      </div>

      {/* Avatar */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${suggestion.avatarBg} flex items-center justify-center text-2xl shadow-lg mb-3`}>
        {suggestion.avatar}
      </div>

      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{suggestion.name}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{suggestion.username}</p>
      <p className="text-zinc-600 dark:text-zinc-300 text-xs mt-1.5 font-medium">{suggestion.specialty}</p>

      {suggestion.mutuals > 0 && (
        <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mt-1.5 flex items-center gap-1">
          <Users className="w-2.5 h-2.5" />{suggestion.mutuals} mutual friends
        </p>
      )}

      <motion.button
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        onClick={() => onAdd(suggestion.id)}
        className={`mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-colors ${suggestion.added
          ? 'bg-zinc-100 dark:bg-zinc-700/70 text-zinc-500 dark:text-zinc-400'
          : 'bg-gradient-to-r from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] text-[#1A1A1A] dark:text-white shadow-md shadow-[#F5C518]/30 dark:shadow-[#e8952a]/25'
        }`}
      >
        {suggestion.added
          ? <><Check className="w-3.5 h-3.5" />Added</>
          : <><UserPlus className="w-3.5 h-3.5" />Add Friend</>}
      </motion.button>
    </motion.div>
  )
}

/* ─── Sidebar panel ──────────────────────────────────────── */

function RightPanel() {
  return (
    <div className="flex flex-col gap-4 w-72 shrink-0">

      {/* Online now */}
      <motion.div {...fadeSlide(0.12)} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Online Now</h3>
          <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
            {ONLINE_FRIENDS.length} active
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {ONLINE_FRIENDS.map((f, i) => (
            <motion.div key={i} whileHover={{ scale: 1.12, y: -2 }} className="flex flex-col items-center gap-1 cursor-pointer">
              <div className="relative">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.avatarBg} flex items-center justify-center text-lg shadow-md`}>
                  {f.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 dark:text-zinc-400">{f.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Friend activity */}
      <motion.div {...fadeSlide(0.18)} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-3xl p-5 shadow-sm">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-4">Friend Activity</h3>
        <div className="flex flex-col gap-3">
          {ACTIVITY.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.06, duration: 0.35, ease: EASE }}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <span className="text-base mt-0.5 shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{a.text}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{a.time} ago</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending among friends */}
      <motion.div {...fadeSlide(0.24)} className="bg-gradient-to-br from-[#F5C518]/10 to-[#FFD84D]/5 dark:from-[#f6c68b]/8 dark:to-[#e8952a]/4 border border-[#F5C518]/25 dark:border-[#f6c68b]/25 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-[#B38B00] dark:text-[#e8952a]" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Trending Among Friends</h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {TRENDING_RECIPES.map((r, i) => (
            <div key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-base shadow-sm shrink-0`}>
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#B38B00] dark:group-hover:text-[#f6c68b] transition-colors truncate">{r.title}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />{r.likes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live sessions */}
      <motion.div {...fadeSlide(0.30)} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-4 h-4 text-red-500" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Live Cooking Sessions</h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {LIVE_SESSIONS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.avatarBg} flex items-center justify-center text-base shadow-sm shrink-0`}>
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{s.name} — {s.event}</p>
                <p className="text-[10px] text-[#B38B00] dark:text-[#e8952a] font-semibold">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */

export function FriendsPage({ username = 'Chef' }: { username?: string }) {
  const [activeTab, setActiveTab]   = useState<Tab>('Friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [followers, setFollowers]   = useState(FOLLOWERS_DATA)
  const [suggestions, setSuggestions] = useState(SUGGESTIONS)

  function handleFollowBack(id: number) {
    setFollowers(f => f.map(x => x.id === id ? { ...x, followedBack: !x.followedBack } : x))
  }

  function handleAddFriend(id: number) {
    setSuggestions(s => s.map(x => x.id === id ? { ...x, added: !x.added } : x))
  }

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">

      {/* ── Main content ─────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Page header */}
        <motion.div {...fadeSlide(0)} className="mb-7">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-100 leading-tight">
                Friends
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5 font-medium">
                Connect, cook, and discover recipes together.
              </p>
            </div>

            {/* Search + bell */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search friends or creators..."
                  className="w-56 sm:w-72 pl-10 pr-4 py-2.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 dark:focus:ring-[#f6c68b]/50 shadow-sm transition-shadow"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                className="relative p-2.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl shadow-sm"
              >
                <Bell className="w-4.5 h-4.5 text-zinc-500 dark:text-zinc-400" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#F5C518] dark:bg-[#e8952a]" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tab bar */}
        <motion.div {...fadeSlide(0.08)} className="flex gap-2 flex-wrap mb-7">
          {TABS.map(({ label, count }) => (
            <motion.button
              key={label}
              onClick={() => setActiveTab(label)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === label
                  ? 'bg-gradient-to-r from-[#F5C518] to-[#FFD84D] dark:from-[#f6c68b] dark:to-[#e8952a] text-[#1A1A1A] dark:text-white shadow-lg shadow-[#F5C518]/30 dark:shadow-[#e8952a]/25'
                  : 'bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300 hover:border-[#F5C518]/40 dark:hover:border-[#f6c68b]/40 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                  activeTab === label
                    ? 'bg-white/25 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                }`}>{count}</span>
              )}
              {activeTab === label && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-2xl ring-2 ring-[#F5C518]/25 dark:ring-[#e8952a]/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">

          {/* Friends */}
          {activeTab === 'Friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {FRIENDS.map(f => <FriendCard key={f.id} friend={f} />)}
              </motion.div>
            </motion.div>
          )}

          {/* Following */}
          {activeTab === 'Following' && (
            <motion.div
              key="following"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {FOLLOWING.map(c => <CreatorCard key={c.id} creator={c} />)}
              </motion.div>
            </motion.div>
          )}

          {/* Followers */}
          {activeTab === 'Followers' && (
            <motion.div
              key="followers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {followers.map(f => (
                  <FollowerCard key={f.id} follower={f} onFollowBack={handleFollowBack} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Add Friends */}
          {activeTab === 'Add Friends' && (
            <motion.div
              key="add-friends"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {/* Suggested for you */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-100">
                    Suggested for You
                  </h2>
                  <button className="text-xs font-semibold text-[#B38B00] dark:text-[#f6c68b] hover:underline">
                    See all
                  </button>
                </div>
                <div className="overflow-x-auto pb-3 scrollbar-none [scroll-snap-type:x_mandatory]">
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-4"
                  >
                    {suggestions.map(s => (
                      <div key={s.id} className="[scroll-snap-align:start]">
                        <SuggestionCard suggestion={s} onAdd={handleAddFriend} />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Trending creators to follow */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4.5 h-4.5 text-[#B38B00] dark:text-[#e8952a]" />
                  <h2 className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-100">
                    Trending Creators
                  </h2>
                </div>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  {FOLLOWING.map(c => <CreatorCard key={c.id} creator={c} />)}
                </motion.div>
              </div>

              {/* Nearby foodies */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4.5 h-4.5 text-rose-500" />
                  <h2 className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-100">
                    Nearby Foodies
                  </h2>
                </div>
                <div className="overflow-x-auto pb-3 scrollbar-none [scroll-snap-type:x_mandatory]">
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-4"
                  >
                    {suggestions.slice(0, 4).map(s => (
                      <div key={s.id} className="[scroll-snap-align:start]">
                        <SuggestionCard
                          suggestion={{ ...s, label: 'Nearby Foodie', labelGradient: 'from-rose-500 to-pink-600' }}
                          onAdd={handleAddFriend}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Right sidebar (desktop only) ─── */}
      <div className="hidden xl:block">
        <RightPanel />
      </div>

    </div>
  )
}
