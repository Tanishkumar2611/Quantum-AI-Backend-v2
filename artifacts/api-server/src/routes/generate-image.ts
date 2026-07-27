import { Router, type IRouter } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerateImageBody } from "@workspace/api-zod";

const router: IRouter = Router();

const apiKey = process.env["GEMINI_API_KEY"];
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required.");
}

const ai = new GoogleGenAI({ apiKey });

router.post("/generate-image", async (req, res) => {
  const parsed = GenerateImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "prompt is required and must be a non-empty string." });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: parsed.data.prompt }] }],
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData?.mimeType?.startsWith("image/"),
    );

    if (!imagePart?.inlineData) {
      res.status(500).json({ error: "Gemini did not return an image." });
      return;
    }

    res.json({
      b64_json: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed.";
    res.status(500).json({ error: message });
  }
});

export default router;
