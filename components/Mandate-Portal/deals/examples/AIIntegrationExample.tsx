"use client"

/**
 * AI Integration Example
 * Comprehensive demonstration of Jeeves AI document analysis and smart form population
 */

import React, { useState } from 'react'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { SmartDealForm } from '@/components/Mandate-Portal/forms/SmartDealForm'
import { DocumentAnalysisPanel } from '@/components/Artificial-Intelligence/ai/DocumentAnalysisPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain,
  FileText,
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  TrendingUp,
  Clock,
  Shield,
  Users,
  DollarSign,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AIMetrics {
  documentsProcessed: number
  averageConfidence: number
  timesSaved: number // in minutes
  accuracyRate: number
  fieldsAutoPopulated: number
}

const mockMetrics: AIMetrics = {
  documentsProcessed: 247,
  averageConfidence: 87.3,
  timesSaved: 1834,
  accuracyRate: 94.2,
  fieldsAutoPopulated: 3891
}

const aiFeatures = [
  {
    icon: Brain,
    title: 'Advanced Document Analysis',
    description: 'AI-powered extraction from term sheets, LOIs, financial statements, and legal documents',
    benefits: ['99.1% accuracy rate', 'Multi-format support', 'Contextual understanding']
  },
  {
    icon: Zap,
    title: 'Intelligent Form Population',
    description: 'Automatically populate deal forms with extracted data and smart field mapping',
    benefits: ['80% time reduction', 'Confidence scoring', 'Validation checks']
  },
  {
    icon: Target,
    title: 'Smart Field Mapping',
    description: 'Advanced algorithms map extracted data to appropriate form fields with high precision',
    benefits: ['Context-aware mapping', 'Relationship detection', 'Error prevention']
  },
  {
    icon: Shield,
    title: 'Compliance & Validation',
    description: 'Built-in compliance checks and data validation ensure regulatory requirements are met',
    benefits: ['Regulatory compliance', 'Data quality checks', 'Audit trails']
  }
]

const integrationSteps = [
  {
    step: 1,
    title: 'Upload Documents',
    description: 'Upload term sheets, financial statements, or deal documents',
    icon: FileText,
    features: ['Secure upload', 'Virus scanning', 'Multi-format support']
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Jeeves AI analyzes documents and extracts key deal information',
    icon: Brain,
    features: ['Document parsing', 'Data extraction', 'Confidence scoring']
  },
  {
    step: 3,
    title: 'Review & Validate',
    description: 'Review extracted data and AI suggestions before applying',
    icon: CheckCircle,
    features: ['Manual review', 'Validation checks', 'Confidence indicators']
  },
  {
    step: 4,
    title: 'Auto-Population',
    description: 'Apply AI enhancements to automatically populate form fields',
    icon: Sparkles,
    features: ['Smart mapping', 'Bulk application', 'Undo capabilities']
  }
]

export function AIIntegrationExample() {
  const [activeDemo, setActiveDemo] = useState('overview')
  const [demoData, setDemoData] = useState({
    formSubmissions: 0,
    aiEnhancements: 0,
    timesSaved: 0
  })

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', data)
    setDemoData(prev => ({
      ...prev,
      formSubmissions: prev.formSubmissions + 1
    }))
  }

  const handleSaveDraft = async (data: any) => {
    console.log('Draft saved:', data)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <FeatureCard variant="premium" className="border-gold/30">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Brain className="w-16 h-16 text-gold" />
              <Sparkles className="w-6 h-6 text-gold absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Jeeves AI Integration</h1>
          <p className="text-xl text-white/80 mb-6 max-w-3xl mx-auto">
            Revolutionary AI-powered document analysis and intelligent form population for institutional deal processing
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{mockMetrics.documentsProcessed}</div>
              <div className="text-sm text-white/60">Documents Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{mockMetrics.averageConfidence}%</div>
              <div className="text-sm text-white/60">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{(mockMetrics.timesSaved / 60).toFixed(1)}h</div>
              <div className="text-sm text-white/60">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{mockMetrics.accuracyRate}%</div>
              <div className="text-sm text-white/60">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{mockMetrics.fieldsAutoPopulated}</div>
              <div className="text-sm text-white/60">Fields Populated</div>
            </div>
          </div>
        </div>
      </FeatureCard>

      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-navy-800/60">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Overview
          </TabsTrigger>
          <TabsTrigger value="demo" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Live Demo
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Features
          </TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-gold data-[state=active]:text-navy-900">
            Integration
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* AI Capabilities */}
          <FeatureCard variant="glass" className="border-gold/20">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">AI-Powered Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <feature.icon className="w-6 h-6 text-gold" />
                      <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                    </div>
                    
                    <p className="text-white/70">{feature.description}</p>
                    
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Process Flow */}
          <FeatureCard variant="glass" className="border-gold/20">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">AI Processing Workflow</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {integrationSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    {/* Step Connection Line */}
                    {index < integrationSteps.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-gold to-gold/30 z-0" />
                    )}
                    
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 bg-gold/20 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-gold" />
                      </div>
                      
                      <div className="mb-2">
                        <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30 mb-2">
                          Step {step.step}
                        </Badge>
                        <h3 className="text-md font-semibold text-white">{step.title}</h3>
                      </div>
                      
                      <p className="text-sm text-white/60 mb-3">{step.description}</p>
                      
                      <ul className="space-y-1">
                        {step.features.map((feature, idx) => (
                          <li key={idx} className="text-xs text-white/50">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard variant="glass" className="border-green-500/20">
              <div className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Efficiency Gains</h3>
                <p className="text-white/60 mb-4">Reduce form completion time by up to 80% with AI automation</p>
                <div className="text-2xl font-bold text-green-400">80%</div>
                <div className="text-sm text-white/50">Time Reduction</div>
              </div>
            </FeatureCard>

            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-6 text-center">
                <Target className="w-8 h-8 text-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Accuracy</h3>
                <p className="text-white/60 mb-4">Maintain high accuracy with AI validation and confidence scoring</p>
                <div className="text-2xl font-bold text-gold">94.2%</div>
                <div className="text-sm text-white/50">Accuracy Rate</div>
              </div>
            </FeatureCard>

            <FeatureCard variant="glass" className="border-blue-500/20">
              <div className="p-6 text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Compliance</h3>
                <p className="text-white/60 mb-4">Built-in compliance checks ensure regulatory requirements</p>
                <div className="text-2xl font-bold text-blue-400">100%</div>
                <div className="text-sm text-white/50">Compliance Rate</div>
              </div>
            </FeatureCard>
          </div>
        </TabsContent>

        {/* Live Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Alert className="border-gold/30 bg-gold/10">
            <Sparkles className="h-4 w-4 text-gold" />
            <AlertDescription className="text-gold">
              This is a live demonstration of the AI-powered deal form. Upload real documents to see Jeeves AI in action.
            </AlertDescription>
          </Alert>

          <SmartDealForm
            dealId="demo-deal-001"
            clientId="demo-client-001"
            onSubmit={handleFormSubmit}
            onSaveDraft={handleSaveDraft}
          />

          {/* Demo Statistics */}
          {(demoData.formSubmissions > 0 || demoData.aiEnhancements > 0) && (
            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Demo Session Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{demoData.formSubmissions}</div>
                    <div className="text-xs text-white/60">Forms Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{demoData.aiEnhancements}</div>
                    <div className="text-xs text-white/60">AI Enhancements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{demoData.timesSaved}</div>
                    <div className="text-xs text-white/60">Minutes Saved</div>
                  </div>
                </div>
              </div>
            </FeatureCard>
          )}
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Analysis Features */}
            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Document Analysis</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Multi-Format Support</div>
                      <div className="text-sm text-white/60">PDF, Word, Excel, PowerPoint, and text files</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Advanced OCR</div>
                      <div className="text-sm text-white/60">Extract text from scanned documents and images</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Context Understanding</div>
                      <div className="text-sm text-white/60">AI understands document context and relationships</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Security Scanning</div>
                      <div className="text-sm text-white/60">Built-in virus scanning and threat detection</div>
                    </div>
                  </li>
                </ul>
              </div>
            </FeatureCard>

            {/* Form Population Features */}
            <FeatureCard variant="glass" className="border-gold/20">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Smart Form Population</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Intelligent Mapping</div>
                      <div className="text-sm text-white/60">Smart field mapping with confidence scoring</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Validation Checks</div>
                      <div className="text-sm text-white/60">Real-time validation and error detection</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Human Review</div>
                      <div className="text-sm text-white/60">Review and approve AI suggestions before applying</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Audit Trail</div>
                      <div className="text-sm text-white/60">Complete audit trail of AI enhancements</div>
                    </div>
                  </li>
                </ul>
              </div>
            </FeatureCard>
          </div>

          {/* API Integration */}
          <FeatureCard variant="glass" className="border-gold/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Integration Example</h3>
              <div className="bg-navy-900/60 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-white/80">
{`import { createJeevesAI } from '@/lib/ai/jeeves'

// Analyze uploaded document
const jeevesAI = createJeevesAI()
const result = await jeevesAI.analyzeDocument({
  fileId: 'doc-123',
  fileName: 'term-sheet.pdf',
  fileType: 'application/pdf',
  fileSize: 2048576,
  analysisType: 'deal_intake',
  priority: 'high'
})

// Extract deal data
const dealData = result.extractedData
const confidence = result.confidence

// Apply to form
if (confidence >= 80) {
  populateForm(dealData)
}`}
                </pre>
              </div>
            </div>
          </FeatureCard>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <FeatureCard variant="glass" className="border-gold/20">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Integration Guide</h2>
              
              <div className="space-y-6">
                {/* Architecture Overview */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Architecture Overview</h3>
                  <p className="text-white/70 mb-4">
                    The AI integration consists of three main components working together to provide seamless document analysis and form population.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-navy-800/40 rounded-lg border border-gold/10">
                      <Brain className="w-6 h-6 text-gold mb-2" />
                      <h4 className="font-medium text-white mb-1">Jeeves AI Service</h4>
                      <p className="text-sm text-white/60">Document analysis and data extraction engine</p>
                    </div>
                    
                    <div className="p-4 bg-navy-800/40 rounded-lg border border-gold/10">
                      <FileText className="w-6 h-6 text-gold mb-2" />
                      <h4 className="font-medium text-white mb-1">Analysis Panel</h4>
                      <p className="text-sm text-white/60">Document upload and result visualization</p>
                    </div>
                    
                    <div className="p-4 bg-navy-800/40 rounded-lg border border-gold/10">
                      <Sparkles className="w-6 h-6 text-gold mb-2" />
                      <h4 className="font-medium text-white mb-1">Smart Form</h4>
                      <p className="text-sm text-white/60">AI-enhanced form with auto-population</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gold/20" />

                {/* Implementation Steps */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Implementation Steps</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gold/20 border border-gold rounded-full flex items-center justify-center text-gold font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Import Components</h4>
                        <p className="text-sm text-white/60">Import the required AI components and utilities</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gold/20 border border-gold rounded-full flex items-center justify-center text-gold font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Configure API</h4>
                        <p className="text-sm text-white/60">Set up Jeeves AI API credentials and endpoints</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gold/20 border border-gold rounded-full flex items-center justify-center text-gold font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Integrate Components</h4>
                        <p className="text-sm text-white/60">Combine DocumentAnalysisPanel and SmartDealForm</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gold/20 border border-gold rounded-full flex items-center justify-center text-gold font-semibold text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Handle Callbacks</h4>
                        <p className="text-sm text-white/60">Implement data extraction and form population handlers</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gold/20" />

                {/* Configuration */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Configuration</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-white/70">API Base URL:</span>
                      <span className="ml-2 text-gold">https://api.jeeves.ai</span>
                    </div>
                    <div>
                      <span className="text-white/70">API Version:</span>
                      <span className="ml-2 text-gold">v1</span>
                    </div>
                    <div>
                      <span className="text-white/70">Supported Formats:</span>
                      <span className="ml-2 text-gold">PDF, DOC, DOCX, XLS, XLSX, TXT</span>
                    </div>
                    <div>
                      <span className="text-white/70">Max File Size:</span>
                      <span className="ml-2 text-gold">50MB</span>
                    </div>
                    <div>
                      <span className="text-white/70">Analysis Types:</span>
                      <span className="ml-2 text-gold">deal_intake, financial_statement, legal_document, kyc_document</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}