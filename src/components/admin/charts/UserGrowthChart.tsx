'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface UserGrowthChartProps {
  data: Array<{
    date: string
    newUsers: number
    totalUsers: number
  }>
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            labelFormatter={(label) => `日期: ${formatDate(label)}`}
            formatter={(value: number, name: string) => {
              const label = name === 'newUsers' ? '新增用户' : '总用户数'
              return [value, label]
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="新增用户"
          />
          <Line 
            type="monotone" 
            dataKey="totalUsers" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="总用户数"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}