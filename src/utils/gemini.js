import { GoogleGenerativeAI } from "@google/generative-ai";


export const runGemini = async (prompt) => {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  console.log("--- Gemini Utility Running ---");
  console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

  try {
    // NOTE: Ensure this is 'gemini-1.5-flash', NOT '2.5'
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log("Gemini API Success: Received text length", text.length);
    return text;
  } catch (error) {
    console.error("Gemini SDK Error:", error.message);
    throw error; // Re-throw so the router catches it
  }
};


