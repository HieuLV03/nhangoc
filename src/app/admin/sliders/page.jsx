"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";
import BackButton from "../components/BackButton/BackButton";

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState([]);

  const [title, setTitle] = useState("");
  const [imageDesktop, setImageDesktop] = useState(null);
  const [imageMobile, setImageMobile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const desktopRef = useRef();
  const mobileRef = useRef();

  useEffect(() => {
    fetchSliders();
  }, []);

  // =========================
  // GET SLIDERS
  // =========================
  async function fetchSliders() {
    const { data, error } = await supabase
      .from("sliders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSliders(data || []);
  }

  // =========================
  // ADD SLIDER
  // =========================
  async function handleAddSlider(e) {
    e.preventDefault();

    if (!imageDesktop) {
      alert("Vui lòng chọn ảnh desktop");
      return;
    }

    try {
      setUploading(true);

      const cleanName = (file) =>
        file.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");

      const uid = Math.random().toString(36).slice(2, 8);

      const fileDesktop = `${Date.now()}-${uid}-desktop-${cleanName(imageDesktop)}`;
      const fileMobile = imageMobile
        ? `${Date.now()}-${uid}-mobile-${cleanName(imageMobile)}`
        : null;

      // =========================
      // UPLOAD DESKTOP
      // =========================
      const { error: upErr1 } = await supabase.storage
        .from("images_slider")
        .upload(fileDesktop, imageDesktop);

      if (upErr1) {
        alert(upErr1.message);
        return;
      }

      const { data: desktopUrl } = supabase.storage
        .from("images_slider")
        .getPublicUrl(fileDesktop);

      // =========================
      // UPLOAD MOBILE
      // =========================
      let mobileUrl = null;

      if (imageMobile) {
        const { error: upErr2 } = await supabase.storage
          .from("images_slider")
          .upload(fileMobile, imageMobile);

        if (upErr2) {
          alert(upErr2.message);
          return;
        }

        const { data: mUrl } = supabase.storage
          .from("images_slider")
          .getPublicUrl(fileMobile);

        mobileUrl = mUrl.publicUrl;
      }

      // =========================
      // INSERT DB (IMPORTANT FIX)
      // =========================
      const { error: insertErr } = await supabase.from("sliders").insert([
        {
          title,
          image_desktop: desktopUrl.publicUrl,
          image_mobile: mobileUrl,

          // 🔥 PATH (dùng để xóa storage)
          desktop_path: fileDesktop,
          mobile_path: fileMobile,

          status: "published",
        },
      ]);

      if (insertErr) {
        alert(insertErr.message);
        return;
      }

      // reset form
      setTitle("");
      setImageDesktop(null);
      setImageMobile(null);

      if (desktopRef.current) desktopRef.current.value = "";
      if (mobileRef.current) mobileRef.current.value = "";

      fetchSliders();
      alert("Thêm slider thành công");
    } finally {
      setUploading(false);
    }
  }

  // =========================
  // DELETE SLIDER (FIXED)
  // =========================
  async function handleDelete(item) {
    if (!confirm("Xóa slider?")) return;

    try {
      const filesToDelete = [];

      if (item.desktop_path) filesToDelete.push(item.desktop_path);
      if (item.mobile_path) filesToDelete.push(item.mobile_path);

      // 1. DELETE STORAGE
      if (filesToDelete.length > 0) {
        const { error: storageErr } = await supabase.storage
          .from("images_slider")
          .remove(filesToDelete);

        if (storageErr) {
          console.log(storageErr.message);
          alert("Lỗi xóa ảnh storage");
          return;
        }
      }

      // 2. DELETE DATABASE
      const { error } = await supabase
        .from("sliders")
        .delete()
        .eq("id", item.id);

      if (error) {
        alert(error.message);
        return;
      }

      fetchSliders();
      alert("Xóa slider thành công");
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra");
    }
  }

  // =========================
  // UI
  // =========================
  return (
  <main className="adminSliderPage">

  <div className="headerRow">
    <div className="headerLeft">
      <BackButton />
      <h1>Quản lý Slider</h1>
    </div>
  </div>
      {/* FORM */}
      <form onSubmit={handleAddSlider} className="sliderForm">
        <input
          type="text"
          placeholder="Tiêu đề slider"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Ảnh Desktop</label>
        <input
          ref={desktopRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageDesktop(e.target.files[0])}
        />

        <label>Ảnh Mobile</label>
        <input
          ref={mobileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageMobile(e.target.files[0])}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Đang upload..." : "Thêm Slider"}
        </button>
      </form>

      {/* LIST */}
      <div className="sliderList">
        {sliders.map((item) => (
          <div key={item.id} className="sliderCard">
            <img
              src={item.image_desktop}
              alt={item.title}
              className="sliderImg"
            />

            {item.image_mobile && (
              <img
                src={item.image_mobile}
                alt="mobile"
                className="sliderMobileImg"
              />
            )}

            <div className="sliderBody">
              <h3>{item.title}</h3>

              <button
                className="deleteBtn"
                onClick={() => handleDelete(item)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}