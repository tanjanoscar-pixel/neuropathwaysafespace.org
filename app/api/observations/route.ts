import { NextResponse } from "next/server";
import type { Observation } from "@/types/domain";

const demoObservations: Observation[] = [];

export async function GET() {
  return NextResponse.json({ data: demoObservations });
}

export async function POST(request: Request) {
  const observation = (await request.json()) as Observation;
  demoObservations.unshift({ ...observation, id: observation.id || crypto.randomUUID() });

  return NextResponse.json({ data: demoObservations[0] }, { status: 201 });
}
