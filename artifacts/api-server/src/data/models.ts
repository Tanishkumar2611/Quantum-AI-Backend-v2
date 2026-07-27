export interface ModelRecord {
  id: string;
  name: string;
  description: string;
  provider: string;
  contextWindow: number;
  maxOutputTokens: number;
  capabilities: string[];
  createdAt: string;
}

export const MODEL_REGISTRY: ModelRecord[] = [
  {
    id: "quantum-ultra-v1",
    name: "Quantum Ultra v1",
    description:
      "Flagship reasoning model with extended context and advanced multi-step problem-solving capabilities.",
    provider: "QuantumAI",
    contextWindow: 128000,
    maxOutputTokens: 32768,
    capabilities: ["reasoning", "code", "math", "vision", "chat"],
    createdAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "quantum-core-v2",
    name: "Quantum Core v2",
    description:
      "Balanced general-purpose model optimised for fast inference and high-quality conversational responses.",
    provider: "QuantumAI",
    contextWindow: 64000,
    maxOutputTokens: 16384,
    capabilities: ["chat", "code", "summarisation", "translation"],
    createdAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "quantum-flash-v1",
    name: "Quantum Flash v1",
    description:
      "Ultra-low-latency model designed for real-time applications and high-throughput workloads.",
    provider: "QuantumAI",
    contextWindow: 32000,
    maxOutputTokens: 8192,
    capabilities: ["chat", "summarisation", "classification"],
    createdAt: "2025-05-10T00:00:00.000Z",
  },
  {
    id: "quantum-code-v1",
    name: "Quantum Code v1",
    description:
      "Specialist code model fine-tuned on 500 B+ tokens of open-source code across 40+ languages.",
    provider: "QuantumAI",
    contextWindow: 96000,
    maxOutputTokens: 32768,
    capabilities: ["code", "debugging", "explanation", "refactoring"],
    createdAt: "2025-04-20T00:00:00.000Z",
  },
];

export function findModel(id: string): ModelRecord | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id);
}
