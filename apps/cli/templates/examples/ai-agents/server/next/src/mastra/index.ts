import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { assistantAgent } from "./agents";
import { searchTool, calculateTool } from "./tools";
import { researchWorkflow } from "./workflows";

const storage = new LibSQLStore({
  url: "file:./mastra.db",
});

export const mastra = new Mastra({
  agents: { assistantAgent },
  tools: { searchTool, calculateTool },
  workflows: { researchWorkflow },
  storage,
});