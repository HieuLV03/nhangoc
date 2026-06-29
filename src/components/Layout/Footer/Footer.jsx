"use client";

import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
<footer className="footer">
  <div className="footerContainer">

    {/* BRAND */}
    <div className="footerBrand">
      <h2>MIREC</h2>
      <p>
        Trung tâm kiểm định bản đồ & tư vấn tài nguyên - môi trường.
      </p>
    </div>

    {/* INFO */}
    <div className="footerBox">
      <h3>Thông tin công ty</h3>

      <p><strong>🏢 Trụ sở:</strong><br />
        Số 18 Alexander De Rhodes, TP.HCM
      </p>

      <p><strong>🏥 Cơ sở:</strong><br />
        286 Quách Điêu, TP.HCM
      </p>

      <p><strong>📞 Hotline:</strong> (028) 73 034 268</p>
      <p><strong>📧 Email:</strong> info@mirec.vn</p>
    </div>

    {/* LINKS */}
    <div className="footerBox">
      <h3>Liên kết</h3>

      <Link href="/">Trang chủ</Link>
      <Link href="/services">Dịch vụ</Link>
      <Link href="/posts">Bài viết</Link>
      <Link href="/booking">Đặt lịch</Link>
    </div>

    {/* SOCIAL */}
    <div className="footerBox">
      <h3>Kết nối</h3>

      <p>💬 Hỗ trợ 24/7</p>

      <div className="social">
        <a href="#">Facebook</a>
        <a href="#">Zalo</a>
      </div>
    </div>

  </div>

  <div className="footerBottom">
    © {new Date().getFullYear()} MIREC. All rights reserved.
  </div>
</footer>
  );
}