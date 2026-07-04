import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export const revalidate = 0;

export default async function CategoriesPage() {
const {
  data: categories,
  error,
} = await supabase
  .from("categories")
  .select("*")
  .order("created_at", { ascending: false });

console.log("categories =", categories);
console.log("error =", error);
console.log("categories:", categories);
console.log("error:", error);
  return (
    <div className="categoriesPage">
      <div className="pageHeader">
        <div>
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

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Slug</th>
                            <th>Ảnh</th>

              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {categories?.length ? (
              categories.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>

                  <td>{item.slug}</td>
  <td>
    {item.img ? (
      <img
        src={item.img}
        alt={item.name}
        className="categoryImg"
      />
    ) : (
      "-"
    )}
  </td>

                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString("vi-VN")}
                  </td>

                  <td>
                    <Link
                      href={`/admin/categories/edit/${item.id}`}
                      className="editBtn"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: 30,
                  }}
                >
                  Chưa có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}