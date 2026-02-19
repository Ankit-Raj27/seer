import chalk from 'chalk';
export class StreamRenderer {
    currentLine = '';
    renderToken(token) {
        process.stdout.write(token);
        this.currentLine += token;
    }
    renderHeader(role) {
        if (role === 'user') {
            console.log(`\n${chalk.blue.bold('User:')}`);
        }
        else {
            process.stdout.write(`${chalk.green.bold('AI:')} `);
        }
    }
    end() {
        process.stdout.write('\n');
        this.currentLine = '';
    }
}
