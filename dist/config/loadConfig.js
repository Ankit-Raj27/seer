import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import os from 'os';
export const ConfigSchema = z.object({
    provider: z.enum(['openai', 'anthropic', 'gemini']),
    model: z.string(),
    apiKey: z.string(),
    baseUrl: z.string().optional(),
});
const CONFIG_DIR = path.join(os.homedir(), '.ai');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
export function loadConfig() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    if (!fs.existsSync(CONFIG_FILE)) {
        const defaultConfig = {
            provider: 'gemini',
            model: 'gemini-2.5-flash',
            apiKey: 'AIzaSyCw-LOaPkKMSb8qRbAe5JClMyKAnlmLrPE',
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        throw new Error(`Config file created at ${CONFIG_FILE}. Please add your API key.`);
    }
    const rawConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    // Allow environment variables to override or fill in API keys
    if (!rawConfig.apiKey) {
        if (rawConfig.provider === 'gemini') {
            rawConfig.apiKey = process.env.GEMINI_API_KEY;
        }
        else if (rawConfig.provider === 'openai') {
            rawConfig.apiKey = process.env.OPENAI_API_KEY;
        }
        else if (rawConfig.provider === 'anthropic') {
            rawConfig.apiKey = process.env.ANTHROPIC_API_KEY;
        }
    }
    const result = ConfigSchema.safeParse(rawConfig);
    if (!result.success) {
        throw new Error(`Invalid config: ${result.error.message}`);
    }
    if (!result.data.apiKey) {
        throw new Error(`API Key is missing in ${CONFIG_FILE}`);
    }
    return result.data;
}
