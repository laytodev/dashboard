"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableModal } from "./data-table-modal"
import type { ReactNode } from "react"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData?: { columns: string[]; data: Record<string, any>[]; filename?: string }
}

export function ChartCard({ title, description, children, action, tableData }: ChartCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-1">
          {action}
          {tableData && (
            <DataTableModal
              title={title}
              description={description}
              columns={tableData.columns}
              data={tableData.data}
              filename={tableData.filename}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}
