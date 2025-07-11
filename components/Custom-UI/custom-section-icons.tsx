import { LucideIcon } from 'lucide-react'

interface CustomIconProps {
  className?: string
  size?: number | string
}

/**
 * Custom icon for the Mission section - representing vision and purpose
 */
export const MissionIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
  </svg>
)

/**
 * Custom icon for Clientele section - representing exclusive membership
 */
export const ClienteleIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C13.5 2 15 3.5 15 5C15 6.5 13.5 8 12 8C10.5 8 9 6.5 9 5C9 3.5 10.5 2 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M20 10C21 10 22 11 22 12C22 13 21 14 20 14C19 14 18 13 18 12C18 11 19 10 20 10Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 10C5 10 6 11 6 12C6 13 5 14 4 14C3 14 2 13 2 12C2 11 3 10 4 10Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 9V15M8 22H16C16 18 14 16 12 16C10 16 8 18 8 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 15L15 17M6 15L9 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Custom icon for Services section - representing comprehensive solutions
 */
export const ServicesIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
    <path d="M10 6.5H14M6.5 10V14M17.5 10V14M10 17.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
)

/**
 * Custom icon for Differentiators section - representing unique value
 */
export const DifferentiatorsIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L14.5 7L20 7.5L16 11.5L17 17L12 14.5L7 17L8 11.5L4 7.5L9.5 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 20V22M8 20L6 22M16 20L18 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Custom icon for Leadership section - representing guidance and expertise
 */
export const LeadershipIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C14 2 16 4 16 6C16 8 14 10 12 10C10 10 8 8 8 6C8 4 10 2 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M12 10C16 10 20 12 20 16V22H4V16C4 12 8 10 12 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 2V0M8.5 3.5L7 2M15.5 3.5L17 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Custom icon for Membership section - representing exclusive access
 */
export const MembershipIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15 5V9L12 12L9 9V5L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 12V22M8 18L12 22L16 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
  </svg>
)

/**
 * Custom icon for Analytics section - representing data and insights
 */
export const AnalyticsIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 13L9 7L13 11L21 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 3H21V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="3" y="17" width="4" height="4" fill="currentColor" opacity="0.3" />
    <rect x="10" y="14" width="4" height="7" fill="currentColor" opacity="0.3" />
    <rect x="17" y="11" width="4" height="10" fill="currentColor" opacity="0.3" />
  </svg>
)

/**
 * Custom icon for North Star section - representing guiding principles
 */
export const NorthStarIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2V22M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M5 5L19 19M19 5L5 19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

/**
 * Custom icon for Contact section - representing communication
 */
export const ContactIcon = ({ className, size = 24 }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 4H20C21 4 22 5 22 6V18C22 19 21 20 20 20H4C3 20 2 19 2 18V6C2 5 3 4 4 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 6L12 13L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
)

/**
 * Icon map for easy access
 */
export const SectionIcons = {
  mission: MissionIcon,
  clientele: ClienteleIcon,
  services: ServicesIcon,
  differentiators: DifferentiatorsIcon,
  leadership: LeadershipIcon,
  membership: MembershipIcon,
  analytics: AnalyticsIcon,
  northStar: NorthStarIcon,
  contact: ContactIcon,
} as const

export type SectionIconType = keyof typeof SectionIcons