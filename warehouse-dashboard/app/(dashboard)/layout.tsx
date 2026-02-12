"use client"

import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>
}
