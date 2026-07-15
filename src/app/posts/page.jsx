import Link from "next/link";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import "./page.css";
import BackButton from "@/components/BackButton/BackButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export const revalidate = 600;

export default async function HomePage() {

  const [
    productRes,
    postRes,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("status", "available")
        .eq("featured", true)

      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", {
        ascending: false,
      })
      .limit(3),

  ]);
  const products =
    productRes.data || [];

  const posts =
    postRes.data || [];

  return (
<main className="home">


<ScrollReveal>

<section className="section">

<div className="sectionHeader">
<h2>Bài viết mới</h2>
</div>


<div className="blogGrid">

{posts.map((p)=>(

<Link
key={p.id}
href={`/posts/${p.slug}`}
className="blogCard"
>


<div className="blogImg">

{p.image && (

<Image
src={p.image}
alt={p.title || "Bài viết"}
width={600}
height={400}
sizes="(max-width:768px) 100vw, 33vw"
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
{p.title}
</h3>


<p>
{p.description}
</p>


</div>


</Link>

))}


</div>


</section>

</ScrollReveal>





<ScrollReveal delay={0.2}>


<section className="section">


<div className="sectionHeader">

<BackButton />

<h2>
Sản phẩm bán chạy
</h2>


</div>



<div className="productGrid">


{products.map((s)=>(

<Link
key={s.id}
href={`/products/${s.slug}`}
className="productCard"
>


<div className="productImg">


{s.image && (

<Image
src={s.image}
alt={s.name || "Sản phẩm"}
width={600}
height={400}
sizes="(max-width:768px) 100vw, 33vw"
className="cardImage"
/>

)}


<div className="imgOverlay">

<span className="imgBtn">
Xem chi tiết
</span>

</div>


</div>



<div className="productBody">


<h3>
{s.name}
</h3>



<div className="priceBox">


<div className="priceOld">

{Number(s.price)
.toLocaleString("vi-VN")}đ

</div>


<span className="priceLabel">
Giá khuyến mãi
</span>



<div className="priceValue">

{Number(
s.sale_price || 0
)
.toLocaleString("vi-VN")}


<span className="currency">
đ
</span>


</div>


</div>



</div>


</Link>

))}


</div>


</section>


</ScrollReveal>



</main>
)
}