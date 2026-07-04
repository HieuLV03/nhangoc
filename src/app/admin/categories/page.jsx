import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export const revalidate = 0;

export default async function CategoriesPage() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="categoriesPage">
        <p>❌ Lỗi Supabase: {error.message}</p>
      </div>
    );
  }

  const categories = data || [];

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

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Slug</th>
              <th>Ảnh</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
<tbody>
  {categories.length > 0 ? (
    categories.map((item) => (
      <tr key={item.id}>
        
        {/* LEFT TD - INFO */}
        <td className="infoTd">
          <div className="name">{item.name}</div>

          <div className="slug">
            <b>Slug:</b> {item.slug}
          </div>

          <div className="date">
            <b>Ngày:</b>{" "}
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("vi-VN")
              : "-"}
          </div>

          <Link
            href={`/admin/categories/edit/${item.id}`}
            className="editBtn"
          >
            Sửa
          </Link>
        </td>

        {/* RIGHT TD - IMAGE */}
        <td className="imageTd">
          {item.img ? (
            <img src={item.img} className="categoryImg" />
          ) : (
            "-"
          )}
        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={2} style={{ textAlign: "center", padding: 20 }}>
        Không có dữ liệu
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}