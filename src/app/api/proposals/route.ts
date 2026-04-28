import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  content: z.string().min(1),
  amount: z.number().optional(),
  budget: z.string().optional(),
  currency: z.string().default("USD"),
  validDays: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const proposals = await db.proposal.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return NextResponse.json(proposals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    let clientId: string | undefined;

    if (data.clientName) {
      const client = await db.client.upsert({
        where: {
          id: `${session.user.id}_${data.clientEmail || data.clientName}`,
        },
        update: {},
        create: {
          userId: session.user.id as string,
          name: data.clientName,
          email: data.clientEmail || "",
        },
      });
      clientId = client.id;
    }

    const amount = data.budget ? parseFloat(data.budget) : undefined;
    const validUntil = data.validDays
      ? new Date(Date.now() + parseInt(data.validDays) * 86400000)
      : undefined;

    const proposal = await db.proposal.create({
      data: {
        userId: session.user.id as string,
        clientId,
        title: data.title,
        content: data.content,
        amount,
        currency: data.currency,
        validUntil,
        status: "DRAFT",
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issues = err.issues || [];
      return NextResponse.json({ error: issues[0]?.message || "Validation error" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
