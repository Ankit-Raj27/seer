export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMProvider {
    streamChat(messages: Message[]): AsyncGenerator<string>;
}
//# sourceMappingURL=provider.d.ts.map