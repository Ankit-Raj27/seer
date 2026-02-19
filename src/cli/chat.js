"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatCommand = chatCommand;
const openai_1 = require("../llm/openai");
const conversation_1 = require("../session/conversation");
const streamRenderer_1 = require("../ui/streamRenderer");
const loadConfig_1 = require("../config/loadConfig");
const readline_1 = __importDefault(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function chatCommand(message, config) {
    const provider = new openai_1.OpenAIProvider(config.apiKey, config.model, config.baseUrl);
    const conversation = new conversation_1.Conversation('You are Seer, a helpful AI CLI agent.');
    const renderer = new streamRenderer_1.StreamRenderer();
    if (message) {
        // Single message mode
        await executeChat(message, provider, conversation, renderer);
    }
    else {
        // Interactive mode
        await startInteractive(provider, conversation, renderer);
    }
}
async function executeChat(content, provider, conversation, renderer) {
    conversation.addMessage('user', content);
    renderer.renderHeader('assistant');
    const spinner = (0, ora_1.default)({ text: 'Thinking...', color: 'cyan' }).start();
    let fullResponse = '';
    try {
        const stream = provider.streamChat(conversation.getMessages());
        spinner.stop();
        for await (const token of stream) {
            renderer.renderToken(token);
            fullResponse += token;
        }
        renderer.end();
        conversation.addMessage('assistant', fullResponse);
    }
    catch (err) {
        spinner.fail('Error');
        console.error(chalk_1.default.red(`\n[System Error] ${err.message}`));
    }
}
async function startInteractive(provider, conversation, renderer) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk_1.default.blue.bold('\nUser > '),
    });
    console.log(chalk_1.default.cyan('Interactive session started. Type "exit" or press Ctrl+C to quit.'));
    rl.prompt();
    rl.on('line', async (line) => {
        const input = line.trim();
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            rl.close();
            return;
        }
        if (input) {
            await executeChat(input, provider, conversation, renderer);
        }
        rl.prompt();
    });
    rl.on('close', () => {
        console.log(chalk_1.default.cyan('\nGoodbye.'));
        process.exit(0);
    });
}
//# sourceMappingURL=chat.js.map