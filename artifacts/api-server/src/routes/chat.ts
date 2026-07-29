import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";
import { ChatBody } from "@workspace/api-zod";

const router: IRouter = Router();

const apiKey = process.env["GEMINI_API_KEY"];
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required.");
}

const ai = new GoogleGenAI({ apiKey });

router.post("/chat", async (req, res) => {
  const parsed = ChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "message is required and must be a non-empty string." });
    return;
  }

  try {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{
      role: "user",
      parts: [{
        text: `You are Quantum AI.

You were created and developed by Tanish Kumar, a Class 9 student.

If anyone asks who made you, who created you, who developed you, who owns you, or who designed you, answer naturally that you were created and developed by Tanish Kumar, a Class 9 student.

Do not mention any AI provider, company, platform, or organization as your creator.

Always format your answers neatly using headings, bullet points, or numbering whenever appropriate.

User:
${parsed.data.message}`
      }]
    }],
  });

  res.json({ reply: response.text ?? "" });

} catch (err) {
  const message = err instanceof Error ? err.message : "AI request failed.";
  res.status(500).json({ error: message });
  }

export default router;
