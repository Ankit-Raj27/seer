"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamRenderer = void 0;
const chalk_1 = __importDefault(require("chalk"));
class StreamRenderer {
    currentLine = '';
    renderToken(token) {
        process.stdout.write(token);
        this.currentLine += token;
    }
    renderHeader(role) {
        if (role === 'user') {
            console.log(`\n${chalk_1.default.blue.bold('User:')}`);
        }
        else {
            process.stdout.write(`${chalk_1.default.green.bold('AI:')} `);
        }
    }
    end() {
        process.stdout.write('\n');
        this.currentLine = '';
    }
}
exports.StreamRenderer = StreamRenderer;
//# sourceMappingURL=streamRenderer.js.map