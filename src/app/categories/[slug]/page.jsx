import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import "./page.css";

export const revalidate = 600;

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  // Lấy danh mục
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  // Lấy sản phẩm thuộc danh mục
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .contains("category_ids", [Number(category.id)])
    .order("created_at", { ascending: false });

  return (
    <div className="categoryPage">
      <div className="container">

        <h1>{category.name}</h1>

        {category.description && (
          <p className="description">
            {category.description}
          </p>
        )}

        {products?.length === 0 ? (
          <div className="empty">
            Chưa có sản phẩm trong danh mục này.
          </div>
        ) : (
          <div className="productGrid">

            {products.map((product) => (

              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="productCard"
              >

                <div className="productImg">

                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={400}
                    sizes="(max-width:768px)100vw,33vw"
                  />

                </div>

                <div className="productContent">

                  <h2>{product.name}</h2>

                  {product.sale_price ? (
                    <div className="price">

                      <span className="sale">
                        {Number(product.sale_price).toLocaleString("vi-VN")}đ
                      </span>

                      <span className="old">
                        {Number(product.price).toLocaleString("vi-VN")}đ
                      </span>

                    </div>
                  ) : (
                    <div className="price">
                      <span className="sale">
                        {Number(product.price).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                </div>

              </Link>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}