import BackButton from "@/components/BackButton/BackButton";
import "./page.css";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export default function AboutPage() {
  return (
    <div className="about">
      <BackButton />

      {/* HERO */}
      <ScrollReveal>
        <div className="about-hero">
          <span className="about-badge">🧋 TRÀ SỮA NHÀ NGỌC</span>

          <h1>
            Về Nhà Ngọc
          </h1>

          <p>
            Một địa điểm nhỏ xinh dành cho những ai yêu thích trà sữa,
            trà trái cây, cà phê và những món ăn vặt thơm ngon.
          </p>
        </div>
      </ScrollReveal>

      {/* WHO WE ARE */}
      <ScrollReveal delay={0.1}>
        <div className="about-section">
          <h2>
            🧋 Nhà Ngọc là ai?
          </h2>

          <p>
            Trà sữa Nhà Ngọc là nơi mang đến những thức uống và món ăn
            quen thuộc với hương vị dễ uống, thơm ngon và phù hợp để
            thưởng thức mỗi ngày.
          </p>

          <p>
            Từ một ly trà sữa mát lạnh, trà trái cây tươi mát đến cà phê
            và các món ăn vặt, Nhà Ngọc luôn mong muốn mang đến cho khách
            hàng một trải nghiệm gần gũi, thoải mái và đáng nhớ.
          </p>
        </div>
      </ScrollReveal>

      {/* MISSION / VISION */}
      <div className="about-grid">
        <ScrollReveal delay={0.1}>
          <div className="about-box">
            <div className="about-box-icon">🥤</div>

            <h3>
              Hương vị
            </h3>

            <p>
              Chú trọng hương vị thơm ngon, dễ uống và luôn cố gắng
              mang đến những món phù hợp với khẩu vị của khách hàng.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="about-box">
            <div className="about-box-icon">💗</div>

            <h3>
              Tận tâm
            </h3>

            <p>
              Luôn phục vụ khách hàng với sự thân thiện, nhiệt tình
              và mong muốn mỗi lần ghé Nhà Ngọc đều là một trải nghiệm vui vẻ.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* PRODUCTS */}
      <ScrollReveal delay={0.15}>
        <div className="about-section">
          <h2>
            🍓 Nhà Ngọc có gì?
          </h2>

          <ul>
            <li>
              🧋 Trà sữa thơm béo, nhiều lựa chọn
            </li>

            <li>
              🍓 Trà trái cây thanh mát
            </li>

            <li>
              ☕ Cà phê và các loại thức uống
            </li>

            <li>
              🍟 Đồ ăn vặt hấp dẫn
            </li>

            <li>
              💕 Nhiều lựa chọn phù hợp để thưởng thức cùng bạn bè
            </li>
          </ul>
        </div>
      </ScrollReveal>

      {/* VALUES */}
      <ScrollReveal delay={0.15}>
        <div className="about-section">
          <h2>
            💗 Điều Nhà Ngọc hướng đến
          </h2>

          <p>
            Nhà Ngọc mong muốn trở thành một địa điểm quen thuộc của mọi người
            khi cần một ly nước ngon, một món ăn vặt hoặc đơn giản là một nơi
            để thưởng thức món yêu thích cùng bạn bè.
          </p>

          <ul>
            <li>
              ✔ Chất lượng và hương vị được chú trọng
            </li>

            <li>
              ✔ Phục vụ thân thiện, nhiệt tình
            </li>

            <li>
              ✔ Món ăn và thức uống đa dạng
            </li>

            <li>
              ✔ Không ngừng cải thiện để phục vụ tốt hơn
            </li>
          </ul>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.2}>
        <div className="about-cta">
          <h2>
            🧋 Ghé Nhà Ngọc thưởng thức nhé!
          </h2>

          <p>
            Xem menu và lựa chọn món yêu thích của bạn ngay hôm nay.
          </p>

          <div className="about-cta-buttons">
            <Link
              href="/products"
              className="btnOutline"
            >
              Xem menu
            </Link>

            <Link
              href="/contact"
              className="btnOutline"
            >
              Đặt món ngay
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}