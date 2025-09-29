'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface ClosableBannerProps {
  children: React.ReactNode
  className?: string
  storageKey?: string
}

export default function ClosableBanner({ 
  children, 
  className = '', 
  storageKey 
}: ClosableBannerProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    if (!storageKey) return true
    return localStorage.getItem(storageKey) !== 'closed'
  })

  const handleClose = () => {
    setIsVisible(false)
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'closed')
      // Trigger custom event to notify other components
      window.dispatchEvent(new CustomEvent('bannerClosed', { detail: { storageKey } }))
    }
  }

  if (!isVisible) return null

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
        aria-label="Close banner"
      >
        <X size={16} className="text-current opacity-70 hover:opacity-100" />
      </button>
      {children}
    </div>
  )
}