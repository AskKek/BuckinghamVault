"use client"

import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="glass-morphism border-red-500/20">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center"
            >
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </motion.div>
            <CardTitle className="text-2xl font-display text-white">
              Access Denied
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <p className="text-white/70">
              You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold">
                <Link href="/vault">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full border-white/20 text-white hover:bg-white/5">
                <Link href="/login">
                  Switch Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}