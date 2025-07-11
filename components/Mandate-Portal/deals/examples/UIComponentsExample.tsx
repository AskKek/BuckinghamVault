"use client"

/**
 * UI Components Showcase
 * Comprehensive example of DataTable, NumericInput, FileUpload, and DateRangePicker
 */

import React, { useState, useMemo } from 'react'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { DataTable, type TableColumn } from '@/components/ui/data-table'
import { NumericInput, FinancialNumericInput } from '@/components/ui/numeric-input'
import { FileUpload, type FileItem } from '@/components/ui/file-upload'
import { DateRangePicker, type DateRange, FinancialDateRangePresets } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DealStatusBadge, DealTypeBadge, CurrencyDisplay } from '@/lib/theme'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Sample data for DataTable
interface SampleDeal {
  id: string
  dealNumber: string
  clientName: string
  type: 'acquisition' | 'divestiture' | 'merger'
  status: 'submitted' | 'under_review' | 'completed' | 'cancelled'
  amount: number
  fee: number
  forensicRating: 'AAA' | 'AA' | 'A' | 'BBB'
  createdAt: Date
  updatedAt: Date
}

const sampleDeals: SampleDeal[] = [
  {
    id: '1',
    dealNumber: 'BV-2024-001',
    clientName: 'Alpha Capital Partners',
    type: 'acquisition',
    status: 'completed',
    amount: 250000000,
    fee: 2500000,
    forensicRating: 'AAA',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-28')
  },
  {
    id: '2', 
    dealNumber: 'BV-2024-002',
    clientName: 'Beta Holdings LLC',
    type: 'divestiture',
    status: 'under_review',
    amount: 180000000,
    fee: 1800000,
    forensicRating: 'AA',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '3',
    dealNumber: 'BV-2024-003',
    clientName: 'Gamma Enterprises',
    type: 'merger',
    status: 'submitted',
    amount: 500000000,
    fee: 5000000,
    forensicRating: 'A',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '4',
    dealNumber: 'BV-2024-004',
    clientName: 'Delta Investments',
    type: 'acquisition',
    status: 'cancelled',
    amount: 75000000,
    fee: 750000,
    forensicRating: 'BBB',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10')
  }
]

export function UIComponentsExample() {
  // DataTable state
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    total: sampleDeals.length
  })

  // NumericInput states
  const [dealValue, setDealValue] = useState<number | null>(250000000)
  const [feeRate, setFeeRate] = useState<number | null>(1.5)
  const [shares, setShares] = useState<number | null>(1000000)
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
  const [reportingPeriod, setReportingPeriod] = useState<DateRange>({ from: null, to: null })

  // DataTable columns configuration
  const columns: TableColumn<SampleDeal>[] = useMemo(() => [
    {
      id: 'dealNumber',
      header: 'Deal Number',
      accessorKey: 'dealNumber',
      sortable: true,
      sticky: true,
      width: 120,
      cell: (value) => (
        <span className="font-mono text-sm text-gold">{value}</span>
      )
    },
    {
      id: 'client',
      header: 'Client Name',
      accessorKey: 'clientName',
      sortable: true,
      width: 200,
      cell: (value) => (
        <span className="font-medium text-white">{value}</span>
      )
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      width: 120,
      align: 'center',
      cell: (value) => <DealTypeBadge type={value} size="sm" />
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      width: 130,
      align: 'center',
      cell: (value) => <DealStatusBadge status={value} size="sm" />
    },
    {
      id: 'amount',
      header: 'Deal Value',
      accessorKey: 'amount',
      sortable: true,
      width: 150,
      align: 'right',
      cell: (value) => (
        <CurrencyDisplay 
          amount={value} 
          size="sm"
          threshold={{ positive: 200000000 }}
        />
      )
    },
    {
      id: 'fee',
      header: 'Fee',
      accessorKey: 'fee',
      sortable: true,
      width: 120,
      align: 'right',
      cell: (value) => (
        <CurrencyDisplay amount={value} size="sm" />
      )
    },
    {
      id: 'rating',
      header: 'Rating',
      accessorKey: 'forensicRating',
      sortable: true,
      width: 100,
      align: 'center',
      cell: (value) => (
        <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
          {value}
        </Badge>
      )
    },
    {
      id: 'created',
      header: 'Created',
      accessorKey: 'createdAt',
      sortable: true,
      width: 120,
      cell: (value) => (
        <span className="text-sm text-white/70">
          {value.toLocaleDateString()}
        </span>
      )
    }
  ], [])

  return (
    <div className="space-y-8">
      {/* DataTable Example */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Enterprise DataTable</h2>
          <p className="text-white/60 mb-6">
            Advanced table component with sorting, filtering, pagination, and selection
          </p>
          
          <DataTable
            data={sampleDeals}
            columns={columns}
            pagination={pagination}
            onPaginationChange={(newPagination) => 
              setPagination(prev => ({ ...prev, ...newPagination }))
            }
            selection={{
              enabled: true,
              selectedRows,
              onSelectionChange: setSelectedRows,
              getRowId: (row) => row.id
            }}
            onRowClick={(row) => console.log('Row clicked:', row)}
            onExport={() => console.log('Export clicked')}
            showToolbar
            showHeader
            showFooter
            stickyHeader
            variant="default"
            maxHeight="500px"
          />
          
          {selectedRows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-gold/10 border border-gold/30 rounded-lg"
            >
              <span className="text-gold font-medium">
                {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
              </span>
            </motion.div>
          )}
        </div>
      </FeatureCard>

      {/* NumericInput Examples */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Financial Numeric Inputs</h2>
          <p className="text-white/60 mb-6">
            High-precision numeric inputs with financial formatting and validation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Deal Value Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Deal Value</label>
              <FinancialNumericInput.Currency
                value={dealValue}
                onChange={setDealValue}
                min={1000000}
                max={1000000000}
                step={1000000}
                showComparison
                comparisonValue={200000000}
                comparisonLabel="vs market avg"
                placeholder="Enter deal value"
                size="lg"
              />
            </div>

            {/* Fee Rate Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Fee Rate (%)</label>
              <FinancialNumericInput.Percentage
                value={feeRate}
                onChange={setFeeRate}
                min={0.1}
                max={5.0}
                step={0.1}
                precision={2}
                showTrend
                trendDirection="up"
                showControls
                size="lg"
              />
            </div>

            {/* Share Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Share Quantity</label>
              <FinancialNumericInput.Quantity
                value={shares}
                onChange={setShares}
                min={1}
                step={1000}
                showControls
                incrementOnScroll
                size="lg"
              />
            </div>

            {/* Basis Points */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Interest Rate (bps)</label>
              <FinancialNumericInput.BasisPoints
                value={250}
                onChange={() => {}}
                min={0}
                max={1000}
                step={25}
                showControls
                size="lg"
              />
            </div>

            {/* Price with Trend */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Asset Price</label>
              <FinancialNumericInput.Price
                value={45.67}
                onChange={() => {}}
                min={0}
                precision={2}
                showTrend
                trendDirection="down"
                showComparison
                comparisonValue={47.23}
                comparisonLabel="prev close"
                size="lg"
              />
            </div>

            {/* Custom Formatted */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Custom Format</label>
              <NumericInput
                value={15000}
                onChange={() => {}}
                format="custom"
                prefix="£"
                suffix="/month"
                precision={0}
                showIndicators
                size="lg"
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* FileUpload Example */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Secure File Upload</h2>
          <p className="text-white/60 mb-6">
            Enterprise-grade file upload with virus scanning, encryption, and document management
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Standard Upload */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Document Upload</h3>
              <FileUpload
                accept={['.pdf', '.doc', '.docx', '.xls', '.xlsx', 'image/*']}
                maxSize={10 * 1024 * 1024} // 10MB
                maxFiles={5}
                multiple
                enableVirusscan
                enableEncryption
                showPreview
                showMetadata
                label="Upload Documents"
                description="Drag and drop files or click to browse"
                onUpload={async (files) => {
                  console.log('Uploading files:', files)
                }}
                onChange={setUploadedFiles}
                variant="default"
                size="md"
              />
            </div>

            {/* Compact Upload */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Image Upload</h3>
              <FileUpload
                accept={['image/*']}
                maxSize={5 * 1024 * 1024} // 5MB
                maxFiles={3}
                multiple
                enableVirusscan
                showPreview
                label="Upload Images"
                description="JPG, PNG, GIF up to 5MB each"
                variant="card"
                size="sm"
              />
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* DateRangePicker Examples */}
      <FeatureCard variant="glass" className="border-gold/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Date Range Picker</h2>
          <p className="text-white/60 mb-6">
            Advanced date range selection with presets, statistics, and financial periods
          </p>
          
          <div className="space-y-6">
            {/* Standard Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Analysis Period</label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  presets={FinancialDateRangePresets.Trading}
                  showPresets
                  showStatistics
                  showRelativeTime
                  placeholder="Select analysis period"
                  variant="default"
                  size="md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Reporting Period</label>
                <DateRangePicker
                  value={reportingPeriod}
                  onChange={setReportingPeriod}
                  presets={FinancialDateRangePresets.Reporting}
                  showPresets
                  showComparison
                  placeholder="Select reporting period"
                  variant="compact"
                  size="md"
                />
              </div>
            </div>

            <Separator className="bg-gold/20" />

            {/* Inline Picker */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Inline Date Range Selection</h3>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                variant="inline"
                showPresets
                showStatistics
                numberOfMonths={2}
                presets={FinancialDateRangePresets.Trading}
              />
            </div>
          </div>
        </div>
      </FeatureCard>

      {/* Integration Summary */}
      <FeatureCard variant="minimal" className="border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Component Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/70">
            <div>
              <h4 className="font-medium text-white mb-2">DataTable Features</h4>
              <ul className="space-y-1">
                <li>• Server-side sorting and filtering</li>
                <li>• Row selection with bulk actions</li>
                <li>• Column visibility controls</li>
                <li>• Export functionality</li>
                <li>• Sticky headers and columns</li>
                <li>• Custom cell renderers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Financial Inputs</h4>
              <ul className="space-y-1">
                <li>• Currency, percentage, basis points</li>
                <li>• Precision validation</li>
                <li>• Trend indicators</li>
                <li>• Comparison values</li>
                <li>• Increment controls</li>
                <li>• Custom formatters</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">File Upload Security</h4>
              <ul className="space-y-1">
                <li>• Virus scanning integration</li>
                <li>• File type validation</li>
                <li>• Encryption support</li>
                <li>• Progress tracking</li>
                <li>• Metadata extraction</li>
                <li>• Quarantine management</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Date Range Features</h4>
              <ul className="space-y-1">
                <li>• Financial period presets</li>
                <li>• Range statistics</li>
                <li>• Comparison periods</li>
                <li>• Multi-calendar support</li>
                <li>• Inline and popup modes</li>
                <li>• Fiscal year handling</li>
              </ul>
            </div>
          </div>
        </div>
      </FeatureCard>
    </div>
  )
}