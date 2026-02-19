#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const loadConfig_1 = require("../config/loadConfig");
const chat_1 = require("./chat");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('ai')
    .description('Seer AI CLI Agent Runtime')
    .version('1.0.0');
program
    .command('chat')
    .description('Chat with the LLM')
    .argument('[message]', 'Message to send to the LLM')
    .action(async (message) => {
    try {
        const config = (0, loadConfig_1.loadConfig)();
        await (0, chat_1.chatCommand)(message, config);
    }
    catch (err) {
        console.error(chalk_1.default.red(`\n[Fatal] ${err.message}`));
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map