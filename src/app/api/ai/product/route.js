import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { name, type } = await req.json();

    let prompt = "";

    if (type === "description") {
      prompt = `
Viết JSON:

{
  "description":""
}

Tên sản phẩm:
${name}

Chỉ trả về JSON.
`;
    } else {
      prompt = `
Viết JSON:

{
  "content":""
}

Tên sản phẩm:
${name}

Chỉ trả về JSON.
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(text));
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