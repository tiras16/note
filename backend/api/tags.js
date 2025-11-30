export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server Configuration Error: Missing API Key" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI that categorizes notes. Analyze the text and generate up to 3 relevant, short tags (e.g., Work, Personal, Ideas, Shopping, Meeting, Important). Return ONLY a JSON array of strings (e.g. ["Work", "Ideas"]). No markdown, no extra text.`,
          },
          { role: "user", content: text },
        ],
        max_tokens: 50,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    let content = data.choices?.[0]?.message?.content || "[]";
    // Temizleme (bazen markdown ```json ... ``` içinde gelebilir)
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let tags = [];
    try {
        tags = JSON.parse(content);
    } catch (e) {
        console.error("JSON Parse Error", e);
        tags = ["General"];
    }

    res.status(200).json({ tags });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

