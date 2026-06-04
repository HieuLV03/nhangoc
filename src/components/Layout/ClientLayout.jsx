"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Header from "@/components/Layout/Header/Header";
import Footer from "@/components//Layout/Footer/Footer";
import ZaloButton from "@/components/ZaloButton/ZaloButton";
import BookingButton from "@/components/BookingButton/BookingButton";
import BookingPopup from "@/components/BookingPopup/BookingPopup";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.ttq) {
      window.ttq.page();
    }
  }, [pathname]);

  return (
    <>
      <Header />
      <main>{children}</main>
      <ZaloButton />
      <BookingButton />
      <BookingPopup />
      <Footer />
    </>
  );
}