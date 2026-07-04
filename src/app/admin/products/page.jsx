"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import "./page.css";
import BackButton from "../components/BackButton/BackButton";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // =========================
  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
     .select(`
  id,
  name,
  slug,
  price,
  sale_price,
  status,
  featured,
  created_at,
  image
`)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // EXTRACT STORAGE PATH
  // =========================
  const extractPath = (url) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      const parts = parsed.pathname.split("/images_product/");

      return parts[1] || null;
    } catch {
      return null;
    }
  };

  // =========================
  // =========================
  const deleteProduct = async (product) => {
    if (!product?.id) {
      alert("Missing product id");
      return;
    }

    const ok = confirm(
      "Bạn có chắc muốn xoá sản phẩm này không?"
    );

    if (!ok) return;

    try {
      // =========================
      // DELETE IMAGE
      // =========================
      if (product.image) {
        const filePath = extractPath(product.image);

        console.log("FILE PATH:", filePath);

        if (filePath) {
          const { error: storageError } =
            await supabase.storage
              .from("images_product")
              .remove([filePath]);

          if (storageError) {
            console.log(
              "Storage error:",
              storageError.message
            );
          }
        }
      }

      // =========================
      // DELETE DATABASE
      // =========================
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) {
        alert(error.message);
        return;
      }

      // =========================
      // UPDATE UI
      // =========================
      setProducts((prev) =>
        prev.filter((s) => s.id !== product.id)
      );

      alert("Đã xoá sản phẩm!");
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="adminPage">
    <div className="adminCard">

 <div className="headerRow">
  <div className="headerLeft">
    <BackButton />
    <h1>Danh sách sản phẩm</h1>
  </div>

  <Link
    href="/admin/products/create"
    className="addBtn"
  >
    + Thêm sản phẩm
  </Link>
</div>

      {/* CONTENT */}
      {loading ? (
        <p>Đang tải...</p>
      ) : products.length === 0 ? (
        <p>Chưa có sản phẩm nào</p>
      ) : (
     <div className="productGrid">
  {products.map((product) => (
    <div
      key={product.id}
      className="productCard"
      style={{
        backgroundImage: product.image
          ? `url(${product.image})`
          : "linear-gradient(135deg,#334155,#111827)",
      }}
    >
      <div className="productOverlay" />

      <div className="productContent">
        <h2>{product.name}</h2>

        <p><strong>Slug:</strong> {product.slug}</p>

        <p>
          <strong>Giá:</strong>{" "}
          {Number(product.price).toLocaleString("vi-VN")}đ
        </p>

        <p>
          <strong>Giá KM:</strong>{" "}
          {product.sale_price
            ? Number(product.sale_price).toLocaleString("vi-VN") + "đ"
            : "-"}
        </p>

        <p>
          <strong>Nổi bật:</strong>{" "}
          {product.featured ? "⭐ Có" : "Không"}
        </p>

        <p>
          <strong>Trạng thái:</strong> {product.status}
        </p>

        <p>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(product.created_at).toLocaleDateString("vi-VN")}
        </p>

        <div className="productActions">
        <Link
  href={`/admin/products/edit/${product.id}`}
  className="cardEditBtn"
>
  Sửa
</Link>

          <button
            className="deleteBtn"
            onClick={() => deleteProduct(product)}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
      )}

    </div>
  </div>
);
}