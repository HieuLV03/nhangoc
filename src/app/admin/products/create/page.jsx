"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";
import BackButton from "../../components/BackButton/BackButton";

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    sale_price: "",
    category_ids: [],
    description: "",
    content: "",
    status: "available",
    featured: false,
  });

  // =========================
  // SLUG
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
    const fileName = `${sanitize(slug)}-${Date.now()}-${randomString()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images_product")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("images_product")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // GET CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name")
        .order("name");

      if (!error) setCategories(data || []);
      else console.log(error);
    };

    fetchCategories();
  }, []);
useEffect(() => {
  if (!form.name.trim()) return;

  const timer = setTimeout(async () => {
    try {
      setAiLoading(true);

      const res = await fetch("/api/ai/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Không thể tạo nội dung AI");
      }

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        description: prev.description || data.description,
        content: prev.content || data.content,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  }, 1500);

  return () => clearTimeout(timer);
}, [form.name]);
  // =========================
  // CREATE PRODUCT
  // =========================
  const createProduct = async () => {
    if (!form.name.trim()) {
      return alert("Nhập tên sản phẩm");
    }

    setLoading(true);

    try {
      let imageUrl = null;

      if (file) {
        imageUrl = await uploadImage(file, form.slug);
      }

      const { error } = await supabase.from("products").insert([
        {
          name: form.name,
          slug: form.slug,
          price: Number(form.price),
          sale_price: form.sale_price
            ? Number(form.sale_price)
            : null,
category_ids: form.category_ids,
            description: form.description,
          content: form.content,
          image: imageUrl,
          status: form.status,
          featured: form.featured,
        },
      ]);

      if (error) throw error;

      alert("Tạo sản phẩm thành công!");

      setForm({
        name: "",
        slug: "",
        price: "",
        sale_price: "",
        category_ids: [],
        description: "",
        content: "",
        status: "available",
        featured: false,
      });

      setFile(null);
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="createPostPage">
      <div className="createPostCard">

        <div className="headerRow">
          <BackButton />
          <h1>Tạo sản phẩm</h1>
        </div>

        {/* NAME */}
        <input
          placeholder="Tên sản phẩm"
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

        {/* IMAGE */}
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
            setForm({ ...form, slug: e.target.value })
          }
        />

<div className="categoryBox">
  <h4>Danh mục</h4>

  <div className="categoryGrid">
    {categories.map((cat) => (
      <label
        key={cat.id}
        className="categoryItem"
      >
        <input
          type="checkbox"
          checked={form.category_ids.includes(cat.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setForm({
                ...form,
                category_ids: [
                  ...form.category_ids,
                  cat.id,
                ],
              });
            } else {
              setForm({
                ...form,
                category_ids:
                  form.category_ids.filter(
                    (id) => id !== cat.id
                  ),
              });
            }
          }}
        />

        <span>{cat.name}</span>
      </label>
    ))}
  </div>
</div>
        {/* PRICE */}
        <input
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        {/* SALE PRICE */}
        <input
          type="number"
          placeholder="Giá khuyến mãi"
          value={form.sale_price}
          onChange={(e) =>
            setForm({ ...form, sale_price: e.target.value })
          }
        />
{aiLoading && (
  <p style={{ color: "#666", marginBottom: 10 }}>
    AI đang tạo nội dung...
  </p>
)}
        <textarea
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

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

        {/* FEATURED */}
        <label style={{ display: "flex", gap: 8 }}>
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
          Nổi bật
        </label>

        {/* BUTTON */}
        <button
          className="submitBtn"
          onClick={createProduct}
          disabled={loading}
        >
          {loading ? "Đang upload..." : "Tạo sản phẩm"}
        </button>
      </div>
    </div>
  );
}