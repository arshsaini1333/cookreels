'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Compass, Film, Users, MessageCircle,
  LayoutGrid, User, ChefHat, Menu, X, Flame,
  BookMarked, Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { icon: Home,          label: 'Home',       href: '/',           },
  { icon: Compass,       label: 'Explore',    href: '/explore',    },
  { icon: Film,          label: 'CookReels',  href: '/reels',      },
  { icon: LayoutGrid,    label: 'Categories', href: '/categories', },
  { icon: Users,         label: 'Friends',    href: '/friends',    },
  { icon: MessageCircle, label: 'Messages',   href: '/messages',   },
  { icon: BookMarked,    label: 'Saved',      href: '/saved',      },
]

interface SidebarProps {
  username?: string
}

export function Sidebar({ username = 'Chef' }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const active = navItems.find(item =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
  )?.label ?? 'Home'

  return (
    <>
      {/* Mobile hamburger */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl backdrop-blur-xl shadow-lg"
        style={{
          background: isDark ? 'rgba(43,43,45,0.95)' : 'rgba(247,241,217,0.95)',
          border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
          color: isDark ? '#A1A1AA' : '#666666',
        }}
        onClick={() => setMobileOpen(v => !v)}
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
            className="lg:hidden fixed inset-0 bg-black/70 z-30 backdrop-blur-[3px]"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed lg:relative lg:translate-x-0 z-40 h-full',
          'w-64 xl:w-72 flex-shrink-0 flex flex-col',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-transform duration-300 ease-in-out',
        ].join(' ')}
      >
        {/* Glass panel */}
        <div
          className="absolute inset-0 backdrop-blur-2xl lg:shadow-none"
          style={{
            background: isDark ? 'rgba(30,30,31,0.95)' : 'rgba(247,241,217,0.97)',
            borderRight: `1px solid ${isDark ? '#343438' : 'rgba(232,232,232,0.60)'}`,
            boxShadow: isDark
              ? '4px 0 24px rgba(0,0,0,0.40)'
              : '4px 0 16px rgba(0,0,0,0.05)',
          }}
        />

        {/* Inner gradient depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 inset-x-0 h-48"
            style={{ background: 'linear-gradient(180deg, rgba(245,197,24,0.04) 0%, transparent 100%)' }}
          />
          <div
            className="absolute bottom-0 inset-x-0 h-32"
            style={{ background: 'linear-gradient(0deg, rgba(245,197,24,0.03) 0%, transparent 100%)' }}
          />
        </div>

        <div className="relative flex flex-col h-full">
          {/* ── Logo ── */}
          <div className="px-5 py-7 flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
                boxShadow: '0 8px 24px rgba(245,197,24,0.35)',
              }}
            >
              <ChefHat size={21} className="text-[#1A1A1A]" strokeWidth={2.1} />
            </div>
            <div>
              <span
                className="text-[17px] font-bold tracking-tight text-gradient-yellow"
                style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
              >
                CookReels
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame size={9} className="text-[#FF9F1C]" />
                <span
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: isDark ? '#71717A' : '#9CA3AF' }}
                >
                  Creator Platform
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mx-5 h-px"
            style={{ background: isDark ? '#343438' : 'rgba(232,232,232,0.80)' }}
          />

          {/* ── Navigation ── */}
          <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto scrollbar-none">
            <p
              className="px-3 mb-3 text-[9px] font-bold tracking-[0.18em] uppercase"
              style={{ color: isDark ? '#52525B' : '#9CA3AF' }}
            >
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.label
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      'relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group',
                      isActive
                        ? 'text-[#1A1A1A]'
                        : '',
                    ].join(' ')}
                    style={!isActive ? {
                      color: isDark ? '#A1A1AA' : '#666666',
                    } : {}}
                    onMouseEnter={e => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.background = isDark ? 'rgba(52,52,56,0.50)' : 'rgba(245,197,24,0.08)'
                        el.style.color = isDark ? '#F5F5F5' : '#1A1A1A'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.background = 'transparent'
                        el.style.color = isDark ? '#A1A1AA' : '#666666'
                      }
                    }}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-bg"
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
                          boxShadow: '0 4px 16px rgba(245,197,24,0.32), 0 1px 3px rgba(245,197,24,0.18)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Icon */}
                    <motion.span
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="relative flex-shrink-0"
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={isActive ? 'text-[#1A1A1A]' : ''}
                        style={!isActive ? { color: isDark ? '#71717A' : '#9CA3AF' } : {}}
                      />
                    </motion.span>

                    {/* Label */}
                    <span className="relative text-sm font-semibold">{item.label}</span>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-dot"
                        className="relative ml-auto w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/40"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Divider */}
          <div
            className="mx-5 h-px"
            style={{ background: isDark ? '#343438' : 'rgba(232,232,232,0.80)' }}
          />

          {/* ── Bottom section ── */}
          <div className="p-3 pb-5 space-y-1.5">
            {/* Theme toggle row */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl">
              <span
                className="text-xs font-medium flex-1"
                style={{ color: isDark ? '#71717A' : '#9CA3AF' }}
              >
                Appearance
              </span>
              <ThemeToggle />
            </div>

            {/* Settings */}
            <Link
              href="/settings"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-colors duration-200"
              style={{ color: isDark ? '#71717A' : '#9CA3AF' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = isDark ? 'rgba(52,52,56,0.50)' : 'rgba(245,197,24,0.08)'
                el.style.color = isDark ? '#F5F5F5' : '#1A1A1A'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.color = isDark ? '#71717A' : '#9CA3AF'
              }}
            >
              <Settings size={17} strokeWidth={1.8} />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            {/* Divider */}
            <div
              className="h-px my-1"
              style={{ background: isDark ? '#343438' : 'rgba(232,232,232,0.80)' }}
            />

            {/* Profile */}
            <Link href="/profile">
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-colors duration-200 group"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = isDark ? 'rgba(52,52,56,0.50)' : 'rgba(245,197,24,0.08)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = 'transparent'
              }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
                    boxShadow: '0 4px 12px rgba(245,197,24,0.28)',
                  }}
                >
                  <User size={16} className="text-[#1A1A1A]" strokeWidth={2.2} />
                </div>
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#7DBB91] rounded-full border-2"
                  style={{ borderColor: isDark ? '#1E1E1F' : '#F7F1D9' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}
                >
                  {username}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: isDark ? '#71717A' : '#9CA3AF' }}
                >
                  View Profile
                </p>
              </div>
            </motion.div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
