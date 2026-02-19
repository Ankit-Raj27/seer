"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const provider_1 = require("../llm/provider");
class Conversation {
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
exports.Conversation = Conversation;
//# sourceMappingURL=conversation.js.map