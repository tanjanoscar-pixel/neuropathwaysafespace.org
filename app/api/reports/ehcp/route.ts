import { NextResponse } from "next/server";
import { generateEhcpReportSections, type EhcpReportInput } from "@/lib/ehcp-report";

export async function POST(request: Request) {
  const body = (await request.json()) as EhcpReportInput;
  const sections = generateEhcpReportSections(body);

  return NextResponse.json({ data: { sections, status: "draft_requires_professional_review" } });
}
