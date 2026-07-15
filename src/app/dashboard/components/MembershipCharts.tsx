"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PlanStat = {
  name: string;
  count: number;
  earnings: number;
};

interface MembershipChartsProps {
  data: PlanStat[];
}

const COLORS = ["#10b981", "#3b82f6", "#eab308", "#f43f5e", "#8b5cf6", "#14b8a6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    });

    return (
      <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl text-white">
        <p className="font-bold text-sm mb-1">{data.name}</p>
        <p className="text-zinc-400 text-xs">Membresías: <span className="text-white font-semibold">{data.count}</span></p>
        <p className="text-zinc-400 text-xs">Ingresos: <span className="text-green-500 font-semibold">{formatter.format(data.earnings)}</span></p>
      </div>
    );
  }
  return null;
};

export default function MembershipCharts({ data }: MembershipChartsProps) {
  if (!data || data.length === 0) {
    return <p className="p-6 text-zinc-500 text-sm">No hay datos disponibles para los gráficos.</p>;
  }

  // Ordenar para el gráfico de barras por ganancias
  const dataByEarnings = [...data].sort((a, b) => b.earnings - a.earnings);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Gráfico de Anillo: Distribución de Membresías */}
      <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden p-6 flex flex-col">
        <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Distribución por Membresía</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="count"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {entry.name} ({entry.count})
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Barras: Ingresos por Membresía */}
      <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden p-6 flex flex-col">
        <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-4">Ingresos por Tipo</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByEarnings}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#52525b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#27272a', opacity: 0.4}} />
              <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                {dataByEarnings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
