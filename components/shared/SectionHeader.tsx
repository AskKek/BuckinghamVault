"use client"

import { motion } from "framer-motion"
import { LucideIcon, Crown, Sparkles, Star } from "lucide-react"
import { 
  textRevealVariants, 
  decorativeLineVariants, 
  prefersReducedMotion 
} from "@/lib/animation-utils"
import { 
  generateAriaLabel,
  focusRingClasses 
} from "@/lib/accessibility-utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  icon?: LucideIcon
  iconVariant?: 'crown' | 'sparkles' | 'star'
  alignment?: 'center' | 'left'
  showDecorative?: boolean
  className?: string
  isInView?: boolean
  delay?: number
}

export function SectionHeader({
  title,
  subtitle,
  description,
  icon: CustomIcon,
  iconVariant = 'crown',
  alignment = 'center',
  showDecorative = true,
  className = "",
  isInView = false,
  delay = 0
}: SectionHeaderProps) {
  
  const getIcon = () => {
    if (CustomIcon) return CustomIcon
    
    switch (iconVariant) {
      case 'sparkles':
        return Sparkles
      case 'star':
        return Star
      default:
        return Crown
    }
  }

  const Icon = getIcon()
  const alignmentClasses = alignment === 'center' ? 'text-center' : 'text-left'
  const flexAlignment = alignment === 'center' ? 'justify-center' : 'justify-start'

  return (
    <motion.div
      className={`space-y-6 md:space-y-8 ${alignmentClasses} ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            duration: prefersReducedMotion() ? 0.1 : 0.8,
            delay: prefersReducedMotion() ? 0 : delay 
          }
        }
      }}
    >
      {/* Decorative Elements */}
      {showDecorative && (
        <motion.div
          className={`flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8 ${flexAlignment}`}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { 
              opacity: 1, 
              scale: 1,
              transition: { 
                duration: prefersReducedMotion() ? 0.1 : 0.8,
                delay: prefersReducedMotion() ? 0 : delay + 0.2 
              }
            }
          }}
        >
          <motion.div
            className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-gold to-transparent"
            variants={decorativeLineVariants}
          />
          
          <div 
            className={`flex items-center justify-center ${focusRingClasses}`}
            role="img"
            aria-label={generateAriaLabel('icon', `${iconVariant} decoration`)}
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-gold" aria-hidden="true" />
          </div>
          
          <motion.div
            className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-gold to-transparent"
            variants={decorativeLineVariants}
          />
        </motion.div>
      )}

      {/* Main Title */}
      <motion.h2
        className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-display font-bold text-gradient leading-tight"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: prefersReducedMotion() ? 0 : 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: prefersReducedMotion() ? 0.1 : 0.8,
              delay: prefersReducedMotion() ? 0 : delay + 0.4,
              ease: "easeOut"
            }
          }
        }}
        id="section-heading"
        aria-label={generateAriaLabel('heading', title)}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.h3
          className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-white/90 leading-relaxed"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: prefersReducedMotion() ? 0 : 30 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: prefersReducedMotion() ? 0.1 : 0.8,
                delay: prefersReducedMotion() ? 0 : delay + 0.6,
                ease: "easeOut"
              }
            }
          }}
          aria-label={generateAriaLabel('subheading', subtitle)}
        >
          {subtitle}
        </motion.h3>
      )}

      {/* Description */}
      {description && (
        <motion.p
          className={`text-lg md:text-xl lg:text-2xl text-white/70 font-sans font-light leading-relaxed ${alignment === 'center' ? 'max-w-4xl mx-auto' : 'max-w-4xl'} px-4`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: prefersReducedMotion() ? 0 : 30 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: prefersReducedMotion() ? 0.1 : 0.8,
                delay: prefersReducedMotion() ? 0 : delay + 0.8,
                ease: "easeOut"
              }
            }
          }}
          aria-label={generateAriaLabel('description', description)}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
} 