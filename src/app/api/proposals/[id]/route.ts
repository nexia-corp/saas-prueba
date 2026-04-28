import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const proposal = await db.proposal.findFirst({
    where: { id, userId: session.user.id as string },
    include: { client: true, sections: true, signature: true },
  });

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(proposal);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const proposal = await db.proposal.findFirst({
    where: { id, userId: session.user.id as string },
  });

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.proposal.update({
    where: { id },
    data: {
      title: body.title ?? proposal.title,
      content: body.content ?? proposal.content,
      status: body.status ?? proposal.status,
      amount: body.amount ?? proposal.amount,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const proposal = await db.proposal.findFirst({
    where: { id, userId: session.user.id as string },
  });

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.proposal.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
