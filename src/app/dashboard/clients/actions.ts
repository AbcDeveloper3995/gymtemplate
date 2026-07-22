"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addManualClient(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const planName = formData.get("plan") as string;
  const isPaid = formData.get("isPaid") === "on";

  if (!name || !planName) return { error: "Faltan datos obligatorios" };

  try {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No hay gimnasio configurado");

    let days = 0;
    let price = 0;
    
    if (planName === "Pase de Visita") { days = 1; price = 15; }
    else if (planName === "Plan Quincenal") { days = 15; price = 45; }
    else if (planName === "Plan Mensual") { days = 30; price = 80; }

    let plan = await prisma.plan.findFirst({
      where: { name: planName, tenantId: tenant.id }
    });
    
    if (!plan) {
      plan = await prisma.plan.create({
        data: {
          name: planName,
          price: price,
          billingCycle: planName === "Plan Mensual" ? "MONTHLY" : "CUSTOM",
          tenantId: tenant.id
        }
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    // Si no pagó pero se registra manual, se puede registrar inactivo o activo. 
    // Asumiremos que si se agrega manual, es porque pagó.
    
    await prisma.client.create({
      data: {
        name,
        email: `manual-${Date.now()}@pulsefitness.local`, // Fake email
        phone,
        status: "ACTIVE",
        tenantId: tenant.id,
        subscriptions: {
          create: {
            planId: plan.id,
            startDate,
            endDate,
            status: "ACTIVE"
          }
        }
      }
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al guardar" };
  }
}

export async function renewSubscription(clientId: string, planName: string) {
  try {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No hay gimnasio configurado");

    let days = 0;
    if (planName === "Pase de Visita") days = 1;
    else if (planName === "Plan Quincenal") days = 15;
    else if (planName === "Plan Mensual") days = 30;

    let plan = await prisma.plan.findFirst({
      where: { name: planName, tenantId: tenant.id }
    });

    if (!plan) return { error: "Plan no encontrado" };

    // Buscar si ya tiene una suscripción activa
    const currentSub = await prisma.subscription.findFirst({
      where: { clientId, status: "ACTIVE" },
      orderBy: { endDate: "desc" }
    });

    const startDate = new Date();
    const endDate = new Date();

    // Si ya tenía una activa y vigente, sumarle a la fecha de vencimiento. Si ya venció, sumarle a la fecha de hoy.
    if (currentSub && currentSub.endDate && currentSub.endDate > startDate) {
      endDate.setTime(currentSub.endDate.getTime());
      endDate.setDate(endDate.getDate() + days);
      
      // Actualizar la existente
      await prisma.subscription.update({
        where: { id: currentSub.id },
        data: { endDate, planId: plan.id }
      });
    } else {
      endDate.setDate(startDate.getDate() + days);
      // Crear nueva
      await prisma.subscription.create({
        data: {
          clientId,
          planId: plan.id,
          startDate,
          endDate,
          status: "ACTIVE"
        }
      });
    }

    // Asegurarse de que el cliente esté ACTIVE
    await prisma.client.update({
      where: { id: clientId },
      data: { status: "ACTIVE" }
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error renovando la membresía" };
  }
}
