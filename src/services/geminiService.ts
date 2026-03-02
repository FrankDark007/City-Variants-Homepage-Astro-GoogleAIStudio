import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static ai: any = null;

  private static getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey });
  }

  static async generateImage(prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "1:4" | "1:8" | "4:1" | "8:1" = "3:4") {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: `Editorial high-end lifestyle photography of ${prompt}. Professional restoration service, moody lighting, warm tones, cinematic quality, high resolution, 4k, realistic textures.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: "1K"
          },
        },
      });

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("NO_IMAGE_PART");
    } catch (error: any) {
      console.error("Image generation failed:", error);
      // Check for permission or not found errors to trigger key re-selection
      const errorMsg = error?.message || "";
      if (errorMsg.includes("403") || errorMsg.includes("404") || errorMsg.includes("permission") || errorMsg.includes("not found")) {
        throw new Error("AUTH_ERROR");
      }
      throw error;
    }
  }
}
