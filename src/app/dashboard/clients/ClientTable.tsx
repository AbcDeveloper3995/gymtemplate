"use client";

import { useState } from "react";
import { addManualClient } from "./actions";
import { UserPlus, Search, Info, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type ClientData = {
  id: string;
  name: string;
  phone: string | null;
  status: string;
  subscriptions: {
    plan: { name: string };
    endDate: Date;
  }[];
};

export default function ClientTable({ clients }: { clients: ClientData[] }) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsClientId, setDetailsClientId] = useState<string | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search))
  );

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addManualClient(formData);
    setIsAddModalOpen(false);
  }

  const selectedClient = clients.find(c => c.id === detailsClientId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o teléfono..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto bg-primary text-black font-bold uppercase tracking-widest hover:bg-yellow-500 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Agregar Manual
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => {
          const sub = client.subscriptions[0];
          const isExpired = sub ? new Date(sub.endDate) < new Date() : true;
          
          return (
            <div key={client.id} className="relative group bg-zinc-950/60 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:border-yellow-500/60 transition-all duration-300">
              
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${client.id}`} 
                    alt={client.name}
                    className="w-full h-full rounded-full object-cover border-2 border-zinc-950"
                  />
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-bold text-white mb-1 truncate w-full">{client.name}</h3>
              <p className="text-xs text-yellow-500 font-medium uppercase tracking-widest mb-6">
                {isExpired ? 'Membresía Vencida' : 'Miembro Activo'}
              </p>

              {/* Stats */}
              <div className="w-full grid grid-cols-3 gap-2 border-y border-white/10 py-4 mb-6">
                <div>
                  <p className="text-white font-bold text-sm truncate">{sub ? sub.plan.name.replace('Plan ', '') : "-"}</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">Plan</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    {sub ? new Date(sub.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : "-"}
                  </p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">Vence</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className={`flex items-center justify-center font-bold text-sm ${isExpired ? 'text-red-500' : 'text-green-500'}`}>
                    {isExpired ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  </div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">Activo</p>
                </div>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={() => setDetailsClientId(client.id)}
                className="w-full py-3 rounded-xl border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4" />
                Detalles
              </button>
            </div>
          );
        })}
        {filteredClients.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl">
            No se encontraron clientes.
          </div>
        )}
      </div>

      {/* Modal Añadir */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-white/10 rounded-xl w-full max-w-md overflow-hidden relative">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Nuevo Cliente</h3>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nombre Completo</label>
                  <input type="text" name="name" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Teléfono</label>
                  <input type="tel" name="phone" className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Membresía Pagada</label>
                  <select name="plan" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-white mt-1">
                    <option value="Pase de Visita">Pase de Visita</option>
                    <option value="Plan Quincenal">Plan Quincenal</option>
                    <option value="Plan Mensual">Plan Mensual</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-primary text-black font-bold uppercase tracking-widest hover:bg-yellow-500 mt-4">
                  Guardar Cliente
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)] rounded-xl w-full max-w-md overflow-hidden relative">
            <button type="button" onClick={() => setDetailsClientId(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={`https://i.pravatar.cc/150?u=${selectedClient.id}`} 
                  alt={selectedClient.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500"
                />
                <div>
                  <h3 className="text-xl font-black text-white">{selectedClient.name}</h3>
                  <p className="text-xs text-yellow-500 font-bold uppercase tracking-widest">
                    {selectedClient.status === "ACTIVE" ? "Cliente Activo" : "Prospecto/Inactivo"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Teléfono</p>
                  <p className="text-white font-medium">{selectedClient.phone || "No especificado"}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Membresía Actual</p>
                  <p className="text-white font-medium">{selectedClient.subscriptions[0]?.plan.name || "Ninguna"}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Vencimiento</p>
                    <p className="text-white font-medium">
                      {selectedClient.subscriptions[0] 
                        ? new Date(selectedClient.subscriptions[0].endDate).toLocaleDateString('es-ES', { dateStyle: 'long' }) 
                        : "N/A"
                      }
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedClient.subscriptions[0] && new Date(selectedClient.subscriptions[0].endDate) >= new Date() ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {selectedClient.subscriptions[0] && new Date(selectedClient.subscriptions[0].endDate) >= new Date() ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <Button onClick={() => setDetailsClientId(null)} className="w-full bg-zinc-800 text-white hover:bg-zinc-700 mt-6 font-bold uppercase tracking-widest">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
