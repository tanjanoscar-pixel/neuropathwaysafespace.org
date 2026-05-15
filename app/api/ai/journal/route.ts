import { NextResponse } from "next/server";
import { analyseJournalEntry } from "@/lib/neuro-ai-analysis";

export async function POST(request: Request) {
  const body = (await request.json()) as { entry?: string; previousEntries?: string[] };

  return NextResponse.json({
    data: analyseJournalEntry(body.entry ?? "", Array.isArray(body.previousEntries) ? body.previousEntries : []),
  });
}
