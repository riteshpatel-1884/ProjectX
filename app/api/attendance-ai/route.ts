import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!, // ✅ SAFE
});

export async function POST(req: Request) {
  const body = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: body.messages,
    temperature: 0.7,
    max_tokens: 800,
  });

  return NextResponse.json({
    content: completion.choices[0].message.content,
  });
}
