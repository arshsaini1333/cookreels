'use client'

import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
  username?: string
}

export function DashboardLayout({ children, username = 'Chef' }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF8F2] dark:bg-[#0F1115]">
      {/* Sidebar */}
      <Sidebar username={username} />

      {/* Main content column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Sticky header */}
        <Header username={username} notificationCount={3} />

        {/* Scrollable content area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex-1 overflow-y-auto"
        >
          {/* Decorative ambient blobs */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-[#FF6B35]/4 dark:bg-[#FF6B35]/3 blur-[120px]" />
            <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-[#FF6B35]/3 dark:bg-[#FF6B35]/2 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#7DBB91]/3 dark:bg-[#7DBB91]/2 blur-[100px]" />
          </div>

          {/* Dashboard content */}
          <div className="relative z-10 px-4 sm:px-6 pt-6 pb-2">
            {children}
          </div>

          {/* Bottom padding */}
          <div className="h-8" />
        </motion.main>
      </div>
    </div>
  )
}
