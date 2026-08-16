'use client'

import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface PrivateRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        router.replace('/')
      }
    }
  }, [user, loading, allowedRoles, router])

  if (loading) {
    return <div>Loading...</div>
  }

  // Prevent flash of protected content before redirect completes
  if (!user || (allowedRoles && user.role && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute