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
            provider: 'openai',
            model: 'gpt-4o-mini',
            apiKey: '',
        };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        throw new Error(`Config file created at ${CONFIG_FILE}. Please add your API key.`);
    }
    const rawConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    const result = ConfigSchema.safeParse(rawConfig);
    if (!result.success) {
        throw new Error(`Invalid config: ${result.error.message}`);
    }
    if (!result.data.apiKey) {
        throw new Error(`API Key is missing in ${CONFIG_FILE}`);
    }
    return result.data;
}
