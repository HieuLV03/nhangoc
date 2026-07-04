"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton/BackButton";
import "./page.css";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    img: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    loadCategory();
  }, [id]);

  const loadCategory = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id) 
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      name: data.name,
      slug: data.slug,
      img: data.img || "",
    });

    setPreview(data.img || "");
  };
  const randomString = () =>
  Math.random().toString(36).substring(2, 8);

const handleUploadImage = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setLoading(true);

    const fileExt = file.name.split(".").pop();

    const fileName = `${form.slug || "category"}-${Date.now()}-${randomString()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images_category")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("images_category")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      img: data.publicUrl,
    }));

    setPreview(data.publicUrl);
  } finally {
    setLoading(false);
  }
};
const updateCategory = async () => {
  if (!form.name.trim()) {
    return alert("Nhập tên danh mục");
  }

  try {
    setLoading(true);

  console.log("ID =", id);
console.log("FORM =", form);
console.log("IMG =", form.img);

const { data, error } = await supabase
  .from("categories")
  .update({
    name: form.name,
    slug: form.slug,
    img: form.img,
  })
  .eq("id", Number(id))
  .select();

console.log("UPDATED =", data);
console.log("ERROR =", error);
    if (error) {
      alert(error.message);
      return;
    }

    alert("Cập nhật thành công");
    router.push("/admin/categories");
    router.refresh();
  } finally {
    setLoading(false);
  }
};

  return (
<div className="editCategoryPage">
  <div className="editCategoryCard">

        <div className="headerRow">
          <BackButton />

          <div>
            <h1>Sửa danh mục</h1>
            <p>Cập nhật thông tin danh mục</p>
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

       <input
  type="file"
  accept="image/*"
  onChange={handleUploadImage}
/>
        {preview && (
          <img
            src={preview}
            alt=""
            className="previewImage"
          />
        )}

        <button
          onClick={updateCategory}
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>

      </div>
    </div>
  );
}