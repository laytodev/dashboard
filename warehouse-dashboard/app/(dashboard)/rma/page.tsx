"use client"

import { useMemo } from "react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { InteractiveDataGrid } from "@/components/dashboard/interactive-data-grid"
import {
  getRMAData,
  getRMAByReason,
  getRMATrend,
  type KPI,
} from "@/lib/dashboard-data"
import { GridColDef } from "@mui/x-data-grid"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function getRMAKPIs(): KPI[] {
  return [
    { label: "Open RMAs", value: "34", change: -8.1, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "RMA Rate", value: "2.1%", change: -0.4, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "Avg Resolution", value: "4.2 days", change: -15, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "Recovery Rate", value: "72%", change: 5.3, changeLabel: "vs prev period", trend: "up", positive: true },
  ]
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-primary/10 text-primary border-primary/20",
  received: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  inspecting: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  resolved: "bg-success/10 text-success border-success/20",
  denied: "bg-destructive/10 text-destructive border-destructive/20",
}

export default function RMAPage() {
  const kpis = useMemo(() => getRMAKPIs(), [])
  const rmas = useMemo(() => getRMAData(), [])
  const rmaByReason = useMemo(() => getRMAByReason(), [])
  const rmaTrend = useMemo(() => getRMATrend(), [])

  const rmaColumns: GridColDef[] = [
    { field: 'id', headerName: 'RMA #', width: 120, fontFamily: 'monospace' },
    { field: 'orderNumber', headerName: 'Order', width: 120, fontFamily: 'monospace' },
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'product', headerName: 'Product', width: 200 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
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
      field: 'value',
      headerName: 'Value',
      width: 100,
      type: 'number',
      valueFormatter: (value: number) => `$${value}`,
    },
    { field: 'dateCreated', headerName: 'Date', width: 100 },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* RMA Trend - use line chart for trend */}
        <InteractiveChart
          title="RMA Activity Trend"
          description="Created vs resolved RMAs over time"
          data={rmaTrend}
          chartType="line"
          dataKeys={["created", "resolved", "openBalance"]}
          xAxisKey="month"
          height={300}
          showControls={true}
          filters={[
            {
              label: 'View',
              key: 'view',
              options: [
                { label: 'All Metrics', value: 'all' },
                { label: 'Created Only', value: 'created' },
                { label: 'Resolved Only', value: 'resolved' },
              ]
            }
          ]}
          trend={-8.1}
        />

        {/* RMA by Reason */}
        <InteractiveChart
          title="Returns by Reason"
          description="Breakdown of RMA causes"
          data={rmaByReason}
          chartType="pie"
          valueKey="count"
          labelKey="reason"
          height={300}
          showControls={false}
          colors={rmaByReason.map(r => r.fill)}
        />
      </div>

      {/* RMA Reason Detail */}
      <InteractiveChart
        title="RMA Reason Analysis"
        description="Detailed breakdown with average values"
        data={rmaByReason}
        chartType="bar"
        dataKeys={["count"]}
        xAxisKey="reason"
        height={280}
        showControls={true}
        filters={[
          {
            label: 'Sort By',
            key: 'sortBy',
            options: [
              { label: 'Count', value: 'count' },
              { label: 'Avg Value', value: 'avgValue' },
            ]
          }
        ]}
      />

      {/* RMA DataGrid */}
      <InteractiveDataGrid
        title="RMA Log"
        description="All return merchandise authorizations with advanced filtering"
        data={rmas}
        columns={rmaColumns}
        height={500}
        pageSize={15}
        density="comfortable"
      />
    </div>
  )
}
