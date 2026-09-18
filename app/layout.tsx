import type { Metadata } from "next";
import CartProvider from "../components/CartContext";
import Toast from "../components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tshirt",
  description: "a premium product",
  openGraph: { title: "Tshirt", description: "a premium product", type: "website", images: ["/product-1.jpg"] },
  twitter: { card: "summary_large_image", title: "Tshirt", description: "a premium product" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICAgIHdpZHRoPSIyMiIKICAgICAgaGVpZ2h0PSIyMiIKICAgICAgdmlld0JveD0iMCAwIDI0IDI0IgogICAgICBmaWxsPSJub25lIgogICAgICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICAgICAgc3Ryb2tlV2lkdGg9IjEuOCIKICAgICAgc3Ryb2tlTGluZWNhcD0icm91bmQiCiAgICAgIHN0cm9rZUxpbmVqb2luPSJyb3VuZCIKICAgID4KICAgICAgPGNpcmNsZSBjeD0iOSIgY3k9IjIxIiByPSIxIiAvPgogICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIxIiByPSIxIiAvPgogICAgICA8cGF0aCBkPSJNMSAxaDRsMi42OCAxMy4zOWEyIDIgMCAwIDAgMiAxLjYxaDkuNzJhMiAyIDAgMCAwIDItMS42MUwyMyA2SDYiIC8+CiAgICA8L3N2Zz4=" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "try{if(location.search.indexOf('screenshot=1')>-1){var s=document.createElement('style');s.textContent='*{animation:none!important;transition:none!important}.will-reveal,.is-hidden,[class*=reveal],[class*=fade]{opacity:1!important;transform:none!important;visibility:visible!important}';document.head.appendChild(s);}}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Tshirt", logo: "/product-1.jpg", url: process.env.VAANI_SITE_URL || undefined }) }} />
      </head>
      <body>
        <CartProvider>
          <Toast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
