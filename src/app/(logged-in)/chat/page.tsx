import type { Metadata } from 'next';
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui';
import { mastra } from '@/mastra';
import ChatClient from './chat-client';

export const metadata: Metadata = {
  title: 'Chat | Oto',
  description: 'Chat with your AI health companion',
};

// TODO: replace with dynamic user ID from auth session
const THREAD_ID = 'example-user-id';

// Derives a provider-scoped resource ID so each model keeps its own conversation history
function getResourceId(): string {
  const agent = mastra.getAgent('orchestratorAgent');
  const modelConfig = agent.model;

  // e.g. "mistral/codestral-latest" → "mistral"
  const provider = typeof modelConfig === 'string'
    ? modelConfig.split('/')[0]
    : 'default';

  return `oto-chat-${provider}`;
}

// Server component: loads previous messages from Mastra memory before rendering
export default async function Chat() {
  const memory = await mastra.getAgent('orchestratorAgent').getMemory();
  const resourceId = getResourceId();
  let response = null;

  try {
    response = await memory?.recall({
      threadId: THREAD_ID,
      resourceId,
    });
  } catch {
    console.log('No previous messages found.');
  }

  // Convert Mastra messages to AI SDK v5 format for the client
  const initialMessages = toAISdkV5Messages(response?.messages || []);

  return <ChatClient initialMessages={initialMessages} />;
}
