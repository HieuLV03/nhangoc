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
 const handleAddSlider = async (e) => {
  e.preventDefault();

  if (!imageDesktop || !imageMobile) {
    alert("Vui lòng chọn đủ ảnh Desktop và Mobile");
    return;
  }

  try {
    setUploading(true);

    const uid = Date.now();

    const desktopName = `${uid}-desktop-${imageDesktop.name}`;
    const mobileName = `${uid}-mobile-${imageMobile.name}`;

    // Upload desktop
    const { error: desktopError } = await supabase.storage
      .from("images_slider")
      .upload(desktopName, imageDesktop);

    if (desktopError) throw desktopError;

    // Upload mobile
    const { error: mobileError } = await supabase.storage
      .from("images_slider")
      .upload(mobileName, imageMobile);

    if (mobileError) throw mobileError;

    const {
      data: { publicUrl: desktopUrl },
    } = supabase.storage
      .from("images_slider")
      .getPublicUrl(desktopName);

    const {
      data: { publicUrl: mobileUrl },
    } = supabase.storage
      .from("images_slider")
      .getPublicUrl(mobileName);

    const { error: insertError } = await supabase
      .from("sliders")
      .insert([
        {
          image_desktop: desktopUrl,
          image_mobile: mobileUrl,
          desktop_path: desktopName,
          mobile_path: mobileName,
          status: true,
        },
      ]);

    if (insertError) throw insertError;

    alert("Thêm slider thành công");

    setImageDesktop(null);
    setImageMobile(null);

    desktopRef.current.value = "";
    mobileRef.current.value = "";

    fetchSliders();
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setUploading(false);
  }
};

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