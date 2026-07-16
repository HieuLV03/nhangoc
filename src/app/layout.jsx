import "./globals.css";
import ClientLayout from "@/components/Layout/ClientLayout";

import { Inter, Playfair_Display, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata = {
  metadataBase: new URL("https://nhangoc.vercel.app"),
  title: {
    default: "Trà sữa Nhà Ngọc | Trà sữa ngon, trà trái cây, đồ uống & ăn vặt chất lượng",
    template: "%s | Trà sữa Nhà Ngọc",
  },
  description:
    "Trà sữa Nhà Ngọc chuyên phục vụ trà sữa, trà trái cây, cà phê và nhiều loại đồ uống thơm ngon.",
  verification: {
    google: "iMhkqfnYHYPZ2e7ZhvNa8URs0nteVRjtS03F9CKa0sU",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable}`}
    >
      <body className="appBody">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}