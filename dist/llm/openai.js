import { fetch } from 'undici';
export class OpenAIProvider {
    apiKey;
    model;
    baseUrl;
    constructor(apiKey, model, baseUrl = 'https://api.openai.com/v1') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
    }
    async *streamChat(messages) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
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
            throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
        }
        const body = response.body;
        if (!body)
            throw new Error('Failed to get response body');
        const reader = body.getReader();
        const decoder = new TextDecoder();
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
