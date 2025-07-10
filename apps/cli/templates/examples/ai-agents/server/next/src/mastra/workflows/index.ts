import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { searchTool } from "../tools";
import { assistantAgent } from "../agents";

// Step 1: Search for information
const searchStep = createStep({
  id: "search-information",
  description: "Search the web for relevant information",
  inputSchema: z.object({
    topic: z.string().describe("The topic to research"),
  }),
  outputSchema: z.object({
    searchResults: z.array(z.object({
      title: z.string(),
      snippet: z.string(),
      url: z.string(),
    })),
  }),
  execute: async ({ inputData }) => {
    const { results } = await searchTool.execute({
      context: { query: inputData.topic },
    });
    
    return {
      searchResults: results,
    };
  },
});

// Step 2: Analyze and summarize
const analyzeStep = createStep({
  id: "analyze-results",
  description: "Analyze search results and create a summary",
  inputSchema: z.object({
    searchResults: z.array(z.object({
      title: z.string(),
      snippet: z.string(),
      url: z.string(),
    })),
  }),
  outputSchema: z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent("assistantAgent");
    
    const prompt = `Please analyze these search results and provide:
1. A concise summary
2. Key points as a bulleted list

Search Results:
${inputData.searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`;

    const response = await agent.generate(prompt, {
      output: z.object({
        summary: z.string(),
        keyPoints: z.array(z.string()),
      }),
    });
    
    return response.object;
  },
});

// Create the workflow
export const researchWorkflow = createWorkflow({
  id: "research-workflow",
  description: "Research a topic by searching and analyzing information",
  inputSchema: z.object({
    topic: z.string().describe("The topic to research"),
  }),
  outputSchema: z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
  }),
})
  .then(searchStep)
  .then(analyzeStep);

researchWorkflow.commit();