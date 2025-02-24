'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, BookOpen, ShoppingBag, Calendar, UsersIcon, MessageCircle, GraduationCap, Award, ChevronRight, ChevronLeft } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Friends', href: '/friends', icon: Users },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Study Groups', href: '/study-groups', icon: UsersIcon },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Credits', href: '/credits', icon: GraduationCap },
  { name: 'Points', href: '/points', icon: Award },
  // { name: 'Profile', href: '/profile', icon: Users },
]

export function Navigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('navbarCollapsed')
      return storedState ? JSON.parse(storedState) : false
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('navbarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Desktop navigation */}
      <nav 
        className={`lg:flex hidden flex-col bg-white border-r relative transition-all duration-300 justify-between`}
        style={{ transition: 'width 0.3s ease-in-out' }}
      >
        <div className="px-3 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${
                  isCollapsed
                    ? 'px-3 py-3'
                    : 'px-4 py-2 space-x-2'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
        {/* <Link
          href="/settings"
          className={`flex items-center rounded-lg whitespace-nowrap transition-all duration-300 ${
            isCollapsed
              ? 'px-3 py-3'
              : 'px-4 py-2 space-x-2'
          }`}
          title={isCollapsed ? item.name : ''}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="transition-opacity duration-300">
              Settings
            </span>
          )}
        </Link> */}
        <button
          className={`absolute bottom-4 ${isCollapsed ? "left-0 right-0 mx-auto" : "right-4"} w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors`}
          onClick={toggleNavbar}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? 'text-indigo-700' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

