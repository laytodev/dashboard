"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { KPI } from "@/lib/dashboard-data"

export function KPICard({ kpi, index }: { kpi: KPI; index: number }) {
  const isPositive = (kpi.trend === "up" && kpi.positive) || (kpi.trend === "down" && kpi.positive)

  return (
    <Card
      className="transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <CardContent className="p-5 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {kpi.trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : kpi.trend === "down" ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {Math.abs(kpi.change)}%
          </div>
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight animate-number">{kpi.value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{kpi.changeLabel}</p>
      </CardContent>
    </Card>
  )
}
