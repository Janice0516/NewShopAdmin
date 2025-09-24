'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface OrderStatusChartProps {
  data: Array<{
    status: string
    count: number
    percentage: number
  }>
}

const statusColors: { [key: string]: string } = {
  'PENDING': '#F59E0B',
  'CONFIRMED': '#3B82F6',
  'SHIPPED': '#10B981',
  'DELIVERED': '#059669',
  'CANCELLED': '#EF4444',
  'REFUNDED': '#8B5CF6'
}

const statusLabels: { [key: string]: string } = {
  'PENDING': '待处理',
  'CONFIRMED': '已确认',
  'SHIPPED': '已发货',
  'DELIVERED': '已送达',
  'CANCELLED': '已取消',
  'REFUNDED': '已退款'
}

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map(item => ({
    ...item,
    label: statusLabels[item.status] || item.status,
    fill: statusColors[item.status] || '#6B7280'
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => [value, '订单数量']}
            labelFormatter={(label) => `状态: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}