import { NextResponse } from "next/server";
import { analyseObservations, analyseTimeline, translateForAudiences } from "@/lib/neuro-ai-analysis";
import type { AnalysisRequestPayload } from "@/types/neuro-ai";

export async function POST(request: Request) {
  const body = (await request.json()) as AnalysisRequestPayload;
  const observations = Array.isArray(body.observations) ? body.observations : [];
  const analysis = analyseObservations(observations);

  return NextResponse.json({
    data: {
      ...analysis,
      translations: body.includeTranslations ? translateForAudiences(analysis) : undefined,
      timeline: body.includeTimeline ? analyseTimeline(observations) : undefined,
    },
  });
}
