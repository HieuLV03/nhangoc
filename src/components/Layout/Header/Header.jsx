"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

import "./Header.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
const isAdminPage = pathname.startsWith("/admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);
useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY && currentY > 80) {
      setShowHeader(false); // kéo xuống → ẩn
    } else {
      setShowHeader(true); // kéo lên → hiện ngay
    }

    lastScrollY = currentY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
useEffect(() => {
  document.body.classList.toggle("admin", role === "admin");
}, [role]);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        setProfile(null);
        setRole("guest");
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setRole(data?.role || "user");
      setLoading(false);
    };

    getUser();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => {
        getUser();
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

if (loading || isAdminPage) {
  return null;
}
  return (
    <>
      {/* ADMIN BAR */}
      {role === "admin" && (
        <div className="adminBar">
          <Link href="/admin/posts">➕ Bài viết</Link>
          <Link href="/admin/services">➕ Dịch vụ</Link>
            <Link href="/admin/sliders">
      ➕ Slider
    </Link>
        </div>
      )}
  {menuOpen && (
  <div
    className="menuOverlay"
    onClick={() => setMenuOpen(false)}
  />
)}
      {/* HEADER */}
<header className={`header ${showHeader ? "show" : "hide"} ${role === "admin" ? "hasAdminBar" : ""}`}>

          <div className="headerLeft">
        <Link href="/" className="logo">
  <Image
    src="/logokhongnen.png"
    alt="MIREC"
    width={72}
    height={54}
    priority
  />
</Link>
        </div>

        <button
          className="menuToggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)}>Dịch vụ</Link>
          <Link href="/posts" onClick={() => setMenuOpen(false)}>Bài viết</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>Giới thiệu</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Liên hệ</Link>
        </nav>
      </header>
    </>
  );
}