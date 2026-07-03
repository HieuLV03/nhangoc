"use client";

import { useRouter } from "next/navigation";
import "./BackButton.css";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="backBtn"
      onClick={() => router.back()}
    >
      <span>←</span>
      <span>Trở về</span>
    </button>
  );
}