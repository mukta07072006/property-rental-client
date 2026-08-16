import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Server-side Route Protection
  if (!session) {
    redirect('/login')
  }

  const userRole = session.user.role

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Sidebar area for Dashboard */}
      {/* <header className="p-6 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold">Welcome back, {session.user.name}</h1>
        <p className="text-gray-600 text-sm">Role: {userRole}</p>
      </header> */}

      {/* Render child pages inside the layout */}
      <main className="p-8">
        {children}
      </main>
    </div>
  )
}