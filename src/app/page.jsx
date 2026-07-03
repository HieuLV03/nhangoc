import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import "./page.css";
import Slider from "@/components/Slider/Slider";

export const revalidate = 3600;

export default async function HomePage() {

  const [sliderRes, productRes, postRes] =
    await Promise.all([

      supabase
        .from("sliders")
        .select("*")
        .eq("status", "published")
        .order("created_at", {
          ascending: false,
        })
        .limit(5),

      supabase
        .from("products")
        .select("*")
        .eq("status", "available")
        .eq("featured", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(6),

      supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(5),
    ]);

  const sliders = sliderRes.data || [];
  const products = productRes.data || [];
  const posts = postRes.data || [];

  return (
    <main className="homePage">

      {/* HERO */}
<Slider sliders={sliders} />
      <section className="section">

        <div className="sectionHeader">

          <span className="sectionTag">
            SẢN PHẨM
          </span>

          <h2>Best Seller</h2>

        </div>

        <div className="productGrid">

          {products.map((item) => (

            <Link
              prefetch={true}
              key={item.id}
              href={`/products/${item.slug}`}
              className="productCard"
            >
<div className="productImg">
  <Image
    src={item.image}
    alt={item.title}
     width={0}
  height={0}
  sizes="100vw"
    className="cardImage"
  />

  <div className="imgOverlay">
    <div className="imgCta">
      <span>Xem chi tiết</span>
    </div>
  </div>
</div>
              <div className="productBody">

                <h3 className="productTitle">
                  {item.title}
                </h3>

                <p className="productDesc">
                  {item.short_description}
                </p>

                <div className="productFooter">

        <span className="productPrice">
  <span className="priceLabel">Giá Ưu đãi</span>
  <span className="priceValue">
    {Number(item.price || 0).toLocaleString("vi-VN")}₫
  </span>
</span>
                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* BLOG */}
      <section className="section">

        <div className="sectionHeader">

          <span className="sectionTag">
            BLOG
          </span>

          <h2>Bài viết mới</h2>

        </div>

        <div className="blogGrid">

          {posts.map((post) => (

            <Link
              prefetch={true}
              key={post.id}
              href={`/posts/${post.slug}`}
              className="blogCard"
            >

              {post.image && (
<div className="blogImg">
  <Image
    src={post.image}
    alt={post.title}
     width={0}
  height={0}
  sizes="100vw"
    className="cardImage"
  />

  <div className="imgOverlay">
    <div className="imgCta">
      <span>Xem bài viết</span>
    </div>
  </div>
</div>
              )}

              <div className="blogBody">

                <h3>{post.title}</h3>

                <p>{post.description}</p>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}