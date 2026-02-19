export class Conversation {
    messages = [];
    constructor(systemPrompt) {
        if (systemPrompt) {
            this.messages.push({ role: 'system', content: systemPrompt });
        }
    }
    addMessage(role, content) {
        this.messages.push({ role, content });
    }
    getMessages() {
        return this.messages;
    }
    clear() {
        this.messages = this.messages.filter(m => m.role === 'system');
    }
}
