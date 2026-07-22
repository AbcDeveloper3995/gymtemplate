import { prisma } from "@/lib/prisma";
import { Users, AlertTriangle, XOctagon, TrendingUp, DollarSign, CreditCard, Activity, Plus, CheckCircle, Target, HeartHandshake } from "lucide-react";
import MembershipCharts from "./components/MembershipCharts";
import RevenueChart from "./components/RevenueChart";
import Link from "next/link";

export default async function DashboardHome() {
  const today = new Date();
  const in3Days = new Date();
  in3Days.setDate(today.getDate() + 3);

  // Active Subscriptions & Earnings calculation
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: { plan: true }
  });

  let totalEarnings = 0;
  const planStats: Record<string, { count: number; earnings: number }> = {};

  activeSubscriptions.forEach(sub => {
    const price = sub.plan.price;
    const name = sub.plan.name;
    
    totalEarnings += price;
    
    if (!planStats[name]) {
      planStats[name] = { count: 0, earnings: 0 };
    }
    planStats[name].count += 1;
    planStats[name].earnings += price;
  });

  const totalMemberships = activeSubscriptions.length;

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  });

  // Active Clients
  const activeCount = await prisma.client.count({
    where: { 
      status: "ACTIVE",
      subscriptions: {
        some: {
          endDate: { gte: today }
        }
      }
    }
  });

  // Leads this month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const leadsThisMonth = await prisma.client.count({
    where: {
      createdAt: { gte: firstDayOfMonth }
    }
  });

  // Retention Rate (Active vs Total Historical)
  const totalHistoricalClients = await prisma.client.count();
  const retentionRate = totalHistoricalClients > 0 
    ? ((activeCount / totalHistoricalClients) * 100).toFixed(1) 
    : "0.0";

  // Expiring Soon (0 - 3 days)
  const expiringSoon = await prisma.subscription.findMany({
    where: {
      endDate: {
        gte: today,
        lte: in3Days,
      },
      status: "ACTIVE"
    },
    include: { client: true, plan: true },
    orderBy: { endDate: "asc" }
  });

  // Expired Subscriptions
  const expired = await prisma.subscription.findMany({
    where: {
      endDate: {
        lt: today
      },
      client: {
         status: "ACTIVE" // Only care about clients we consider active but missed payment
      }
    },
    include: { client: true, plan: true },
    orderBy: { endDate: "desc" }
  });

  // Recent Activity Feed
  const recentAttendances = await prisma.attendance.findMany({
    take: 5,
    orderBy: { checkInAt: "desc" },
    include: { client: true, class: true }
  });

  const recentSubscriptions = await prisma.subscription.findMany({
    take: 5,
    orderBy: { startDate: "desc" },
    include: { client: true, plan: true }
  });

  const recentClients = await prisma.client.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  // Combine and sort
  const activityFeed = [
    ...recentAttendances.map(a => ({
      id: `att-${a.id}`,
      type: 'ATTENDANCE' as const,
      title: `${a.client.name} hizo check-in`,
      subtitle: a.class ? `Clase: ${a.class.name}` : 'Entrenamiento libre',
      date: a.checkInAt,
      icon: CheckCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    })),
    ...recentSubscriptions.map(s => ({
      id: `sub-${s.id}`,
      type: 'SUBSCRIPTION' as const,
      title: `${s.client.name} adquirió un plan`,
      subtitle: `Plan: ${s.plan.name}`,
      date: s.startDate,
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-500/10"
    })),
    ...recentClients.map(c => ({
      id: `cli-${c.id}`,
      type: 'NEW_CLIENT' as const,
      title: `Nuevo prospecto/cliente`,
      subtitle: c.name,
      date: c.createdAt,
      icon: Plus,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);

  // Transform planStats to array for the charts
  const chartData = Object.entries(planStats).map(([name, stats]) => ({
    name,
    count: stats.count,
    earnings: stats.earnings
  }));

  // Dynamic greeting
  const currentHour = today.getHours();
  let greeting = "¡Buenas noches";
  let greetingIcon = "🌙";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "¡Buenos días";
    greetingIcon = "☀️";
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = "¡Buenas tardes";
    greetingIcon = "🌤️";
  }

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          {greeting}, Administrador! <span className="text-2xl">{greetingIcon}</span>
        </h1>
        <p className="text-zinc-400 font-medium mt-1 uppercase tracking-widest text-xs">Resumen ejecutivo del gimnasio</p>
      </div>

      {/* KPI Cards Strip (Compact 6-column layout on large screens) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <div className="bg-zinc-950/70 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 relative overflow-hidden group shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:border-green-500/60 transition-all duration-300">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Ingresos (Mes)</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-green-400">{formatter.format(totalEarnings)}</h3>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 shrink-0">
              <DollarSign className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/70 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 relative overflow-hidden group shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:border-orange-500/60 transition-all duration-300">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Memb. Activas</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white">{totalMemberships}</h3>
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 shrink-0">
              <CreditCard className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/70 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-4 relative overflow-hidden group shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:border-yellow-500/60 transition-all duration-300">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Por Vencer (3d)</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-yellow-500">{expiringSoon.length}</h3>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500 shrink-0">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/70 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 relative overflow-hidden group shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-500/60 transition-all duration-300">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Vencidas</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-red-500">{expired.length}</h3>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500 shrink-0">
              <XOctagon className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/70 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 relative overflow-hidden group shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:border-purple-500/60 transition-all duration-300">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Nuevos Leads</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-purple-400">{leadsThisMonth}</h3>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 shrink-0">
              <Target className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/70 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 relative overflow-hidden group shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-500/60 transition-all duration-300">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Retención</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-blue-400">{retentionRate}%</h3>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
              <HeartHandshake className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* MASTER DASHBOARD LAYOUT: 2-Column Analytics + 1-Column Live Control Tower */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Left & Center: Financial Charts & Analytics (2 Columns) */}
        <div className="xl:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          {/* Gráfico de Evolución de Ingresos */}
          <RevenueChart />

          {/* Gráficos de Distribución e Ingresos por Membresía */}
          <MembershipCharts data={chartData} />
        </div>

        {/* Right Sidebar Column: Live Feed & Alerts (1 Column) */}
        <div className="xl:col-span-1 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
          {/* Actividad Reciente */}
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Actividad en Vivo</h2>
              </div>
              <Link href="/dashboard/activity" className="text-xs text-primary font-bold hover:underline">Ver Todo</Link>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto divide-y divide-white/5">
              {activityFeed.length === 0 ? (
                <p className="text-zinc-500 text-xs p-2">Sin actividad reciente.</p>
              ) : (
                activityFeed.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{item.subtitle}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {item.date instanceof Date ? item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Próximos a Vencer */}
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-yellow-500/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-yellow-500/[0.02]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Por Vencer (3 Días)</h2>
              </div>
              <Link href="/dashboard/clients" className="text-xs text-primary font-bold hover:underline">Gestionar</Link>
            </div>
            <div className="p-0 max-h-60 overflow-y-auto">
              {expiringSoon.length === 0 ? (
                <p className="p-5 text-zinc-500 text-xs">No hay membresías por vencer.</p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {expiringSoon.map(sub => (
                    <li key={sub.id} className="p-3.5 px-5 flex justify-between items-center hover:bg-white/5 transition-colors">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="text-white text-xs font-bold truncate">{sub.client.name}</p>
                        <p className="text-zinc-400 text-[11px] truncate">{sub.plan.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-yellow-400 font-bold text-xs block">{sub.endDate?.toLocaleDateString() || "-"}</span>
                        <span className="text-zinc-500 text-[10px]">{sub.client.phone || "Sin tel."}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Membresías Vencidas */}
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-red-500/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-red-500/[0.02]">
              <div className="flex items-center gap-2">
                <XOctagon className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Vencidos</h2>
              </div>
              <Link href="/dashboard/clients" className="text-xs text-primary font-bold hover:underline">Renovar</Link>
            </div>
            <div className="p-0 max-h-60 overflow-y-auto">
              {expired.length === 0 ? (
                <p className="p-5 text-zinc-500 text-xs">No hay clientes vencidos.</p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {expired.slice(0, 5).map(sub => (
                    <li key={sub.id} className="p-3.5 px-5 flex justify-between items-center hover:bg-white/5 transition-colors">
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="text-white text-xs font-bold truncate">{sub.client.name}</p>
                        <p className="text-zinc-400 text-[11px] truncate">{sub.plan.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-red-400 font-bold text-xs block">{sub.endDate?.toLocaleDateString() || "-"}</span>
                        <span className="text-zinc-500 text-[10px]">{sub.client.phone || "Sin tel."}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
