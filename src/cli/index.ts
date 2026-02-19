#!/usr/bin/env node
import { Command } from 'commander';
import { loadConfig } from '../config/loadConfig.js';
import { chatCommand } from './chat.js';
import chalk from 'chalk';

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
    } catch (err: any) {
      console.error(chalk.red(`\n[Fatal] ${err.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
