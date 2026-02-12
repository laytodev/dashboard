// Warehouse Operations Dashboard - Mock Data Layer

export type DateRange = "7d" | "30d" | "90d" | "12m"

// KPI Summary
export interface KPI {
  label: string
  value: string
  change: number
  changeLabel: string
  trend: "up" | "down" | "flat"
  positive: boolean // whether up is good
}

export function getOverviewKPIs(range: DateRange): KPI[] {
  const multiplier = range === "7d" ? 0.7 : range === "30d" ? 1 : range === "90d" ? 1.2 : 1.5
  return [
    { label: "Orders Processed", value: Math.round(2847 * multiplier).toLocaleString(), change: 12.5, changeLabel: "vs prev period", trend: "up", positive: true },
    { label: "On-Time Shipment", value: "96.3%", change: 1.8, changeLabel: "vs prev period", trend: "up", positive: true },
    { label: "Order Accuracy", value: "99.2%", change: 0.3, changeLabel: "vs prev period", trend: "up", positive: true },
    { label: "Avg Fulfillment Time", value: "1.4 hrs", change: -8.2, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "Customer Calls", value: Math.round(1263 * multiplier).toLocaleString(), change: -5.1, changeLabel: "vs prev period", trend: "down", positive: true },
    { label: "RMA Rate", value: "2.1%", change: -0.4, changeLabel: "vs prev period", trend: "down", positive: true },
  ]
}

// Orders Over Time
export interface TimeSeriesPoint {
  date: string
  orders: number
  shipped: number
  returned: number
}

export function getOrdersTimeSeries(range: DateRange): TimeSeriesPoint[] {
  const points = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 12 : 12
  const data: TimeSeriesPoint[] = []
  const now = new Date()

  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now)
    if (range === "7d") d.setDate(d.getDate() - i)
    else if (range === "30d") d.setDate(d.getDate() - i)
    else if (range === "90d") d.setDate(d.getDate() - i * 7)
    else d.setMonth(d.getMonth() - i)

    const base = range === "7d" ? 380 : range === "30d" ? 95 : range === "90d" ? 680 : 2800
    const variance = Math.random() * base * 0.3
    const orders = Math.round(base + variance)
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: range !== "12m" ? "numeric" : undefined }),
      orders,
      shipped: Math.round(orders * (0.92 + Math.random() * 0.06)),
      returned: Math.round(orders * (0.01 + Math.random() * 0.03)),
    })
  }
  return data
}

// Warehouse Throughput
export interface ThroughputData {
  hour: string
  inbound: number
  outbound: number
  picks: number
}

export function getWarehouseThroughput(range: DateRange): ThroughputData[] {
  const hours = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"]
  return hours.map(hour => {
    const hourNum = parseInt(hour)
    const peak = hourNum >= 9 && hourNum <= 2 ? 1.4 : hourNum >= 8 ? 1.1 : 0.7
    return {
      hour,
      inbound: Math.round(45 * peak + Math.random() * 20),
      outbound: Math.round(62 * peak + Math.random() * 25),
      picks: Math.round(180 * peak + Math.random() * 50),
    }
  })
}

// Inventory by Category
export interface InventoryCategory {
  category: string
  units: number
  value: number
  turnover: number
  fill: string
}

export function getInventoryByCategory(): InventoryCategory[] {
  return [
    { category: "Electronics", units: 14520, value: 2847000, turnover: 8.2, fill: "hsl(var(--chart-1))" },
    { category: "Industrial", units: 8930, value: 1563000, turnover: 5.4, fill: "hsl(var(--chart-2))" },
    { category: "Automotive", units: 6740, value: 982000, turnover: 6.8, fill: "hsl(var(--chart-3))" },
    { category: "Hardware", units: 12100, value: 743000, turnover: 11.3, fill: "hsl(var(--chart-4))" },
    { category: "Safety/PPE", units: 9800, value: 412000, turnover: 14.6, fill: "hsl(var(--chart-5))" },
  ]
}

// Customer Service Metrics
export interface CSMetric {
  metric: string
  value: string
  target: string
  progress: number
  status: "on-track" | "at-risk" | "behind"
}

export function getCSMetrics(): CSMetric[] {
  return [
    { metric: "Avg Hold Time", value: "1m 24s", target: "< 2m", progress: 85, status: "on-track" },
    { metric: "First Call Resolution", value: "78.4%", target: "> 80%", progress: 98, status: "at-risk" },
    { metric: "Calls Abandoned", value: "3.2%", target: "< 5%", progress: 70, status: "on-track" },
    { metric: "Customer Satisfaction", value: "4.3/5", target: "> 4.0", progress: 86, status: "on-track" },
    { metric: "Avg Handle Time", value: "4m 12s", target: "< 5m", progress: 78, status: "on-track" },
    { metric: "Escalation Rate", value: "6.8%", target: "< 5%", progress: 120, status: "behind" },
  ]
}

// Call Volume by Reason
export interface CallReason {
  reason: string
  count: number
  percentage: number
  fill: string
}

export function getCallReasons(): CallReason[] {
  return [
    { reason: "Order Status", count: 412, percentage: 32.6, fill: "hsl(var(--chart-1))" },
    { reason: "Place Order", count: 298, percentage: 23.6, fill: "hsl(var(--chart-2))" },
    { reason: "RMA Request", count: 187, percentage: 14.8, fill: "hsl(var(--chart-3))" },
    { reason: "Billing Inquiry", count: 142, percentage: 11.2, fill: "hsl(var(--chart-4))" },
    { reason: "Product Info", count: 124, percentage: 9.8, fill: "hsl(var(--chart-5))" },
    { reason: "Other", count: 100, percentage: 7.9, fill: "hsl(var(--muted-foreground))" },
  ]
}

// Call Volume Over Time
export interface CallVolumePoint {
  hour: string
  inbound: number
  handled: number
  abandoned: number
}

export function getCallVolume(): CallVolumePoint[] {
  const hours = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]
  return hours.map(hour => {
    const inbound = Math.round(80 + Math.random() * 60)
    const abandoned = Math.round(inbound * (0.02 + Math.random() * 0.04))
    return {
      hour,
      inbound,
      handled: inbound - abandoned,
      abandoned,
    }
  })
}

// RMA Data
export interface RMAEntry {
  id: string
  orderNumber: string
  customer: string
  product: string
  reason: string
  status: "pending" | "approved" | "received" | "inspecting" | "resolved" | "denied"
  dateCreated: string
  value: number
}

export function getRMAData(): RMAEntry[] {
  const statuses: RMAEntry["status"][] = ["pending", "approved", "received", "inspecting", "resolved", "denied"]
  const reasons = ["Defective", "Wrong Item", "Damaged in Shipping", "Not as Described", "Customer Changed Mind", "Missing Parts"]
  const products = ["Circuit Board A200", "Hydraulic Pump X50", "Safety Helmet Pro", "Steel Bracket Kit", "LED Panel 4x8", "Bearing Assembly", "Cable Harness C12", "Valve Controller"]
  const customers = ["Acme Manufacturing", "TechVault Inc.", "Precision Parts Co.", "Global Supplies Ltd.", "Metro Industrial", "Summit Equipment", "Coastal Fabricators", "Delta Solutions"]

  return Array.from({ length: 24 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - Math.floor(Math.random() * 30))
    return {
      id: `RMA-${(2024000 + i).toString()}`,
      orderNumber: `ORD-${(100000 + Math.floor(Math.random() * 9000)).toString()}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      product: products[Math.floor(Math.random() * products.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dateCreated: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      value: Math.round(50 + Math.random() * 950),
    }
  })
}

// RMA by Reason
export interface RMAReason {
  reason: string
  count: number
  percentage: number
  avgValue: number
  fill: string
}

export function getRMAByReason(): RMAReason[] {
  return [
    { reason: "Defective", count: 42, percentage: 35, avgValue: 285, fill: "hsl(var(--chart-5))" },
    { reason: "Wrong Item", count: 28, percentage: 23, avgValue: 192, fill: "hsl(var(--chart-3))" },
    { reason: "Damaged in Shipping", count: 22, percentage: 18, avgValue: 340, fill: "hsl(var(--chart-1))" },
    { reason: "Not as Described", count: 15, percentage: 13, avgValue: 156, fill: "hsl(var(--chart-4))" },
    { reason: "Other", count: 13, percentage: 11, avgValue: 98, fill: "hsl(var(--chart-2))" },
  ]
}

// RMA Trend
export interface RMATrend {
  month: string
  created: number
  resolved: number
  openBalance: number
}

export function getRMATrend(): RMATrend[] {
  let balance = 18
  return ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map(month => {
    const created = Math.round(15 + Math.random() * 12)
    const resolved = Math.round(12 + Math.random() * 14)
    balance = balance + created - resolved
    return { month, created, resolved, openBalance: Math.max(balance, 3) }
  })
}

// Inventory Analytics
export interface InventoryLevel {
  product: string
  sku: string
  onHand: number
  committed: number
  available: number
  reorderPoint: number
  status: "healthy" | "low" | "critical" | "overstock"
  daysOfSupply: number
}

export function getInventoryLevels(): InventoryLevel[] {
  return [
    { product: "Circuit Board A200", sku: "CB-A200", onHand: 1240, committed: 320, available: 920, reorderPoint: 500, status: "healthy", daysOfSupply: 42 },
    { product: "Hydraulic Pump X50", sku: "HP-X50", onHand: 85, committed: 62, available: 23, reorderPoint: 100, status: "critical", daysOfSupply: 4 },
    { product: "Safety Helmet Pro", sku: "SH-PRO", onHand: 3400, committed: 180, available: 3220, reorderPoint: 800, status: "overstock", daysOfSupply: 120 },
    { product: "Steel Bracket Kit", sku: "SB-KIT", onHand: 560, committed: 410, available: 150, reorderPoint: 200, status: "low", daysOfSupply: 12 },
    { product: "LED Panel 4x8", sku: "LP-4X8", onHand: 780, committed: 290, available: 490, reorderPoint: 350, status: "healthy", daysOfSupply: 28 },
    { product: "Bearing Assembly", sku: "BA-001", onHand: 2100, committed: 450, available: 1650, reorderPoint: 600, status: "healthy", daysOfSupply: 55 },
    { product: "Cable Harness C12", sku: "CH-C12", onHand: 120, committed: 95, available: 25, reorderPoint: 150, status: "critical", daysOfSupply: 3 },
    { product: "Valve Controller", sku: "VC-100", onHand: 450, committed: 180, available: 270, reorderPoint: 200, status: "healthy", daysOfSupply: 30 },
    { product: "Motor Drive Unit", sku: "MDU-50", onHand: 210, committed: 185, available: 25, reorderPoint: 120, status: "low", daysOfSupply: 5 },
    { product: "Sensor Package S3", sku: "SP-S3", onHand: 890, committed: 220, available: 670, reorderPoint: 300, status: "healthy", daysOfSupply: 45 },
  ]
}

// Space Utilization
export interface ZoneUtilization {
  zone: string
  capacity: number
  used: number
  percentage: number
}

export function getZoneUtilization(): ZoneUtilization[] {
  return [
    { zone: "Zone A - Receiving", capacity: 5000, used: 3800, percentage: 76 },
    { zone: "Zone B - Pick & Pack", capacity: 8000, used: 6920, percentage: 86.5 },
    { zone: "Zone C - Bulk Storage", capacity: 12000, used: 10440, percentage: 87 },
    { zone: "Zone D - Cold Storage", capacity: 3000, used: 2610, percentage: 87 },
    { zone: "Zone E - Staging", capacity: 4000, used: 2480, percentage: 62 },
    { zone: "Zone F - Returns", capacity: 2000, used: 1540, percentage: 77 },
  ]
}

// Picking Performance
export interface PickerPerformance {
  name: string
  ordersPicked: number
  accuracy: number
  avgTime: number
  shift: "morning" | "afternoon" | "night"
}

export function getPickerPerformance(): PickerPerformance[] {
  return [
    { name: "Team Alpha", ordersPicked: 342, accuracy: 99.7, avgTime: 3.2, shift: "morning" },
    { name: "Team Bravo", ordersPicked: 318, accuracy: 99.4, avgTime: 3.5, shift: "morning" },
    { name: "Team Charlie", ordersPicked: 295, accuracy: 98.9, avgTime: 3.8, shift: "afternoon" },
    { name: "Team Delta", ordersPicked: 267, accuracy: 99.1, avgTime: 4.1, shift: "afternoon" },
    { name: "Team Echo", ordersPicked: 184, accuracy: 99.5, avgTime: 3.4, shift: "night" },
  ]
}

// Recent Orders
export interface RecentOrder {
  id: string
  customer: string
  items: number
  total: number
  status: "processing" | "picking" | "packing" | "shipped" | "delivered"
  date: string
  priority: "standard" | "expedited" | "rush"
}

export function getRecentOrders(): RecentOrder[] {
  const customers = ["Acme Manufacturing", "TechVault Inc.", "Precision Parts Co.", "Global Supplies Ltd.", "Metro Industrial", "Summit Equipment", "Coastal Fabricators", "Delta Solutions", "Pioneer Dynamics", "Atlas Corp."]
  const statuses: RecentOrder["status"][] = ["processing", "picking", "packing", "shipped", "delivered"]
  const priorities: RecentOrder["priority"][] = ["standard", "standard", "standard", "expedited", "rush"]

  return Array.from({ length: 20 }, (_, i) => {
    const d = new Date()
    d.setHours(d.getHours() - Math.floor(Math.random() * 72))
    return {
      id: `ORD-${(108000 + i).toString()}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      items: Math.floor(1 + Math.random() * 15),
      total: Math.round(100 + Math.random() * 4900),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
    }
  })
}

// Shipment Carriers
export interface CarrierData {
  carrier: string
  shipments: number
  onTime: number
  avgTransit: number
  cost: number
}

export function getCarrierData(): CarrierData[] {
  return [
    { carrier: "FedEx", shipments: 842, onTime: 97.2, avgTransit: 2.1, cost: 12840 },
    { carrier: "UPS", shipments: 634, onTime: 95.8, avgTransit: 2.4, cost: 9680 },
    { carrier: "USPS", shipments: 428, onTime: 91.3, avgTransit: 3.2, cost: 4280 },
    { carrier: "DHL", shipments: 186, onTime: 96.5, avgTransit: 1.8, cost: 5580 },
    { carrier: "LTL Freight", shipments: 94, onTime: 88.4, avgTransit: 4.6, cost: 8460 },
  ]
}

// Agent Performance
export interface AgentPerformance {
  name: string
  callsHandled: number
  avgHandleTime: string
  satisfaction: number
  resolution: number
  csat?: number
  fcr?: number
  status?: string
}

export function getAgentPerformance(): AgentPerformance[] {
  return [
    { name: "Sarah Chen", callsHandled: 142, avgHandleTime: "3m 48s", satisfaction: 4.6, resolution: 84, csat: 4.6, fcr: 84, status: "Available" },
    { name: "Mike Torres", callsHandled: 128, avgHandleTime: "4m 12s", satisfaction: 4.4, resolution: 79, csat: 4.4, fcr: 79, status: "On Call" },
    { name: "Jessica Park", callsHandled: 135, avgHandleTime: "3m 55s", satisfaction: 4.7, resolution: 86, csat: 4.7, fcr: 86, status: "Available" },
    { name: "David Kim", callsHandled: 118, avgHandleTime: "4m 30s", satisfaction: 4.2, resolution: 75, csat: 4.2, fcr: 75, status: "Break" },
    { name: "Rachel Adams", callsHandled: 145, avgHandleTime: "3m 32s", satisfaction: 4.5, resolution: 82, csat: 4.5, fcr: 82, status: "Available" },
    { name: "James Wilson", callsHandled: 110, avgHandleTime: "4m 45s", satisfaction: 4.1, resolution: 71, csat: 4.1, fcr: 71, status: "On Call" },
  ]
}

// SLA Metrics
export interface SLAMetric {
  metric: string
  actual: string
  target: string
  status: "met" | "at-risk" | "missed"
}

export function getSLAMetrics(): SLAMetric[] {
  return [
    { metric: "Answer Speed", actual: "94%", target: "> 80%", status: "met" },
    { metric: "Avg Hold Time", actual: "1m 24s", target: "< 2m", status: "met" },
    { metric: "First Call Resolution", actual: "87.3%", target: "> 85%", status: "met" },
    { metric: "Calls Abandoned", actual: "2.1%", target: "< 5%", status: "met" },
    { metric: "Escalation Rate", actual: "8.2%", target: "< 5%", status: "at-risk" },
  ]
}

// Call Volume by Hour
export interface CallVolumeByHour {
  hour: string
  calls: number
  handled: number
  abandoned: number
  dayType?: string
}

export function getCallVolumeByHour(range: DateRange): CallVolumeByHour[] {
  const hours = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]
  return hours.map(hour => {
    const calls = Math.round(80 + Math.random() * 60)
    const abandoned = Math.round(calls * (0.02 + Math.random() * 0.03))
    return {
      hour,
      calls,
      handled: calls - abandoned,
      abandoned,
      dayType: "weekday",
    }
  })
}
