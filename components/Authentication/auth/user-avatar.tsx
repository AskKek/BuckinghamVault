"use client"

import { motion } from 'framer-motion'
import { User, LogOut, Settings, Shield } from 'lucide-react'
import { useSecureAuth } from '@/hooks/use-secure-auth'
import { getRoleDisplayName } from '@/lib/auth-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function UserAvatar() {
  const { user, logout } = useSecureAuth()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'mandate_member':
        return 'bg-gold/20 text-gold border-gold/30'
      case 'viewer':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'ai_analyst':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      default:
        return 'bg-white/20 text-white border-white/30'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <Avatar className="w-8 h-8 border-2 border-gold/30">
            <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/10 text-gold text-sm font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white">{user.name}</div>
            <div className="text-xs text-white/60">{user.email}</div>
          </div>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-navy/95 backdrop-blur-sm border-gold/20" align="end">
        <DropdownMenuLabel className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-gold/30">
              <AvatarFallback className="bg-gradient-to-br from-gold/20 to-gold/10 text-gold font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white">{user.name}</div>
              <div className="text-sm text-white/60">{user.email}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getRoleBadgeColor()}`}>
              {getRoleDisplayName(user.role)}
            </Badge>
            {user.mandateId && (
              <Badge variant="outline" className="text-xs border-white/30 text-white/70">
                {user.mandateId.replace('mandate_', '').toUpperCase()}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gold/20" />

        <DropdownMenuItem className="text-white/90 hover:bg-white/5 cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white/90 hover:bg-white/5 cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>

        {user.role === 'admin' && (
          <DropdownMenuItem className="text-white/90 hover:bg-white/5 cursor-pointer">
            <Shield className="w-4 h-4 mr-2" />
            Admin Panel
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-gold/20" />

        <DropdownMenuItem 
          onClick={logout}
          className="text-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}