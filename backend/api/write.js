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

  const { prompt, type, tone } = req.body;
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
            content: `You are a helpful professional AI writer. Write a ${tone} ${type} based on the user's request. Return the result in HTML format (using <p>, <br> tags for structure). Do not include any intro like "Here is your email:", just the content.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const result =
      data.choices?.[0]?.message?.content || "No text generated.";
    res.status(200).json({ result });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

