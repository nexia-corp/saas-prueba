import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientName, projectType, budget, currency, description } = await req.json();

  if (!clientName || !projectType || !budget) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = `You are an expert freelance business consultant. Write a professional, persuasive project proposal for the following:

Client: ${clientName}
Project Type: ${projectType}
Budget: ${budget} ${currency}
${description ? `Additional Details: ${description}` : ""}

Write a complete, professional proposal that includes:
1. Executive Summary (2-3 sentences about what you will deliver)
2. Understanding of Requirements (show you understand their needs)
3. Proposed Solution & Scope of Work (detailed deliverables with bullet points)
4. Timeline (realistic phases with durations)
5. Investment (clear pricing breakdown)
6. Why Choose Us (2-3 compelling reasons)
7. Next Steps (clear call to action)

Write in a professional but warm tone. Be specific and concrete. Do NOT use generic filler phrases. Format with clear section headers using ##. Make it feel personalized to ${clientName}.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "";
    const title = `${projectType} Proposal — ${clientName}`;

    return NextResponse.json({ content, title });
  } catch {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
