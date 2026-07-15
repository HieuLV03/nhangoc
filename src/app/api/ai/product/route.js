import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Thiếu tên sản phẩm" },
        { status: 400 }
      );
    }

    const prompt = `
Bạn là chuyên gia viết nội dung SEO bằng tiếng Việt.

Tên sản phẩm:
${name}

Hãy trả về DUY NHẤT JSON theo đúng định dạng:

{
  "description": "...",
  "content": "<h2>Giới thiệu sản phẩm</h2><p>...</p>"
}

Yêu cầu:
- Không markdown.
- Không dùng \`\`\`.
- Chỉ trả về JSON.
- description dài khoảng 40-80 từ.
- content là HTML đầy đủ với các mục:
  - Giới thiệu sản phẩm
  - Ưu điểm nổi bật
  - Đối tượng sử dụng
  - Hướng dẫn sử dụng
  - Lưu ý
  - Kết luận
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    let text = response.text || "";

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(text);

    return NextResponse.json(json);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}