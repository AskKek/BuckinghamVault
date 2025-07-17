"use client"

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  onLoad?: () => void
  onError?: () => void
}

/**
 * Premium responsive image component optimized for Buckingham Vault
 * Automatically serves WebP/AVIF with PNG fallback
 * Includes blur placeholders and responsive sizing
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  quality = 85,
  fill = false,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  placeholder = 'blur',
  onLoad,
  onError
}: ResponsiveImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Extract filename without extension for optimized path
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'avif' | 'png' = 'webp') => {
    const filename = originalSrc.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
    return `/images/optimized/${filename}-lg.${format}`
  }

  // Generate blur placeholder source
  const getPlaceholderSrc = (originalSrc: string) => {
    const filename = originalSrc.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
    return `/images/optimized/${filename}-placeholder.webp`
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  // If optimized image fails, fallback to original
  if (imageError) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        quality={quality}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        onLoad={handleLoad}
        placeholder={placeholder}
      />
    )
  }

  return (
    <picture>
      {/* AVIF - Best compression, modern browsers */}
      <source
        srcSet={`
          ${getOptimizedSrc(src, 'avif').replace('-lg', '-sm')} 640w,
          ${getOptimizedSrc(src, 'avif').replace('-lg', '-md')} 1024w,
          ${getOptimizedSrc(src, 'avif').replace('-lg', '-lg')} 1920w,
          ${getOptimizedSrc(src, 'avif').replace('-lg', '-xl')} 2560w
        `}
        sizes={sizes}
        type="image/avif"
      />
      
      {/* WebP - Good compression, wide support */}
      <source
        srcSet={`
          ${getOptimizedSrc(src, 'webp').replace('-lg', '-sm')} 640w,
          ${getOptimizedSrc(src, 'webp').replace('-lg', '-md')} 1024w,
          ${getOptimizedSrc(src, 'webp').replace('-lg', '-lg')} 1920w,
          ${getOptimizedSrc(src, 'webp').replace('-lg', '-xl')} 2560w
        `}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* PNG - Fallback for older browsers */}
      <source
        srcSet={`
          ${getOptimizedSrc(src, 'png').replace('-lg', '-sm')} 640w,
          ${getOptimizedSrc(src, 'png').replace('-lg', '-md')} 1024w,
          ${getOptimizedSrc(src, 'png').replace('-lg', '-lg')} 1920w,
          ${getOptimizedSrc(src, 'png').replace('-lg', '-xl')} 2560w
        `}
        sizes={sizes}
        type="image/png"
      />
      
      <Image
        src={getOptimizedSrc(src, 'webp')}
        alt={alt}
        className={cn(
          'transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        priority={priority}
        quality={quality}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? getPlaceholderSrc(src) : undefined}
      />
    </picture>
  )
}

/**
 * Premium hero image component with enhanced loading states
 * Specifically optimized for critical above-the-fold images
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<ResponsiveImageProps, 'priority' | 'placeholder'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      className={cn(
        'transform transition-all duration-700 hover:scale-105',
        className
      )}
      priority={true}
      placeholder="blur"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
      {...props}
    />
  )
}

/**
 * Decorative image component for non-critical images
 * Uses lazy loading and progressive enhancement
 */
export function DecorativeImage({
  src,
  alt,
  className,
  ...props
}: ResponsiveImageProps) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      className={cn(
        'transition-all duration-500 hover:brightness-110',
        className
      )}
      priority={false}
      placeholder="blur"
      {...props}
    />
  )
}