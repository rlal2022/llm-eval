import Groq from "groq-sdk";

const systemPrompt = `You are a helpful AI assistant.`;

const groq = new Groq({ apiKey: process.env.NEXT_GROQ_API_KEY });

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chatCompletion = await getGroqChatCompletion(prompt);
    return new Response(JSON.stringify(chatCompletion), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to get chat completion",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function getGroqChatCompletion(prompt) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
    return response;
  } catch (error) {
    console.error("Error in getGroqChatCompletion:", error);
    throw error;
  }
}
