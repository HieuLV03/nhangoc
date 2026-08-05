"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { supabase } from "@/lib/supabase";

import "./Header.css";


export default function Header(){


  const router = useRouter();

  const pathname = usePathname();


  const isAdminPage =
    pathname.startsWith("/admin");



  const [menuOpen,setMenuOpen] =
    useState(false);


  const [user,setUser] =
    useState(null);


  const [profile,setProfile] =
    useState(null);


  const [role,setRole] =
    useState("guest");


  const [loading,setLoading] =
    useState(true);


  const [showHeader,setShowHeader] =
    useState(true);




  /*
  ================================
  SMART HEADER
  ================================
  */


  useEffect(()=>{


    let lastY = 0;



    const handleScroll = ()=>{


      const currentY =
        document.documentElement.scrollTop ||
        document.body.scrollTop;



      if(
        currentY > lastY &&
        currentY > 80
      ){

        // scroll xuống
        setShowHeader(false);

      }
      else{

        // scroll lên
        setShowHeader(true);

      }



      lastY=currentY;


    };




    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive:true
      }
    );




    // hỗ trợ container scroll
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



    return ()=>{


      window.removeEventListener(
        "scroll",
        handleScroll
      );


    };


  },[]);





  /*
  ================================
  ADMIN CLASS
  ================================
  */


  useEffect(()=>{


    document.body.classList.toggle(
      "admin",
      role==="admin"
    );


  },[role]);






  /*
  ================================
  AUTH
  ================================
  */


  useEffect(()=>{


    const getUser = async()=>{


      const {

        data:{
          user

        }

      }
      =
      await supabase.auth.getUser();




      setUser(user);



      if(!user){


        setProfile(null);

        setRole("guest");

        setLoading(false);

        return;


      }




      const {

        data

      }
      =
      await supabase

      .from("users")

      .select(
        "name, role"
      )

      .eq(
        "id",
        user.id
      )

      .maybeSingle();




      setProfile(data);


      setRole(
        data?.role || "user"
      );


      setLoading(false);



    };




    getUser();




    const {

      data:listener

    }
    =
    supabase.auth.onAuthStateChange(()=>{


      getUser();


    });



    return ()=>{


      listener.subscription.unsubscribe();


    };



  },[]);






  const handleLogout = async()=>{


    await supabase.auth.signOut();


    router.push("/");


  };





  if(
    loading ||
    isAdminPage
  ){

    return null;

  }







  return (

    <>


      {
        role==="admin" && (

          <div className="adminBar">


            <Link href="/admin/posts">
              ➕ Bài viết
            </Link>


            <Link href="/admin/products">
              ➕ Sản phẩm
            </Link>


            <Link href="/admin/sliders">
              ➕ Slider
            </Link>


          </div>

        )
      }





      <div

        className={
          `menuOverlay ${
            menuOpen
            ?
            "active"
            :
            ""
          }`
        }


        onClick={()=>
          setMenuOpen(false)
        }

      />






      <header

        className={

          `header ${
            showHeader
            ?
            "show"
            :
            "hide"
          }

          ${
            role==="admin"
            ?
            "hasAdminBar"
            :
            ""
          }

          `

        }

      >





        <div className="headerLeft">


          <Link
            href="/"
            className="logo"
          >

            <Image

              src="/logokhongnen.png"

              alt="Nhà Ngọc"

              width={72}

              height={54}

              priority

            />

          </Link>


        </div>






        <button

          className="menuToggle"

          onClick={()=>
            setMenuOpen(!menuOpen)
          }

        >

          {
            menuOpen
            ?
            "✕"
            :
            "☰"
          }


        </button>







        <nav

          className={
            `nav ${
              menuOpen
              ?
              "active"
              :
              ""
            }`
          }

        >


          <Link href="/">
            Trang chủ
          </Link>


          <Link href="/products">
            Sản phẩm
          </Link>


          <Link href="/categories">
            Danh mục
          </Link>


          <Link href="/posts">
            Bài viết
          </Link>


          <Link href="/about">
            Giới thiệu
          </Link>


          <Link href="/contact">
            Liên hệ
          </Link>



        </nav>




      </header>


    </>

  );

}