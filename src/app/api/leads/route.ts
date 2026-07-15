import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, membership } = data;

    if (!name || !email) {
      return NextResponse.json(
        { error: "El nombre y el correo son obligatorios." },
        { status: 400 }
      );
    }

    // Buscar el primer tenant o crearlo
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Pulse Fitness",
          domain: "pulsefitness.local",
        },
      });
    }

    // Definir la duración y el precio base según la membresía
    let days = 0;
    let price = 0;
    let planName = "";
    
    if (membership === "visita") {
       days = 1; price = 15; planName = "Pase de Visita";
    } else if (membership === "quincenal") {
       days = 15; price = 45; planName = "Plan Quincenal";
    } else if (membership === "mensual") {
       days = 30; price = 80; planName = "Plan Mensual";
    } else {
       // fallback
       days = 30; price = 80; planName = "Plan Personalizado";
    }

    // Buscar o crear el Plan
    let plan = await prisma.plan.findFirst({
      where: { name: planName, tenantId: tenant.id }
    });
    
    if (!plan) {
      plan = await prisma.plan.create({
        data: {
          name: planName,
          price: price,
          billingCycle: membership === "mensual" ? "MONTHLY" : "CUSTOM",
          tenantId: tenant.id
        }
      });
    }

    // Calcular fechas
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    // Crear cliente y su suscripción 
    const client = await prisma.client.create({
      data: {
        name,
        email,
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
      },
      include: {
        subscriptions: true
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/clients");

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
