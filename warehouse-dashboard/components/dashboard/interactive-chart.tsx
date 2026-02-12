'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, LineChart, PieChart, ScatterChart } from '@mui/x-charts'
import { Download, Table2, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import { DataTableModal } from './data-table-modal'
import { exportToExcel } from '@/lib/excel-export'

interface InteractiveChartProps {
  title: string
  description?: string
  data: any[]
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
  dataKeys?: string[]
  xAxisKey?: string
  yAxisKey?: string
  valueKey?: string
  labelKey?: string
  colors?: string[]
  height?: number
  showControls?: boolean
  showDataTable?: boolean
  filters?: {
    label: string
    key: string
    options: { label: string; value: string }[]
  }[]
  dateRange?: boolean
  trend?: number
}

export function InteractiveChart({
  title,
  description,
  data,
  chartType,
  dataKeys = [],
  xAxisKey,
  yAxisKey,
  valueKey,
  labelKey,
  colors,
  height = 300,
  showControls = true,
  showDataTable = true,
  filters = [],
  dateRange = false,
  trend,
}: InteractiveChartProps) {
  const [isTableOpen, setIsTableOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const [dataLimit, setDataLimit] = useState<number>(data.length)
  const [chartVariant, setChartVariant] = useState<'default' | 'stacked'>('default')
  const [showAnimation, setShowAnimation] = useState(true)

  // Apply filters to data
  const filteredData = useMemo(() => {
    let result = [...data]
    
    // Apply each filter
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => String(item[key]) === value)
      }
    })
    
    // Apply data limit
    return result.slice(0, dataLimit)
  }, [data, selectedFilters, dataLimit])

  const handleExport = () => {
    exportToExcel(filteredData, `${title.replace(/\s+/g, '_')}_data`)
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterKey]: value }))
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 300)
  }

  const chartColors = colors || [
    'hsl(215, 80%, 55%)',
    'hsl(168, 55%, 45%)',
    'hsl(35, 90%, 55%)',
    'hsl(262, 55%, 58%)',
    'hsl(0, 65%, 55%)',
  ]

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {title}
              {trend !== undefined && (
                <Badge variant={trend >= 0 ? 'default' : 'destructive'} className="gap-1">
                  {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </Badge>
              )}
            </CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex gap-2">
            {showDataTable && (
              <Button variant="outline" size="sm" onClick={() => setIsTableOpen(true)}>
                <Table2 className="h-4 w-4 mr-2" />
                Data
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showControls && (filters.length > 0 || dateRange) && (
            <div className="mb-6 space-y-4 p-4 bg-muted/30 rounded-lg border animate-slide-up">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                Filters & Controls
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map(filter => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{filter.label}</label>
                    <Select
                      value={selectedFilters[filter.key] || 'all'}
                      onValueChange={(value) => handleFilterChange(filter.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {filter.options.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Data Points: {dataLimit}
                  </label>
                  <input
                    type="range"
                    value={dataLimit}
                    onChange={(e) => setDataLimit(parseInt(e.target.value))}
                    min={5}
                    max={data.length}
                    step={1}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                {(chartType === 'bar' || chartType === 'area') && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Chart Type</label>
                    <Select value={chartVariant} onValueChange={(v: any) => setChartVariant(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="stacked">Stacked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={showAnimation ? 'animate-scale-in' : ''}>
            {chartType === 'bar' && xAxisKey && (
              <BarChart
                dataset={filteredData}
                xAxis={[{ scaleType: 'band', dataKey: xAxisKey }]}
                series={dataKeys.map((key, idx) => ({
                  dataKey: key,
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  color: chartColors[idx % chartColors.length],
                  stack: chartVariant === 'stacked' ? 'total' : undefined,
                }))}
                height={height}
                slotProps={{
                  legend: { hidden: false },
                }}
              />
            )}

            {chartType === 'line' && xAxisKey && (
              <LineChart
                dataset={filteredData}
                xAxis={[{ scaleType: 'band', dataKey: xAxisKey }]}
                series={dataKeys.map((key, idx) => ({
                  dataKey: key,
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  color: chartColors[idx % chartColors.length],
                  showMark: filteredData.length <= 20,
                  curve: 'natural',
                }))}
                height={height}
                slotProps={{
                  legend: { hidden: false },
                }}
              />
            )}

            {chartType === 'area' && xAxisKey && (
              <LineChart
                dataset={filteredData}
                xAxis={[{ scaleType: 'band', dataKey: xAxisKey }]}
                series={dataKeys.map((key, idx) => ({
                  dataKey: key,
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  color: chartColors[idx % chartColors.length],
                  area: true,
                  showMark: false,
                  stack: chartVariant === 'stacked' ? 'total' : undefined,
                }))}
                height={height}
                slotProps={{
                  legend: { hidden: false },
                }}
              />
            )}

            {chartType === 'pie' && valueKey && labelKey && (
              <PieChart
                series={[
                  {
                    data: filteredData.map((item, idx) => ({
                      id: idx,
                      value: item[valueKey],
                      label: item[labelKey],
                      color: chartColors[idx % chartColors.length],
                    })),
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={height}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                  },
                }}
              />
            )}

            {chartType === 'scatter' && xAxisKey && yAxisKey && (
              <ScatterChart
                dataset={filteredData}
                xAxis={[{ dataKey: xAxisKey }]}
                yAxis={[{ dataKey: yAxisKey }]}
                series={[
                  {
                    dataKey: yAxisKey,
                    label: yAxisKey.charAt(0).toUpperCase() + yAxisKey.slice(1),
                    color: chartColors[0],
                  },
                ]}
                height={height}
              />
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filteredData.length} of {data.length} records</span>
            {Object.keys(selectedFilters).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFilters({})}
                className="h-6 text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showDataTable && (
        <DataTableModal
          isOpen={isTableOpen}
          onClose={() => setIsTableOpen(false)}
          data={filteredData}
          title={`${title} - Data`}
        />
      )}
    </>
  )
}
