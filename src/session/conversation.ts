import { type Message } from '../llm/provider.js';

export class Conversation {
  private messages: Message[] = [];

  constructor(systemPrompt?: string) {
    if (systemPrompt) {
      this.messages.push({ role: 'system', content: systemPrompt });
    }
  }

  addMessage(role: 'user' | 'assistant', content: string) {
    this.messages.push({ role, content });
  }

  getMessages(): Message[] {
    return this.messages;
  }

  clear() {
    this.messages = this.messages.filter(m => m.role === 'system');
  }
}
