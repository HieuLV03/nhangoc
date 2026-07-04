import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export const revalidate = 0;

export default async function CategoriesPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="categoriesPage">
        <p>❌ Lỗi: {error.message}</p>
      </div>
    );
  }

  const list = categories || [];

  return (
    <div className="categoriesPage">
      <div className="pageHeader">
        <div>
          <h1>Danh mục</h1>
          <p>Quản lý danh mục sản phẩm</p>
        </div>

        <Link href="/admin/categories/create" className="createBtn">
          + Thêm danh mục
        </Link>
      </div>

      <div className="grid">
        {list.length > 0 ? (
          list.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                backgroundImage: item.img
                  ? `url(${item.img})`
                  : "none",
              }}
            >
              <div className="overlay" />

              <div className="content">
                <h2>{item.name}</h2>

                <p>Slug: {item.slug}</p>

                <p>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString(
                        "vi-VN"
                      )
                    : "-"}
                </p>

                <Link
                  href={`/admin/categories/edit/${item.id}`}
                  className="editBtn"
                >
                  Sửa
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
}