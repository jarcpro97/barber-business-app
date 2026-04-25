'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  total: { label: 'Ingresos', color: 'hsl(var(--primary))' },
}

export function RevenueChart({ data }: { data: { day: string; total: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `$${v.toLocaleString('es-CO')}`}
          width={70}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                }).format(Number(value))
              }
            />
          }
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
