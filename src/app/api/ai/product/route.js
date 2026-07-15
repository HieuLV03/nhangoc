import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
const { name, type } = await req.json();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const prompt = `
Viết JSON.

{
"description":"..."
}

Tên sản phẩm:
${name}

Chỉ trả về JSON.
`;

    const { name } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Tên sản phẩm: ${name}`,
    });

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message,
        stack: String(err),
      },
      {
        status: 500,
      }
    );
  }
}