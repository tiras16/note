// This URL will point to your backend server (e.g., Firebase Function, Vercel, AWS Lambda)
// Example: "https://us-central1-your-project.cloudfunctions.net/summarizeNote"
const API_URL = "";

export const aiClient = {
  summarize: async (text: string): Promise<string> => {
    // Fallback to mock if no API URL is configured (Development Mode)
    if (!API_URL) {
      console.warn("API_URL is not set. Using mock response.");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            "<h3>Mock AI Summary</h3><p>This is a placeholder summary because the backend URL is not configured yet.</p><p><b>To go live:</b> Deploy your backend server and update the <code>API_URL</code> in <code>src/services/aiClient.ts</code>.</p><p>Original text start: " +
              text.substring(0, 50) +
              "...</p>"
          );
        }, 1500);
      });
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers here if needed (e.g. user token)
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch summary");
      }

      // Expecting backend to return { summary: "html string..." }
      return data.summary || "No summary returned from server.";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "<p>Error connecting to AI service. Please check your internet connection.</p>";
    }
  },
};
