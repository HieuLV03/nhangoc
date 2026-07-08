"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const editorRef = useRef(null);

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);
const [categories, setCategories] = useState([]);
const [oldImage, setOldImage] = useState("");
const [form, setForm] = useState({
  name: "",
  slug: "",
  price: "",
  sale_price: "",
  category_ids: [],
  description: "",
  content: "",
  image: "",
  status: "available",
  featured: false,
});
  // =========================
  // SLUG
  // =========================
useEffect(() => {
  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    setCategories(data || []);
  };

  fetchCategories();
}, []);
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
    Math.random()
      .toString(36)
      .substring(2, 8);

  // =========================
  // FETCH DATA
  // =========================
const getStoragePath = (url) => {
  if (!url) return null;

  const parts = url.split("/images_product/");

  return parts.length > 1
    ? decodeURIComponent(parts[1])
    : null;
};
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const { data, error } =
        await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .maybeSingle();

      if (error) {
        console.log(error);
        return;
      }

  if (data) {

  setOldImage(data.image || "");

  setForm({
  name: data.name || "",
  slug: data.slug || "",
  price: data.price || "",
  sale_price: data.sale_price || "",
category_ids: data.category_ids || [],
  description: data.description || "",
  content: data.content || "",
  image: data.image || "",
  status: data.status || "available",
  featured: data.featured || false,
});
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // UPLOAD IMAGE
  // =========================

  const handleUploadImage =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        setUploading(true);

        const fileExt =
          file.name
            .split(".")
            .pop();

        const fileName = `${
          form.slug || "product"
        }-${Date.now()}-${randomString()}.${fileExt}`;

        const { error } =
          await supabase.storage
            .from(
              "images_product"
            )
            .upload(
              fileName,
              file
            );

        if (error) {
          console.log(error);
          alert(
            "Upload ảnh thất bại"
          );
          return;
        }

        const { data } =
          supabase.storage
            .from(
              "images_product"
            )
            .getPublicUrl(
              fileName
            );

        setForm((prev) => ({
          ...prev,
          image:
            data.publicUrl,
        }));
      } catch (err) {
        console.log(err);

        alert(
          "Upload ảnh thất bại"
        );
      } finally {
        setUploading(false);
      }
    };

  // =========================
  // UPDATE
  // =========================

  const update = async () => {
    try {
      setLoading(true);

      const { error } =
      await supabase
  .from("products")
  .update({
    name: form.name,
    slug: form.slug,
    price: Number(form.price),
    sale_price: form.sale_price
      ? Number(form.sale_price)
      : null,
category_ids: form.category_ids,
      description: form.description,
    content: form.content,
    image: form.image,
    status: form.status,
    featured: form.featured,
    updated_at: new Date().toISOString(),
  })
  .eq("id", id);
      if (error) {
        console.log(error);

        alert(error.message);

        return;
      }
// Nếu đã đổi ảnh thì xóa ảnh cũ
if (oldImage && oldImage !== form.image) {
  const oldPath = getStoragePath(oldImage);

  if (oldPath) {
    const { error: removeError } =
      await supabase.storage
        .from("images_product")
        .remove([oldPath]);

    if (removeError) {
      console.log("Lỗi xóa ảnh:", removeError);
    }
  }

  setOldImage(form.image);
}
      alert(
        "Cập nhật thành công!"
      );

      router.refresh();
    } catch (err) {
      console.log(err);

      alert("Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="editProductPage">
      <div className="editProductCard">
        <h1>Sửa sản phẩm</h1>


        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => {
            const name =
              e.target.value;

            setForm({
              ...form,
              name,
              slug:
                sanitize(
                  name
                ),
            });
          }}
        />

        {/* SLUG */}

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug:
                sanitize(
                  e.target.value
                ),
            })
          }
        />

        {/* CATEGORY */}

      <div className="categoryBox">
  {categories.map((item) => (
    <label
      key={item.id}
      className="categoryItem"
    >
      <input
        type="checkbox"
        checked={form.category_ids.includes(item.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setForm({
              ...form,
              category_ids: [
                ...form.category_ids,
                item.id,
              ],
            });
          } else {
            setForm({
              ...form,
              category_ids:
                form.category_ids.filter(
                  (id) => id !== item.id
                ),
            });
          }
        }}
      />

      {item.name}
    </label>
  ))}
</div>

        {/* PRICE */}

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price:
                e.target.value,
            })
          }
        />
<input
    type="number"
    placeholder="Giá khuyến mãi"
    value={form.sale_price}
    onChange={(e)=>
        setForm({
            ...form,
            sale_price:e.target.value
        })
    }
/>
<textarea
  placeholder="Mô tả ngắn"
  value={form.description}
  onChange={(e) =>
    setForm({
      ...form,
      description: e.target.value,
    })
  }
/>
<textarea
  className="editor"
  placeholder="Nội dung HTML"
  value={form.content}
  onChange={(e) =>
    setForm({
      ...form,
      content: e.target.value,
    })
  }
/>
        {/* IMAGE */}

        <div className="uploadBox">
          <input
            type="file"
            onChange={
              handleUploadImage
            }
          />

          {uploading && (
            <p>
              Đang upload...
            </p>
          )}

          {form.image && (
            <img
              src={form.image}
              alt=""
              className="previewImage"
            />
          )}
        </div>

        {/* STATUS */}

    <select
    value={form.status}
    onChange={(e)=>
        setForm({
            ...form,
            status:e.target.value
        })
    }
>
    <option value="available">
        Còn hàng
    </option>

    <option value="out_of_stock">
        Hết hàng
    </option>
</select>
        {/* FEATURED */}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={
              form.featured
            }
            onChange={(e) =>
              setForm({
                ...form,
                featured:
                  e.target.checked,
              })
            }
          />

          Featured
        </label>

        {/* BUTTON */}

        <button
          onClick={update}
          disabled={loading}
        >
          {loading
            ? "Đang lưu..."
            : "Cập nhật"}
        </button>
      </div>
    </div>
  );
}