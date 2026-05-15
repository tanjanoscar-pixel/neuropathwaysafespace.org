import { NextResponse } from "next/server";
import { runSpecialistAgents } from "@/lib/neuro-ai-analysis";
import type { Observation } from "@/types/domain";

export async function POST(request: Request) {
  const body = (await request.json()) as { observations?: Observation[] };
  const observations = Array.isArray(body.observations) ? body.observations : [];

  return NextResponse.json({ data: runSpecialistAgents(observations) });
}
