"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton/BackButton";
import "./page.css";

export default function CreateCategoryPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  // ======================
  // Tạo slug
  // ======================

  const sanitize = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ======================
  // CREATE
  // ======================

  const createCategory = async () => {
    if (!form.name.trim()) {
      return alert("Vui lòng nhập tên danh mục");
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("categories")
        .insert([
          {
            name: form.name,
            slug: form.slug,
          },
        ]);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Thêm danh mục thành công!");

      setForm({
        name: "",
        slug: "",
      });
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createCategoryPage">
      <div className="createCategoryCard">

        <div className="headerRow">
          <BackButton />

          <div>
            <h1>Thêm danh mục</h1>
            <p>Tạo danh mục mới</p>
          </div>
        </div>

        <input
          placeholder="Tên danh mục"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;

            setForm({
              ...form,
              name,
              slug: sanitize(name),
            });
          }}
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: sanitize(e.target.value),
            })
          }
        />
        <button
          onClick={createCategory}
          disabled={loading}
        >
          {loading
            ? "Đang tạo..."
            : "Tạo danh mục"}
        </button>
      </div>
    </div>
  );
}