"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    FiHome,
    FiFileText,
    FiGrid,
    FiImage,
    FiSettings,
    FiLogOut
} from "react-icons/fi";

export default function Sidebar() {

    const pathname = usePathname();

    const menus = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: <FiHome />
        },
        {
            name: "Bài viết",
            href: "/admin/posts",
            icon: <FiFileText />
        },
        {
            name: "Dịch vụ",
            href: "/admin/products",
            icon: <FiGrid />
        },
        {
            name: "Slider",
            href: "/admin/sliders",
            icon: <FiImage />
        },
        {
            name: "Cài đặt",
            href: "/admin/settings",
            icon: <FiSettings />
        }
    ];

    return (

        <aside className="sidebar">

            <div className="logo">
                ADMIN
            </div>

            <nav>

                {
                    menus.map(menu => (

                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={
                                pathname.startsWith(menu.href)
                                    ? "active"
                                    : ""
                            }
                        >
                            {menu.icon}

                            <span>
                                {menu.name}
                            </span>

                        </Link>

                    ))
                }

            </nav>

            <button className="logout">
                <FiLogOut />
                Đăng xuất
            </button>

        </aside>

    );

}