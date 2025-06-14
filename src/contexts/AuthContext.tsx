"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface AuthContextType {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  const handleSignIn = () => signIn('google')
  const handleSignOut = () => signOut()

  const value: AuthContextType = {
    user: session?.user ? {
      // Use email as ID if no explicit ID is provided by NextAuth
      id: (session.user as { id?: string }).id || session.user.email || '',
      name: session.user.name,
      email: session.user.email,
      image: session.user.image
    } : null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    signIn: handleSignIn,
    signOut: handleSignOut
  }

  return (
    <AuthContext.Provider value={value}>
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