"use client";
import { useState } from "react";
import "./page.css";
import BackButton from "@/components/BackButton/BackButton";

export default function BookingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
products: [],
      productType: "",

  });
  const [errorPopup, setErrorPopup] = useState("");
const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const showError = (msg) => {
  setErrorPopup(msg);
  setTimeout(() => setErrorPopup(""), 3000);
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
      vs: form.products.filter(
        (item) => item !== value
      ),
    });
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

if (form.products.length === 0) {
  showError("Vui lòng chọn ít nhất 1 dịch vụ để được tư vấn.");
  return;
}

  setLoading(true);

  const formData = { ...form };

  setForm({
    name: "",
    phone: "",
    email: "",
    products: [],
    productType: "",
  });

  setLoading(false);

  // 👉 show popup
  setShowPopup(true);

  setTimeout(() => {
    setShowPopup(false);
  }, 5000);

  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).catch(console.error);
};

  return (
    
    <div className="booking-container">
      {errorPopup && (
  <div className="successOverlay">
    <div className="successPopup errorPopup">
      <div className="successIcon">⚠️</div>

      <h2>HISU thông báo</h2>

      <p>{errorPopup}</p>

      <button onClick={() => setErrorPopup("")}>
        Đóng
      </button>
    </div>
  </div>
)}
                    <BackButton />

      <div className="booking-box">
        
        <h1>Đặt lịch tư vấn</h1>

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
  <option value="">-- Chọn hình thức làm đẹp --</option>

  <option value="Làm tại cơ sở">
    Làm tại cơ sở
  </option>

  <option value="Làm tại nhà">
    Làm tại nhà
  </option>
</select>
 <div className="checkboxGroup">
  <p className="checkboxTitle">
    Chọn dịch vụ cần tư vấn
  </p>

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
          {showPopup && (
  <div className="successOverlay">
    <div className="successPopup">
      <div className="successIcon">🎉</div>

      <h2>Gửi thành công!</h2>

<p>Bộ phận tư vấn sẽ liên hệ lại bạn trong thời gian sớm nhất để hỗ trợ chi tiết.</p>

      <button onClick={() => setShowPopup(false)}>
        Đóng
      </button>
    </div>
  </div>
)}
        </form>
      </div>
    </div>
  );
}