"use client"

import { useMemo } from "react"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { KPICard } from "@/components/dashboard/kpi-card"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { InteractiveDataGrid } from "@/components/dashboard/interactive-data-grid"
import {
  getWarehouseThroughput,
  getPickerPerformance,
  getZoneUtilization,
  type DateRange,
} from "@/lib/dashboard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GridColDef } from "@mui/x-data-grid"
import type { KPI } from "@/lib/dashboard-data"

function getWarehouseKPIs(range: DateRange): KPI[] {
  const m = range === "7d" ? 0.7 : range === "30d" ? 1 : range === "90d" ? 1.2 : 1.5
  return [
    { label: "Units Picked", value: Math.round(18420 * m).toLocaleString(), change: 8.3, changeLabel: "vs prev period", trend: "up", positive: true },
    { label: "Pick Rate/Hr", value: "142", change: 5.1, changeLabel: "vs prev period", trend: "up", positive: true },
    { label: "Dock-to-Stock", value: "2.8 hrs", change: -12, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "Utilization", value: "84.2%", change: 2.1, changeLabel: "vs prev period", trend: "up", positive: true },
  ]
}

export default function WarehousePage() {
  const { dateRange } = useDashboard()

  const kpis = useMemo(() => getWarehouseKPIs(dateRange), [dateRange])
  const throughput = useMemo(() => getWarehouseThroughput(dateRange), [dateRange])
  const pickers = useMemo(() => getPickerPerformance(), [])
  const zones = useMemo(() => getZoneUtilization(), [])

  const pickerColumns: GridColDef[] = [
    { field: 'name', headerName: 'Team Member', width: 180 },
    { field: 'ordersPicked', headerName: 'Orders Picked', width: 150, type: 'number' },
    { field: 'accuracy', headerName: 'Accuracy (%)', width: 130, type: 'number' },
    { field: 'avgTime', headerName: 'Avg Time (min)', width: 140, type: 'number' },
    {
      field: 'shift',
      headerName: 'Shift',
      width: 100,
      renderCell: (params) => (
        <Badge variant="secondary" className="text-[10px]">
          {params.value}
        </Badge>
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

      {/* Throughput Chart */}
      <InteractiveChart
        title="Hourly Warehouse Throughput"
        description="Inbound, outbound, and picking activity by hour"
        data={throughput}
        chartType="bar"
        dataKeys={["inbound", "outbound", "picks"]}
        xAxisKey="hour"
        height={340}
        showControls={true}
        filters={[
          {
            label: 'Shift',
            key: 'shift',
            options: [
              { label: 'All Shifts', value: 'all' },
              { label: 'Morning (6am-2pm)', value: 'morning' },
              { label: 'Afternoon (2pm-10pm)', value: 'afternoon' },
              { label: 'Night (10pm-6am)', value: 'night' },
            ]
          }
        ]}
        trend={6.2}
      />

      {/* Team Performance & Rankings */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Performance Chart */}
        <InteractiveChart
          title="Team Performance Comparison"
          description="Orders picked by team member"
          data={pickers}
          chartType="bar"
          dataKeys={["ordersPicked"]}
          xAxisKey="name"
          height={320}
          showControls={true}
          filters={[
            {
              label: 'Shift',
              key: 'shift',
              options: [
                { label: 'All Shifts', value: 'all' },
                { label: 'Day Shift', value: 'Day' },
                { label: 'Night Shift', value: 'Night' },
              ]
            }
          ]}
        />

        {/* Team Rankings Card */}
        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Team Rankings</CardTitle>
            <p className="text-xs text-muted-foreground">Sorted by orders picked</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pickers.map((picker, i) => (
                <div key={picker.name} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{picker.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[10px]">
                            {picker.shift}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {picker.accuracy}% accuracy
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{picker.ordersPicked}</p>
                      <p className="text-[10px] text-muted-foreground">{picker.avgTime} min avg</p>
                    </div>
                  </div>
                  <Progress value={(picker.ordersPicked / 342) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Utilization & Team Data Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <InteractiveChart
          title="Zone Capacity Utilization"
          description="Current vs maximum capacity by zone"
          data={zones}
          chartType="bar"
          dataKeys={["used", "capacity"]}
          xAxisKey="zone"
          height={320}
          showControls={false}
        />

        <InteractiveChart
          title="Zone Usage Percentage"
          description="Utilization rate across warehouse zones"
          data={zones}
          chartType="bar"
          dataKeys={["percentage"]}
          xAxisKey="zone"
          height={320}
          showControls={false}
          colors={zones.map(z => 
            z.percentage > 85 ? 'hsl(0, 65%, 55%)' : 
            z.percentage > 70 ? 'hsl(35, 90%, 55%)' : 
            'hsl(168, 55%, 45%)'
          )}
        />
      </div>

      {/* Team Performance DataGrid */}
      <InteractiveDataGrid
        title="Complete Team Performance Data"
        description="Detailed picker metrics with sorting and filtering"
        data={pickers}
        columns={pickerColumns}
        height={400}
        pageSize={10}
        density="comfortable"
      />
    </div>
  )
}
