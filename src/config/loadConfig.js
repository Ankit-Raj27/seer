"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchema = void 0;
exports.loadConfig = loadConfig;
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
exports.ConfigSchema = zod_1.z.object({
    provider: zod_1.z.enum(['openai', 'anthropic', 'gemini']),
    model: zod_1.z.string(),
    apiKey: zod_1.z.string(),
    baseUrl: zod_1.z.string().optional(),
});
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.ai');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
function loadConfig() {
    if (!fs_1.default.existsSync(CONFIG_DIR)) {
        fs_1.default.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    if (!fs_1.default.existsSync(CONFIG_FILE)) {
        const defaultConfig = {
            provider: 'openai',
            model: 'gpt-4o-mini',
            apiKey: '',
        };
        fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        throw new Error(`Config file created at ${CONFIG_FILE}. Please add your API key.`);
    }
    const rawConfig = JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf-8'));
    const result = exports.ConfigSchema.safeParse(rawConfig);
    if (!result.success) {
        throw new Error(`Invalid config: ${result.error.message}`);
    }
    if (!result.data.apiKey) {
        throw new Error(`API Key is missing in ${CONFIG_FILE}`);
    }
    return result.data;
}
//# sourceMappingURL=loadConfig.js.map