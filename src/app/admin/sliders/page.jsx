"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";
import BackButton from "../components/BackButton/BackButton";

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const imageRef = useRef();

  const cleanFileName = (name) =>
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

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
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setSliders(data || []);
    }
  }

  // =========================
  // ADD SLIDER
  // =========================

  async function handleAddSlider(e) {
    e.preventDefault();

    if (!image) {
      alert("Vui lòng chọn ảnh slider.");
      return;
    }

    try {
      setUploading(true);

      const fileName =
        `${Date.now()}-${cleanFileName(image.name)}`;

      const { error: uploadError } =
        await supabase.storage
          .from("images_slider")
          .upload(fileName, image);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("images_slider")
        .getPublicUrl(fileName);

      const { error: insertError } =
        await supabase
          .from("sliders")
          .insert([
            {
              image: publicUrl,
              path: fileName,
              status: true,
            },
          ]);

      if (insertError) throw insertError;

      alert("Thêm slider thành công.");

      setImage(null);

      if (imageRef.current) {
        imageRef.current.value = "";
      }

      fetchSliders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(item) {
    if (!confirm("Bạn có chắc muốn xóa slider này?")) {
      return;
    }

    try {
      if (item.path) {
        const { error: storageError } =
          await supabase.storage
            .from("images_slider")
            .remove([item.path]);

        if (storageError) {
          throw storageError;
        }
      }

      const { error } =
        await supabase
          .from("sliders")
          .delete()
          .eq("id", item.id);

      if (error) throw error;

      fetchSliders();

      alert("Xóa slider thành công.");
    } catch (err) {
      console.error(err);
      alert(err.message);
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

      <form
        onSubmit={handleAddSlider}
        className="sliderForm"
      >
        <label>Ảnh Slider</label>

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <button
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Đang tải lên..."
            : "Thêm Slider"}
        </button>
      </form>

      <div className="sliderList">
        {sliders.map((item) => (
          <div
            key={item.id}
            className="sliderCard"
          >
            <img
              src={item.image}
              alt="Slider"
              className="sliderImg"
            />

            <div className="sliderBody">
              <button
                className="deleteBtn"
                onClick={() =>
                  handleDelete(item)
                }
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