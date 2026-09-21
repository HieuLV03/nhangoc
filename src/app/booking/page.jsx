"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton/BackButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import "./page.css";

export default function BookingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    products: [],
    productType: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const products = [
    "🧋 Trà sữa",
    "🍓 Trà trái cây",
    "☕ Cà phê",
    "🍟 Đồ ăn vặt",
    "🍽️ Món khác",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      products: checked
        ? [...prev.products, value]
        : prev.products.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    if (form.products.length === 0) {
      setError("Vui lòng chọn ít nhất 1 món.");
      return;
    }

    if (!form.productType) {
      setError("Vui lòng chọn hình thức nhận món.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }

      setSuccess(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        products: [],
        productType: "",
        message: "",
      });
    } catch (err) {
      setError(
        err?.message || "Không thể gửi yêu cầu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bookingPage">
      <BackButton />

      {/* HERO */}
      <ScrollReveal>
        <section className="bookingHero">
          <span className="bookingBadge">🧋 TRÀ SỮA NHÀ NGỌC</span>

          <h1>Đặt món & Liên hệ</h1>

          <p>
            Chọn món yêu thích và gửi thông tin cho Nhà Ngọc.
            Chúng mình sẽ liên hệ để xác nhận đơn hàng của bạn.
          </p>
        </section>
      </ScrollReveal>

      {/* FORM */}
      <ScrollReveal delay={0.1}>
        <section className="bookingContainer">
          <form className="bookingForm" onSubmit={handleSubmit}>
            <div className="formHeader">
              <h2>🛒 Đặt món</h2>

              <p>
                Vui lòng điền thông tin bên dưới để Nhà Ngọc
                tiếp nhận yêu cầu của bạn.
              </p>
            </div>

            {/* HỌ TÊN */}
            <div className="formGroup">
              <label htmlFor="name">
                Họ và tên <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* PHONE */}
            <div className="formGroup">
              <label htmlFor="phone">
                Số điện thoại <span>*</span>
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* EMAIL */}
            <div className="formGroup">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email nếu có"
              />
            </div>

            {/* CHỌN MÓN */}
            <div className="checkboxGroup">
              <p className="checkboxTitle">
                Bạn muốn đặt món gì? <span>*</span>
              </p>

              {products.map((product) => (
                <label key={product}>
                  <input
                    type="checkbox"
                    value={product}
                    checked={form.products.includes(product)}
                    onChange={handleCheckbox}
                  />

                  <span>{product}</span>
                </label>
              ))}
            </div>

            {/* HÌNH THỨC NHẬN */}
            <div className="formGroup">
              <label htmlFor="productType">
                Hình thức nhận món <span>*</span>
              </label>

              <select
                id="productType"
                name="productType"
                value={form.productType}
                onChange={handleChange}
              >
                <option value="">-- Chọn hình thức nhận món --</option>
                <option value="Đến quán nhận">🏪 Đến quán nhận</option>
                <option value="Giao hàng">🛵 Giao hàng</option>
              </select>
            </div>

            {/* GHI CHÚ */}
            <div className="formGroup">
              <label htmlFor="message">Ghi chú đơn hàng</label>

              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                placeholder="Ví dụ: ít đá, ít đường, thêm topping, địa chỉ giao hàng..."
              />
            </div>

            {/* ERROR */}
            {error && <div className="formError">⚠️ {error}</div>}

            {/* BUTTON */}
            <button
              type="submit"
              className="submitButton"
              disabled={loading}
            >
              {loading ? "⏳ Đang gửi..." : "🛒 Gửi yêu cầu đặt món"}
            </button>

            <p className="formNote">
              💗 Nhà Ngọc sẽ liên hệ lại để xác nhận thông tin đơn hàng.
            </p>
          </form>
        </section>
      </ScrollReveal>

      {/* CONTACT INFO */}
      <ScrollReveal delay={0.15}>
        <section className="bookingInfo">
          <div className="infoCard">
            <div className="infoIcon">📍</div>

            <div>
              <h3>Địa chỉ</h3>
              <p>
                16 Ấp Tường Thắng B, xã Phước Long,
                tỉnh Cà Mau (Chợ Trưởng Tòa)
              </p>
            </div>
          </div>

          <div className="infoCard">
            <div className="infoIcon">📞</div>

            <div>
              <h3>Hotline</h3>
              <p>0332 605 121</p>
            </div>
          </div>

          <div className="infoCard">
            <div className="infoIcon">📧</div>

            <div>
              <h3>Email</h3>
              <p>nguyentinhngoc@gmail.com</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SUCCESS */}
      {success && (
        <div
          className="successOverlay"
          onClick={() => setSuccess(false)}
        >
          <div
            className="successPopup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="successIcon">✓</div>

            <h2>Đặt món thành công!</h2>

            <p>
              Nhà Ngọc đã nhận được yêu cầu của bạn.
              Chúng mình sẽ liên hệ lại để xác nhận đơn hàng.
            </p>

            <button onClick={() => setSuccess(false)}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </main>
  );
}