import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { searchTool, calculateTool } from "../tools";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra.db",
  }),
});

export const assistantAgent = new Agent({
  name: "Assistant Agent",
  description: "A helpful AI assistant that can search the web, perform calculations, and remember conversations.",
  instructions: `You are a helpful AI assistant with access to various tools and capabilities:

1. You can search the web for current information
2. You can perform mathematical calculations
3. You have memory of previous conversations with users

Always strive to provide accurate, helpful, and concise responses. When you don't know something, use the search tool to find information. For mathematical queries, use the calculator tool.

Remember to:
- Be conversational and friendly
- Cite sources when providing factual information
- Ask for clarification when needed
- Use your memory to provide contextual responses`,
  model: openai("gpt-4o-mini"),
  tools: {
    searchTool,
    calculateTool,
  },
  memory,
});