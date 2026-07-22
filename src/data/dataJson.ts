// Estructura de datos JSON principal (dataJson) para operar sin base de datos (Prisma/SQLite)
export const dataJson = {
  auth: {
    email: "demo@gmail.com",
    password: "adminadmin"
  },
  tenant: {
    id: "tenant-1",
    name: "Pulse Fitness",
    domain: "pulsefitness.local"
  },
  plans: [
    { id: "plan-1", name: "Pase de Visita", price: 15, billingCycle: "CUSTOM", tenantId: "tenant-1" },
    { id: "plan-2", name: "Plan Quincenal", price: 45, billingCycle: "CUSTOM", tenantId: "tenant-1" },
    { id: "plan-3", name: "Plan Mensual", price: 80, billingCycle: "MONTHLY", tenantId: "tenant-1" },
    { id: "plan-4", name: "Plan Anual", price: 750, billingCycle: "ANNUAL", tenantId: "tenant-1" }
  ],
  classes: [
    { id: "class-1", name: "CrossFit Intensivo", schedule: "07:00 AM", instructor: "Jessica Lee" },
    { id: "class-2", name: "HIIT Cardio Extremo", schedule: "09:00 AM", instructor: "Marcus Chen" },
    { id: "class-3", name: "Fuerza y Potencia", schedule: "06:00 PM", instructor: "Jessica Lee" },
    { id: "class-4", name: "Boxeo & Sparring", schedule: "08:00 PM", instructor: "Marcus Chen" }
  ],
  clients: [
    {
      id: "cli-1",
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
      phone: "+52 998 123 4567",
      status: "ACTIVE",
      tenantId: "tenant-1",
      createdAt: new Date("2026-06-15T10:00:00Z"),
      subscriptions: [
        {
          id: "sub-1",
          planId: "plan-3",
          startDate: new Date("2026-07-01T10:00:00Z"),
          endDate: new Date("2026-08-01T10:00:00Z"),
          status: "ACTIVE",
          plan: { id: "plan-3", name: "Plan Mensual", price: 80, billingCycle: "MONTHLY", tenantId: "tenant-1" }
        }
      ]
    },
    {
      id: "cli-2",
      name: "María García",
      email: "maria.garcia@ejemplo.com",
      phone: "+52 998 234 5678",
      status: "ACTIVE",
      tenantId: "tenant-1",
      createdAt: new Date("2026-06-20T14:30:00Z"),
      subscriptions: [
        {
          id: "sub-2",
          planId: "plan-2",
          startDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // Hace 13 días
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),   // Vence en 2 días (para sección Próximos a vencer)
          status: "ACTIVE",
          plan: { id: "plan-2", name: "Plan Quincenal", price: 45, billingCycle: "CUSTOM", tenantId: "tenant-1" }
        }
      ]
    },
    {
      id: "cli-3",
      name: "Carlos López",
      email: "carlos.lopez@ejemplo.com",
      phone: "+52 998 345 6789",
      status: "ACTIVE",
      tenantId: "tenant-1",
      createdAt: new Date("2026-05-10T09:15:00Z"),
      subscriptions: [
        {
          id: "sub-3",
          planId: "plan-3",
          startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),  // Venció hace 10 días (para sección Membresías Vencidas)
          status: "ACTIVE",
          plan: { id: "plan-3", name: "Plan Mensual", price: 80, billingCycle: "MONTHLY", tenantId: "tenant-1" }
        }
      ]
    },
    {
      id: "cli-4",
      name: "Ana Martínez",
      email: "ana.martinez@ejemplo.com",
      phone: "+52 998 456 7890",
      status: "ACTIVE",
      tenantId: "tenant-1",
      createdAt: new Date("2026-07-18T16:00:00Z"),
      subscriptions: [
        {
          id: "sub-4",
          planId: "plan-1",
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),   // Venció hace 2 días
          status: "ACTIVE",
          plan: { id: "plan-1", name: "Pase de Visita", price: 15, billingCycle: "CUSTOM", tenantId: "tenant-1" }
        }
      ]
    },
    {
      id: "cli-5",
      name: "Sofía Rodríguez",
      email: "sofia.rod@ejemplo.com",
      phone: "+52 998 567 8901",
      status: "ACTIVE",
      tenantId: "tenant-1",
      createdAt: new Date("2026-07-21T11:00:00Z"),
      subscriptions: [
        {
          id: "sub-5",
          planId: "plan-3",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Vence en 30 días
          status: "ACTIVE",
          plan: { id: "plan-3", name: "Plan Mensual", price: 80, billingCycle: "MONTHLY", tenantId: "tenant-1" }
        }
      ]
    }
  ],
  attendance: [
    {
      id: "att-1",
      clientId: "cli-1",
      classId: "class-1",
      checkInAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      client: { id: "cli-1", name: "Juan Pérez", email: "juan.perez@ejemplo.com", phone: "+52 998 123 4567" },
      class: { id: "class-1", name: "CrossFit Intensivo", schedule: "07:00 AM", instructor: "Jessica Lee" }
    },
    {
      id: "att-2",
      clientId: "cli-2",
      classId: "class-2",
      checkInAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      client: { id: "cli-2", name: "María García", email: "maria.garcia@ejemplo.com", phone: "+52 998 234 5678" },
      class: { id: "class-2", name: "HIIT Cardio Extremo", schedule: "09:00 AM", instructor: "Marcus Chen" }
    },
    {
      id: "att-3",
      clientId: "cli-5",
      classId: null,
      checkInAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      client: { id: "cli-5", name: "Sofía Rodríguez", email: "sofia.rod@ejemplo.com", phone: "+52 998 567 8901" },
      class: null
    }
  ]
};
