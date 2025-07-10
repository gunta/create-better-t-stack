<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">AI Agent Assistant</h1>
    
    <div class="flex gap-4 mb-4">
      <div class="flex-1 bg-gray-50 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-2">Chat with Agent</h2>
        <div class="flex-1 overflow-y-auto mb-4 bg-white rounded p-4 h-96">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['mb-4', message.role === 'user' ? 'text-right' : 'text-left']"
          >
            <div
              :class="[
                'inline-block p-3 rounded-lg',
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black',
              ]"
            >
              <p class="text-sm font-semibold mb-1">
                {{ message.role === 'user' ? 'You' : 'Assistant' }}
              </p>
              <p>{{ message.content }}</p>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="flex gap-2">
          <input
            v-model="input"
            type="text"
            placeholder="Ask anything..."
            class="flex-1 p-2 border rounded"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading ? 'Thinking...' : 'Send' }}
          </button>
        </form>
      </div>
      
      <div class="flex-1 bg-gray-50 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-2">Research Workflow</h2>
        <div class="space-y-4">
          <div class="flex gap-2">
            <input
              v-model="researchTopic"
              type="text"
              placeholder="Enter a topic to research..."
              class="flex-1 p-2 border rounded"
              :disabled="isResearching"
            />
            <button
              @click="handleResearch"
              :disabled="isResearching || !researchTopic.trim()"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {{ isResearching ? 'Researching...' : 'Research' }}
            </button>
          </div>
          
          <div v-if="researchResult" class="bg-white rounded p-4">
            <h3 class="font-semibold mb-2">Summary:</h3>
            <p class="text-gray-700 mb-4">{{ researchResult.summary }}</p>
            
            <h3 class="font-semibold mb-2">Key Points:</h3>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="(point, index) in researchResult.keyPoints"
                :key="index"
                class="text-gray-700"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';

const resourceId = ref('user_123'); // In production, get from auth
const threadId = ref(`chat_${Date.now()}`);
const researchTopic = ref('');
const researchResult = ref<{ summary: string; keyPoints: string[] } | null>(null);
const isResearching = ref(false);

const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/agent',
  body: {
    resourceId: resourceId.value,
    threadId: threadId.value,
  },
});

async function handleResearch() {
  if (!researchTopic.value.trim()) return;
  
  isResearching.value = true;
  try {
    const response = await fetch('/api/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: researchTopic.value }),
    });
    
    if (response.ok) {
      researchResult.value = await response.json();
    }
  } catch (error) {
    console.error('Research error:', error);
  } finally {
    isResearching.value = false;
  }
}
</script>