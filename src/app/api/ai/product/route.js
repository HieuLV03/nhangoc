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

Yêu cầu:
- Viết mô tả ngắn 100 từ.
- Tập trung vào lợi ích sản phẩm.
- Văn phong bán hàng.
- Không dùng markdown.
- Chỉ trả về JSON.
`;
    } else {
      prompt = `
Bạn là chuyên gia viết nội dung marketing và SEO cho sản phẩm.

Hãy viết một bài mô tả sản phẩm chi tiết bằng tiếng Việt.

Chỉ trả về JSON đúng format:

{
  "content": ""
}

Yêu cầu:
- Độ dài 300 từ.
- Có mở đầu thu hút.
- Giới thiệu sản phẩm.
- Công dụng và lợi ích.
- Điểm nổi bật.
- Hướng dẫn sử dụng.
- Đối tượng phù hợp.
- Kêu gọi mua hàng.
- SEO tự nhiên.
- Không dùng markdown.
- Không thêm ký tự ngoài JSON.

Tên sản phẩm:
${name}
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        maxOutputTokens: 3000,
        temperature: 0.8,
      },
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