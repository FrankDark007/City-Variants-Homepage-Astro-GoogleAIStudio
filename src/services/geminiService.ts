import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static ai: any = null;

  private static getAI() {
    // Create a new instance right before use to get the latest API key
    return new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
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

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image part found in response");
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  }
}
