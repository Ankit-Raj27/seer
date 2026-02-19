import { type Message } from '../llm/provider.js';
export declare class Conversation {
    private messages;
    constructor(systemPrompt?: string);
    addMessage(role: 'user' | 'assistant', content: string): void;
    getMessages(): Message[];
    clear(): void;
}
