// Ported from Gemini to NVIDIA NIM (Llama 3.3 70B Instruct)

const LLAMA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL_ID = "meta/llama-3.3-70b-instruct";

export const runGemini = async (prompt) => {
  // Read at call time — not at import time — so dotenv has already loaded by now
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  console.log("--- NVIDIA Llama 3.3 70B Call Initiated ---");
  console.log("API Key exists:", !!NVIDIA_API_KEY);

  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY not configured");
  }

  // The legacy callers pass a single combined prompt string.
  // Treat everything before "User question:" as the system instruction.
  const splitIdx = prompt.indexOf("User question:");
  const systemInstruction =
    splitIdx !== -1 ? prompt.slice(0, splitIdx).trim() : "You are a helpful business AI assistant.";
  const userPrompt =
    splitIdx !== -1 ? prompt.slice(splitIdx + "User question:".length).trim() : prompt.trim();

  const payload = {
    model: MODEL_ID,
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
    top_p: 0.7,
    max_tokens: 1024,
    stream: false,
  };

  try {
    const response = await fetch(LLAMA_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA API error ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    const text = json.choices[0].message.content;

    console.log("NVIDIA Llama Success: Received text length", text.length);
    return text;
  } catch (error) {
    console.error("NVIDIA Llama Error:", error.message);
    throw error;
  }
};
