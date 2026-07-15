import { prisma } from "@/lib/prisma";
import ClientTable from "./ClientTable";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      subscriptions: {
        include: { plan: true },
        orderBy: { endDate: "desc" },
        take: 1 // Solo traer la membresía más reciente
      }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Gestión de Clientes</h1>
        <p className="text-zinc-400 font-medium mt-1">Directorio de miembros y control de vencimientos</p>
      </div>

      <ClientTable clients={clients} />
    </div>
  );
}
