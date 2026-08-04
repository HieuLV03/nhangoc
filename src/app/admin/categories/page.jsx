"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";
import BackButton from "../components/BackButton/BackButton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DATA
  // =========================
  const fetchCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // DELETE
  // =========================
  const deleteCategory = async (category) => {
    if (!category?.id) return;

    const ok = confirm(
      "Bạn có chắc muốn xóa danh mục này?"
    );

    if (!ok) return;

    try {
      // Xóa ảnh storage nếu có
      if (category.path) {
        const { error: storageError } =
          await supabase.storage
            .from("categories")
            .remove([category.path]);

        if (storageError) {
          console.log(storageError.message);
        }
      }

      // Xóa database
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (error) {
        alert(error.message);
        return;
      }

      // Update UI
      setCategories((prev) =>
        prev.filter((item) => item.id !== category.id)
      );

      alert("Đã xóa danh mục!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="categoriesPage">
      <div className="pageHeader">
        <div>
          <BackButton />

          <h1>Danh mục</h1>

          <p>Quản lý danh mục sản phẩm</p>
        </div>

        <Link
          href="/admin/categories/create"
          className="createBtn"
        >
          + Thêm danh mục
        </Link>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : categories.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <div className="grid">
          {categories.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                backgroundImage: item.img
                  ? `url(${item.img})`
                  : "linear-gradient(135deg,#334155,#111827)",
              }}
            >
              <div className="overlay" />

              <div className="content">
                <h2>{item.name}</h2>

                <p>
                  <strong>Slug:</strong> {item.slug}
                </p>

                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleDateString("vi-VN")
                    : "-"}
                </p>

                <div className="categoryActions">
                  <Link
                    href={`/admin/categories/edit/${item.id}`}
                    className="cardEditBtn"
                  >
                    Sửa
                  </Link>

                  <button
                    className="deleteBtn"
                    onClick={() =>
                      deleteCategory(item)
                    }
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
  );
}