import Link from "next/link";

import { supabase } from "@/lib/supabase";

import Image from "next/image";

import "./page.css";
import BackButton from "@/components/BackButton/BackButton";

export const revalidate = 600;

export default async function HomePage() {

 const [productRes, postRes] = await Promise.all([
  supabase
    .from("products")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false }),

  supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5),
]);

console.log("PRODUCT ERROR:", productRes.error);
console.log("POST ERROR:", postRes.error);

console.log("PRODUCT DATA:", productRes.data);
console.log("POST DATA:", postRes.data);

const products = productRes.data || [];
const posts = postRes.data || [];
  return (
    <main className="home">

      {/* HERO */}

      <section className="section">

        <div className="sectionHeader">
              <BackButton />
          
          <h2>Sản phẩm</h2>
        </div>

        <div className="productGrid">

          {products.map((s) => (

            <Link
              key={s.id}
              href={`/products/${s.slug}`}
              className="productCard"
            >

              <div className="productImg">

         <Image
  src={s.image}
  alt={s.name}
  width={600}
  height={400}
  sizes="(max-width:768px) 100vw, 33vw"
  className="cardImage"
/>

                <div className="imgOverlay">

                  <span className="imgBtn">
                    Xem chi tiết
                  </span>

                </div>

              </div>

              <div className="productBody">

                <h3>{s.name}</h3>
            <div className="priceBox">

  {s.sale_price !== null && Number(s.sale_price) > 0 ? (
    <>
      <span className="priceLabel">
        Giá khuyến mãi
      </span>

      <div className="priceRow">
        <div className="priceSale">
          {Number(s.sale_price).toLocaleString("vi-VN")}
          <span className="currency">đ</span>
        </div>

        <div className="priceOld">
          {Number(s.price).toLocaleString("vi-VN")}đ
        </div>
      </div>
    </>
  ) : (
    <>
      <span className="priceLabel">
        Giá
      </span>

      <div className="priceSale">
        {Number(s.price).toLocaleString("vi-VN")}
        <span className="currency">đ</span>
      </div>
    </>
  )}

</div>
              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* BLOG */}
      <section className="section">

        <div className="sectionHeader">
          <h2>Bài viết mới</h2>
        </div>

        <div className="blogGrid">

          {posts.map((p) => (

            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="blogCard"
            >

              <div className="blogImg">

          <Image
  src={p.image}
  alt={p.title}
  width={600}
  height={400}
  sizes="(max-width:768px) 100vw, 33vw"
  className="cardImage"
/>
                <div className="imgOverlay">

                  <span className="imgBtn">
                    Xem bài viết
                  </span>

                </div>

              </div>

              <div className="blogBody">

                <h3>{p.name}</h3>

                <p>{p.description}</p>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}