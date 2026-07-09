import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./admin.css";

export default async function Dashboard() {
const [
  { count: postCount },
  { count: categoryCount },
  { count: productCount },
  { count: sliderCount },
] = await Promise.all([
  supabase.from("posts").select("id", { count: "exact", head: true }),
  supabase.from("categories").select("id", { count: "exact", head: true }),
  supabase.from("products").select("id", { count: "exact", head: true }),
  supabase.from("sliders").select("id", { count: "exact", head: true }),
]);
  return (
    <div className="dashboard">
      <div className="dashboardHeader">
        <div>
          <h1>Dashboard</h1>
          <p>Chào mừng bạn quay trở lại 👋</p>
        </div>
      </div>

      <div className="cards">
        <Link href="/admin/posts" className="card">
          <div className="cardIcon">📰</div>
          <div>
            <h3>Bài viết</h3>
            <span>{postCount ?? 0}</span>
          </div>
        </Link>

        <Link href="/admin/categories" className="card">
          <div className="cardIcon">📂</div>
          <div>
            <h3>Danh mục</h3>
            <span>{categoryCount ?? 0}</span>
          </div>
        </Link>

        <Link href="/admin/products" className="card">
          <div className="cardIcon">📦</div>
          <div>
            <h3>Sản phẩm</h3>
            <span>{productCount ?? 0}</span>
          </div>
        </Link>

        <Link href="/admin/sliders" className="card">
          <div className="cardIcon">🖼️</div>
          <div>
            <h3>Slider</h3>
            <span>{sliderCount ?? 0}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}