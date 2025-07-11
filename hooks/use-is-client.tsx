import { useState, useEffect } from 'react'

/**
 * Universal hook for detecting client-side rendering
 * Ensures consistent behavior between SSR and client hydration
 * @returns {boolean} true if running on client, false during SSR
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook for conditionally executing code only on client side
 * @param callback Function to execute when on client
 * @param deps Dependency array for the effect
 */
export function useClientEffect(
  callback: () => void | (() => void),
  deps: React.DependencyList = []
): void {
  const isClient = useIsClient()

  useEffect(() => {
    if (isClient) {
      return callback()
    }
  }, [isClient, ...deps])
}