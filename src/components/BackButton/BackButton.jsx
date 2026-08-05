"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import "./BackButton.css";


export default function BackButton(){

  const router = useRouter();

  const [show,setShow] = useState(true);



  useEffect(()=>{


    console.log("BackButton mounted");


    let lastY = 0;


    const handleScroll = ()=>{


      const currentY =
        document.documentElement.scrollTop ||
        document.body.scrollTop;


      console.log(
        "current scroll:",
        currentY
      );



      if(currentY > lastY && currentY > 80){

        setShow(false);

      }
      else{

        setShow(true);

      }


      lastY=currentY;


    };



    // bắt window
    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive:true
      }
    );


    // bắt tất cả container scroll
    const containers =
      document.querySelectorAll("*");



    containers.forEach(el=>{


      const style =
        window.getComputedStyle(el);



      if(
        style.overflowY==="auto" ||
        style.overflowY==="scroll"
      ){

        el.addEventListener(
          "scroll",
          handleScroll,
          {
            passive:true
          }
        );

      }


    });



    return()=>{


      window.removeEventListener(
        "scroll",
        handleScroll
      );


      containers.forEach(el=>{


        el.removeEventListener(
          "scroll",
          handleScroll
        );


      });


    };


  },[]);



  return (

    <button

      className={
        `backBtn ${
          show
          ?"show"
          :"hide"
        }`
      }

      onClick={()=>router.back()}

    >

      ← Trở về


    </button>

  );

}