<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';
  import { onMount } from 'svelte';

  let resourceId = "user_123"; // In production, get from auth
  let threadId = `chat_${Date.now()}`;
  let researchTopic = "";
  let researchResult: { summary: string; keyPoints: string[] } | null = null;
  let isResearching = false;

  const { messages, input, handleSubmit, isLoading } = useChat({
    api: '/api/agent',
    body: {
      resourceId,
      threadId,
    },
  });

  async function handleResearch() {
    if (!researchTopic.trim()) return;
    
    isResearching = true;
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: researchTopic }),
      });
      
      if (response.ok) {
        researchResult = await response.json();
      }
    } catch (error) {
      console.error('Research error:', error);
    } finally {
      isResearching = false;
    }
  }
</script>

<div class="flex flex-col h-screen max-w-4xl mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">AI Agent Assistant</h1>
  
  <div class="flex gap-4 mb-4">
    <div class="flex-1 bg-gray-50 rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-2">Chat with Agent</h2>
      <div class="flex-1 overflow-y-auto mb-4 bg-white rounded p-4 h-96">
        {#each $messages as message}
          <div
            class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}"
          >
            <div
              class="inline-block p-3 rounded-lg {message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'}"
            >
              <p class="text-sm font-semibold mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </p>
              <p>{message.content}</p>
            </div>
          </div>
        {/each}
      </div>
      
      <form on:submit={handleSubmit} class="flex gap-2">
        <input
          type="text"
          bind:value={$input}
          placeholder="Ask anything..."
          class="flex-1 p-2 border rounded"
          disabled={$isLoading}
        />
        <button
          type="submit"
          disabled={$isLoading}
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {$isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
    
    <div class="flex-1 bg-gray-50 rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-2">Research Workflow</h2>
      <div class="space-y-4">
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={researchTopic}
            placeholder="Enter a topic to research..."
            class="flex-1 p-2 border rounded"
            disabled={isResearching}
          />
          <button
            on:click={handleResearch}
            disabled={isResearching || !researchTopic.trim()}
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isResearching ? 'Researching...' : 'Research'}
          </button>
        </div>
        
        {#if researchResult}
          <div class="bg-white rounded p-4">
            <h3 class="font-semibold mb-2">Summary:</h3>
            <p class="text-gray-700 mb-4">{researchResult.summary}</p>
            
            <h3 class="font-semibold mb-2">Key Points:</h3>
            <ul class="list-disc list-inside space-y-1">
              {#each researchResult.keyPoints as point}
                <li class="text-gray-700">{point}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>