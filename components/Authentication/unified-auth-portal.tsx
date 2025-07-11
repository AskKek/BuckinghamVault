"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'

// Replace direct icon imports with dynamic imports
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false })
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield), { ssr: false })
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users), { ssr: false })
const CrownIcon = dynamic(() => import('lucide-react').then(mod => mod.Crown), { ssr: false })
const ArrowRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ArrowRight), { ssr: false })
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight), { ssr: false })
const LockIcon = dynamic(() => import('lucide-react').then(mod => mod.Lock), { ssr: false })
const KeyIcon = dynamic(() => import('lucide-react').then(mod => mod.Key), { ssr: false })
const MailIcon = dynamic(() => import('lucide-react').then(mod => mod.Mail), { ssr: false })
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye), { ssr: false })
const EyeOffIcon = dynamic(() => import('lucide-react').then(mod => mod.EyeOff), { ssr: false })

// Use project @ alias instead of relative paths
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BuckinghamVaultIcon } from "@/components/Custom-UI/buckingham-vault-icon"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSecureAuthSafe } from "@/hooks/use-secure-auth"

interface UnifiedAuthPortalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthStep = "selection" | "credentials"
type UserType = "mandate" | "client" | null

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional()
})

type LoginFormValues = z.infer<typeof loginSchema>

export function UnifiedAuthPortal({ isOpen, onClose }: UnifiedAuthPortalProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("selection")
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  
  const router = useRouter()
  const { login } = useSecureAuthSafe()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type)
    setCurrentStep("credentials")
  }

  const handleBackToSelection = () => {
    setCurrentStep("selection")
    setSelectedUserType(null)
    setAuthError('')
    form.reset()
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setAuthError('')

    try {
      // Authenticate with the provided credentials
      const result = await login(data.email, data.password || '')
      
      if (result.success) {
        
        // Navigate based on user type
        if (selectedUserType === "mandate") {
          router.push("/vault")
        } else if (selectedUserType === "client") {
          router.push("/vault")
        }
        
        onClose()
      } else {
        setAuthError(result.error || 'Invalid credentials. Please check your email and password.')
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentStep("selection")
    setSelectedUserType(null)
    setAuthError('')
    form.reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          {/* Auth Portal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="relative w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass Background */}
              <div className="absolute inset-0 glass-morphism rounded-3xl" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy-dark/98 to-navy/95 rounded-3xl border border-gold/20" />

              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-gold/15 to-transparent rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-l from-gold/12 to-transparent rounded-full blur-3xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>

              <div className="relative z-10 p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center bg-gold/10 border border-gold/20">
                      <BuckinghamVaultIcon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">
                        Private Access Portal
                      </h2>
                      <p className="text-xs text-gold/70">The Buckingham Vault</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-gold hover:text-gold-light hover:bg-gold/10 rounded-full w-10 h-10 p-0"
                  >
                    <XIcon className="w-5 h-5" />
                  </Button>
                </div>

                {/* User Type Selection */}
                {currentStep === "selection" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-display font-bold text-white mb-3">
                        Select Access Type
                      </h3>
                      <p className="text-white/70 font-light">
                        Choose your portal to access Buckingham Vault services
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Mandate Member Option */}
                      <motion.button
                        onClick={() => handleUserTypeSelect("mandate")}
                        className="w-full p-6 glass-morphism rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300 group text-left"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
                              <CrownIcon className="w-7 h-7 text-gold" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white group-hover:text-gold transition-colors duration-300">
                                Mandate Member
                              </h4>
                              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                                Internal access to deal tracking, analytics & institutional tools
                              </p>
                            </div>
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-gold/60 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </motion.button>

                      {/* Client Services Option */}
                      <motion.button
                        onClick={() => handleUserTypeSelect("client")}
                        className="w-full p-6 glass-morphism rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300 group text-left"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
                              <ShieldIcon className="w-7 h-7 text-gold" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white group-hover:text-gold transition-colors duration-300">
                                Client Services
                              </h4>
                              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                                Portfolio access, trading platform & wealth management
                              </p>
                            </div>
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-gold/60 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </motion.button>
                    </div>

                    <div className="mt-8 p-4 bg-navy/40 border border-gold/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <LockIcon className="w-5 h-5 text-gold/70" />
                        <p className="text-xs text-white/70">
                          All access portals are secured with institutional-grade encryption and multi-factor authentication.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Credentials Step */}
                {currentStep === "credentials" && selectedUserType && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-gold/20 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {selectedUserType === "mandate" ? (
                          <CrownIcon className="w-8 h-8 text-gold" />
                        ) : (
                          <ShieldIcon className="w-8 h-8 text-gold" />
                        )}
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-2">
                        {selectedUserType === "mandate" ? "Mandate Portal" : "Client Portal"}
                      </h3>
                      <p className="text-white/70 font-light text-sm">
                        Enter your credentials to access secure services
                      </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Email Address</label>
                        <div className="relative">
                          <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold/60" />
                          <Input
                            {...form.register('email')}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 bg-navy/50 border-gold/20 text-white placeholder:text-white/40 focus:border-gold/50 h-12"
                          />
                        </div>
                        {form.formState.errors.email && (
                          <p className="text-red-400 text-xs">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Password</label>
                        <div className="relative">
                          <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold/60" />
                          <Input
                            {...form.register('password')}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="pl-10 pr-10 bg-navy/50 border-gold/20 text-white placeholder:text-white/40 focus:border-gold/50 h-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold/60 hover:text-gold transition-colors"
                          >
                            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Error Message */}
                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                        >
                          <p className="text-red-400 text-sm">{authError}</p>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-gold to-gold-light text-navy font-bold py-4 rounded-xl hover:from-gold-light hover:to-gold transition-all duration-300 flex items-center justify-center space-x-3 group h-12"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <KeyIcon className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <>
                              <span>Secure Access</span>
                              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          onClick={handleBackToSelection}
                          variant="outline"
                          className="w-full bg-transparent border-gold/30 text-white hover:bg-gold/10 hover:border-gold py-3 rounded-xl transition-all duration-300"
                        >
                          Back to Selection
                        </Button>
                      </div>
                    </form>

                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}