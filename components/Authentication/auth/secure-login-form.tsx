"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

type LoginFormValues = z.infer<typeof loginSchema>

interface SecureLoginFormProps {
  onSuccess?: () => void
}

export function SecureLoginForm({ onSuccess }: SecureLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useSecureAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: LoginFormValues) => {
    setError('')
    setIsSubmitting(true)
    
    try {
      const result = await login(values.email, values.password)
      
      if (result.success) {
        onSuccess?.()
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="glass-morphism border-gold/20">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 mx-auto glass-morphism rounded-2xl flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-gold" />
          </motion.div>
          <CardTitle className="text-2xl font-display text-white">
            Secure Access Portal
          </CardTitle>
          <p className="text-white/70">
            Enterprise-grade authentication for Buckingham Vault
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-navy/50 border-gold/20 text-white placeholder:text-white/50 focus:border-gold"
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white/50 hover:text-white/70 transition-colors"
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert className="border-red-500/30 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Secure Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-navy/30 border border-gold/10 rounded-lg"
          >
            <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Security Features
            </h4>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <span>Secure HTTP-only cookies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <span>Rate limiting protection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <span>Session auto-refresh</span>
              </div>
            </div>
          </motion.div>

        </CardContent>
      </Card>
    </motion.div>
  )
}