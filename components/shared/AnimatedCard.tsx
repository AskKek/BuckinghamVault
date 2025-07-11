"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { FeatureCard, FeatureCardProps } from "@/components/shared/FeatureCard"

/**
 * AnimatedCard - Legacy wrapper around FeatureCard
 * 
 * This component maintains backward compatibility for existing AnimatedCard usage
 * while internally using the new unified FeatureCard component.
 * 
 * @deprecated Use FeatureCard directly for new implementations
 */

interface AnimatedCardProps {
  children?: ReactNode
  title?: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  index?: number
  isInView?: boolean
  delay?: number
  variant?: 'default' | 'glass' | 'premium'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  isInteractive?: boolean
  className?: string
  showHoverGlow?: boolean
}

export function AnimatedCard({
  children,
  title,
  description,
  icon,
  iconColor = "text-gold",
  index = 0,
  isInView = true,
  delay = 0,
  variant = 'default',
  size = 'md',
  onClick,
  isInteractive,
  className = "",
  showHoverGlow = true
}: AnimatedCardProps) {
  
  // Map legacy props to FeatureCard props
  const featureCardProps: FeatureCardProps = {
    title,
    description,
    icon,
    iconColor,
    index,
    isInView,
    delay,
    variant,
    size,
    onClick,
    isInteractive,
    className,
    showHoverGlow,
    hoverAnimation: variant === 'premium' ? 'scale' : 'lift',
    children
  }

  return <FeatureCard {...featureCardProps} />
} 