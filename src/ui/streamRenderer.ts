import chalk from 'chalk';

export class StreamRenderer {
  private currentLine = '';

  renderToken(token: string) {
    process.stdout.write(token);
    this.currentLine += token;
  }

  renderHeader(role: 'user' | 'assistant') {
    if (role === 'user') {
      console.log(`\n${chalk.blue.bold('User:')}`);
    } else {
      process.stdout.write(`${chalk.green.bold('AI:')} `);
    }
  }

  end() {
    process.stdout.write('\n');
    this.currentLine = '';
  }
}
