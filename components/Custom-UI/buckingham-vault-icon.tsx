"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface BuckinghamVaultIconProps {
  size?: number
  className?: string
  animate?: boolean
}

export function BuckinghamVaultIcon({ size = 32, className = "", animate = true }: BuckinghamVaultIconProps) {
  const MotionImage = motion(Image)

  if (animate) {
    return (
      <MotionImage
        src="/images/buckingham-vault-icon.png"
        alt="Buckingham Vault"
        width={size}
        height={size}
        className={`${className}`}
        whileHover={{
          scale: 1.05,
          filter: "brightness(1.1) drop-shadow(0 0 8px rgba(215, 147, 9, 0.3))",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.2,
        }}
      />
    )
  }

  return (
    <Image
      src="/images/buckingham-vault-icon.png"
      alt="Buckingham Vault"
      width={size}
      height={size}
      className={className}
    />
  )
}
