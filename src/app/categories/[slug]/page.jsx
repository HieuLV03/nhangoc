import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import "./page.css";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";


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
    <div className="categoryPage">

      <div className="container">


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



        {products?.length === 0 ? (

          <ScrollReveal>

            <div className="empty">
              Chưa có sản phẩm trong danh mục này.
            </div>

          </ScrollReveal>


        ) : (

          <div className="productGrid">


            {products.map((product,index)=>(


              <ScrollReveal
                key={product.id}
                delay={index * 0.12}
              >


                <Link
                  href={`/products/${product.slug}`}
                  className="productCard"
                >


                  <div className="productImg">


                    {product.image && (

                      <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={400}
                        sizes="(max-width:768px)100vw,33vw"
                        className="cardImage"
                      />

                    )}


                  </div>



                  <div className="productContent">


                    <h2>
                      {product.name}
                    </h2>



                    {product.sale_price ? (

                      <div className="price">

                        <span className="sale">
                          {Number(product.sale_price)
                          .toLocaleString("vi-VN")}đ
                        </span>


                        <span className="old">
                          {Number(product.price)
                          .toLocaleString("vi-VN")}đ
                        </span>


                      </div>


                    ) : (

                      <div className="price">

                        <span className="sale">
                          {Number(product.price)
                          .toLocaleString("vi-VN")}đ
                        </span>

                      </div>

                    )}


                  </div>


                </Link>


              </ScrollReveal>


            ))}


          </div>

        )}


      </div>


    </div>
  );
}