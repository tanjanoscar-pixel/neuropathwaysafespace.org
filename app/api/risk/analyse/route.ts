import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk-scoring";
import type { Observation } from "@/types/domain";

export async function POST(request: Request) {
  const body = (await request.json()) as { observations?: Observation[] };
  const observations = Array.isArray(body.observations) ? body.observations : [];
  const riskScore = calculateRiskScore(observations);

  return NextResponse.json({ data: riskScore });
}
