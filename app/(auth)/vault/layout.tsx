export const dynamic = 'force-dynamic'

import { AppShell, RouteGuard } from '@/components/Core'
import { UserAvatar } from '@/components/Authentication/auth/user-avatar'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  FileText, 
  Bot, 
  BookOpen, 
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface VaultLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/vault', icon: BarChart3 },
  { name: 'Deal Tracker', href: '/vault/deals', icon: FileText },
  { name: 'Brightpool Exchange', href: '/vault/exchange', icon: TrendingUp },
  { name: 'Jeeves AI', href: '/vault/jeeves', icon: Bot },
  { name: 'Knowledge Center', href: '/vault/knowledge', icon: BookOpen },
  { name: 'Settings', href: '/vault/settings', icon: Settings },
]

export default function VaultLayout({ children }: VaultLayoutProps) {
  return (
    <RouteGuard 
      requiredRoles={['admin', 'mandate_member', 'client']}
      showUnauthorized={true}
    >
      <AppShell variant="auth" showSidebar={false}>
        <div className="min-h-screen">
          {/* Navigation Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 border-b border-gold/10 bg-navy/80 backdrop-blur-sm"
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <Link href="/vault" className="text-xl font-display font-bold text-gold">
                    Buckingham Vault
                  </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-white/70 hover:text-white hover:bg-white/5"
                  >
                    <Bell className="w-4 h-4" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 text-white">
                      3
                    </Badge>
                  </Button>
                  <UserAvatar />
                </div>
              </div>
            </div>
          </motion.header>

          {/* Mobile Navigation */}
          <div className="md:hidden border-b border-gold/10 bg-navy/90 backdrop-blur-sm">
            <nav className="flex overflow-x-auto px-4 py-2 space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </AppShell>
    </RouteGuard>
  )
}