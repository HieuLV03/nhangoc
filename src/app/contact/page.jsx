"use client";

import { useState } from "react";
import "./page.css";
import BackButton from "@/components/BackButton/BackButton";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    products: [],
    productType: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setForm({
        ...form,
        products: [...form.products, value],
      });
    } else {
      setForm({
        ...form,
        products: form.products.filter((item) => item !== value),
      });
    }
  };

  const showError = (msg) => {
    setErrorPopup(msg);

    setTimeout(() => {
      setErrorPopup("");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.products.length === 0) {
      showError("Vui lòng chọn ít nhất 1 món.");
      return;
    }

    if (!form.productType) {
      showError("Vui lòng chọn hình thức nhận món.");
      return;
    }

    setLoading(true);

    const formData = { ...form };

    // Reset form
    setForm({
      name: "",
      phone: "",
      email: "",
      products: [],
      productType: "",
      message: "",
    });

    // Hiện popup thành công
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2500);

    // Gửi API
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).catch(() => {
      showError("Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.");
    });

    setLoading(false);
  };

  return (
    <div className="contact">
      <BackButton />

      {/* ERROR POPUP */}
      {errorPopup && (
        <div className="successOverlay">
          <div className="successPopup errorPopup">
            <div className="successIcon">⚠️</div>

            <h2>Nhà Ngọc thông báo</h2>

            <p>{errorPopup}</p>

            <button onClick={() => setErrorPopup("")}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="successOverlay">
          <div className="successPopup">
            <div className="successIcon">🎉</div>

            <h2>Đã nhận yêu cầu!</h2>

            <p>
              Cảm ơn bạn đã đặt món tại Nhà Ngọc.
              <br />
              Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>

            <button onClick={() => setShowPopup(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="contact-hero">
        <span className="contact-badge">
          🧋 TRÀ SỮA NHÀ NGỌC
        </span>

        <h1>Đặt món & Liên hệ</h1>

        <p>
          Chọn món bạn yêu thích và để lại thông tin.
          Nhà Ngọc sẽ liên hệ để xác nhận đơn hàng
          nhanh chóng.
        </p>
      </section>

      {/* CONTENT */}
      <div className="contact-wrapper">

        {/* FORM */}
        <div className="contact-form">

          <div className="form-heading">
            <h2>Đặt món ngay</h2>

            <p>
              Vui lòng điền thông tin bên dưới để
              Nhà Ngọc có thể xác nhận đơn hàng.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="booking-form"
          >

            {/* NAME */}
            <div className="inputGroup">
              <label>Họ và tên</label>

              <input
                name="name"
                placeholder="Nhập họ và tên"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE */}
            <div className="inputGroup">
              <label>Số điện thoại</label>

              <input
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="inputGroup">
              <label>Email</label>

              <input
                name="email"
                type="email"
                placeholder="Email (không bắt buộc)"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* DELIVERY */}
            <div className="inputGroup">
              <label>Hình thức nhận món</label>

              <select
                name="productType"
                value={form.productType}
                onChange={handleChange}
                required
              >
                <option value="">
                  -- Chọn hình thức --
                </option>

                <option value="Đến quán nhận">
                  🏠 Đến quán nhận
                </option>

                <option value="Giao hàng">
                  🛵 Giao hàng
                </option>
              </select>
            </div>

            {/* PRODUCTS */}
            <div className="checkboxGroup">

              <p className="checkboxTitle">
                Chọn món
              </p>

              <label>
                <input
                  type="checkbox"
                  value="Trà sữa"
                  checked={form.products.includes("Trà sữa")}
                  onChange={handleCheckbox}
                />

                <span>🧋 Trà sữa</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Trà trái cây"
                  checked={form.products.includes("Trà trái cây")}
                  onChange={handleCheckbox}
                />

                <span>🍓 Trà trái cây</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Cà phê"
                  checked={form.products.includes("Cà phê")}
                  onChange={handleCheckbox}
                />

                <span>☕ Cà phê</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Đồ ăn vặt"
                  checked={form.products.includes("Đồ ăn vặt")}
                  onChange={handleCheckbox}
                />

                <span>🍟 Đồ ăn vặt</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Món khác"
                  checked={form.products.includes("Món khác")}
                  onChange={handleCheckbox}
                />

                <span>🍽️ Món khác</span>
              </label>

            </div>

            {/* MESSAGE */}
            <div className="inputGroup">

              <label>Ghi chú đơn hàng</label>

              <textarea
                name="message"
                placeholder="Ví dụ: ít đá, ít đường, thêm topping, địa chỉ giao hàng..."
                value={form.message}
                onChange={handleChange}
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Đang gửi..."
                : "🛒 Gửi yêu cầu đặt món"}
            </button>

          </form>
        </div>

        {/* CONTACT INFO */}
        <div className="contact-info">

          <div className="info-heading">

            <span className="info-icon">
              🧋
            </span>

            <div>
              <h2>Trà sữa Nhà Ngọc</h2>

              <p>
                Liên hệ với chúng tôi để đặt món
                hoặc được hỗ trợ nhanh chóng.
              </p>
            </div>

          </div>

          <div className="infoList">

            {/* ADDRESS */}
            <div className="infoItem">

              <div className="infoItemIcon">
                🏢
              </div>

              <div>

                <span>Địa chỉ</span>

                <strong>
                  16 Ấp Tường Thắng B,
                  xã Phước Long,
                  tỉnh Cà Mau
                  <br />
                  (Chợ Trưởng Tòa)
                </strong>

              </div>

            </div>

            {/* PHONE */}
            <div className="infoItem">

              <div className="infoItemIcon">
                📞
              </div>

              <div>

                <span>Hotline</span>

                <a href="tel:0332605121">
                  0332 605 121
                </a>

              </div>

            </div>

            {/* EMAIL */}
            <div className="infoItem">

              <div className="infoItemIcon">
                📧
              </div>

              <div>

                <span>Email</span>

                <a href="mailto:nguyentinhngoc@gmail.com">
                  nguyentinhngoc@gmail.com
                </a>

              </div>

            </div>

          </div>

          {/* NOTE */}
          <div className="contact-note">

            <strong>
              🧋 Nhà Ngọc luôn sẵn sàng phục vụ!
            </strong>

            <p>
              Bạn muốn đặt món, hỏi giá hoặc cần
              tư vấn? Hãy để lại thông tin, chúng tôi
              sẽ liên hệ với bạn sớm nhất.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}