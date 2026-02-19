import { Message } from '../llm/provider';
export declare class Conversation {
    private messages;
    constructor(systemPrompt?: string);
    addMessage(role: 'user' | 'assistant', content: string): void;
    getMessages(): Message[];
    clear(): void;
}
//# sourceMappingURL=conversation.d.ts.map