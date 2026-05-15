'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Settings, LogOut, UserCircle } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#FFF8F2]/85 dark:bg-[#1A1D24]/85 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-white/6 shadow-sm shadow-black/4 dark:shadow-black/30"
    >
      {/* Left: search — offset on mobile for hamburger */}
      <div className="flex-1 ml-10 lg:ml-0">
        <motion.div
          animate={{
            boxShadow: searchFocused
              ? '0 0 0 3px rgba(255,107,53,0.22)'
              : '0 0 0 0px rgba(255,107,53,0)',
          }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/60 dark:border-white/8 transition-colors duration-200 hover:border-[#FF6B35]/35 dark:hover:border-[#FF6B35]/25"
        >
          <motion.span
            animate={{ color: searchFocused ? '#FF6B35' : undefined }}
            className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none"
          >
            <Search size={16} strokeWidth={2} />
          </motion.span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search recipes, creators, reels…"
            className="w-full pl-9 pr-4 py-2.5 bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none rounded-2xl"
          />
        </motion.div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <ThemeToggle />

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/8 text-zinc-600 dark:text-zinc-300 hover:border-[#FF6B35]/50 dark:hover:border-[#FF6B35]/35 hover:text-[#FF6B35] transition-colors duration-200"
        >
          <Bell size={17} strokeWidth={1.8} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full ring-2 ring-[#FFF8F2] dark:ring-[#1A1D24] animate-pulse" />
          )}
        </motion.button>

        {/* Welcome + avatar */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-tight">Welcome back,</p>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">{username}</p>
          </div>
          <div ref={dropdownRef} className="relative flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              aria-label="Open profile"
              onClick={() => setProfileOpen((o) => !o)}
              className="relative"
            >
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF6B35]/40 hover:ring-[#FF6B35] transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-md shadow-[#FF6B35]/30 ring-2 ring-[#FF6B35]/25 hover:ring-[#FF6B35]/55 transition-all">
                  <User size={16} className="text-white" strokeWidth={2.2} />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#7DBB91] rounded-full border-2 border-[#FFF8F2] dark:border-[#1A1D24]" />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1A1D24] border border-zinc-200/70 dark:border-white/8 shadow-xl shadow-black/12 dark:shadow-black/50 overflow-hidden z-50"
                >
                  <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-white/6">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{username}</p>
                  </div>
                  <div className="p-1">
                    {[
                      { icon: UserCircle, label: 'View Profile', href: '/profile' },
                      { icon: Settings,   label: 'Settings',     href: '/settings' },
                    ].map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-[#FF6B35] transition-colors duration-150"
                      >
                        <Icon size={15} strokeWidth={1.8} />
                        {label}
                      </a>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150"
                    >
                      <LogOut size={15} strokeWidth={1.8} />
                      Logout
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
