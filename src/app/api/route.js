import nodemailer from "nodemailer";

export const runtime = "nodejs";

// 🔥 FIX: tạo transporter trong function để tránh cache lỗi env
const createTransporter = () =>
  nodemailer.createTransport({
    product: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // APP PASSWORD (KHÔNG phải password thường)
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

export async function POST(req) {
  try {
    const body = await req.json();

    // check env
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return Response.json({
        success: false,
        error: "Missing EMAIL env",
      });
    }

    const transporter = createTransporter();

    console.log("📩 Sending email...");
await transporter.sendMail({
  from: `"Website Booking" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "📩 Khách hàng cần tư vấn mới",
  html: `
    <div style="font-family: Arial; line-height: 1.6">
      <h2>📩 Có khách hàng mới đặt lịch</h2>

      <p><b>👤 Họ tên:</b> ${body.name}</p>

      <p><b>📞 Số điện thoại:</b> ${body.phone}</p>

      <p><b>📧 Email:</b> ${
        body.email || "Không có"
      }</p>

      <p><b>🏠 Hình thức:</b> ${
        body.productType
      }</p>

      <p><b>💅 Dịch vụ:</b></p>

      <ul>
        ${body.products
          ?.map((item) => `<li>${item}</li>`)
          .join("")}
      </ul>
    </div>
  `,
});
    console.log("✅ Email sent");

    return Response.json({ success: true });
  } catch (err) {
    console.error("❌ Mail error:", err);

    return Response.json({
      success: false,
      error: err.message,
    });
  }
}