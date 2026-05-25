'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plus, Image, Video, Utensils, Timer,
} from 'lucide-react'
import { uploadToS3 } from '@/lib/uploadTos3'

// ─── Category data ────────────────────────────────────────────────────────────

const CATEGORY_GROUPS = [
  {
    group: 'Meal Type',
    items: [
      { id: 'breakfast',  label: 'Breakfast',   emoji: '☀️' },
      { id: 'lunch',      label: 'Lunch',        emoji: '🍱' },
      { id: 'dinner',     label: 'Dinner',       emoji: '🌙' },
      { id: 'brunch',     label: 'Brunch',       emoji: '🥞' },
      { id: 'snacks',     label: 'Snacks',       emoji: '🍿' },
      { id: 'appetizer',  label: 'Appetizer',    emoji: '🥗' },
    ],
  },
  {
    group: 'Sweets & Drinks',
    items: [
      { id: 'sweet_dish', label: 'Sweet Dish',   emoji: '🍰' },
      { id: 'dessert',    label: 'Dessert',      emoji: '🧁' },
      { id: 'shakes',     label: 'Shakes',       emoji: '🥤' },
      { id: 'smoothies',  label: 'Smoothies',    emoji: '🥝' },
      { id: 'juice',      label: 'Juice',        emoji: '🍹' },
      { id: 'beverages',  label: 'Beverages',    emoji: '☕' },
    ],
  },
  {
    group: 'Indian Cuisine',
    items: [
      { id: 'north_indian',  label: 'North Indian',  emoji: '🫓' },
      { id: 'south_indian',  label: 'South Indian',  emoji: '🥘' },
      { id: 'punjabi',       label: 'Punjabi',        emoji: '🧆' },
      { id: 'bengali',       label: 'Bengali',        emoji: '🐟' },
      { id: 'rajasthani',    label: 'Rajasthani',     emoji: '🌵' },
      { id: 'street_food',   label: 'Street Food',    emoji: '🌮' },
      { id: 'mughlai',       label: 'Mughlai',        emoji: '🍖' },
      { id: 'gujarati',      label: 'Gujarati',       emoji: '🫘' },
    ],
  },
  {
    group: 'World Cuisine',
    items: [
      { id: 'chinese',       label: 'Chinese',        emoji: '🥡' },
      { id: 'italian',       label: 'Italian',        emoji: '🍝' },
      { id: 'mexican',       label: 'Mexican',        emoji: '🌯' },
      { id: 'thai',          label: 'Thai',           emoji: '🍜' },
      { id: 'japanese',      label: 'Japanese',       emoji: '🍣' },
      { id: 'korean',        label: 'Korean',         emoji: '🥢' },
      { id: 'mediterranean', label: 'Mediterranean',  emoji: '🫒' },
      { id: 'american',      label: 'American',       emoji: '🍔' },
      { id: 'french',        label: 'French',         emoji: '🥐' },
      { id: 'spanish',       label: 'Spanish',        emoji: '🥘' },
      { id: 'greek',         label: 'Greek',          emoji: '🫙' },
      { id: 'middle_east',   label: 'Middle Eastern', emoji: '🧆' },
      { id: 'turkish',       label: 'Turkish',        emoji: '🥙' },
      { id: 'vietnamese',    label: 'Vietnamese',     emoji: '🍲' },
    ],
  },
  {
    group: 'Dietary',
    items: [
      { id: 'vegetarian',  label: 'Vegetarian',  emoji: '🥦' },
      { id: 'vegan',       label: 'Vegan',        emoji: '🌱' },
      { id: 'non_veg',     label: 'Non-Veg',      emoji: '🍗' },
      { id: 'gluten_free', label: 'Gluten-Free',  emoji: '🌾' },
      { id: 'keto',        label: 'Keto',         emoji: '🥑' },
      { id: 'healthy',     label: 'Healthy',      emoji: '💪' },
      { id: 'low_cal',     label: 'Low-Calorie',  emoji: '🥗' },
    ],
  },
  {
    group: 'Special',
    items: [
      { id: 'quick_meals', label: 'Quick Meals',  emoji: '⚡' },
      { id: 'baking',      label: 'Baking',       emoji: '🍞' },
      { id: 'bbq_grill',   label: 'BBQ & Grill',  emoji: '🔥' },
      { id: 'soups',       label: 'Soups',        emoji: '🍲' },
      { id: 'salads',      label: 'Salads',       emoji: '🥬' },
      { id: 'sandwich',    label: 'Sandwiches',   emoji: '🥪' },
      { id: 'festive',     label: 'Festive',      emoji: '🎉' },
      { id: 'kids',        label: 'Kids Menu',    emoji: '🧒' },
      { id: 'other',       label: 'Other',        emoji: '✨' },
    ],
  },
] as const

// ─── CategoryPicker ───────────────────────────────────────────────────────────

function CategoryPicker({
  selected,
  onChange,
}: {
  selected: Set<string>
  onChange: (next: Set<string>) => void
}) {
  const toggle = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {CATEGORY_GROUPS.map(group => (
        <div key={group.group}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--cr-text-muted)' }}>
            {group.group}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map(item => {
              const active = selected.has(item.id)
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                  style={
                    active
                      ? { background: 'linear-gradient(135deg,#F5C518,#FFB800)', color: '#1A1A1A', boxShadow: '0 2px 8px rgba(245,197,24,0.35)' }
                      : { background: 'var(--cr-bg-surface)', color: 'var(--cr-text-2)', border: '1px solid var(--cr-border)' }
                  }
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── FileDropZone ─────────────────────────────────────────────────────────────

function FileDropZone({
  accept,
  icon,
  hint,
  preview,
  onFile,
}: {
  accept: string
  icon: React.ReactNode
  hint: string
  preview: string | null
  onFile: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handle = (file: File | undefined) => {
    if (file) onFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]) }}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all"
      style={{
        border: `2px dashed ${dragging ? 'var(--cr-accent)' : 'var(--cr-border)'}`,
        background: dragging ? 'var(--cr-accent-soft)' : 'var(--cr-bg-surface)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handle(e.target.files?.[0])}
      />

      {preview ? (
        accept.startsWith('video') ? (
          <video src={preview} className="w-full max-h-48 object-contain" muted playsInline />
        ) : (
          <img src={preview} alt="preview" className="w-full max-h-48 object-contain" />
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--cr-accent-soft)' }}>
            {icon}
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--cr-text-1)' }}>
            Click or drag & drop
          </p>
          <p className="text-xs" style={{ color: 'var(--cr-text-muted)' }}>{hint}</p>
        </div>
      )}

      {preview && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">Change file</span>
        </div>
      )}
    </div>
  )
}

// ─── AddContentModal ──────────────────────────────────────────────────────────

type ContentType = 'recipe' | 'reel'

export function AddContentModal({
  open,
  onClose,
  userId,
}: {
  open: boolean
  onClose: () => void
  userId: string
}) {
  const router = useRouter()
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => {
      setToast(null)
      if (ok) { onClose(); router.refresh() }
    }, 2000)
  }

  const [type, setType] = useState<ContentType>('recipe')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  const [recipeTitle,  setRecipeTitle]  = useState('')
  const [recipeDesc,   setRecipeDesc]   = useState('')
  const [difficulty,   setDifficulty]   = useState('EASY')
  const [cookTime,     setCookTime]     = useState('')
  const [prepTime,     setPrepTime]     = useState('')
  const [photoFile,    setPhotoFile]    = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [reelTitle,    setReelTitle]    = useState('')
  const [reelDesc,     setReelDesc]     = useState('')
  const [videoFile,    setVideoFile]    = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const [isUploading, setIsUploading] = useState(false)

  const handlePhoto = (file: File) => {
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleVideo = (file: File) => {
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const handleClose = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    setPhotoFile(null); setPhotoPreview(null)
    setVideoFile(null); setVideoPreview(null)
    setRecipeTitle(''); setRecipeDesc(''); setCookTime(''); setPrepTime('')
    setReelTitle(''); setReelDesc('')
    setSelectedCategories(new Set())
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isUploading) return

    try {
      setIsUploading(true)

      if (type === 'recipe') {
        if (!photoFile) { showToast('Please select a cover photo', false); return }
        if (!recipeTitle.trim()) { showToast('Please enter a recipe title', false); return }

        const imageUrl = await uploadToS3(photoFile, 'recipes')
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            title: recipeTitle.trim(),
            description: recipeDesc.trim(),
            coverImage: imageUrl,
            cookTime: cookTime ? Number(cookTime) : null,
            prepTime: prepTime ? Number(prepTime) : null,
            difficulty,
            cuisine: Array.from(selectedCategories)[0] || null,
            isVeg: selectedCategories.has('vegetarian') || selectedCategories.has('vegan'),
          }),
        })
        if (!response.ok) throw new Error('Recipe creation failed')
        showToast('Recipe posted successfully!', true)
      }

      if (type === 'reel') {
        if (!videoFile) { showToast('Please select a video', false); return }
        if (!reelTitle.trim()) { showToast('Please enter a reel title', false); return }

        const videoUrl = await uploadToS3(videoFile, 'reels')
        const duration = await new Promise<number>(resolve => {
          const video = document.createElement('video')
          video.preload = 'metadata'
          video.onloadedmetadata = () => resolve(Math.floor(video.duration))
          video.src = URL.createObjectURL(videoFile)
        })

        const response = await fetch('/api/reels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            title: reelTitle.trim(),
            description: reelDesc.trim(),
            videoUrl,
            duration,
            categories: Array.from(selectedCategories),
          }),
        })
        if (!response.ok) throw new Error('Reel creation failed')
        showToast('Reel posted successfully!', true)
      }
    } catch (error) {
      console.error(error)
      showToast('Upload failed. Please try again.', false)
    } finally {
      setIsUploading(false)
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors'
  const inputStyle = {
    background: 'var(--cr-bg-surface)',
    color: 'var(--cr-text-1)',
    border: '1px solid var(--cr-border)',
  }
  const labelCls = 'text-xs font-semibold mb-1.5 block'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="add-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="add-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-2rem)] max-w-lg rounded-2xl overflow-hidden flex flex-col"
            style={{
              top: 'max(5rem, calc(50% - min(45vh, 320px)))',
              maxHeight: 'calc(100svh - 5.5rem)',
              background: 'var(--cr-bg-card)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
            }}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--cr-border)', background: 'var(--cr-bg-card)' }}>
              <h2 className="text-lg font-bold" style={{ color: 'var(--cr-text-1)', fontFamily: 'var(--font-heading)' }}>
                Add Content
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" style={{ color: 'var(--cr-text-2)' }} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto">
              {/* Type selector */}
              <div className="flex gap-2 px-5 pt-4">
                {(['recipe', 'reel'] as ContentType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={
                      type === t
                        ? { background: 'linear-gradient(135deg,#F5C518,#FFB800)', color: '#1A1A1A' }
                        : { background: 'var(--cr-bg-surface)', color: 'var(--cr-text-2)', border: '1px solid var(--cr-border)' }
                    }
                  >
                    {t === 'recipe' ? <Utensils className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {t === 'recipe' ? 'Recipe' : 'Reel'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4 pb-6">
                {type === 'recipe' ? (
                  <>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Cover Photo *</label>
                      <FileDropZone
                        accept="image/*"
                        icon={<Image className="w-5 h-5" style={{ color: 'var(--cr-accent)' }} />}
                        hint="JPG, PNG, WEBP — up to 10 MB"
                        preview={photoPreview}
                        onFile={handlePhoto}
                      />
                    </div>

                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Recipe Title *</label>
                      <div className="relative">
                        <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--cr-text-muted)' }} />
                        <input
                          className={inputCls}
                          style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                          placeholder="e.g. Spicy Butter Chicken"
                          value={recipeTitle}
                          onChange={e => setRecipeTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Description</label>
                      <textarea
                        className={inputCls + ' resize-none min-h-[72px]'}
                        style={inputStyle}
                        placeholder="Describe your recipe..."
                        value={recipeDesc}
                        onChange={e => setRecipeDesc(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>
                        Category
                        {selectedCategories.size > 0 && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--cr-accent)', color: '#1A1A1A' }}>
                            {selectedCategories.size} selected
                          </span>
                        )}
                      </label>
                      <CategoryPicker selected={selectedCategories} onChange={setSelectedCategories} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Difficulty</label>
                        <select className={inputCls} style={inputStyle} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Cook (min)</label>
                        <div className="relative">
                          <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--cr-text-muted)' }} />
                          <input type="number" min="1" className={inputCls} style={{ ...inputStyle, paddingLeft: '2rem' }} placeholder="30" value={cookTime} onChange={e => setCookTime(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Prep (min)</label>
                        <div className="relative">
                          <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--cr-text-muted)' }} />
                          <input type="number" min="1" className={inputCls} style={{ ...inputStyle, paddingLeft: '2rem' }} placeholder="10" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Video *</label>
                      <FileDropZone
                        accept="video/*"
                        icon={<Video className="w-5 h-5" style={{ color: 'var(--cr-accent)' }} />}
                        hint="MP4, MOV, WEBM — up to 200 MB"
                        preview={videoPreview}
                        onFile={handleVideo}
                      />
                    </div>

                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Reel Title *</label>
                      <div className="relative">
                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--cr-text-muted)' }} />
                        <input
                          className={inputCls}
                          style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                          placeholder="e.g. 60-Second Pasta"
                          value={reelTitle}
                          onChange={e => setReelTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>Caption</label>
                      <textarea
                        className={inputCls + ' resize-none min-h-[72px]'}
                        style={inputStyle}
                        placeholder="Write a caption..."
                        value={reelDesc}
                        onChange={e => setReelDesc(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls} style={{ color: 'var(--cr-text-muted)' }}>
                        Category
                        {selectedCategories.size > 0 && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--cr-accent)', color: '#1A1A1A' }}>
                            {selectedCategories.size} selected
                          </span>
                        )}
                      </label>
                      <CategoryPicker selected={selectedCategories} onChange={setSelectedCategories} />
                    </div>
                  </>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-md mt-2"
                  style={{ background: 'linear-gradient(135deg,#F5C518,#FFB800)', color: '#1A1A1A' }}
                >
                  <Plus className="w-4 h-4" />
                  {isUploading
                    ? 'Uploading...'
                    : type === 'recipe'
                    ? 'Post Recipe'
                    : 'Post Reel'}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                key="upload-toast"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold"
                style={{
                  background: toast.ok ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                  color: '#fff',
                  minWidth: '220px',
                  boxShadow: toast.ok ? '0 8px 32px rgba(34,197,94,0.35)' : '0 8px 32px rgba(239,68,68,0.35)',
                }}
              >
                <span className="text-lg">{toast.ok ? '✓' : '✕'}</span>
                {toast.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
