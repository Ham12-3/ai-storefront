'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function RevenueChart({
  data,
}: {
  data: Array<{ day: string; revenue: number; previous: number }>
}) {
  return (
    <div
      className="chart-wrap"
      role="img"
      aria-label="Revenue increased over the selected period compared with the previous period"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 15, right: 8, left: -12, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d95735" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#d95735" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#d9dcd7"
            strokeDasharray="2 6"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6e7d86', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `£${Number(value) / 1000}k`}
            tick={{ fill: '#6e7d86', fontSize: 11 }}
          />
          <Tooltip
            formatter={(value) => `£${Number(value).toLocaleString('en-GB')}`}
          />
          <Area
            type="monotone"
            dataKey="previous"
            stroke="#a7b1b7"
            fill="transparent"
            strokeDasharray="4 4"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#d95735"
            strokeWidth={3}
            fill="url(#revenue-fill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
