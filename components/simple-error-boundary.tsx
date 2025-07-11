'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class SimpleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy p-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-gold">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-white/70">
                We encountered an unexpected error. Please refresh the page to continue.
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gold text-navy hover:bg-gold-light"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}