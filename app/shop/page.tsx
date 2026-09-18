"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PRODUCTS = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Good Things Take Time Graphic Tee",
    description: "Wear patience, walk the mountain path",
    price: 600,
    badge: "Bestseller",
    aspect: "4/5",
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Same Dreams Bigger Plans Graphic Tee",
    description: "Same dreams, bigger plans, quiet confidence",
    price: 200,
    badge: "New",
    aspect: "1/1",
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Higher Than Yesterday Mountain Tee",
    description: "Rise higher than the day before",
    price: 300,
    badge: "New",
    aspect: "5/6",
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Discipline Builds Freedom Statue Tee",
    description: "Discipline sculpts the path to freedom",
    price: 400,
    badge: "Limited",
    aspect: "3/4",
  },
];

const FILTERS = ["All", "Graphic Tees", "Statement", "Limited"];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };
  const [added, setAdded] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
const products = [
  { id: 1, img: "/product-1.jpg", name: "Good Things Take Time Graphic Tee", description: "Wear patience, walk the mountain path", price: 600, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Same Dreams Bigger Plans Graphic Tee", description: "Same dreams, bigger plans, quiet confidence", price: 200, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Higher Than Yesterday Mountain Tee", description: "Rise higher than the day before", price: 300, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Discipline Builds Freedom Statue Tee", description: "Discipline sculpts the path to freedom", price: 400, badge: "" }
];
    return () => io.disconnect();
  }, []);

  const handleAddToCart = (p: typeof PRODUCTS[number]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{`
        .will-reveal { opacity: 0; transform: translateY(24px); }
        .reveal { transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <Navbar />

      {/* Header */}
      <section
        className="reveal"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "56px 24px 32px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          The Full Range
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--text)",
            margin: 0,
          }}
        >
          Shop All Tees
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "var(--muted)",
            maxWidth: 520,
            marginTop: 16,
          }}
        >
          Heavyweight cotton, screen-printed graphics that don't crack, cut for the way you actually move. Every tee built different.
        </p>

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 32,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "10px 20px",
                borderRadius: "var(--radius-pill)",
                border: activeFilter === f ? "none" : "1px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                background: activeFilter === f ? "var(--primary)" : "transparent",
                color: activeFilter === f ? "var(--bg)" : "var(--text)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                minHeight: 44,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section
        className="reveal"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px 40px",
        }}
      >
        <div
          className="columns-1 sm:columns-2 lg:columns-3"
          style={{ columnGap: 24 }}
        >
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              style={{
                breakInside: "avoid",
                marginBottom: 24,
                background: "var(--bg)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "var(--transition-smooth)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                )
              }
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    aspectRatio: p.aspect,
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.7s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                {p.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      transform: "rotate(-3deg)",
                      background: "var(--primary)",
                      color: "var(--bg)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "6px 12px",
                      borderRadius: 2,
                      pointerEvents: "none",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>

              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    lineHeight: 1.25,
                    margin: 0,
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                    margin: "6px 0 14px",
                    lineHeight: 1.5,
                  }}
                >
                  {p.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "10px 16px",
                      borderRadius: 2,
                      border: "none",
                      background: "var(--primary)",
                      color: "var(--bg)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      minHeight: 44,
                      boxShadow: "none",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    {added === p.id ? "Added ✓" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="reveal"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--muted)",
            borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)",
            paddingTop: 32,
          }}
        >
          <span>★★★★★ 1,200+ reviews</span>
          <span>Made in India</span>
          <span>Free delivery above ₹999</span>
          <span>7-day easy returns</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}