import { z } from 'zod';
export declare const ConfigSchema: z.ZodObject<{
    provider: z.ZodEnum<["openai", "anthropic", "gemini"]>;
    model: z.ZodString;
    apiKey: z.ZodString;
    baseUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model: string;
    provider: "openai" | "anthropic" | "gemini";
    apiKey: string;
    baseUrl?: string | undefined;
}, {
    model: string;
    provider: "openai" | "anthropic" | "gemini";
    apiKey: string;
    baseUrl?: string | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare function loadConfig(): Config;
