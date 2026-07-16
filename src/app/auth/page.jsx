"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import "./page.css"
import BackButton from "@/components/BackButton/BackButton";
export default function AuthPage() {
  const router = useRouter();
const [errorPopup, setErrorPopup] = useState("");
const [successPopup, setSuccessPopup] = useState("");
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN (FIX CHUẨN ROLE)
  // =========================
  const translateAuthError = (message) => {
  if (!message) return "Có lỗi xảy ra";

  const map = {
    "Invalid login credentials": "Email hoặc mật khẩu không đúng",
    "Email not confirmed": "Email chưa được xác thực",
    "User already registered": "Email đã tồn tại",
    "Password should be at least 6 characters":
      "Mật khẩu phải có ít nhất 6 ký tự",
    "For security purposes, you can only request this after 60 seconds":
      "Vui lòng thử lại sau ít phút",
  };

  return map[message] || "Đăng nhập thất bại, vui lòng thử lại";
};
const showError = (msg) => {
  setErrorPopup(msg);
  setTimeout(() => setErrorPopup(""), 4000);
};

const showSuccess = (msg) => {
  setSuccessPopup(msg);
  setTimeout(() => setSuccessPopup(""), 3000);
};
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const handleLogin = async () => {
  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    return showError(translateAuthError(error.message));
  }

  const user = data?.user;

  if (!user) {
    return showError("Đăng nhập thất bại");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return showError("Không lấy được thông tin tài khoản");
  }

  router.push("/");
};
  // =========================
  // REGISTER
  // =========================
const handleRegister = async () => {
  // NAME
  if (!name.trim()) {
    return showError("Vui lòng nhập họ tên");
  }

  // EMAIL RỖNG
  if (!email.trim()) {
    return showError("Vui lòng nhập email");
  }

  // EMAIL SAI FORMAT (FRONTEND CHẶN LUÔN)
  if (!isValidEmail(email)) {
    return showError("Email không đúng định dạng");
  }

  // PASSWORD
  if (!password) {
    return showError("Vui lòng nhập mật khẩu");
  }

  if (password.length < 6) {
    return showError("Mật khẩu phải từ 6 ký tự trở lên");
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  setLoading(false);

  // SERVER ERROR (chỉ còn lỗi thật sự)
  if (error) {
    return showError("Đăng ký thất bại, vui lòng thử lại");
  }

  const user = data?.user;

  if (user) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        email,
        name,
        role: "user",
      },
    ]);

    if (insertError) {
      return showError("Không lưu được thông tin người dùng");
    }
  }

  showSuccess("Đăng ký thành công!");

  setMode("login");
};
  return (
    <div className="authPage">
      {successPopup && (
  <div className="successOverlay">
    <div className="successPopup">
      <div className="successIcon">💚</div>

      <h2>Nhà Ngọc thông báo</h2>

      <p>{successPopup}</p>

      <button onClick={() => setSuccessPopup("")}>
        Đóng
      </button>
    </div>
  </div>
)}
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
      <BackButton/>
      <div className="authCard">
        <h1>{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h1>

        {mode === "register" && (
          <input
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading
            ? "Đang xử lý..."
            : mode === "login"
            ? "Đăng nhập"
            : "Đăng ký"}
        </button>

        <p
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          style={{ cursor: "pointer" }}
        >
          {mode === "login"
            ? "Chưa có tài khoản? Đăng ký"
            : "Đã có tài khoản? Đăng nhập"}
        </p>
      </div>
    </div>
  );
}