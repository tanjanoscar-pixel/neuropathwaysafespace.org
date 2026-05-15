import { NextResponse } from "next/server";
import { analyseObservations } from "@/lib/neuro-ai-analysis";
import type { Observation } from "@/types/domain";

export async function POST(request: Request) {
  const body = (await request.json()) as { observations?: Observation[] };
  const observations = Array.isArray(body.observations) ? body.observations : [];
  const analysis = analyseObservations(observations);

  return NextResponse.json({
    data: {
      deterministicRisk: analysis.deterministicRisk,
      riskFlags: analysis.riskFlags,
      reminder: "This review does not make clinical decisions. Follow local safeguarding procedures for concerns.",
    },
  });
}
