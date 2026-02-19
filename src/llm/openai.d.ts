import { LLMProvider, Message } from './provider';
export declare class OpenAIProvider implements LLMProvider {
    private apiKey;
    private model;
    private baseUrl;
    constructor(apiKey: string, model: string, baseUrl?: string);
    streamChat(messages: Message[]): AsyncGenerator<string>;
}
//# sourceMappingURL=openai.d.ts.map