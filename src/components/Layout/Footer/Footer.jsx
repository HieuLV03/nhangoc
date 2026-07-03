"use client";

import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
<footer className="footer">
  <div className="footerContainer">

    {/* BRAND */}
    <div className="footerBrand">
      <h2>Tiệm nhà Ngọc</h2>
    </div>

    {/* INFO */}
    <div className="footerBox">
      <h3>Thông tin quán</h3>

      <p><strong>🏢 Trụ sở:</strong><br />
        16 Ấp Tường Thắng B, xã Phước Long, tỉnh Cà Mau
      </p>

      <p><strong>📞 Hotline:</strong>0332 605 121 </p>
      <p><strong>📧 Email:</strong> nguyentinhngoc@gmail.com</p>
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
      <div className="social">
        <a href="#">Facebook</a>
        <a href="#">Zalo</a>
      </div>
    </div>

  </div>

  <div className="footerBottom">
    © {new Date().getFullYear()} Tiệm nhà Ngọc. All rights reserved.
  </div>
</footer>
  );
}