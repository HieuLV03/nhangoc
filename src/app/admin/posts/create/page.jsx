
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";
import BackButton from "../../components/BackButton/BackButton";

export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    image: "",
    status: "published",
    featured: false,
  });

  // =========================
  // SLUG CLEAN
  // =========================
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

  const randomString = () =>
    Math.random().toString(36).substring(2, 8);

  // =========================
  // UPLOAD IMAGE
  // =========================
  const uploadImage = async (file, slug) => {
    const fileExt = file.name.split(".").pop();

    const cleanSlug = sanitize(slug || "post");

    const fileName = `${cleanSlug}-${Date.now()}-${randomString()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images_post")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("images_post")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // AI - DESCRIPTION
  // =========================
  const generateDescription = async () => {
    if (!form.title.trim()) {
      return alert("Nhập tiêu đề bài viết trước");
    }

    try {
      setDescLoading(true);

      const res = await fetch("/api/ai/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "description",
          name: form.title,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI lỗi");
      }

      setForm((prev) => ({
        ...prev,
        description: data.description || "",
      }));
    } catch (err) {
      console.error("Generate description error:", err);
      alert(err.message || "Không thể tạo mô tả");
    } finally {
      setDescLoading(false);
    }
  };

  // =========================
  // AI - CONTENT
  // =========================
  const generateContent = async () => {
    if (!form.title.trim()) {
      return alert("Nhập tiêu đề bài viết trước");
    }

    try {
      setContentLoading(true);

      const res = await fetch("/api/ai/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "content",
          name: form.title,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI lỗi");
      }

      setForm((prev) => ({
        ...prev,
        content: data.content || "",
      }));
    } catch (err) {
      console.error("Generate content error:", err);
      alert(err.message || "Không thể tạo content");
    } finally {
      setContentLoading(false);
    }
  };

  // =========================
  // CREATE POST
  // =========================
  const createPost = async () => {
    if (!form.title.trim()) {
      return alert("Nhập tiêu đề");
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadImage(file, form.slug);
      }

      const { error } = await supabase.from("posts").insert([
        {
          title: form.title,
          slug: form.slug,
          description: form.description,
          content: form.content,

          image: imageUrl,
          status: form.status,
          featured: form.featured,

          views: 0,
        },
      ]);

      if (error) throw error;

      alert("Tạo bài viết thành công!");

      setForm({
        title: "",
        slug: "",
        description: "",
        content: "",
        image: "",
        status: "published",
        featured: false,
      });

      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Không thể tạo bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPostPage">
      <div className="createPostCard">

        {/* HEADER */}
        <div className="headerRow">
          <div className="headerLeft">
            <BackButton />
            <h1>Tạo bài viết</h1>
          </div>
        </div>

        {/* TITLE → AUTO SLUG */}
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;

            setForm({
              ...form,
              title,
              slug: sanitize(title),
            });
          }}
        />

        {/* FILE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        {/* SLUG */}
        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* AI DESCRIPTION */}
        <button
          type="button"
          className="aiBtn"
          onClick={generateDescription}
          disabled={descLoading}
        >
          {descLoading ? "Đang tạo..." : "✨ Tạo mô tả bằng AI"}
        </button>

        {/* CONTENT */}
        <textarea
          className="editor"
          placeholder="Nhập HTML..."
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
        />

        {/* AI CONTENT */}
        <button
          type="button"
          className="aiBtn"
          onClick={generateContent}
          disabled={contentLoading}
        >
          {contentLoading ? "Đang tạo..." : "✨ Tạo content bằng AI"}
        </button>

        {/* STATUS */}
        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
        >
          <option value="published">Hiện</option>
          <option value="hidden">Ẩn</option>
        </select>

        {/* FEATURED */}
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({
                ...form,
                featured: e.target.checked,
              })
            }
          />
          Featured
        </label>

        {/* SUBMIT */}
        <button
          className="submitBtn"
          onClick={createPost}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Đăng bài"}
        </button>

      </div>
    </div>
  );
}
