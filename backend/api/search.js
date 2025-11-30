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

  const { query, notes } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server Configuration Error: Missing API Key" });
  }

  // Not listesi çok uzunsa token limitini aşabilir, bu yüzden sadece gerekli kısımları alıyoruz.
  // Gerçek bir uygulamada bu işlem Vector Database (Pinecone vb.) ile yapılır ama şimdilik
  // pratik olması için Context Injection yöntemiyle yapıyoruz.
  const simplifiedNotes = notes.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content.replace(/<[^>]+>/g, "").substring(0, 500) // HTML temizle ve kısalt
  }));

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
            content: `You are a semantic search engine for personal notes. 
            The user will provide a search query and a list of notes (JSON).
            Find the notes that are relevant to the query based on meaning, not just keywords.
            Return a JSON object with a "matches" array containing the IDs of the relevant notes.
            Example response: { "matches": ["123", "456"] }
            If no notes match, return { "matches": [] }`,
          },
          { 
            role: "user", 
            content: `Query: "${query}"\n\nNotes Data:\n${JSON.stringify(simplifiedNotes)}` 
          },
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const content = JSON.parse(data.choices[0].message.content);
    res.status(200).json({ matches: content.matches || [] });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

