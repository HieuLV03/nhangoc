
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, type } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Thiếu tiêu đề bài viết" },
        { status: 400 }
      );
    }

    // Kiểm tra API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Chưa cấu hình GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Khởi tạo Gemini khi API được gọi
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // =========================
    // DESCRIPTION
    // =========================
    if (type === "description") {
      const prompt = `
Viết mô tả SEO ngắn cho một bài viết có tiêu đề:

"${name}"

Yêu cầu:
- Viết bằng tiếng Việt.
- Khoảng 120-160 ký tự.
- Tự nhiên, dễ đọc.
- Có chứa từ khóa chính liên quan đến tiêu đề.
- Phù hợp với SEO Google.
- Không dùng HTML.
- Không dùng Markdown.
- Không thêm tiêu đề.
- Không thêm lời giải thích.
- Chỉ trả về phần mô tả.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          maxOutputTokens: 300,
          temperature: 0.8,
        },
      });

      const description = response.text?.trim();

      return NextResponse.json({
        description,
      });
    }

    // =========================
    // CONTENT
    // =========================
    if (type === "content") {
      const prompt = `
Bạn là chuyên gia viết bài blog SEO tiếng Việt và HTML semantic.

Hãy viết một bài blog SEO hoàn chỉnh với tiêu đề:

"${name}"

Yêu cầu:

1. Viết bằng tiếng Việt tự nhiên.
2. Nội dung hữu ích, dễ đọc.
3. Không bịa thông tin cụ thể nếu không có cơ sở.
4. Bài viết có cấu trúc rõ ràng.
5. Sử dụng HTML semantic.
6. Chỉ trả về HTML.
7. Không dùng Markdown.
8. Không dùng <html>, <head>, <body>.
9. Không dùng <script>.
10. Không dùng CSS inline.
11. Không bọc HTML trong \`\`\`.
12. Không thêm lời giải thích bên ngoài bài viết.
13. Không viết "Dưới đây là bài viết".
14. Không viết "Hy vọng bài viết".
15. Không nói về quá trình tạo nội dung.

Cấu trúc bài viết nên gồm:

<h2>Tiêu đề phần chính</h2>

<p>Đoạn mở đầu hấp dẫn.</p>

<h3>Tiêu đề phần nhỏ</h3>

<p>Nội dung chi tiết.</p>

<h3>Điểm nổi bật</h3>

<ul>
<li>Điểm nổi bật 1</li>
<li>Điểm nổi bật 2</li>
<li>Điểm nổi bật 3</li>
</ul>

<h3>Thông tin chi tiết</h3>

<p>Nội dung chi tiết.</p>

<strong>Thông tin quan trọng</strong>

<p>Nội dung giải thích.</p>

Có thể sử dụng <ol> hoặc <table> nếu nội dung phù hợp.

Cuối bài bắt buộc có:

<h2>Câu hỏi thường gặp</h2>

<h3>Câu hỏi 1</h3>
<p>Câu trả lời.</p>

<h3>Câu hỏi 2</h3>
<p>Câu trả lời.</p>

<h3>Câu hỏi 3</h3>
<p>Câu trả lời.</p>

Yêu cầu nội dung:
- Khoảng 500-700 từ.
- SEO tự nhiên.
- Không nhồi nhét từ khóa.
- Nội dung có giá trị cho người đọc.
- Có H2 và H3 rõ ràng.
- Có danh sách khi phù hợp.
- Có <strong> để nhấn mạnh thông tin quan trọng.
- Chỉ trả về HTML của bài viết.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          maxOutputTokens: 5000,
          temperature: 0.8,
        },
      });

      let content = response.text?.trim() || "";

      // Nếu Gemini vô tình bọc trong code fence
      content = content
        .replace(/^```html\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      return NextResponse.json({
        content,
      });
    }

    // =========================
    // INVALID TYPE
    // =========================
    return NextResponse.json(
      {
        error: "Type không hợp lệ",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("GEMINI POST ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Không thể tạo nội dung AI",
      },
      {
        status: 500,
      }
    );
  }
}
