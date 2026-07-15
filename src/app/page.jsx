import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ListProduct from "../components/ProductList/ProductList";
import "./page.css";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import Slider from "@/components/Slider/Slider";

export const revalidate = 600;

export default async function HomePage() {

  const [sliderRes, productRes, postRes] =
    await Promise.all([

      supabase
        .from("sliders")
        .select("*")
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
console.log("sliderRes", sliderRes);
console.log("sliderData", sliderRes.data);
console.log("sliderError", sliderRes.error);
  const sliders = sliderRes.data || [];
  const products = productRes.data || [];
  const posts = postRes.data || [];

  return (
    <main className="homePage">

      {/* HERO */}
<Slider sliders={sliders} />
<ScrollReveal>

      <section className="section">

        <div className="sectionHeader">

          <span className="sectionTag">
            SẢN PHẨM
          </span>

          <h2>Best Seller</h2>

        </div>

      <ListProduct products={products} />

      </section>
</ScrollReveal>

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