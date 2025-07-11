"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState, ReactNode } from "react"
import { 
  sectionVariants, 
  prefersReducedMotion, 
  useDeviceDetection 
} from "@/lib/animation-utils"
import { 
  generateAriaLabel, 
  createLandmarkProps,
  announceToScreenReader 
} from "@/lib/accessibility-utils"

interface SectionWrapperProps {
  children: ReactNode
  id?: string
  title?: string
  description?: string
  className?: string
  backgroundType?: 'navy' | 'gradient' | 'transparent'
  showDecorative?: boolean
  announceOnView?: boolean
  role?: 'main' | 'section' | 'complementary'
}

export function SectionWrapper({ 
  children, 
  id,
  title,
  description,
  className = "",
  backgroundType = 'navy',
  showDecorative = false,
  announceOnView = false,
  role = 'section'
}: SectionWrapperProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasAnnounced, setHasAnnounced] = useState(false)
  const { isMobile } = useDeviceDetection()

  // Announce section to screen readers when it comes into view
  useEffect(() => {
    if (isInView && announceOnView && title && !hasAnnounced) {
      announceToScreenReader(`Entering ${title} section`)
      setHasAnnounced(true)
    }
  }, [isInView, announceOnView, title, hasAnnounced])

  const getBackgroundClasses = () => {
    switch (backgroundType) {
      case 'gradient':
        return 'bg-gradient-to-b from-navy via-navy-dark to-navy'
      case 'transparent':
        return 'bg-transparent'
      default:
        return 'bg-navy'
    }
  }

  const landmarkProps = createLandmarkProps(role)
  const ariaLabel = title ? generateAriaLabel('section', title, description) : undefined

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative py-20 md:py-32 overflow-hidden ${getBackgroundClasses()} ${className}`}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-label={ariaLabel}
      {...landmarkProps}
    >
      {/* Decorative Background Elements */}
      {showDecorative && !prefersReducedMotion() && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-gold/5 to-transparent rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -25, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-gradient-to-l from-gold/5 to-transparent rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 25, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>
      )}

      {/* Content with proper z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  )
} 