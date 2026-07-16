import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import BackButton from "@/components/BackButton/BackButton";

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
        <BackButton />
        
        <h1 className="pageTitle">
          Danh mục
        </h1>

        <p className="pageDesc">
          Chọn danh mục để xem các sản phẩm phù hợp.
        </p>

        <div className="categoryGrid">

  {categories?.map((item, index) => (

    <ScrollReveal
      key={item.id}
      delay={index * 0.1}
    >

      <Link
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

    </ScrollReveal>

  ))}

</div>
      </div>
    </div>
  );
}