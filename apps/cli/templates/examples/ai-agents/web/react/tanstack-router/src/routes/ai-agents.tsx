import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export const Route = createFileRoute("/ai-agents")({
  component: AIAgentPage,
});

function AIAgentPage() {
  const [resourceId] = useState("user_123"); // In production, get from auth
  const [threadId] = useState(`chat_${Date.now()}`);
  const [researchTopic, setResearchTopic] = useState("");
  const [researchResult, setResearchResult] = useState<{
    summary: string;
    keyPoints: string[];
  } | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/agent",
    body: {
      resourceId,
      threadId,
    },
  });

  const handleResearch = async () => {
    if (!researchTopic.trim()) return;
    
    setIsResearching(true);
    try {
      const response = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: researchTopic }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResearchResult(data);
      }
    } catch (error) {
      console.error("Research error:", error);
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Agent Assistant</h1>
      
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Chat with Agent</h2>
          <div className="flex-1 overflow-y-auto mb-4 bg-white rounded p-4 h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="flex-1 p-2 border rounded"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
        
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Research Workflow</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="Enter a topic to research..."
                className="flex-1 p-2 border rounded"
                disabled={isResearching}
              />
              <button
                onClick={handleResearch}
                disabled={isResearching || !researchTopic.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isResearching ? "Researching..." : "Research"}
              </button>
            </div>
            
            {researchResult && (
              <div className="bg-white rounded p-4">
                <h3 className="font-semibold mb-2">Summary:</h3>
                <p className="text-gray-700 mb-4">{researchResult.summary}</p>
                
                <h3 className="font-semibold mb-2">Key Points:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {researchResult.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}