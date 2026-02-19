# SEER - AI CLI AGENT RUNTIME

## Foundation Layer (v0.1.0)
Modular CLI runtime for local AI agents.

### Features
- Token-by-token streaming
- Interactive conversation sessions
- Provider Abstraction (OpenAI compatible)
- Local config management (`~/.ai/config.json`)

### Commands
- `ai chat "message"`: Single response
- `ai chat`: Interactive mode

### Tech Stack
- TypeScript / Node.js
- Commander.js (CLI)
- Chalk (Colors)
- Ora (Spinners)
- Zod (Validation)
