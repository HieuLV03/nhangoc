
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import "./page.css";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import BackButton from "@/components/BackButton/BackButton";

export const revalidate = 600;

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .contains("category_ids", [Number(category.id)])
    .order("created_at", { ascending: false });

  return (
    <main className="categoryPage">

      {/* BACK BUTTON */}
      <BackButton />

      {/* CONTAINER */}
      <div className="container">

        {/* CATEGORY HEADER */}

        <ScrollReveal>
          <h1>
            {category.name}
          </h1>

          {category.description && (
            <p className="description">
              {category.description}
            </p>
          )}
        </ScrollReveal>


        {/* PRODUCTS */}

        {products?.length === 0 ? (

          <ScrollReveal>
            <div className="empty">
              Chưa có sản phẩm trong danh mục này.
            </div>
          </ScrollReveal>

        ) : (

          <div className="productGrid">

            {products?.map((product, index) => (

              <ScrollReveal
                key={product.id}
                delay={index * 0.12}
              >

                <Link
                  href={`/products/${product.slug}`}
                  className="productCard"
                >

                  {/* IMAGE */}

                  <div className="productImg">

                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name || "Sản phẩm"}
                        width={1000}
                        height={1500}
                        sizes="(max-width:768px) 50vw,33vw"
                        className="cardImage"
                      />
                    )}

                    <div className="imgOverlay" />

                  </div>


                  {/* CONTENT */}

                  <div className="productContent">

                    <h2 className="productTitle">
                      {product.name}
                    </h2>


      


                    {/* PRICE */}

                    <div className="productPrice">

                      {product.sale_price ? (
                        <>
                          <span className="priceSale">
                            {Number(
                              product.sale_price
                            ).toLocaleString("vi-VN")}
                            ₫
                          </span>

                          <span className="priceOld">
                            {Number(
                              product.price
                            ).toLocaleString("vi-VN")}
                            ₫
                          </span>
                        </>
                      ) : (
                        <span className="priceSale">
                          {Number(
                            product.price
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      )}

                    </div>

                  </div>

                </Link>

              </ScrollReveal>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}
