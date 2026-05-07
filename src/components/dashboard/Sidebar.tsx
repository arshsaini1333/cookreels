'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Compass,
  Film,
  Users,
  MessageCircle,
  LayoutGrid,
  User,
  ChefHat,
  Menu,
  X,
  Flame,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: Film, label: 'CookReels', href: '/reels' },
  { icon: Users, label: 'Friends', href: '/friends' },
  { icon: MessageCircle, label: 'Messages', href: '/messages' },
  { icon: LayoutGrid, label: 'Categories', href: '/categories' },
]

interface SidebarProps {
  activeItem?: string
  username?: string
}

export function Sidebar({ activeItem = 'Home', username = 'Chef' }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState(activeItem)

  return (
    <>
      {/* Mobile hamburger button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl
          bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm
          shadow-lg border border-zinc-200/60 dark:border-zinc-700/60
          text-zinc-700 dark:text-zinc-300"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </motion.button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed lg:relative lg:translate-x-0 z-40 h-full',
          'w-64 xl:w-72 flex-shrink-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'flex flex-col',
          'bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl',
          'border-r border-zinc-200/60 dark:border-zinc-700/40',
          'shadow-xl shadow-zinc-200/40 dark:shadow-black/30 lg:shadow-none',
          'transition-transform duration-300 ease-in-out',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="px-6 py-7 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f6c68b] flex items-center justify-center shadow-lg shadow-[#f6c68b]/30">
            <ChefHat size={20} className="text-stone-900" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-lg font-bold text-[#f6c68b]">
              CookReels
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Flame size={10} className="text-[#f6c68b]" />
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
                CREATOR PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.label
            return (
              <motion.div
                key={item.label}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    setActive(item.label)
                    setMobileOpen(false)
                  }}
                  className={[
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'text-stone-900 dark:text-stone-900'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200',
                  ].join(' ')}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl bg-[#f6c68b]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={[
                      'relative transition-colors duration-200',
                      isActive
                        ? 'text-stone-900'
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-[#f6c68b]',
                    ].join(' ')}
                  >
                    <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                  </motion.span>
                  <span className="relative text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-stone-900/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Bottom divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />

        {/* Profile section pinned at bottom */}
        <div className="p-3 pb-4">
          <motion.div
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
              hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition-colors duration-200 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#f6c68b] flex items-center justify-center shadow-md shadow-[#f6c68b]/25 flex-shrink-0">
                <User size={16} className="text-stone-900" strokeWidth={2.2} />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-zinc-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                {username}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                View Profile
              </p>
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  )
}
