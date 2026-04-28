import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  proposalId: z.string(),
  token: z.string(),
  signerName: z.string().min(1),
  signerEmail: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const proposal = await db.proposal.findFirst({
      where: { id: data.proposalId, publicToken: data.token },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (proposal.status === "ACCEPTED") {
      return NextResponse.json({ error: "Already signed" }, { status: 409 });
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    await db.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
        signature: {
          create: {
            signerName: data.signerName,
            signerEmail: data.signerEmail,
            ipAddress: ip,
            signatureData: `${data.signerName} — ${new Date().toISOString()}`,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
