"use client"

import { useMemo } from "react"
import { useDashboard } from "@/components/dashboard/dashboard-provider"
import { KPICard } from "@/components/dashboard/kpi-card"
import { InteractiveChart } from "@/components/dashboard/interactive-chart"
import { InteractiveDataGrid } from "@/components/dashboard/interactive-data-grid"
import {
  getCallVolumeByHour,
  getCallReasons,
  getSLAMetrics,
  getAgentPerformance,
  type DateRange,
} from "@/lib/dashboard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GridColDef } from "@mui/x-data-grid"
import { cn } from "@/lib/utils"
import type { KPI } from "@/lib/dashboard-data"

function getCustomerServiceKPIs(range: DateRange): KPI[] {
  const m = range === "7d" ? 0.7 : range === "30d" ? 1 : range === "90d" ? 1.2 : 1.5
  return [
    { label: "Total Calls", value: Math.round(2847 * m).toLocaleString(), change: 4.2, changeLabel: "vs prev period", trend: "up", positive: false },
    { label: "Avg Wait Time", value: "2.4 min", change: -8.5, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "CSAT Score", value: "4.6/5", change: 3.1, changeLabel: "vs prev period", trend: "up", positive: true },
    { label: "First Call Resolution", value: "87.3%", change: 2.8, changeLabel: "vs prev period", trend: "up", positive: true },
  ]
}

export default function CustomerServicePage() {
  const { dateRange } = useDashboard()

  const kpis = useMemo(() => getCustomerServiceKPIs(dateRange), [dateRange])
  const callVolume = useMemo(() => getCallVolumeByHour(dateRange), [dateRange])
  const callReasons = useMemo(() => getCallReasons(), [])
  const slaMetrics = useMemo(() => getSLAMetrics(), [])
  const agents = useMemo(() => getAgentPerformance(), [])

  const agentColumns: GridColDef[] = [
    { field: 'name', headerName: 'Agent', width: 180 },
    { field: 'callsHandled', headerName: 'Calls Handled', width: 140, type: 'number' },
    { field: 'avgHandleTime', headerName: 'Avg Handle (min)', width: 150, type: 'number' },
    { field: 'csat', headerName: 'CSAT', width: 100, type: 'number' },
    { field: 'fcr', headerName: 'FCR (%)', width: 100, type: 'number' },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Badge
          variant={params.value === 'Available' ? 'default' : 'secondary'}
          className="text-[10px]"
        >
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

      {/* Call Volume & Reasons */}
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <InteractiveChart
            title="Call Volume by Hour"
            description="Inbound call patterns throughout the day"
            data={callVolume}
            chartType="area"
            dataKeys={["calls"]}
            xAxisKey="hour"
            height={320}
            showControls={true}
            filters={[
              {
                label: 'Day Type',
                key: 'dayType',
                options: [
                  { label: 'All Days', value: 'all' },
                  { label: 'Weekdays', value: 'weekday' },
                  { label: 'Weekends', value: 'weekend' },
                ]
              }
            ]}
            trend={4.2}
          />
        </div>

        <div className="lg:col-span-3">
          <InteractiveChart
            title="Call Reasons Distribution"
            description="Top reasons customers contact support"
            data={callReasons}
            chartType="pie"
            valueKey="count"
            labelKey="reason"
            height={320}
            showControls={false}
            colors={callReasons.map(r => r.fill)}
          />
        </div>
      </div>

      {/* SLA Metrics & Agent Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* SLA Metrics Cards */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">SLA Performance Metrics</CardTitle>
            <p className="text-xs text-muted-foreground">Service level agreement compliance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slaMetrics.map((metric, i) => (
                <div key={metric.metric} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{metric.metric}</p>
                      <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-semibold",
                        metric.status === "met" && "text-success",
                        metric.status === "at-risk" && "text-warning",
                        metric.status === "missed" && "text-destructive",
                      )}>
                        {metric.actual}
                      </p>
                      <Badge
                        variant={metric.status === "met" ? "default" : "destructive"}
                        className="text-[10px] mt-1"
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={parseFloat(metric.actual)}
                    className={cn(
                      "h-1.5",
                      metric.status === "met" && "bg-success/20",
                      metric.status === "at-risk" && "bg-warning/20",
                      metric.status === "missed" && "bg-destructive/20",
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance Chart */}
        <InteractiveChart
          title="Agent Call Volume"
          description="Calls handled by each agent"
          data={agents}
          chartType="bar"
          dataKeys={["callsHandled"]}
          xAxisKey="name"
          height={280}
          showControls={true}
          filters={[
            {
              label: 'Status',
              key: 'status',
              options: [
                { label: 'All Agents', value: 'all' },
                { label: 'Available', value: 'Available' },
                { label: 'On Call', value: 'On Call' },
                { label: 'Break', value: 'Break' },
              ]
            }
          ]}
        />
      </div>

      {/* Agent Performance Leaderboard */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Agent Leaderboard</CardTitle>
          <p className="text-xs text-muted-foreground">Top performers by CSAT and FCR</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agents
              .sort((a, b) => b.csat - a.csat)
              .slice(0, 5)
              .map((agent, i) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {agent.callsHandled} calls
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {agent.avgHandleTime} min avg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">{agent.csat} CSAT</p>
                    <p className="text-[10px] text-muted-foreground">{agent.fcr}% FCR</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Performance DataGrid */}
      <InteractiveDataGrid
        title="Complete Agent Performance Data"
        description="Detailed metrics for all customer service agents"
        data={agents}
        columns={agentColumns}
        height={450}
        pageSize={10}
        density="comfortable"
      />
    </div>
  )
}
