"use client"

import { ReactNode, useState, forwardRef } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  cardHoverVariants, 
  iconHoverVariants, 
  staggerChildVariants,
  prefersReducedMotion 
} from "@/lib/animation-utils"
import { 
  generateAriaLabel,
  createFocusableProps,
  focusRingClasses 
} from "@/lib/accessibility-utils"
import { cn } from "@/lib/utils"

// Core interfaces for FeatureCard
export interface FeatureCardBadge {
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export interface FeatureCardAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  disabled?: boolean
}

export interface FeatureCardMetadata {
  label: string
  value: string | number | ReactNode
  icon?: LucideIcon
  className?: string
}

export interface FeatureCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  // Core content
  title?: string
  description?: string
  children?: ReactNode
  
  // Visual elements
  icon?: LucideIcon
  iconColor?: string
  badges?: FeatureCardBadge[]
  
  // Layout and styling
  variant?: 'default' | 'glass' | 'premium' | 'minimal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  orientation?: 'vertical' | 'horizontal'
  aspectRatio?: 'square' | 'video' | 'auto'
  
  // Interactivity
  onClick?: () => void
  isInteractive?: boolean
  isSelected?: boolean
  isLoading?: boolean
  
  // Animation
  index?: number
  isInView?: boolean
  delay?: number
  showHoverGlow?: boolean
  hoverAnimation?: 'lift' | 'scale' | 'glow' | 'none'
  
  // Content sections
  header?: ReactNode
  footer?: ReactNode
  sidebar?: ReactNode
  
  // Metadata and badges
  metadata?: FeatureCardMetadata[]
  primaryAction?: FeatureCardAction
  secondaryActions?: FeatureCardAction[]
  
  // Hover content
  hoverContent?: ReactNode
  showHoverContent?: boolean
  
  // Accessibility
  role?: string
  ariaLabel?: string
  ariaDescription?: string
  
  // Custom styling
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(({
  // Core content
  title,
  description,
  children,
  
  // Visual elements
  icon: Icon,
  iconColor = "text-gold",
  badges = [],
  
  // Layout and styling
  variant = 'default',
  size = 'md',
  orientation = 'vertical',
  aspectRatio = 'auto',
  
  // Interactivity
  onClick,
  isInteractive,
  isSelected = false,
  isLoading = false,
  
  // Animation
  index = 0,
  isInView = true,
  delay = 0,
  showHoverGlow = true,
  hoverAnimation = 'lift',
  
  // Content sections
  header,
  footer,
  sidebar,
  
  // Metadata and actions
  metadata = [],
  primaryAction,
  secondaryActions = [],
  
  // Hover content
  hoverContent,
  showHoverContent = !!hoverContent,
  
  // Accessibility
  role,
  ariaLabel,
  ariaDescription,
  
  // Custom styling
  className = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  
  // Motion props
  ...motionProps
}, ref) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Determine if card should be interactive
  const interactive = isInteractive ?? (!!onClick || !!primaryAction)
  
  // Get card styling classes
  const getCardClasses = () => {
    const baseClasses = cn(
      "relative h-full group transition-all duration-300",
      interactive && "cursor-pointer",
      isSelected && "ring-2 ring-gold/40",
      aspectRatio === 'square' && "aspect-square",
      aspectRatio === 'video' && "aspect-video"
    )
    
    const variantClasses = {
      default: "bg-navy/90 border border-gold/10 hover:border-gold/30",
      glass: "glass-morphism backdrop-blur-sm border-gold/20 hover:border-gold/40",
      premium: "glass-morphism backdrop-blur-sm border-gold/20 hover:border-gold/40 hover:scale-105 hover:shadow-lg hover:shadow-gold/10",
      minimal: "bg-transparent border-none hover:bg-white/5"
    }
    
    return cn(baseClasses, variantClasses[variant])
  }

  // Get sizing classes
  const getSizeClasses = () => {
    const sizeMap = {
      sm: {
        padding: 'p-3 md:p-4',
        spacing: 'space-y-2 md:space-y-3',
        iconSize: 'w-6 h-6 md:w-8 md:h-8',
        iconContainer: 'w-8 h-8 md:w-10 md:h-10',
        titleSize: 'text-sm md:text-base',
        descSize: 'text-xs md:text-sm'
      },
      md: {
        padding: 'p-4 md:p-6',
        spacing: 'space-y-3 md:space-y-4',
        iconSize: 'w-8 h-8 md:w-10 md:h-10',
        iconContainer: 'w-10 h-10 md:w-12 md:h-12',
        titleSize: 'text-base md:text-lg',
        descSize: 'text-sm md:text-base'
      },
      lg: {
        padding: 'p-6 md:p-8',
        spacing: 'space-y-4 md:space-y-6',
        iconSize: 'w-10 h-10 md:w-12 md:h-12',
        iconContainer: 'w-12 h-12 md:w-16 md:h-16',
        titleSize: 'text-lg md:text-xl',
        descSize: 'text-base md:text-lg'
      },
      xl: {
        padding: 'p-8 md:p-12',
        spacing: 'space-y-6 md:space-y-8',
        iconSize: 'w-12 h-12 md:w-16 md:h-16',
        iconContainer: 'w-16 h-16 md:w-20 md:h-20',
        titleSize: 'text-xl md:text-2xl',
        descSize: 'text-lg md:text-xl'
      }
    }
    
    return sizeMap[size]
  }

  // Get hover animation variants
  const getHoverVariants = () => {
    const animations = {
      lift: { y: -4 },
      scale: { scale: 1.02 },
      glow: { boxShadow: "0 0 20px rgba(215, 147, 9, 0.3)" },
      none: {}
    }
    
    return animations[hoverAnimation]
  }

  const sizeClasses = getSizeClasses()
  const computedAriaLabel = ariaLabel || (title ? generateAriaLabel('feature card', title, description) : undefined)
  const focusableProps = { 
    ...createFocusableProps(interactive),
    ...(role && { role }),
    ...(computedAriaLabel && { 'aria-label': computedAriaLabel }),
    ...(ariaDescription && { 'aria-description': ariaDescription })
  }

  // Handle card click
  const handleClick = () => {
    if (onClick) onClick()
    else if (primaryAction) primaryAction.onClick()
  }

  return (
    <motion.div
      ref={ref}
      {...motionProps}
      className={cn(className, interactive && focusRingClasses)}
      variants={staggerChildVariants}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={!prefersReducedMotion() && hoverAnimation !== 'none' ? getHoverVariants() : undefined}
      whileTap={!prefersReducedMotion() && interactive ? { scale: 0.98 } : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={interactive ? handleClick : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...focusableProps}
    >
      <Card className={getCardClasses()}>
        {/* Hover Glow Effect */}
        {showHoverGlow && variant !== 'minimal' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 pointer-events-none rounded-xl"
            variants={cardHoverVariants}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Premium Border Animation */}
        {variant === 'premium' && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(215, 147, 9, 0.1), rgba(215, 147, 9, 0.05), rgba(215, 147, 9, 0.1))",
              padding: "1px",
            }}
            whileHover={{
              background: "linear-gradient(135deg, rgba(215, 147, 9, 0.3), rgba(215, 147, 9, 0.1), rgba(215, 147, 9, 0.3))"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-navy/90 rounded-xl" />
          </motion.div>
        )}

        <div className={cn(
          "relative z-10 h-full",
          orientation === 'horizontal' ? "flex" : "flex flex-col"
        )}>
          {/* Sidebar (horizontal layout only) */}
          {orientation === 'horizontal' && sidebar && (
            <div className="flex-shrink-0 w-1/3 p-4">
              {sidebar}
            </div>
          )}

          <div className={cn(
            "flex-1",
            orientation === 'horizontal' ? "flex flex-col" : ""
          )}>
            {/* Header */}
            {(header || Icon || title || badges.length > 0) && (
              <CardHeader className={cn(
                sizeClasses.padding,
                "pb-2",
                headerClassName
              )}>
                {header || (
                  <div className={sizeClasses.spacing}>
                    {/* Icon and Badges Row */}
                    <div className="flex items-start justify-between">
                      {Icon && (
                        <motion.div
                          className="relative flex-shrink-0"
                          variants={iconHoverVariants}
                          whileHover={!prefersReducedMotion() ? "hover" : undefined}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className={cn(
                            sizeClasses.iconContainer,
                            "glass-morphism rounded-xl flex items-center justify-center group-hover:premium-glow transition-all duration-500"
                          )}>
                            <Icon 
                              className={cn(
                                sizeClasses.iconSize,
                                iconColor,
                                "group-hover:text-gold-light transition-colors duration-300"
                              )}
                              aria-hidden="true"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Badges */}
                      {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 flex-shrink-0">
                          {badges.map((badge, index) => (
                            <Badge
                              key={index}
                              variant={badge.variant}
                              className={cn("text-xs", badge.className)}
                            >
                              {badge.label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    {title && (
                      <motion.h3
                        className={cn(
                          sizeClasses.titleSize,
                          "font-display font-bold text-white group-hover:text-gradient transition-all duration-300 leading-tight"
                        )}
                        whileHover={!prefersReducedMotion() ? { scale: 1.02 } : undefined}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {title}
                      </motion.h3>
                    )}

                    {/* Description */}
                    {description && (
                      <motion.p
                        className={cn(
                          sizeClasses.descSize,
                          "text-white/70 font-sans leading-relaxed"
                        )}
                        whileHover={!prefersReducedMotion() ? { scale: 1.01 } : undefined}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>
                )}
              </CardHeader>
            )}

            {/* Content */}
            <CardContent className={cn(
              sizeClasses.padding,
              "flex-1",
              contentClassName
            )}>
              <div className={sizeClasses.spacing}>
                {/* Metadata */}
                {metadata.length > 0 && (
                  <div className="space-y-2">
                    {metadata.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-white/70">
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.label}</span>
                        </div>
                        <div className={cn("text-white font-medium", item.className)}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom Children */}
                {children}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  </div>
                )}

                {/* Hover Content */}
                {showHoverContent && hoverContent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0, 
                      height: isHovered ? 'auto' : 0 
                    }}
                    className="overflow-hidden"
                    transition={{ duration: 0.2 }}
                  >
                    <div className="pt-3 border-t border-gold/20">
                      {hoverContent}
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>

            {/* Footer */}
            {(footer || primaryAction || secondaryActions.length > 0) && (
              <CardFooter className={cn(
                sizeClasses.padding,
                "pt-2",
                footerClassName
              )}>
                {footer || (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-2">
                      {secondaryActions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'ghost'}
                          size={action.size || 'sm'}
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className={cn(
                            "text-white/50 hover:text-white hover:bg-white/10",
                            action.className
                          )}
                        >
                          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                          {action.label}
                        </Button>
                      ))}
                    </div>

                    {primaryAction && (
                      <Button
                        variant={primaryAction.variant || 'default'}
                        size={primaryAction.size || 'sm'}
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.disabled}
                        className={cn(
                          "bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 text-gold border border-gold/30",
                          primaryAction.className
                        )}
                      >
                        {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
                        {primaryAction.label}
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
})

FeatureCard.displayName = "FeatureCard"

export { FeatureCard }