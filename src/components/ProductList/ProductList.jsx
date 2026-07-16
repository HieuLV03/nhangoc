"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
    removeVietnameseTones(
      item.name.toLowerCase()
    ).includes(
      removeVietnameseTones(
        keyword.toLowerCase()
      )
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


{
filteredProducts.map((item,index)=>(


<motion.div

key={item.id}


initial={{

opacity:0,

y:60,

scale:0.95

}}


whileInView={{

opacity:1,

y:0,

scale:1

}}


viewport={{

once:true,

amount:0.2

}}


transition={{

duration:0.6,

delay:index * 0.08,

ease:[0.22,1,0.36,1]

}}


whileHover={{

y:-8,

scale:1.02

}}


>



<Link

href={`/products/${item.slug}`}

className="productCard"


>


<div className="productImg">


{
item.image && (

<Image

src={item.image}

alt={item.name || "Sản phẩm"}

width={1000}

height={1500}

sizes="(max-width:768px) 50vw,33vw"

className="cardImage"

/>

)

}


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


<div className="productPrice">


{
item.sale_price ? (

<>

<span className="priceSale">

{
Number(item.sale_price)
.toLocaleString("vi-VN")
}₫

</span>


<span className="priceOld">

{
Number(item.price)
.toLocaleString("vi-VN")
}₫

</span>


</>

):(


<span className="priceSale">

{
Number(item.price)
.toLocaleString("vi-VN")
}₫

</span>


)

}


</div>

</div>



</Link>


</motion.div>



))

}



{
filteredProducts.length===0 && (

<div className="emptyProduct">

Không tìm thấy sản phẩm.

</div>

)

}


</div>


</>

);

}