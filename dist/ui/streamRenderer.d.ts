export declare class StreamRenderer {
    private currentLine;
    renderToken(token: string): void;
    renderHeader(role: 'user' | 'assistant'): void;
    end(): void;
}
