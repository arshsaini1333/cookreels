'use client'

import { motion } from 'framer-motion'
import { Home, Compass, Film, LayoutGrid, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { icon: Home,        label: 'Home',       href: '/'           },
  { icon: Compass,     label: 'Explore',    href: '/explore'    },
  { icon: Film,        label: 'Reels',      href: '/reels'      },
  { icon: LayoutGrid,  label: 'Categories', href: '/categories' },
  { icon: User,        label: 'Profile',    href: '/profile'    },
]

export function BottomNav() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pb-safe pointer-events-none">
      <div className="mx-3 mb-3 pointer-events-auto">
        <div
          className="flex items-center justify-around px-2 py-2 rounded-[22px] backdrop-blur-2xl shadow-2xl"
          style={{
            background: isDark ? 'rgba(43,43,45,0.95)' : 'rgba(247,241,217,0.95)',
            border: `1px solid ${isDark ? '#343438' : 'rgba(232,232,232,0.80)'}`,
            boxShadow: isDark
              ? '0 -4px 32px rgba(0,0,0,0.50), 0 0 0 1px rgba(52,52,56,0.80)'
              : '0 -4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,232,232,0.70)',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl min-w-[52px] transition-colors duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'rgba(245,197,24,0.12)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    style={{ color: isActive ? '#F5C518' : isDark ? '#71717A' : '#9CA3AF' }}
                  />
                </motion.div>

                <span
                  className="relative text-[10px] font-semibold leading-none transition-colors"
                  style={{ color: isActive ? '#F5C518' : isDark ? '#71717A' : '#9CA3AF' }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F5C518]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
