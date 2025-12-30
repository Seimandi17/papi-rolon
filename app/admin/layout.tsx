import Link from 'next/link'
import Image from 'next/image'
import { AdminNav } from './components/AdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">PAPI FÚTBOL ROLÓN</h1>
                <p className="text-xs text-gray-200">Panel de Administración</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-secondary text-accent rounded-lg font-medium hover:bg-secondary-light transition-colors"
            >
              Ver Público
            </Link>
          </div>
        </div>
      </header>
      <AdminNav />
      {children}
    </div>
  )
}

