#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { loadConfig } from '../config/loadConfig.js';
import { chatCommand } from './chat.js';
import chalk from 'chalk';
// Load environment variables from .env and .env.local
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath }); // dotenv v16+ supports override: true, but v4 might not. Let's stick to simple config for now or assume newer overrides if installed.
    // Actually, let's just use it.
}
const program = new Command();
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
        const config = loadConfig();
        await chatCommand(message, config);
    }
    catch (err) {
        console.error(chalk.red(`\n[Fatal] ${err.message}`));
        process.exit(1);
    }
});
program.parse(process.argv);
