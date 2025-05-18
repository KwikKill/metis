"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { getMonthlyApplicationData } from "@/lib/local-storage"

export function Overview() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Load data from localStorage
    const monthlyData = getMonthlyApplicationData()
    setData(monthlyData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          formatter={(value, name) => {
            const formattedName = name === "applied" ? "Applied" : name === "interviews" ? "Interviews" : "Offers"
            return [value, formattedName]
          }}
        />
        <Legend />
        <Bar name="Applied" dataKey="applied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar name="Interviews" dataKey="interviews" fill="#eab308" radius={[4, 4, 0, 0]} />
        <Bar name="Offers" dataKey="offers" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
