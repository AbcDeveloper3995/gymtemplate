import Link from "next/link";
import { Home, Users, LogOut, Dumbbell, CreditCard, Calendar } from "lucide-react";
import DemoBanner from "@/components/DemoBanner";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen flex relative"
      style={{
        backgroundImage: 'url(/img/dashboard.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm z-0"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950/60 backdrop-blur-md border-r border-white/10 flex flex-col relative z-10">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center pointer-events-none">
            <img src="/img/logo.png" alt="Gym California Logo" className="h-14 w-14 rounded-full object-cover border border-white/20 shadow-md" />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group">
            <Home className="h-5 w-5 group-hover:text-primary transition-colors" />
            <span className="font-bold text-sm uppercase tracking-widest">Resumen</span>
          </Link>
          <Link href="/dashboard/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group">
            <Users className="h-5 w-5 group-hover:text-primary transition-colors" />
            <span className="font-bold text-sm uppercase tracking-widest">Clientes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="font-bold text-sm uppercase tracking-widest">Salir</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 flex flex-col">
        <DemoBanner />
        <div className="p-8 max-w-6xl mx-auto pb-24 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
