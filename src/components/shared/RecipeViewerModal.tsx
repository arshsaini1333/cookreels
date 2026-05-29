'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronLeft, ChevronRight, Heart, MessageCircle,
  Clock, Share2, Bookmark, BadgeCheck, Send, Calendar,
  ChefHat, Flame,
} from 'lucide-react'
import type { ProfileRecipe, ProfileUser } from '@/components/profile/ProfilePage'

// ─── Extended data fetched per-recipe ────────────────────────────────────────

interface RecipeDetail {
  description?: string | null
  servings?: number | null
  createdAt?: string | null
  commentCount?: number
  comments?: RecipeComment[]
}

interface RecipeComment {
  id: string
  username: string
  userAvatar?: string | null
  text: string
  createdAt?: string | null
  likeCount?: number
}

// ─── Public props ─────────────────────────────────────────────────────────────

export interface RecipeViewerModalProps {
  recipes: ProfileRecipe[]
  initialIndex: number
  user: ProfileUser
  isOpen: boolean
  onClose: () => void
  currentUserAvatar?: string | null
  currentUserName?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function fmtTime(min: number | null | undefined) {
  if (!min) return '—'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60), m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function fmtDate(s: string | null | undefined) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return '' }
}

const GRADIENTS = [
  'from-orange-600 to-rose-600',   'from-amber-500 to-orange-700',
  'from-pink-400 to-fuchsia-600',  'from-yellow-500 to-amber-600',
  'from-emerald-500 to-teal-700',  'from-red-500 to-orange-600',
  'from-rose-400 to-pink-600',     'from-green-500 to-emerald-600',
  'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-600',
]

const DIFF_LABEL: Record<string, string> = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' }
const DIFF_COLOR: Record<string, string> = {
  EASY:   'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  HARD:   'bg-red-500/20 text-red-300 border border-red-500/30',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ src, name, size = 'md' }: { src?: string | null; name: string; size?: 'sm' | 'md' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
  return (
    <div className={`${dim} rounded-full overflow-hidden flex-shrink-0`}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold"
               style={{ background: 'linear-gradient(135deg,#F5C518,#FFB800)', color: '#1A1A1A' }}>{initials}</div>
      }
    </div>
  )
}

function Bone({ w = 'w-full' }: { w?: string }) {
  return <div className={`h-3 rounded-full animate-pulse ${w}`} style={{ background: 'var(--cr-border)' }} />
}

// Whole-panel slide variants — image + content move as one unit
const slideV = {
  enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit:  (d: number) => ({ x: d >= 0 ? '-100%' : '100%' }),
}

// ─── RecipeViewerModal ────────────────────────────────────────────────────────

export function RecipeViewerModal({
  recipes, initialIndex, user, isOpen, onClose,
  currentUserAvatar, currentUserName,
}: RecipeViewerModalProps) {

  const [mounted, setMounted]           = useState(false)
  useEffect(() => setMounted(true), [])

  const [index,         setIndex]         = useState(initialIndex)
  const [direction,     setDirection]     = useState(0)
  const [liked,         setLiked]         = useState(false)
  const [likeCount,     setLikeCount]     = useState(0)
  const [saved,         setSaved]         = useState(false)
  const [commentText,   setCommentText]   = useState('')
  const [detail,        setDetail]        = useState<RecipeDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [expanded,      setExpanded]      = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const commentRef   = useRef<HTMLInputElement>(null)
  const touchX       = useRef<number | null>(null)
  const touchY       = useRef<number | null>(null)

  const recipe  = recipes[index]
  const hasPrev = index > 0
  const hasNext = index < recipes.length - 1

  useEffect(() => {
    if (!isOpen || !recipe) return
    setLiked(false)
    setLikeCount(recipe.likeCount)
    setDetail(null)
    setExpanded(false)
    setLoadingDetail(true)

    let dead = false
    fetch(`/api/recipes/${recipe.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!dead && d) setDetail(d) })
      .catch(() => {})
      .finally(() => { if (!dead) setLoadingDetail(false) })
    return () => { dead = true }
  }, [isOpen, recipe?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navigate = useCallback((dir: number) => {
    setDirection(dir)
    setIndex(i => {
      const n = i + dir
      return n >= 0 && n < recipes.length ? n : i
    })
  }, [recipes.length])

  useEffect(() => {
    if (!isOpen) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, onClose, navigate])

  useEffect(() => {
    if (!isOpen || !containerRef.current) return
    const el  = containerRef.current
    const sel = 'button:not([disabled]),input:not([disabled]),[href],[tabindex]:not([tabindex="-1"])'
    const all = () => Array.from(el.querySelectorAll<HTMLElement>(sel))
    const t   = setTimeout(() => all()[0]?.focus(), 80)
    const fn  = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = all()
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey  && document.activeElement === first) { e.preventDefault(); last?.focus() }
      if (!e.shiftKey && document.activeElement === last)  { e.preventDefault(); first?.focus() }
    }
    el.addEventListener('keydown', fn)
    return () => { clearTimeout(t); el.removeEventListener('keydown', fn) }
  }, [isOpen])

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
    touchY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || touchY.current === null) return
    const dx = touchX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) navigate(dx > 0 ? 1 : -1)
    touchX.current = touchY.current = null
  }

  const handleLike = () => {
    setLiked(l => { setLikeCount(c => l ? c - 1 : c + 1); return !l })
  }

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: recipe?.title, url: window.location.href })
      else await navigator.clipboard.writeText(window.location.href)
    } catch {}
  }

  if (!recipe || !mounted) return null

  const gradient  = GRADIENTS[index % GRADIENTS.length]
  const diffKey   = recipe.difficulty ?? ''
  const totalTime = (recipe.cookTime ?? 0) + (recipe.prepTime ?? 0)
  const commenter = currentUserName ?? user.name

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="rv-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 bg-black/75 backdrop-blur-xl"
            style={{ zIndex: 9998 }}
          />

          {/* Outer nav arrows — desktop only */}
          {hasPrev && (
            <motion.button
              key="rv-prev-ext"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => navigate(-1)}
              aria-label="Previous recipe"
              className="fixed left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm
                         items-center justify-center hover:bg-white/30 transition-colors hidden md:flex"
              style={{ zIndex: 10000 }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
          )}
          {hasNext && (
            <motion.button
              key="rv-next-ext"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => navigate(1)}
              aria-label="Next recipe"
              className="fixed right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm
                         items-center justify-center hover:bg-white/30 transition-colors hidden md:flex"
              style={{ zIndex: 10000 }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          )}

          {/* Modal shell */}
          <motion.div
            key="rv-shell"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.91, y: 24 }}
            transition={{ type: 'spring', stiffness: 310, damping: 30 }}
            className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 md:p-6 pointer-events-none"
            style={{ zIndex: 9999 }}
            role="dialog"
            aria-modal="true"
            aria-label={recipe.title}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={containerRef}
              onClick={e => e.stopPropagation()}
              className="
                pointer-events-auto relative w-full overflow-hidden flex flex-col
                rounded-t-3xl max-h-[93dvh]
                sm:rounded-3xl sm:max-w-2xl sm:max-h-[92vh]
                md:max-w-5xl md:rounded-3xl md:h-[88vh] md:max-h-[800px]
              "
              style={{ background: 'var(--cr-bg-card)' }}
            >

              {/* ══ FIXED HEADER — stays put during slide ══ */}
              <div
                className="relative z-10 flex items-center justify-between px-4 py-3 flex-shrink-0 border-b"
                style={{ borderColor: 'var(--cr-border)', background: 'var(--cr-bg-card)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="ring-2 ring-offset-2 rounded-full flex-shrink-0"
                       style={{ '--tw-ring-color': 'var(--cr-accent)', '--tw-ring-offset-color': 'var(--cr-bg-card)' } as React.CSSProperties}>
                    <Avatar src={user.avatar} name={user.name} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-sm font-semibold truncate" style={{ color: 'var(--cr-text-1)' }}>
                        {user.name}
                      </span>
                      {user.verified && <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--cr-accent)' }} />}
                      {user.topChef && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg,#F5C518,#FFB800)', color: '#1A1A1A' }}>👑</span>
                      )}
                    </div>
                    <span className="text-[11px]" style={{ color: 'var(--cr-text-muted)' }}>{user.username}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                             transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" style={{ color: 'var(--cr-text-2)' }} />
                </button>
              </div>

              {/* ══ SLIDE REGION — image + body move as one ══ */}
              <div className="flex-1 relative overflow-hidden min-h-0">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={recipe.id}
                    custom={direction}
                    variants={slideV}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 360, damping: 36 }}
                    className="absolute inset-0 flex flex-col md:flex-row"
                  >

                    {/* ── IMAGE PANEL ──────────────────────── */}
                    <div
                      className="
                        relative flex-shrink-0 bg-black overflow-hidden
                        w-full h-56 xs:h-64 sm:h-72
                        md:w-[46%] md:h-full
                      "
                    >
                      {recipe.coverImage
                        ? <img src={recipe.coverImage} alt={recipe.title}
                               className="w-full h-full object-cover" loading="lazy" />
                        : <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <span className="text-7xl opacity-40">🍽️</span>
                          </div>
                      }

                      {/* Gradient overlays */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                      {/* Difficulty */}
                      {diffKey && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${DIFF_COLOR[diffKey] ?? ''}`}>
                            {DIFF_LABEL[diffKey] ?? diffKey}
                          </span>
                        </div>
                      )}

                      {/* Counter badge */}
                      {recipes.length > 1 && (
                        <div className="absolute top-3 right-3 z-10 text-[11px] font-semibold text-white
                                        bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                          {index + 1} / {recipes.length}
                        </div>
                      )}

                      {/* Mobile arrows */}
                      {hasPrev && (
                        <button onClick={() => navigate(-1)} aria-label="Previous recipe"
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                                           bg-black/50 backdrop-blur-sm flex items-center justify-center
                                           active:scale-90 transition-transform md:hidden">
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                      )}
                      {hasNext && (
                        <button onClick={() => navigate(1)} aria-label="Next recipe"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
                                           bg-black/50 backdrop-blur-sm flex items-center justify-center
                                           active:scale-90 transition-transform md:hidden">
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>

                    {/* ── CONTENT COLUMN ───────────────────── */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

                      {/* Scrollable body */}
                      <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="px-4 py-4 space-y-4">

                          {/* Title + chips */}
                          <div>
                            <h2 className="text-base sm:text-lg font-bold leading-snug"
                                style={{ fontFamily: 'var(--font-heading)', color: 'var(--cr-text-1)' }}>
                              {recipe.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {totalTime > 0 && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                                      style={{ background: 'var(--cr-bg-surface)', color: 'var(--cr-text-muted)' }}>
                                  <Clock className="w-3 h-3" />{fmtTime(totalTime)}
                                </span>
                              )}
                              {recipe.cookTime && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                                      style={{ background: 'var(--cr-bg-surface)', color: 'var(--cr-text-muted)' }}>
                                  <ChefHat className="w-3 h-3" />Cook {fmtTime(recipe.cookTime)}
                                </span>
                              )}
                              {detail?.servings && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                                      style={{ background: 'var(--cr-bg-surface)', color: 'var(--cr-text-muted)' }}>
                                  <Flame className="w-3 h-3" />{detail.servings} servings
                                </span>
                              )}
                              {detail?.createdAt && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                                      style={{ background: 'var(--cr-bg-surface)', color: 'var(--cr-text-muted)' }}>
                                  <Calendar className="w-3 h-3" />{fmtDate(detail.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          {loadingDetail ? (
                            <div className="space-y-2"><Bone /><Bone w="w-5/6" /><Bone w="w-4/6" /></div>
                          ) : detail?.description ? (
                            <div>
                              <p className={`text-sm leading-relaxed ${!expanded ? 'line-clamp-3 sm:line-clamp-none' : ''}`}
                                 style={{ color: 'var(--cr-text-2)' }}>
                                {detail.description}
                              </p>
                              <button onClick={() => setExpanded(v => !v)}
                                      className="sm:hidden mt-1.5 text-xs font-semibold"
                                      style={{ color: 'var(--cr-accent)' }}>
                                {expanded ? 'Show less' : 'Read more'}
                              </button>
                            </div>
                          ) : null}

                          <div className="border-t" style={{ borderColor: 'var(--cr-border)' }} />

                          {/* Comments */}
                          <div>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--cr-text-1)' }}>
                              Comments
                              {!loadingDetail && detail?.commentCount != null && (
                                <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--cr-text-muted)' }}>
                                  ({fmt(detail.commentCount)})
                                </span>
                              )}
                            </h3>

                            {loadingDetail ? (
                              <div className="space-y-4">
                                {[0, 1, 2].map(i => (
                                  <div key={i} className="flex gap-2.5 animate-pulse">
                                    <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: 'var(--cr-border)' }} />
                                    <div className="flex-1 space-y-2 pt-1"><Bone w="w-1/3" /><Bone w="w-3/4" /></div>
                                  </div>
                                ))}
                              </div>
                            ) : detail?.comments?.length ? (
                              <div className="space-y-4">
                                {detail.comments.map(c => (
                                  <div key={c.id} className="flex gap-2.5">
                                    <Avatar src={c.userAvatar} name={c.username} size="sm" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-baseline gap-1.5 flex-wrap">
                                        <span className="text-xs font-semibold" style={{ color: 'var(--cr-text-1)' }}>{c.username}</span>
                                        {c.createdAt && (
                                          <span className="text-[10px]" style={{ color: 'var(--cr-text-muted)' }}>{fmtDate(c.createdAt)}</span>
                                        )}
                                      </div>
                                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--cr-text-2)' }}>{c.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs py-6 text-center" style={{ color: 'var(--cr-text-muted)' }}>
                                No comments yet. Be the first!
                              </p>
                            )}
                          </div>

                          <div className="h-1" />
                        </div>
                      </div>

                      {/* Footer: actions + comment input */}
                      <div className="flex-shrink-0 border-t" style={{ borderColor: 'var(--cr-border)' }}>
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={handleLike}
                              aria-label={liked ? 'Unlike' : 'Like'}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors"
                              style={{ color: liked ? '#F5C518' : 'var(--cr-text-muted)' }}
                            >
                              <motion.span animate={{ scale: liked ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.25 }}>
                                <Heart className="w-5 h-5"
                                       style={{ fill: liked ? '#F5C518' : 'transparent',
                                                color: liked ? '#F5C518' : 'var(--cr-text-muted)' }} />
                              </motion.span>
                              <span className="text-xs font-semibold tabular-nums">{fmt(likeCount)}</span>
                            </motion.button>

                            <button onClick={() => commentRef.current?.focus()} aria-label="Comment"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                                    style={{ color: 'var(--cr-text-muted)' }}>
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-xs font-semibold tabular-nums">
                                {detail?.commentCount != null ? fmt(detail.commentCount) : '—'}
                              </span>
                            </button>
                          </div>

                          <div className="flex items-center">
                            <motion.button
                              whileTap={{ scale: 0.82 }}
                              onClick={() => setSaved(s => !s)}
                              aria-label={saved ? 'Unsave' : 'Save'}
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{ color: saved ? '#F5C518' : 'var(--cr-text-muted)' }}
                            >
                              <Bookmark className="w-5 h-5"
                                        style={{ fill: saved ? '#F5C518' : 'transparent',
                                                 color: saved ? '#F5C518' : 'var(--cr-text-muted)' }} />
                            </motion.button>

                            <button onClick={handleShare} aria-label="Share"
                                    className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70"
                                    style={{ color: 'var(--cr-text-muted)' }}>
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Comment input */}
                        <div className="flex items-center gap-2.5 px-4 pb-4">
                          <Avatar src={currentUserAvatar ?? user.avatar} name={commenter} size="sm" />
                          <div className="flex-1 flex items-center gap-2 rounded-full px-3.5 py-2"
                               style={{ background: 'var(--cr-bg-surface)', border: '1px solid var(--cr-border)' }}>
                            <input
                              ref={commentRef}
                              type="text"
                              value={commentText}
                              onChange={e => setCommentText(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && commentText.trim()) setCommentText('') }}
                              placeholder="Add a comment…"
                              aria-label="Add a comment"
                              className="flex-1 bg-transparent text-sm outline-none min-w-0"
                              style={{ color: 'var(--cr-text-1)' }}
                            />
                            <AnimatePresence>
                              {commentText.trim() && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.6 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.6 }}
                                  transition={{ duration: 0.14 }}
                                  onClick={() => setCommentText('')}
                                  aria-label="Post comment"
                                  className="flex-shrink-0"
                                >
                                  <Send className="w-4 h-4" style={{ color: 'var(--cr-accent)' }} />
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
