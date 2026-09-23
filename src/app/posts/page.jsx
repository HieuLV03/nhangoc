
import Link from "next/link";
import Image from "next/image";

import { supabase } from "@/lib/supabase";
import ListProduct from "@/components/ProductList/ProductList";
import BackButton from "@/components/BackButton/BackButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

import "./page.css";

export const revalidate = 600;

export default async function HomePage() {
  const [productRes, postRes] = await Promise.all([
    // Sản phẩm bán chạy / nổi bật
    supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .eq("featured", true)
      .order("created_at", {
        ascending: false,
      }),

    // 3 bài viết mới nhất
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", {
        ascending: false,
      })
      .limit(3),
  ]);

  const products = productRes.data || [];
  const posts = postRes.data || [];

  return (
    <main className="home">

      {/* =====================================================
          BÀI VIẾT MỚI
      ===================================================== */}

      <ScrollReveal>
        <section className="section">

          <div className="sectionHeader">
            <h2>Bài viết mới</h2>
          </div>

          <div className="blogGrid">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="blogCard"
              >

                <div className="blogImg">

                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title || "Bài viết"}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="cardImage"
                    />
                  )}

                  <div className="imgOverlay">
                    <span className="imgBtn">
                      Xem bài viết
                    </span>
                  </div>

                </div>

                <div className="blogBody">

                  <h3>
                    {post.title}
                  </h3>

                  <p>
                    {post.description}
                  </p>

                </div>

              </Link>
            ))}
          </div>

        </section>
      </ScrollReveal>


      {/* =====================================================
          SẢN PHẨM BÁN CHẠY
      ===================================================== */}

      <ScrollReveal delay={0.2}>
        <section className="section">

          <div className="sectionHeader">

            <BackButton />

            <h2>
              Sản phẩm bán chạy
            </h2>

          </div>

          <ListProduct products={products} />

          <div className="viewMoreWrap">

            <Link
              href="/products"
              className="viewMoreBtn"
            >
              Xem thêm sản phẩm

              <span>
                →
              </span>
            </Link>

          </div>

        </section>
      </ScrollReveal>

    </main>
  );
}
