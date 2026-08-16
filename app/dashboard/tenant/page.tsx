
import TenantDashboard from '../../../pages/dashboard/TenantDashboard'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function TenantDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
const userRole = session?.user?.role

  if (userRole !== 'tenant') {
    return <div>Access Denied. You do not have permission to view this page.</div>
  }
  return <TenantDashboard />
  
}
