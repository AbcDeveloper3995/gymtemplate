// Reemplazo en memoria respaldado por dataJson (sin base de datos Prisma/SQLite)
import { dataJson } from "@/data/dataJson";

// Almacén global en memoria para que persistan las creaciones y actualizaciones durante el tiempo de ejecución
const globalStore = (globalThis as any).__dataStore || {
  tenant: { ...dataJson.tenant },
  plans: [...dataJson.plans],
  classes: [...dataJson.classes],
  clients: dataJson.clients.map(c => ({ ...c, subscriptions: [...c.subscriptions] })),
  subscriptions: [] as any[],
  attendance: [...dataJson.attendance],
};

// Inicializar la lista plana de suscripciones a partir de los clientes iniciales si está vacía
if (globalStore.subscriptions.length === 0) {
  globalStore.clients.forEach((client: any) => {
    client.subscriptions?.forEach((sub: any) => {
      globalStore.subscriptions.push({
        ...sub,
        clientId: client.id,
        client: { id: client.id, name: client.name, email: client.email, phone: client.phone, status: client.status },
        plan: sub.plan || globalStore.plans.find((p: any) => p.id === sub.planId) || { id: "plan-1", name: "Pase", price: 15 }
      });
    });
  });
}

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).__dataStore = globalStore;
}

export const prisma = {
  tenant: {
    findFirst: async () => globalStore.tenant,
    create: async ({ data }: any) => {
      globalStore.tenant = { id: "tenant-1", ...data };
      return globalStore.tenant;
    }
  },
  plan: {
    findFirst: async ({ where }: any) => {
      if (!where) return globalStore.plans[0];
      return globalStore.plans.find((p: any) => p.name === where.name);
    },
    create: async ({ data }: any) => {
      const newPlan = { id: `plan-${Date.now()}`, ...data };
      globalStore.plans.push(newPlan);
      return newPlan;
    }
  },
  client: {
    findMany: async ({ where, orderBy, take, include }: any = {}) => {
      let list = [...globalStore.clients];
      if (where?.status) {
        list = list.filter((c: any) => c.status === where.status);
      }
      if (orderBy?.createdAt === "desc") {
        list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      if (include?.subscriptions) {
        list = list.map((c: any) => {
          const subs = globalStore.subscriptions.filter((s: any) => s.clientId === c.id || c.subscriptions?.some((cs: any) => cs.id === s.id));
          subs.sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
          return {
            ...c,
            subscriptions: include.subscriptions.take ? subs.slice(0, include.subscriptions.take) : subs
          };
        });
      }
      if (take) list = list.slice(0, take);
      return list;
    },
    findFirst: async ({ where }: any = {}) => {
      if (where?.id) return globalStore.clients.find((c: any) => c.id === where.id);
      return globalStore.clients[0];
    },
    count: async ({ where }: any = {}) => {
      let list = [...globalStore.clients];
      if (where?.status) {
        list = list.filter((c: any) => c.status === where.status);
      }
      if (where?.createdAt?.gte) {
        list = list.filter((c: any) => new Date(c.createdAt) >= new Date(where.createdAt.gte));
      }
      if (where?.subscriptions?.some?.endDate?.gte) {
        const threshold = new Date(where.subscriptions.some.endDate.gte);
        list = list.filter((c: any) => {
          const clientSubs = globalStore.subscriptions.filter((s: any) => s.clientId === c.id || c.subscriptions?.some((cs: any) => cs.id === s.id));
          return clientSubs.some((s: any) => new Date(s.endDate) >= threshold);
        });
      }
      return list.length;
    },
    create: async ({ data, include }: any = {}) => {
      const newClientId = `cli-${Date.now()}`;
      const newClient: any = {
        id: newClientId,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        status: data.status || "ACTIVE",
        tenantId: data.tenantId || "tenant-1",
        createdAt: new Date(),
        subscriptions: []
      };

      if (data.subscriptions?.create) {
        const subData = data.subscriptions.create;
        const plan = globalStore.plans.find((p: any) => p.id === subData.planId) || globalStore.plans[0];
        const newSub = {
          id: `sub-${Date.now()}`,
          clientId: newClientId,
          planId: subData.planId,
          startDate: subData.startDate || new Date(),
          endDate: subData.endDate || new Date(Date.now() + 30 * 86400000),
          status: subData.status || "ACTIVE",
          plan: plan,
          client: { id: newClientId, name: newClient.name, email: newClient.email, phone: newClient.phone, status: newClient.status }
        };
        newClient.subscriptions.push(newSub);
        globalStore.subscriptions.push(newSub);
      }

      globalStore.clients.push(newClient);

      if (include?.subscriptions) {
        return {
          ...newClient,
          subscriptions: globalStore.subscriptions.filter((s: any) => s.clientId === newClientId || newClient.subscriptions.some((cs: any) => cs.id === s.id))
        };
      }
      return newClient;
    },
    update: async ({ where, data }: any = {}) => {
      const idx = globalStore.clients.findIndex((c: any) => c.id === where.id);
      if (idx !== -1) {
        globalStore.clients[idx] = { ...globalStore.clients[idx], ...data };
        return globalStore.clients[idx];
      }
      return null;
    }
  },
  subscription: {
    findMany: async ({ where, orderBy, take, include }: any = {}) => {
      let list = [...globalStore.subscriptions];
      if (where?.status) {
        list = list.filter((s: any) => s.status === where.status);
      }
      if (where?.endDate?.gte) {
        list = list.filter((s: any) => new Date(s.endDate) >= new Date(where.endDate.gte));
      }
      if (where?.endDate?.lte) {
        list = list.filter((s: any) => new Date(s.endDate) <= new Date(where.endDate.lte));
      }
      if (where?.endDate?.lt) {
        list = list.filter((s: any) => new Date(s.endDate) < new Date(where.endDate.lt));
      }
      if (where?.client?.status) {
        list = list.filter((s: any) => s.client?.status === where.client.status || globalStore.clients.find((c: any) => c.id === s.clientId)?.status === where.client.status);
      }
      if (orderBy?.endDate === "asc") {
        list.sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
      } else if (orderBy?.endDate === "desc") {
        list.sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      } else if (orderBy?.startDate === "desc") {
        list.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      }
      if (take) list = list.slice(0, take);
      return list;
    },
    findFirst: async ({ where, orderBy }: any = {}) => {
      let list = [...globalStore.subscriptions];
      if (where?.clientId) {
        list = list.filter((s: any) => s.clientId === where.clientId);
      }
      if (where?.status) {
        list = list.filter((s: any) => s.status === where.status);
      }
      if (orderBy?.endDate === "desc") {
        list.sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      }
      return list[0] || null;
    },
    create: async ({ data }: any = {}) => {
      const plan = globalStore.plans.find((p: any) => p.id === data.planId) || globalStore.plans[0];
      const client = globalStore.clients.find((c: any) => c.id === data.clientId) || { id: data.clientId, name: "Cliente" };
      const newSub = {
        id: `sub-${Date.now()}`,
        clientId: data.clientId,
        planId: data.planId,
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(),
        status: data.status || "ACTIVE",
        plan: plan,
        client: client
      };
      globalStore.subscriptions.push(newSub);
      const c = globalStore.clients.find((c: any) => c.id === data.clientId);
      if (c) {
        if (!c.subscriptions) c.subscriptions = [];
        c.subscriptions.push(newSub);
      }
      return newSub;
    },
    update: async ({ where, data }: any = {}) => {
      const idx = globalStore.subscriptions.findIndex((s: any) => s.id === where.id);
      if (idx !== -1) {
        globalStore.subscriptions[idx] = { ...globalStore.subscriptions[idx], ...data };
        if (data.planId) {
          const plan = globalStore.plans.find((p: any) => p.id === data.planId);
          if (plan) globalStore.subscriptions[idx].plan = plan;
        }
        return globalStore.subscriptions[idx];
      }
      return null;
    }
  },
  attendance: {
    findMany: async ({ take, orderBy, include }: any = {}) => {
      let list = [...globalStore.attendance];
      if (orderBy?.checkInAt === "desc") {
        list.sort((a: any, b: any) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime());
      }
      if (take) list = list.slice(0, take);
      return list;
    }
  }
};
