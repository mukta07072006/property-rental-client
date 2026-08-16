'use client'

import React from 'react'
import Link from 'next/link'
import { Home, RefreshCw } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home size={20} />
            Go Home
          </Link>
          <button onClick={() => window.location.reload()} className="btn-outline flex items-center gap-2">
            <RefreshCw size={20} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound