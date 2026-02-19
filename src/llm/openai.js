"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const provider_1 = require("./provider");
const undici_1 = require("undici");
const eventsource_parser_1 = require("eventsource-parser");
class OpenAIProvider {
    apiKey;
    model;
    baseUrl;
    constructor(apiKey, model, baseUrl = 'https://api.openai.com/v1') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
    }
    async *streamChat(messages) {
        const response = await (0, undici_1.fetch)(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                stream: true,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API Error: ${error}`);
        }
        const reader = response.body?.getReader();
        if (!reader)
            throw new Error('Failed to get response reader');
        const decoder = new TextDecoder();
        let controller;
        const stream = new ReadableStream({
            async start(c) {
                controller = c;
            }
        });
        // Simple stream processing for the generator
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                if (line.includes('[DONE]'))
                    return;
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        const content = data.choices[0]?.delta?.content;
                        if (content)
                            yield content;
                    }
                    catch (e) {
                        // Ignore parse errors for incomplete chunks
                    }
                }
            }
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.js.map