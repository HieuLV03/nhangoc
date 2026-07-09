"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import ButtonSearch from "../ButtonSearch/ButtonSearch";

import "./ProductList.css";

export default function ProductList({ products }) {
  const [keyword, setKeyword] = useState("");
const removeVietnameseTones = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
const filteredProducts = products.filter((item) =>
  removeVietnameseTones(item.name.toLowerCase()).includes(
    removeVietnameseTones(keyword.toLowerCase())
  )
);
  return (
    <>
      <ButtonSearch
        placeholder="Tìm sản phẩm..."
        textButton="Tìm"
        size="large"
        onSearch={setKeyword}
      />

      <div className="productGrid">
        {filteredProducts.map((item) => (
       <Link
  key={item.id}
  href={`/products/${item.slug}`}
  className="productCard"
  onClick={(e) => {
    e.currentTarget.classList.add("opening");
  }}
>
           <div className="productImg">

  {item.image && (
    <Image
      src={item.image}
      alt={item.name || "Sản phẩm"}
      width={1000}
      height={1500}
      sizes="(max-width:768px) 50vw, 33vw"
      className="cardImage"
    />
  )}


  <div className="imgOverlay">
              
              </div>
            </div>

            <div className="productBody">
              <h3 className="productTitle">
                {item.name}
              </h3>

              <p className="productDesc">
                {item.description}
              </p>

              <div className="productFooter">
                <div className="productPrice">
                  {item.sale_price ? (
                    <>
                      <span className="priceSale">
                        {Number(item.sale_price).toLocaleString("vi-VN")}₫
                      </span>

                      <span className="priceOld">
                        {Number(item.price).toLocaleString("vi-VN")}₫
                      </span>
                    </>
                  ) : (
                    <span className="priceSale">
                      {Number(item.price).toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredProducts.length === 0 && (
          <div className="emptyProduct">
            Không tìm thấy sản phẩm.
          </div>
        )}
      </div>
    </>
  );
}