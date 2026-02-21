'use client';

import '@/app/globals.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DefaultChatTransport, ToolUIPart, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';

import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';

import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';

function isPrintableKey(key: string): boolean {
  return (
    key.length === 1 && !['Enter', 'Tab', 'Escape', 'Backspace'].includes(key)
  );
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');
  const editable = el.getAttribute('contenteditable') === 'true';
  return (
    tag === 'input' || tag === 'textarea' || role === 'textbox' || editable
  );
}

export default function ChatClient({
  initialMessages,
}: {
  initialMessages: UIMessage[];
}) {
  return <ChatClientInner initialMessages={initialMessages} />;
}

function ChatClientInner({
  initialMessages,
}: {
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPrintableKey(e.key) || isInputFocused()) return;
      if (e.metaKey || e.ctrlKey) return;
      const textarea = containerRef.current?.querySelector('textarea');
      if (!textarea) return;
      e.preventDefault();
      e.stopPropagation();
      textarea.focus();
      setInput((prev) => prev + e.key);
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput('');
  };

  const handleTranscript = useCallback((text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  return (
    <div ref={containerRef} className='w-full p-6 relative size-full h-screen'>
      <div className='flex flex-col h-full'>
        <Conversation className='h-full'>
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Message
                        key={`${message.id}-${part.type}-${i}`}
                        from={message.role}
                      >
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    );
                  }

                  if (part.type?.startsWith('tool-')) {
                    return (
                      <Tool key={`${message.id}-${part.type}-${i}`}>
                        <ToolHeader
                          type={(part as ToolUIPart).type}
                          state={
                            (part as ToolUIPart).state || 'output-available'
                          }
                          className='cursor-pointer'
                        />
                        <ToolContent>
                          <ToolInput input={(part as ToolUIPart).input || {}} />
                          <ToolOutput
                            output={(part as ToolUIPart).output}
                            errorText={(part as ToolUIPart).errorText}
                          />
                        </ToolContent>
                      </Tool>
                    );
                  }

                  return null;
                })}
              </div>
            ))}
            <ConversationScrollButton />
          </ConversationContent>
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className='mt-20'>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              className='md:leading-10'
              value={input}
              placeholder='Type your message...'
              disabled={status !== 'ready'}
            />
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  );
}
