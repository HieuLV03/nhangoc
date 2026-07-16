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
<section className="section introSection">
  <div className="introContent">
    <span className="sectionTag">TRÀ SỮA NHÀ NGỌC</span>

    <h1>Trà sữa Nhà Ngọc – Thức uống thơm ngon, chất lượng mỗi ngày</h1>

    <p>
      Trà sữa Nhà Ngọc chuyên phục vụ các loại trà sữa, trà trái cây,
      cà phê và đồ uống được pha chế từ nguyên liệu chất lượng.
      Với thực đơn đa dạng, hương vị thơm ngon và mức giá hợp lý,
      chúng tôi mong muốn mang đến cho khách hàng những ly đồ uống
      tươi ngon trong từng lần thưởng thức.
    </p>

    <p>
      Ngoài các món bán chạy như trà sữa truyền thống, trà sữa khoai môn,
      trà đào, trà vải và nhiều loại topping hấp dẫn,
      Trà sữa Nhà Ngọc luôn cập nhật những thức uống mới để đáp ứng
      sở thích của mọi khách hàng.
    </p>
  </div>
</section>
<ScrollReveal>

      <section className="section">

        <div className="sectionHeader">

          <span className="sectionTag">
            SẢN PHẨM
          </span>

          <h2>Best Seller</h2>

        </div>

      <ListProduct products={products} />
<div className="viewMoreWrap">
  <Link href="/products" className="viewMoreBtn">
    Xem thêm sản phẩm
        <span>→</span>

  </Link>
</div>
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
<div className="viewMoreWrap">
  <Link href="/posts" className="viewMoreBtn">
    Xem thêm bài viết
    <span>→</span>
  </Link>
</div>
      </section>

    </main>
  );
}