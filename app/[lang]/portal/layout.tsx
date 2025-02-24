import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/[lang]/globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uni Community',
  description: 'A social platform for university students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-grow">
              <Navigation />
              <main className="flex-grow overflow-auto">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}