import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_DSA_API_KEY || process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    // Updated to use a currently supported model
    // Options: llama-3.3-70b-versatile, llama-3.1-70b-versatile, mixtral-8x7b-32768
    const completion = await groq.chat.completions.create({
      model: body.model || "llama-3.3-70b-versatile", // Using the latest Llama model
      messages: body.messages,
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 1024,
    });

    // Return in the format expected by the frontend
    return NextResponse.json({
      choices: [
        {
          message: {
            content: completion.choices[0].message.content,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to get AI response",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}