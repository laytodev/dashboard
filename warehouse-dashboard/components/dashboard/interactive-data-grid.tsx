'use client'

import { useState, useMemo } from 'react'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Search } from 'lucide-react'
import { exportToExcel } from '@/lib/excel-export'

interface InteractiveDataGridProps {
  title: string
  description?: string
  data: any[]
  columns: GridColDef[]
  height?: number
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
  density?: 'compact' | 'standard' | 'comfortable'
}

export function InteractiveDataGrid({
  title,
  description,
  data,
  columns,
  height = 500,
  pageSize = 10,
  searchable = true,
  exportable = true,
  density = 'standard',
}: InteractiveDataGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: 0,
  })

  // Add unique IDs if not present
  const rowsWithIds = useMemo(() => {
    return data.map((row, idx) => ({
      id: row.id || idx,
      ...row,
    }))
  }, [data])

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rowsWithIds

    const query = searchQuery.toLowerCase()
    return rowsWithIds.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(query)
      )
    )
  }, [rowsWithIds, searchQuery])

  const handleExport = () => {
    exportToExcel(filteredRows, `${title.replace(/\s+/g, '_')}_data`)
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="font-mono text-xs">
              {filteredRows.length} rows
            </Badge>
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex gap-2">
          {exportable && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {searchable && (
          <div className="mb-4 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        <div className="animate-scale-in" style={{ height }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            density={density}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
                printOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'hsl(var(--muted))',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'hsl(var(--muted) / 0.5)',
                borderRadius: '0.5rem 0.5rem 0 0',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid hsl(var(--border))',
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
