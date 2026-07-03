"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./BookingButton.css";

export default function BookingButton() {
  const [burst, setBurst] = useState(false);

  const triggerBurst = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
  };

  useEffect(() => {
    window.triggerBookingBurst = triggerBurst;
  }, []);

  return (
    <Link href="/booking" className="bookingFloat">
      <div className={`bookingIcon ${burst ? "burst" : ""}`}>
        📅
      </div>
    </Link>
  );
}