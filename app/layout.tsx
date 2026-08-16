// Example using path aliases
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Prompt } from 'next/font/google'

const prompt = Prompt({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-prompt',
})

export const metadata: Metadata = {
  title: 'Property Rental & Booking Platform',
  description: 'Find your perfect rental property. Connect with owners and book securely.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={prompt.className}>
      <body>
      
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" />
        
      </body>
    </html>
  )
}