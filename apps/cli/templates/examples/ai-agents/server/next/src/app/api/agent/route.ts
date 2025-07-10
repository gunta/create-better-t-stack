import { mastra } from "@/mastra";
import { RuntimeContext } from "@mastra/core/di";
import { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages, resourceId, threadId } = await req.json();
  
  const agent = mastra.getAgent("assistantAgent");
  
  // Set up runtime context if needed
  const runtimeContext = new RuntimeContext();
  
  // Use memory if resourceId and threadId are provided
  const options = {
    runtimeContext,
    ...(resourceId && threadId && { resourceId, threadId }),
  };
  
  const result = await agent.stream(messages, options);
  
  return result.toDataStreamResponse();
}