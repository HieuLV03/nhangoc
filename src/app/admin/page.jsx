import Link from "next/link";
import "./admin.css";
export default function Dashboard() {
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
    <span>0</span>
  </div>
</Link>
  <Link href="/admin/categories" className="card">
          <div className="cardIcon">📂</div>
          <div>
            <h3>Danh mục</h3>
            <span>0</span>
          </div>
        </Link>
 <Link href="/admin/products" className="card">
  <div className="cardIcon">📦</div>

  <div>
    <h3>Sản phẩm</h3>
    <span>0</span>
  </div>
</Link>

<Link href="/admin/sliders" className="card">
  <div className="cardIcon">🖼️</div>

  <div>
    <h3>Slider</h3>
    <span>0</span>
  </div>
</Link>
      </div>

    </div>
  );
}