'use client'

import { useEffect, useRef, useState } from 'react'

interface RoyalLiquidGoldBackgroundProps {
  className?: string
}

export function RoyalLiquidGoldBackground({ className = "" }: RoyalLiquidGoldBackgroundProps) {
  const [isClient, setIsClient] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  // Initialize client render state
  useEffect(() => {
    setIsClient(true)
  }, [])

  // SSR-safe interaction only when client-side
  useEffect(() => {
    if (!isClient) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('royal-bg')
      if (!container) return

      const rect = container.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isClient])

  // Render default background on SSR
  if (!isClient) return (
    <div
      className={`absolute inset-0 bg-navy overflow-hidden ${className}`}
    >
      {/* SSR fallback background */}
    </div>
  )

  return (
    <div
      id="royal-bg"
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="relative w-full h-full">
        {/* Base gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-dark" />
        
        {/* Primary liquid gold layer */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `
              radial-gradient(
                600px circle at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(244, 185, 66, 0.3) 0%,
                rgba(215, 147, 9, 0.2) 25%,
                transparent 70%
              ),
              linear-gradient(135deg,
                #f4b942 0%,
                #d79309 30%,
                #101b3e 70%
              )
            `
          }}
        />

        {/* Secondary flowing gold accents */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `
              radial-gradient(
                400px circle at ${mousePosition.x + 20}% ${mousePosition.y - 10}%,
                rgba(244, 185, 66, 0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                300px circle at ${mousePosition.x - 15}% ${mousePosition.y + 15}%,
                rgba(215, 147, 9, 0.08) 0%,
                transparent 40%
              )
            `
          }}
        />
        
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: `
                linear-gradient(
                  45deg,
                  transparent 30%,
                  rgba(244, 185, 66, 0.02) 50%,
                  transparent 70%
                )
              `,
              animation: 'shimmer 8s ease-in-out infinite alternate'
            }}
          />
        </div>
        
        {/* Royal texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, rgba(244, 185, 66, 0.1), transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(215, 147, 9, 0.08), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(244, 185, 66, 0.05), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(184, 120, 10, 0.03), transparent)
            `,
            backgroundSize: '150px 150px, 200px 200px, 100px 100px, 180px 180px'
          }}
        />

        <style jsx>{`
          @keyframes shimmer {
            0%, 100% {
              transform: translateX(-100%) rotate(45deg);
            }
            50% {
              transform: translateX(100%) rotate(45deg);
            }
          }
        `}</style>
      </div>
    </div>
  )
}