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
      contents: [{ role: "user", parts: [{ text: parsed.data.message }] }],
    });

    res.json({ reply: response.text ?? "" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed.";
    res.status(500).json({ error: message });
  }
});

export default router;
