import Groq from "groq-sdk";

const systemPrompt = `You are a helpful AI assistant.`;

const groq = new Groq({ apiKey: process.env.NEXT_GROQ_API_KEY });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();

  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  let userPrompt = "";
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
