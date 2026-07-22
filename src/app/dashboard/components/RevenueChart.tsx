"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, Target } from "lucide-react";

const monthlyRevenueData = [
  { month: "Ene", ingresos: 32400, meta: 30000, miembros: 145 },
  { month: "Feb", ingresos: 36800, meta: 34000, miembros: 158 },
  { month: "Mar", ingresos: 41200, meta: 38000, miembros: 172 },
  { month: "Abr", ingresos: 39500, meta: 40000, miembros: 168 },
  { month: "May", ingresos: 46300, meta: 42000, miembros: 189 },
  { month: "Jun", ingresos: 52100, meta: 48000, miembros: 210 },
  { month: "Jul", ingresos: 58400, meta: 55000, miembros: 235 },
];

const CustomRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const ingresos = payload[0]?.value || 0;
    const meta = payload[1]?.value || 0;
    const data = payload[0]?.payload || {};
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    });

    const diff = ingresos - meta;
    const diffText = diff >= 0 ? `+${formatter.format(diff)} sobre meta` : `${formatter.format(diff)} de la meta`;

    return (
      <div className="bg-zinc-900/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl text-white min-w-[200px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <span className="font-black text-sm uppercase tracking-wider text-primary">{label} 2026</span>
          <span className="text-[10px] text-zinc-400 font-bold bg-white/5 px-2 py-0.5 rounded-md">
            {data.miembros} miembros
          </span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Ingresos Reales:
            </span>
            <span className="font-black text-green-400 text-sm">{formatter.format(ingresos)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
              Meta Mensual:
            </span>
            <span className="font-bold text-yellow-500">{formatter.format(meta)}</span>
          </div>
          <div className="pt-1 border-t border-white/5 flex justify-end">
            <span className={`text-[11px] font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {diffText}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.6)] group hover:border-green-500/30 transition-all duration-300">
      {/* Background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-green-500/10 transition-colors duration-500"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
              <TrendingUp className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Evolución de Ingresos Mensuales
            </h2>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Comparativa de recaudo real vs. meta proyectada (Último semestre)
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2% vs Junio</span>
          </div>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyRevenueData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#71717a"
              fontSize={12}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              fontWeight="medium"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomRevenueTooltip />} cursor={{ stroke: "#3f3f46", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="ingresos"
              name="Ingresos Reales"
              stroke="#22c55e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIngresos)"
              activeDot={{ r: 7, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="meta"
              name="Meta Mensual"
              stroke="#eab308"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-zinc-400 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-white font-bold">Ingresos Reales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-b-2 border-dashed border-yellow-500"></span>
            <span>Meta Mensual Punteada</span>
          </div>
        </div>
        <div className="text-zinc-500 text-[11px] font-semibold">
          * Datos simulados para demostración ejecutiva de tendencia
        </div>
      </div>
    </div>
  );
}
