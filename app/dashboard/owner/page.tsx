import OwnerDashboard from '../../../pages/dashboard/OwnerDashboard'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function OwnerDashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() })
  const userRole = session?.user?.role
  
    if (userRole !== 'owner') {
      return <div>Access Denied. You do not have permission to view this page.</div>
    }
  return <OwnerDashboard />
}
