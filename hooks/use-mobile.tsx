import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with false for consistent SSR/client hydration
  const [isMobile, setIsMobile] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    // Mark as client-side
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      // Initial check
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Listen for changes
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    }
  }, [])

  // Return false during SSR and initial hydration, actual value after
  return isClient ? isMobile : false
}
