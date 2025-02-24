'use client'

import React, { createContext, useContext, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = async (email: string, password: string) => {
    // Mock sign-in logic
    if (email === 'user@example.com' && password === 'password') {
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        role: 'USER',
      })
      return true
    }
    return false
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Mock sign-up logic
    setUser({
      id: '2',
      name,
      email,
      role: 'USER',
    })
    return true
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

