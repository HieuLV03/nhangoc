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
- Viết mô tả ngắn 24 từ.
- Tập trung vào lợi ích sản phẩm.
- Văn phong bán hàng.
- Không dùng markdown.
- Chỉ trả về JSON.
`;
    } else {
     prompt = `
Bạn là chuyên gia viết nội dung marketing, SEO và thiết kế HTML cho trang sản phẩm.

Hãy tạo nội dung sản phẩm bằng HTML thuần.

Chỉ trả về JSON đúng format:

{
  "content": ""
}

Yêu cầu HTML:
- Chỉ trả về HTML bên trong content.
- Không dùng markdown.
- Văn phong bán hàng.
- Không bọc trong \`\`\`html.
- HTML phải sạch, có thể render trực tiếp trên website.

Cấu trúc bắt buộc:

<h2>Tiêu đề giới thiệu sản phẩm</h2>

<p>Đoạn mô tả mở đầu hấp dẫn.</p>

<h3>Điểm nổi bật</h3>

<ul>
<li>Lợi ích 1</li>
<li>Lợi ích 2</li>
<li>Lợi ích 3</li>
</ul>

<h3>Công dụng sản phẩm</h3>

<p>Nội dung chi tiết...</p>


<h3>Ai nên sử dụng?</h3>

<p>Nội dung...</p>

<div class="product-highlight">
<strong>Lý do nên chọn sản phẩm</strong>
<p>Nội dung nổi bật.</p>
</div>

<p class="call-to-action">
Kêu gọi mua hàng.
</p>


Yêu cầu nội dung:
- Khoảng 510 từ.
- SEO tự nhiên.
- Văn phong bán hàng cao cấp.
- Không nhồi nhét từ khóa.
- Có tiêu đề H2,H3 rõ ràng.
- Có danh sách ul/ol.
- Có đoạn nhấn mạnh bằng strong.
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