import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export const revalidate = 600;

export default async function CategoriesPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="categoriesPage">
        <p>Không thể tải danh mục.</p>
      </div>
    );
  }

  return (
    <div className="categoriesPage">
      <div className="container">
        <h1 className="pageTitle">
          Danh mục sản phẩm
        </h1>

        <p className="pageDesc">
          Chọn danh mục để xem các sản phẩm phù hợp.
        </p>

        <div className="categoryGrid">
          {categories?.map((item) => (
            <Link
              key={item.id}
              href={`/categories/${item.slug}`}
              className="categoryCard"
            >
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.name}
                  className="categoryImage"
                />
              ) : (
                <div className="categoryPlaceholder">
                  📂
                </div>
              )}

              <div className="categoryContent">
                <h2>{item.name}</h2>

                {item.description && (
                  <p>{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}