import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { name } = await req.json();

    const prompt = `
Viết JSON:

{
"description":"",
"content":""
}

Tên sản phẩm:
${name}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("===== RESPONSE =====");
    console.log(response);

    console.log("===== TEXT =====");
    console.log(response.text);

    return NextResponse.json({
      success: true,
      data: response,
      text: response.text,
    });
  } catch (err) {
    console.error("===== ERROR =====");
    console.error(err);

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