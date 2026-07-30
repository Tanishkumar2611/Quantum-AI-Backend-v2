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
    res.status(400).json({
      error: "Message is required."
    });
    return;
  }
const question = parsed.data.message.toLowerCase();

if (
  question.includes("who created you") ||
  question.includes("who made you") ||
  question.includes("who developed you") ||
  question.includes("who is your developer") ||
  question.includes("who is your creator") ||
  question.includes("who owns you")
) {
  res.json({
    reply: `I am Quantum AI.

I am an AI application developed by Tanish Kumar, a Class 9 student.

How can I help you today?`
  });
  return;
}


  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",

      config: {
        systemInstruction: `
You are Quantum AI.

Quantum AI is an AI application developed by Tanish Kumar, a Class 9 student.

When someone asks questions like:
- Who developed Quantum AI?
- Who made Quantum AI?
- Who created this application?
- Who owns Quantum AI?
- Who designed Quantum AI?

Answer naturally that:

"I was developed and created by Tanish Kumar, a Student of Class 9."

When answering normal questions:
- Be friendly.
- Give accurate information.
- Use headings whenever suitable.
- Use numbered lists when explaining steps.
- Use bullet points whenever appropriate.
- Create neat Markdown tables whenever comparisons are requested.
- Keep answers easy to understand.
`
      },

      contents: [
        {
          role: "user",
          parts: [
            {
              text: parsed.data.message
            }
          ]
        }
      ]
    });

    res.json({
      reply: response.text ?? ""
    });

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Request failed.";

    res.status(500).json({
      error: message
    });

  }
});

export default router;
