import "./globals.css";
import ClientLayout from "@/components/Layout/ClientLayout";
import Script from "next/script";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable}`}
    >
      <head>
        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject = t;
              var ttq = w[t] = w[t] || [];

              ttq.methods = [
                "page","track","identify","instances","debug","on","off","once","ready"
              ];

              ttq.setAndDefer = function (t, e) {
                t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                };
              };

              for (var i = 0; i < ttq.methods.length; i++) {
                ttq.setAndDefer(ttq, ttq.methods[i]);
              }

              ttq.load = function (id) {
                var src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + id;
                var s = document.createElement("script");
                s.async = true;
                s.src = src;
                document.head.appendChild(s);
              };

              ttq.load("D8GH643C77UDLID670L0");
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      </head>

      <body className="appBody">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}