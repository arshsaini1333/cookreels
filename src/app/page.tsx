import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardCards } from '@/components/dashboard/DashboardCards'

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout username={session.username}>
      <DashboardCards username={session.username} />
    </DashboardLayout>
  )
}
