import { z } from 'zod';
export declare const ConfigSchema: z.ZodObject<{
    provider: z.ZodEnum<{
        openai: "openai";
        anthropic: "anthropic";
        gemini: "gemini";
    }>;
    model: z.ZodString;
    apiKey: z.ZodString;
    baseUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type Config = z.infer<typeof ConfigSchema>;
export declare function loadConfig(): Config;
