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
        products: [...form.vs, value],
      });
    } else {
      setForm({
        ...form,
        products: form.products.filter((i) => i !== value),
      });
    }
  };

  const showError = (msg) => {
    setErrorPopup(msg);
    setTimeout(() => setErrorPopup(""), 3000);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.products.length === 0) {
    showError("Vui lòng chọn ít nhất 1 dịch vụ.");
    return;
  }

  if (!form.productType) {
    showError("Vui lòng chọn hình thức làm đẹp.");
    return;
  }

  setLoading(true);

  const formData = { ...form };

  // reset form ngay
  setForm({
    name: "",
    phone: "",
    email: "",
    products: [],
    productType: "",
    message: "",
  });

  // hiện popup ngay lập tức
  setShowPopup(true);

  // tự đóng popup
  setTimeout(() => {
    setShowPopup(false);
  }, 2500);

  // gửi API nền
  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).catch(() => {
    showError("Có lỗi xảy ra khi gửi dữ liệu.");
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
            <h2>MIREC thông báo</h2>
            <p>{errorPopup}</p>
            <button onClick={() => setErrorPopup("")}>Đóng</button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="successOverlay">
          <div className="successPopup">
            <div className="successIcon">🎉</div>
            <h2>Gửi thành công!</h2>
            <p>Chúng tôi sẽ liên hệ bạn sớm nhất.</p>
            <button onClick={() => setShowPopup(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="contact-hero">
        <h1>Liên hệ tư vấn</h1>
        <p>Gửi thông tin, chúng tôi sẽ hỗ trợ nhanh nhất</p>
      </div>

      <div className="contact-wrapper">
        <div className="contact-form">
          <p>Điền thông tin để được tư vấn</p>

          <form onSubmit={handleSubmit} className="booking-form">
            <input
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              placeholder="Email (không bắt buộc)"
              value={form.email}
              onChange={handleChange}
            />

            <select
              name="productType"
              value={form.productType}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn hình thức --</option>
              <option value="Làm tại cơ sở">Làm tại cơ sở</option>
              <option value="Làm tại nhà">Làm tại nhà</option>
            </select>

            <div className="checkboxGroup">
              <p className="checkboxTitle">Chọn dịch vụ</p>

              <label>
                <input
                  type="checkbox"
                  value="Môi"
                  checked={form.products.includes("Môi")}
                  onChange={handleCheckbox}
                />
                Môi
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Mày"
                  checked={form.products.includes("Mày")}
                  onChange={handleCheckbox}
                />
                Mày
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Ti"
                  checked={form.products.includes("Ti")}
                  onChange={handleCheckbox}
                />
                Ti
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Bikini"
                  checked={form.products.includes("Bikini")}
                  onChange={handleCheckbox}
                />
                Bikini
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Khử thâm"
                  checked={form.products.includes("Khử thâm")}
                  onChange={handleCheckbox}
                />
                Khử thâm
              </label>
            </div>

            <button disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Thông tin</h2>
                    <p>📍Trụ sở: 354/47 Quốc lộ 1, Phường Bình Tân, TP.HCM</p>
          <p>📍Cơ sở: 15A Sông Đà, Phường Tân Sơn Hòa, TP.HCM</p>
          <p>📞 0372 089 821</p>
          <p>📧 thammyvienhisu@gmail.com</p>

          <div className="contact-note">
            Cảm ơn bạn đã tin tưởng MIREC
          </div>
        </div>
      </div>
    </div>
  );
}