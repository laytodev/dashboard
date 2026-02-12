"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { DashboardShell } from "./dashboard-shell"
import type { DateRange } from "@/lib/dashboard-data"

interface DashboardContextType {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

const DashboardContext = createContext<DashboardContextType>({
  dateRange: "30d",
  setDateRange: () => {},
})

export function useDashboard() {
  return useContext(DashboardContext)
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>("30d")

  return (
    <DashboardContext.Provider value={{ dateRange, setDateRange }}>
      <DashboardShell dateRange={dateRange} onDateRangeChange={setDateRange}>
        {children}
      </DashboardShell>
    </DashboardContext.Provider>
  )
}
