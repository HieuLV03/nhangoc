import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import "./page.css";
import Slider from "@/components/Slider/Slider";

export const revalidate = 3600;

export default async function HomePage() {

  const [sliderRes, serviceRes, postRes] =
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
        .from("services")
        .select("*")
        .eq("status", "published")
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
        .limit(3),
    ]);

  const sliders = sliderRes.data || [];
  const services = serviceRes.data || [];
  const posts = postRes.data || [];

  return (
    <main className="homePage">

      {/* HERO */}
<Slider sliders={sliders} />
      {/* SERVICES */}
      <section className="section">

        <div className="sectionHeader">

          <span className="sectionTag">
            DỊCH VỤ
          </span>

          <h2>Dịch vụ nổi bật</h2>

        </div>

        <div className="serviceGrid">

          {services.map((item) => (

            <Link
              prefetch={true}
              key={item.id}
              href={`/services/${item.slug}`}
              className="serviceCard"
            >
<div className="serviceImg">
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
              <div className="serviceBody">

                <h3 className="serviceTitle">
                  {item.title}
                </h3>

                <p className="serviceDesc">
                  {item.short_description}
                </p>

                <div className="serviceFooter">

                  <span className="servicePrice">

                    {Number(
                      item.price || 0
                    ).toLocaleString("vi-VN")}₫

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