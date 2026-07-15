import { prisma } from "@/lib/prisma";
import { Users, AlertTriangle, XOctagon, TrendingUp, DollarSign, CreditCard, Activity, Plus, CheckCircle, Target, HeartHandshake } from "lucide-react";
import MembershipCharts from "./components/MembershipCharts";
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
        <p className="text-zinc-400 font-medium mt-1 uppercase tracking-widest text-xs">Resumen general del gimnasio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:border-green-500/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Ingresos del Mes</p>
              <h3 className="text-4xl font-black text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">{formatter.format(totalEarnings)}</h3>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              <DollarSign className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:border-orange-500/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Membresías Activas</p>
              <h3 className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{totalMemberships}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]">
              <CreditCard className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:border-yellow-500/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Por Vencer (3 días)</p>
              <h3 className="text-4xl font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">{expiringSoon.length}</h3>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/60 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:border-red-500/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Membresías Vencidas</p>
              <h3 className="text-4xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{expired.length}</h3>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              <XOctagon className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Nuevos Leads */}
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-500/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Nuevos Leads (Mes)</p>
              <h3 className="text-4xl font-black text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{leadsThisMonth}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Retención */}
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:border-blue-500/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Tasa de Retención</p>
              <h3 className="text-4xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{retentionRate}%</h3>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <HeartHandshake className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}>
        {/* Próximos a vencer */}
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Próximos a Vencer</h2>
            <Link href="/dashboard/clients" className="text-xs text-primary font-bold hover:underline">Ver Todos</Link>
          </div>
          <div className="p-0">
            {expiringSoon.length === 0 ? (
              <p className="p-6 text-zinc-500 text-sm">No hay membresías por vencer.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {expiringSoon.map(sub => (
                  <li key={sub.id} className="p-4 px-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-white font-bold">{sub.client.name}</p>
                      <p className="text-zinc-500 text-sm">{sub.plan.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold">{sub.endDate.toLocaleDateString()}</p>
                      <p className="text-zinc-500 text-xs">{sub.client.phone || "Sin teléfono"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Vencidos Recientemente */}
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Membresías Vencidas</h2>
            <Link href="/dashboard/clients" className="text-xs text-primary font-bold hover:underline">Ir a Clientes</Link>
          </div>
          <div className="p-0">
            {expired.length === 0 ? (
              <p className="p-6 text-zinc-500 text-sm">No hay clientes vencidos.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {expired.slice(0,5).map(sub => (
                  <li key={sub.id} className="p-4 px-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-white font-bold">{sub.client.name}</p>
                      <p className="text-zinc-500 text-sm">{sub.plan.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-500 font-bold">{sub.endDate.toLocaleDateString()}</p>
                      <p className="text-zinc-500 text-xs">{sub.client.phone || "Sin teléfono"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Gráficos de Membresías */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
        <MembershipCharts data={chartData} />
      </div>


    </div>
  );
}
