'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SalesChartProps {
  data: Array<{
    date: string
    amount: number
    orders: number
  }>
}

export default function SalesChart({ data }: SalesChartProps) {
  // 格式化数据用于图表显示
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric' 
    })
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
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
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="amount"
            orientation="left"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <YAxis 
            yAxisId="orders"
            orientation="right"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'amount') {
                return [formatCurrency(value as number), '销售额']
              }
              return [value, '订单数']
            }}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Legend />
          <Line 
            yAxisId="amount"
            type="monotone" 
            dataKey="amount" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="销售额"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            yAxisId="orders"
            type="monotone" 
            dataKey="orders" 
            stroke="#10B981" 
            strokeWidth={2}
            name="订单数"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}