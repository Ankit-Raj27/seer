
import { GoogleGenerativeAI } from '@google/generative-ai';
import { type LLMProvider, type Message } from './provider.js';

export class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, model: string, baseUrl?: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = model;
  }

  async *streamChat(messages: Message[]): AsyncGenerator<string> {
    const systemMessage = messages.find(m => m.role === 'system');
    const chatHistory = messages.filter(m => m.role !== 'system');

    // Extract the last message as the new user input
    const lastMessage = chatHistory[chatHistory.length - 1];
    const history = chatHistory.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemMessage ? systemMessage.content : undefined,
    });

    const chat = model.startChat({
      history,
    });

    if (!lastMessage || lastMessage.role !== 'user') {
      // Fallback if the last message isn't user (shouldn't happen in normal flow)
      // Just yield nothing or error?
      // Let's assume standard usage where executedChat puts user message last.
      throw new Error('Last message must be a user message.');
    }

    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  }
}
