"use client";

import "./Slider.css";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

export default function Slider({
  sliders,
}) {
  return (
    <section className="heroSlider">

      {sliders.length > 0 && (
        <Swiper
          modules={[
            Autoplay,
            Pagination,
          ]}
          slidesPerView={1}
          loop={sliders.length > 1}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="heroSwiper"
        >
          {sliders.map((item, index) => (
            <SwiperSlide key={item.id}>

              <div className="heroSlide">

        <Image
  src={item.image}
  alt={item.title || "Banner trang chủ"}
  fill
  priority={index === 0}
  sizes="100vw"
  className="heroImg"
/>
                <div className="heroOverlay" />

                <div className="heroContent">

                  <div className="heroActions">

                    <Link
                      href="/products"
                      className="btnOutline"
                        aria-label="Xem danh sách sản phẩm"

                    >
                      Xem sản phẩm
                    </Link>

                    <Link
                      href="/posts"
                      className="btnOutline"
                        aria-label="Xem bài viết làm đẹp"

                    >
                      Xem bài viết
                    </Link>

                  </div>

                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      )}

    </section>
  );
}