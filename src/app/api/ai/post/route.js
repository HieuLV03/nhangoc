import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const { type, name } = body;

    if (!name?.trim()) {
      return Response.json(
        { error: "Thiếu tiêu đề bài viết" },
        { status: 400 }
      );
    }
    // =========================
    // DESCRIPTION
    // =========================
    if (type === "description") {
      const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia viết nội dung SEO tiếng Việt.",
          },
          {
            role: "user",
            content: `
Viết mô tả SEO ngắn cho bài viết có tiêu đề:

"${name}"

Yêu cầu:
- Viết bằng tiếng Việt.
- Khoảng 120-160 ký tự.
- Tự nhiên, dễ đọc.
- Có chứa từ khóa chính liên quan đến tiêu đề.
- Không dùng HTML.
- Không thêm tiêu đề hoặc giải thích.
- Chỉ trả về phần mô tả.
            `,
          },
        ],
      });

      const description = response.output_text?.trim();

      return Response.json({
        description,
      });
    }

    // =========================
    // CONTENT
    // =========================
    if (type === "content") {
      const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia viết bài blog SEO tiếng Việt và HTML semantic.",
          },
          {
            role: "user",
            content: `
Viết một bài blog SEO hoàn chỉnh với tiêu đề:

"${name}"

Yêu cầu:

1. Viết bằng tiếng Việt tự nhiên.
2. Nội dung hữu ích, dễ đọc.
3. Không bịa thông tin cụ thể nếu không có cơ sở.
4. Bài viết có cấu trúc rõ ràng.
5. Sử dụng HTML semantic.
6. Chỉ trả về HTML, không markdown.
7. Không dùng <html>, <head>, <body>.
8. Không dùng <script>.
9. Không dùng CSS inline.
10. Không dùng Markdown.
- Không bọc trong \`\`\`html.

Cấu trúc nên có:

<h2> cho các phần chính.

<h3> cho các phần nhỏ khi cần.

<p> cho đoạn văn.

<ul> hoặc <ol> khi cần liệt kê.

<strong> để nhấn mạnh những thông tin quan trọng.

Có thể sử dụng <table> nếu nội dung phù hợp.

Cuối bài có một phần FAQ sử dụng:

<h2>Câu hỏi thường gặp</h2>

Sau đó sử dụng <h3> cho từng câu hỏi và <p> cho câu trả lời.

Không được viết:
- "Dưới đây là bài viết..."
- "Hy vọng bài viết..."
- Lời giải thích về quá trình tạo bài.
- Markdown.
- Code fence.

Chỉ trả về HTML của bài viết.
            `,
          },
        ],
      });

      const content = response.output_text?.trim();

      return Response.json({
        content,
      });
    }

    // =========================
    // INVALID TYPE
    // =========================
    return Response.json(
      {
        error: "Type không hợp lệ",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("AI POST ERROR:", error);

    return Response.json(
      {
        error: error?.message || "Không thể tạo nội dung AI",
      },
      {
        status: 500,
      }
    );
  }
}
