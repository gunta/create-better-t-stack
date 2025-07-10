import { mastra } from "@/mastra";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  
  if (!topic) {
    return NextResponse.json(
      { error: "Topic is required" },
      { status: 400 }
    );
  }
  
  try {
    const workflow = mastra.getWorkflow("researchWorkflow");
    const result = await workflow.execute({
      inputData: { topic },
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Workflow error:", error);
    return NextResponse.json(
      { error: "Failed to execute workflow" },
      { status: 500 }
    );
  }
}