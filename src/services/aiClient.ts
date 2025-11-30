const API_URL = "https://note-psi-ashen.vercel.app/api/summarize";
const WRITE_API_URL = "https://note-psi-ashen.vercel.app/api/write"; // New endpoint

export const aiClient = {
  summarize: async (text: string): Promise<string> => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch summary");
      }

      return data.summary || "No summary returned from server.";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "<p>Error connecting to AI service. Please check your internet connection.</p>";
    }
  },

  generateText: async (
    prompt: string,
    type: string,
    tone: string
  ): Promise<string> => {
    try {
      const response = await fetch(WRITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, type, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate text");
      }

      return data.result || "No text generated.";
    } catch (error) {
      console.error("AI Writer Error:", error);
      throw error;
    }
  },
};
