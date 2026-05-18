'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Settings, LogOut, UserCircle, Sparkles } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@/context/ThemeContext'

interface HeaderProps {
  username?: string
  avatarUrl?: string
  notificationCount?: number
}

export function Header({
  username = 'Chef',
  avatarUrl,
  notificationCount = 3,
}: HeaderProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  async function handleLogout() {
    setProfileOpen(false)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-16 backdrop-blur-2xl border-b shadow-sm"
      style={{
        background: isDark ? 'rgba(30,30,31,0.90)' : 'rgba(245,245,245,0.92)',
        borderBottomColor: isDark ? '#343438' : '#E8E8E8',
        boxShadow: isDark
          ? '0 1px 0 rgba(52,52,56,0.80), 0 4px 24px rgba(0,0,0,0.30)'
          : '0 1px 0 rgba(232,232,232,0.90), 0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Warm ambient line at very top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F5C518]/35 to-transparent" />

      {/* Left: Search — offset for mobile hamburger */}
      <div className="flex-1 ml-10 lg:ml-0">
        <div className="relative max-w-sm lg:max-w-md xl:max-w-lg">
          {/* Glow ring when focused */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 -z-10 rounded-2xl"
                style={{
                  background: 'var(--cr-accent-soft)',
                  boxShadow: `0 0 0 2px var(--cr-accent-border), 0 4px 20px var(--cr-accent-soft)`,
                }}
              />
            )}
          </AnimatePresence>

          <motion.div
            animate={{
              borderColor: searchFocused ? 'var(--cr-accent-border)' : undefined,
            }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center rounded-2xl transition-colors duration-200"
            style={{
              background: isDark ? 'rgba(43,43,45,0.80)' : 'rgba(255,255,255,0.90)',
              border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
            }}
          >
            <motion.span
              animate={{ color: searchFocused ? 'var(--cr-accent)' : undefined }}
              className="absolute left-3.5 pointer-events-none"
              style={{ color: isDark ? '#71717A' : '#9CA3AF' }}
            >
              <Search size={15} strokeWidth={2.1} />
            </motion.span>

            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search recipes, creators, reels…"
              className="w-full pl-9 pr-4 py-2.5 bg-transparent text-sm outline-none rounded-2xl font-ui"
              style={{
                color: isDark ? '#F5F5F5' : '#1A1A1A',
              }}
            />

            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                style={{
                  background: 'var(--cr-accent-soft)',
                  border: '1px solid var(--cr-accent-border)',
                }}
              >
                <Sparkles size={9} style={{ color: 'var(--cr-accent)' }} />
                <span className="text-[9px] font-bold whitespace-nowrap" style={{ color: 'var(--cr-accent)' }}>AI Search</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Theme toggle — hidden on smallest screens */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: isDark ? 'rgba(43,43,45,0.90)' : 'rgba(255,255,255,0.90)',
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
          <Bell size={16} strokeWidth={1.9} />
          {notificationCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F5C518]" />
              <motion.span
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full opacity-50 bg-[#F5C518]"
              />
            </>
          )}
        </motion.button>

        {/* Welcome + avatar */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-[11px] leading-tight font-ui" style={{ color: isDark ? '#71717A' : '#9CA3AF' }}>Welcome back,</p>
            <p className="text-sm font-semibold leading-tight" style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}>{username}</p>
          </div>

          <div ref={dropdownRef} className="relative flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Open profile"
              onClick={() => setProfileOpen(o => !o)}
              className="relative"
            >
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F5C518]/35 hover:ring-[#F5C518]/65 transition-all"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-[#F5C518]/25 hover:ring-[#F5C518]/55 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
                    boxShadow: '0 4px 14px rgba(245,197,24,0.28)',
                  }}
                >
                  <User size={16} className="text-[#1A1A1A]" strokeWidth={2.2} />
                </div>
              )}
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#7DBB91] rounded-full border-2"
                style={{ borderColor: isDark ? '#1E1E1F' : '#F5F5F5' }}
              />
            </motion.button>

            {/* Profile dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2.5 w-52 rounded-2xl backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
                  style={{
                    background: isDark ? 'rgba(43,43,45,0.97)' : 'rgba(255,255,255,0.97)',
                    border: `1px solid ${isDark ? '#343438' : '#E8E8E8'}`,
                    boxShadow: isDark
                      ? '0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(52,52,56,0.80)'
                      : '0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(232,232,232,0.90)',
                  }}
                >
                  {/* Top accent line */}
                  <div className="h-[2px] bg-gradient-to-r from-[#F5C518] to-[#FF9F1C]" />

                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: isDark ? '#343438' : '#E8E8E8' }}
                  >
                    <p className="text-xs font-bold truncate" style={{ color: isDark ? '#F5F5F5' : '#1A1A1A' }}>{username}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: isDark ? '#71717A' : '#9CA3AF' }}>Passionate home cook</p>
                  </div>

                  <div className="p-1.5">
                    {[
                      { icon: UserCircle, label: 'View Profile', href: '/profile' },
                      { icon: Settings,   label: 'Settings',     href: '/settings' },
                    ].map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                        style={{ color: isDark ? '#A1A1AA' : '#666666' }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background = isDark ? 'rgba(52,52,56,0.60)' : '#FFF3BF'
                          el.style.color = '#F5C518'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background = 'transparent'
                          el.style.color = isDark ? '#A1A1AA' : '#666666'
                        }}
                      >
                        <Icon size={15} strokeWidth={1.8} />
                        {label}
                      </a>
                    ))}

                    <div
                      className="my-1 mx-2 h-px"
                      style={{ background: isDark ? '#343438' : '#E8E8E8' }}
                    />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150 font-medium"
                    >
                      <LogOut size={15} strokeWidth={1.8} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
