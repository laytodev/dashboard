"use client"

import { useMemo } from "react"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { KPICard } from "@/components/dashboard/kpi-card"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { InteractiveDataGrid } from "@/components/dashboard/interactive-data-grid"
import {
  getOverviewKPIs,
  getOrdersTimeSeries,
  getInventoryByCategory,
  getRecentOrders,
  getCarrierData,
  getZoneUtilization,
} from "@/lib/dashboard-data"
import { GridColDef } from "@mui/x-data-grid"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function OverviewPage() {
  const { dateRange } = useDashboard()

  const kpis = useMemo(() => getOverviewKPIs(dateRange), [dateRange])
  const timeSeries = useMemo(() => getOrdersTimeSeries(dateRange), [dateRange])
  const inventory = useMemo(() => getInventoryByCategory(), [])
  const recentOrders = useMemo(() => getRecentOrders(), [])
  const carriers = useMemo(() => getCarrierData(), [])
  const zones = useMemo(() => getZoneUtilization(), [])

  const orderColumns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 120, fontFamily: 'monospace' },
    { field: 'customer', headerName: 'Customer', width: 200 },
    { field: 'items', headerName: 'Items', width: 80, type: 'number' },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      type: 'number',
      valueFormatter: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px] capitalize",
            params.value === "delivered" && "bg-success/10 text-success border-success/20",
            params.value === "shipped" && "bg-primary/10 text-primary border-primary/20",
            params.value === "processing" && "bg-warning/10 text-warning border-warning/20",
            params.value === "picking" && "bg-chart-4/10 text-chart-4 border-chart-4/20",
            params.value === "packing" && "bg-chart-2/10 text-chart-2 border-chart-2/20",
          )}
        >
          {params.value}
        </Badge>
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      renderCell: (params) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] capitalize",
            params.value === "rush" && "border-destructive/40 text-destructive",
            params.value === "expedited" && "border-warning/40 text-warning",
          )}
        >
          {params.value}
        </Badge>
      ),
    },
    { field: 'date', headerName: 'Date', width: 100 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <InteractiveChart
            title="Order Volume Trends"
            description="Orders placed vs shipped over time"
            data={timeSeries}
            chartType="area"
            dataKeys={["orders", "shipped", "returned"]}
            xAxisKey="date"
            height={320}
            showControls={true}
            filters={[
              {
                label: 'Metric',
                key: 'metric',
                options: [
                  { label: 'All Metrics', value: 'all' },
                  { label: 'Orders Only', value: 'orders' },
                  { label: 'Shipped Only', value: 'shipped' },
                ]
              }
            ]}
            trend={8.5}
          />
        </div>

        <div className="lg:col-span-3">
          <InteractiveChart
            title="Inventory Distribution"
            description="Current stock by category"
            data={inventory}
            chartType="pie"
            valueKey="units"
            labelKey="category"
            height={320}
            showControls={false}
            colors={inventory.map(i => i.fill)}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <InteractiveChart
          title="Carrier On-Time Performance"
          description="Delivery performance by carrier partner"
          data={carriers}
          chartType="bar"
          dataKeys={["onTime"]}
          xAxisKey="carrier"
          height={280}
          showControls={true}
          filters={[
            {
              label: 'Min Performance',
              key: 'onTime',
              options: [
                { label: 'All Carriers', value: 'all' },
                { label: 'Above 95%', value: '95' },
                { label: 'Above 90%', value: '90' },
              ]
            }
          ]}
        />

        <InteractiveChart
          title="Warehouse Capacity Utilization"
          description="Zone capacity usage"
          data={zones}
          chartType="bar"
          dataKeys={["percentage"]}
          xAxisKey="zone"
          height={280}
          showControls={false}
          colors={zones.map(z => 
            z.percentage > 85 ? 'hsl(0, 65%, 55%)' : 
            z.percentage > 70 ? 'hsl(35, 90%, 55%)' : 
            'hsl(168, 55%, 45%)'
          )}
        />
      </div>

      {/* Recent Orders DataGrid */}
      <InteractiveDataGrid
        title="Recent Order Activity"
        description="Latest orders with full details and advanced filtering"
        data={recentOrders}
        columns={orderColumns}
        height={450}
        pageSize={10}
        density="comfortable"
      />
    </div>
  )
}
