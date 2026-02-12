"use client"

import { useMemo } from "react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { InteractiveDataGrid } from "@/components/dashboard/interactive-data-grid"
import {
  getInventoryLevels,
  getInventoryByCategory,
  type KPI,
} from "@/lib/dashboard-data"
import { GridColDef } from "@mui/x-data-grid"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

function getInventoryKPIs(): KPI[] {
  return [
    { label: "Total SKUs", value: "4,832", change: 3.2, changeLabel: "vs prev month", trend: "up", positive: true },
    { label: "Total Value", value: "$6.5M", change: 1.8, changeLabel: "vs prev month", trend: "up", positive: true },
    { label: "Avg Turnover", value: "8.4x", change: 6.2, changeLabel: "vs prev quarter", trend: "up", positive: true },
    { label: "Stockout Rate", value: "1.3%", change: -0.5, changeLabel: "vs prev month", trend: "down", positive: true },
  ]
}

const statusColors: Record<string, string> = {
  healthy: "bg-success/10 text-success border-success/20",
  low: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  overstock: "bg-primary/10 text-primary border-primary/20",
}

export default function InventoryPage() {
  const kpis = useMemo(() => getInventoryKPIs(), [])
  const inventory = useMemo(() => getInventoryLevels(), [])
  const categories = useMemo(() => getInventoryByCategory(), [])

  const criticalItems = inventory.filter(i => i.status === "critical")

  const scatterData = inventory.map(item => ({
    name: item.product,
    status: item.status,
    x: item.daysOfSupply,
    y: item.onHand,
  }))

  const inventoryColumns: GridColDef[] = [
    { field: 'product', headerName: 'Product', width: 220 },
    { field: 'sku', headerName: 'SKU', width: 120, fontFamily: 'monospace' },
    { field: 'onHand', headerName: 'On Hand', width: 120, type: 'number' },
    { field: 'committed', headerName: 'Committed', width: 120, type: 'number' },
    { field: 'available', headerName: 'Available', width: 120, type: 'number' },
    { field: 'reorderPoint', headerName: 'Reorder Point', width: 130, type: 'number' },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Badge
          variant="secondary"
          className={cn("text-[10px] capitalize", statusColors[params.value])}
        >
          {params.value}
        </Badge>
      ),
    },
    {
      field: 'daysOfSupply',
      headerName: 'Days Supply',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <span className={cn(
          "font-medium",
          params.value < 7 && "text-destructive",
          params.value >= 7 && params.value < 15 && "text-warning",
        )}>
          {params.value}d
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Critical Items Alert */}
      {criticalItems.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5 animate-slide-up">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Critical Stock Alert</p>
              <p className="text-xs text-muted-foreground mt-1">
                {criticalItems.length} item(s) below reorder point:{" "}
                {criticalItems.slice(0, 3).map(i => i.product).join(", ")}
                {criticalItems.length > 3 && ` and ${criticalItems.length - 3} more`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Inventory by Category */}
        <InteractiveChart
          title="Stock Value by Category"
          description="Current inventory value distribution"
          data={categories}
          chartType="bar"
          dataKeys={["value"]}
          xAxisKey="category"
          height={300}
          showControls={true}
          filters={[
            {
              label: 'Sort By',
              key: 'sortBy',
              options: [
                { label: 'Value', value: 'value' },
                { label: 'Units', value: 'units' },
                { label: 'Turnover', value: 'turnover' },
              ]
            }
          ]}
          colors={categories.map(c => c.fill)}
        />

        {/* Inventory Health Scatter */}
        <InteractiveChart
          title="Inventory Health Matrix"
          description="Days of supply vs on-hand quantity"
          data={scatterData}
          chartType="scatter"
          xAxisKey="x"
          yAxisKey="y"
          height={300}
          showControls={true}
          filters={[
            {
              label: 'Status',
              key: 'status',
              options: [
                { label: 'All Items', value: 'all' },
                { label: 'Healthy Only', value: 'healthy' },
                { label: 'Low Stock', value: 'low' },
                { label: 'Critical', value: 'critical' },
              ]
            }
          ]}
        />
      </div>

      {/* Turnover & Category Distribution */}
      <div className="grid gap-4 lg:grid-cols-2">
        <InteractiveChart
          title="Inventory Turnover by Category"
          description="Annual turnover rate comparison"
          data={categories}
          chartType="bar"
          dataKeys={["turnover"]}
          xAxisKey="category"
          height={300}
          showControls={false}
          colors={categories.map(c => c.fill)}
        />

        <InteractiveChart
          title="Unit Distribution by Category"
          description="Total units in stock"
          data={categories}
          chartType="pie"
          valueKey="units"
          labelKey="category"
          height={300}
          showControls={false}
          colors={categories.map(c => c.fill)}
        />
      </div>

      {/* Inventory DataGrid */}
      <InteractiveDataGrid
        title="Stock Levels"
        description="Complete inventory positions with advanced filtering and sorting"
        data={inventory}
        columns={inventoryColumns}
        height={500}
        pageSize={15}
        density="comfortable"
      />
    </div>
  )
}
