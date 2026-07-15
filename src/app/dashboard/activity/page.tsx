import { prisma } from "@/lib/prisma";
import { Activity, CheckCircle, CreditCard, Plus } from "lucide-react";

export default async function ActivityPage() {
  const recentAttendances = await prisma.attendance.findMany({
    take: 30,
    orderBy: { checkInAt: "desc" },
    include: { client: true, class: true }
  });

  const recentSubscriptions = await prisma.subscription.findMany({
    take: 30,
    orderBy: { startDate: "desc" },
    include: { client: true, plan: true }
  });

  const recentClients = await prisma.client.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
  });

  // Combine and sort (Descending for timeline: newest at top)
  const activityFeed = [
    ...recentAttendances.map(a => ({
      id: `att-${a.id}`,
      type: 'ATTENDANCE' as const,
      title: `${a.client.name} hizo check-in`,
      subtitle: a.class ? `Clase: ${a.class.name}` : 'Entrenamiento libre',
      date: a.checkInAt,
      icon: CheckCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/50",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]"
    })),
    ...recentSubscriptions.map(s => ({
      id: `sub-${s.id}`,
      type: 'SUBSCRIPTION' as const,
      title: `${s.client.name} adquirió un plan`,
      subtitle: `Plan: ${s.plan.name}`,
      date: s.startDate,
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-500/10",
      borderColor: "border-green-500/50",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]"
    })),
    ...recentClients.map(c => ({
      id: `cli-${c.id}`,
      type: 'NEW_CLIENT' as const,
      title: `Nuevo prospecto/cliente`,
      subtitle: c.name,
      date: c.createdAt,
      icon: Plus,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/50",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Línea de Actividad
        </h1>
        <p className="text-zinc-400 font-medium mt-1 uppercase tracking-widest text-xs">Eventos recientes en tu gimnasio</p>
      </div>

      <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Timeline Container */}
        <div className="relative border-l-2 border-white/10 ml-6 space-y-12 pb-12">
          {activityFeed.length === 0 ? (
            <p className="text-zinc-500 ml-8">No hay actividad reciente.</p>
          ) : (
            activityFeed.map((item, index) => (
              <div key={item.id} className="relative animate-in slide-in-from-left-8 fade-in duration-700" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-1 w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center`}>
                  <div className={`w-12 h-12 rounded-full ${item.bg} border-2 ${item.borderColor} ${item.color} flex items-center justify-center ${item.glow} z-10 relative`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="ml-16 bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.bg.replace('/10', '')} opacity-50`}></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-zinc-400 text-sm">{item.subtitle}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className={`font-black text-lg ${item.color}`}>
                        {new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: 'numeric' }).format(item.date)}
                      </p>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                        {new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(item.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
