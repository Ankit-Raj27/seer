import { OpenAIProvider } from '../llm/openai.js';
import { Conversation } from '../session/conversation.js';
import { StreamRenderer } from '../ui/streamRenderer.js';
import { type Config } from '../config/loadConfig.js';
import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';

export async function chatCommand(message: string | undefined, config: Config) {
  const provider = new OpenAIProvider(config.apiKey, config.model, config.baseUrl);
  const conversation = new Conversation('You are Seer, a helpful AI CLI agent.');
  const renderer = new StreamRenderer();

  if (message) {
    // Single message mode
    await executeChat(message, provider, conversation, renderer);
  } else {
    // Interactive mode
    await startInteractive(provider, conversation, renderer);
  }
}

async function executeChat(content: string, provider: OpenAIProvider, conversation: Conversation, renderer: StreamRenderer) {
  conversation.addMessage('user', content);
  renderer.renderHeader('assistant');

  const spinner = ora({ text: 'Thinking...', color: 'cyan' }).start();
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
  } catch (err: any) {
    spinner.fail('Error');
    console.error(chalk.red(`\n[System Error] ${err.message}`));
  }
}

async function startInteractive(provider: OpenAIProvider, conversation: Conversation, renderer: StreamRenderer) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.blue.bold('\nUser > '),
  });

  console.log(chalk.cyan('Interactive session started. Type "exit" or press Ctrl+C to quit.'));
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
    console.log(chalk.cyan('\nGoodbye.'));
    process.exit(0);
  });
}
