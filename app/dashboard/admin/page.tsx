import AdminDashboard from '../../../pages/dashboard/AdminDashboard'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
    const userRole = session?.user?.role
    
      if (userRole !== 'admin') {
        return <div>Access Denied. You do not have permission to view this page.</div>
      }
  return <AdminDashboard />
}
