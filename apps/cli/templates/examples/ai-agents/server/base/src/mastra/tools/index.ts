import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as mathjs from "mathjs";

export const searchTool = createTool({
  id: "web-search",
  description: "Search the web for current information",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      title: z.string(),
      snippet: z.string(),
      url: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    // In a real implementation, this would call a search API
    // For demo purposes, we'll return mock data
    console.log(`Searching for: ${context.query}`);
    
    return {
      results: [
        {
          title: "Example Search Result",
          snippet: "This is a mock search result for demonstration purposes.",
          url: "https://example.com",
        },
      ],
    };
  },
});

export const calculateTool = createTool({
  id: "calculator",
  description: "Perform mathematical calculations",
  inputSchema: z.object({
    expression: z.string().describe("Mathematical expression to evaluate"),
  }),
  outputSchema: z.object({
    result: z.union([z.number(), z.string()]),
    expression: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const result = mathjs.evaluate(context.expression);
      return {
        result: result,
        expression: context.expression,
      };
    } catch (error) {
      return {
        result: `Error: ${error.message}`,
        expression: context.expression,
      };
    }
  },
});