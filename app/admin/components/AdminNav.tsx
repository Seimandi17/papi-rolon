'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Settings, Users, FolderTree, Calendar, User } from 'lucide-react'

const navItems = [
  { id: 'config', label: 'Configuración', href: '/admin', icon: Settings },
  { id: 'teams', label: 'Equipos', href: '/admin/teams', icon: Users },
  { id: 'groups', label: 'Grupos', href: '/admin/groups', icon: FolderTree },
  { id: 'matches', label: 'Partidos', href: '/admin/matches', icon: Calendar },
  { id: 'players', label: 'Jugadores', href: '/admin/players', icon: User },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin')
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap
                  ${
                    isActive
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


