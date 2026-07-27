import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import z from "zod";
import {
  CreateChatCompletionBody,
  CreateChatCompletionResponse,
} from "@workspace/api-zod";
import { findModel } from "../data/models";

const router: IRouter = Router();

const ErrorResponse = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

/** Rough token estimator: 1 token ≈ 4 characters */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Build a stub completion reply from the requested model + messages. */
function buildReply(
  modelId: string,
  messages: { role: string; content: string }[],
  temperature: number,
): string {
  const lastUserMsg =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (modelId.includes("code")) {
    return (
      `// QuantumAI Code response (model: ${modelId}, temp: ${temperature})\n` +
      `// Responding to: "${lastUserMsg.slice(0, 80)}"\n\n` +
      `function solution() {\n  // Your implementation here\n  return null;\n}`
    );
  }

  if (modelId.includes("flash")) {
    return `[${modelId}] ${lastUserMsg.slice(0, 60)} — fast response generated.`;
  }

  return (
    `Hello from QuantumAI-Backend (model: ${modelId})!\n\n` +
    `I received your message: "${lastUserMsg.slice(0, 120)}"\n\n` +
    `This is a stub response. Wire up a real LLM provider to generate ` +
    `live completions via the /api/v1/chat/completions endpoint.`
  );
}

router.post("/v1/chat/completions", (req, res) => {
  const parsed = CreateChatCompletionBody.safeParse(req.body);

  if (!parsed.success) {
    const err = ErrorResponse.parse({
      error: {
        code: "invalid_request",
        message: "Request body failed validation.",
        details: parsed.error.flatten(),
      },
    });
    res.status(400).json(err);
    return;
  }

  const { model, messages, temperature = 0.7, maxTokens } = parsed.data;

  const modelRecord = findModel(model);
  if (!modelRecord) {
    const err = ErrorResponse.parse({
      error: {
        code: "model_not_found",
        message: `Model '${model}' is not registered. Call GET /api/v1/models for available models.`,
      },
    });
    res.status(404).json(err);
    return;
  }

  const replyContent = buildReply(model, messages, temperature);
  const promptTokens = messages.reduce(
    (acc, m) => acc + estimateTokens(m.content),
    0,
  );
  const completionTokens = estimateTokens(replyContent);
  const cappedCompletion = maxTokens
    ? Math.min(completionTokens, maxTokens)
    : completionTokens;

  const data = CreateChatCompletionResponse.parse({
    id: `chatcmpl-${randomUUID()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: replyContent },
        finishReason: "stop",
      },
    ],
    usage: {
      promptTokens,
      completionTokens: cappedCompletion,
      totalTokens: promptTokens + cappedCompletion,
    },
  });

  res.json(data);
});

export default router;
