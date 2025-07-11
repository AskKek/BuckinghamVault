import bcrypt from 'bcryptjs'
import { User } from '@/types/financial'
import { mockUsers } from '@/lib/mock-data'

// In a real application, this would interact with a database
// For now, we'll use our mock data with password hashing

interface UserCredentials {
  email: string
  password: string
}

interface CreateUserData extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'> {
  password: string
}

// Hash password for new users
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Verify password during login
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  // In a real app, this would be a database query
  const user = mockUsers.find(u => u.id === userId)
  return user || null
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  // In a real app, this would be a database query
  const user = mockUsers.find(u => u.email === email)
  return user || null
}

// Authenticate user credentials
export async function authenticateUser(credentials: UserCredentials): Promise<User | null> {
  const user = await getUserByEmail(credentials.email)
  
  if (!user || !user.isActive) {
    return null
  }
  
  // For demo purposes, accept any password (including empty) for all valid users
  // This allows admin@bv.com to work for both mandate members and clients
  // In production, you would verify against a hashed password:
  // const isValidPassword = await verifyPassword(credentials.password, user.hashedPassword)
  
  // Update last login timestamp and return user
  return {
    ...user,
    lastLogin: new Date()
  }
}

// Create new user (for future use)
export async function createUser(userData: CreateUserData): Promise<User> {
  const hashedPassword = await hashPassword(userData.password)
  
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date()
  }
  
  // In a real app, this would save to database
  mockUsers.push(newUser)
  
  return newUser
}

// Update user
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return null
  }
  
  const updatedUser = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date()
  }
  
  // In a real app, this would update the database
  mockUsers[userIndex] = updatedUser
  
  return updatedUser
}

// Check if user has permission
export function userHasPermission(user: User, action: string, resource: string): boolean {
  // Admin has all permissions
  if (user.role === 'admin') return true
  
  // Check specific permissions
  return user.permissions.some(permission => {
    const actionMatch = permission.action === '*' || permission.action === action
    const resourceMatch = permission.resource === '*' || permission.resource === resource
    
    // Check conditions if they exist
    if (permission.conditions && actionMatch && resourceMatch) {
      // For mandate-specific permissions
      if (permission.conditions.mandateId && user.mandateId !== permission.conditions.mandateId) {
        return false
      }
    }
    
    return actionMatch && resourceMatch
  })
}

// Get users by mandate
export async function getUsersByMandate(mandateId: string): Promise<User[]> {
  return mockUsers.filter(user => user.mandateId === mandateId && user.isActive)
}

// Deactivate user
export async function deactivateUser(userId: string): Promise<boolean> {
  const user = await getUserById(userId)
  if (!user) return false
  
  await updateUser(userId, { isActive: false })
  return true
}