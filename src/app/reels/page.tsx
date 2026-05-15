import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ReelsPage } from '@/components/reels/ReelsPage'

export const metadata = { title: 'Reels | CookReels' }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  return (
    <DashboardLayout username={session.username}>
      <ReelsPage />
    </DashboardLayout>
  )
}
