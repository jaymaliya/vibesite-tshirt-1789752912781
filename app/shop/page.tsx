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

function getCardSpans(p: typeof PRODUCTS[number]) {
  const [w, h] = p.aspect.split("/").map(Number);
  const ratio = h / w;
  const colSpan = p.badge === "Bestseller" ? 2 : 1;
  const baseCol = 280;
  const width = colSpan === 2 ? baseCol * 2 + 24 : baseCol;
  const imgHeight = width * ratio;
  const totalHeight = imgHeight + 172;
  const rowSpan = Math.max(30, Math.round(totalHeight / 10));
  return { colSpan, rowSpan };
}

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
        .shop-masonry {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 10px;
          grid-auto-flow: dense;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .shop-masonry { grid-template-columns: repeat(4, 1fr); }
        }
        .trust-item + .trust-item {
          border-left: 1px solid color-mix(in srgb, var(--bg) 22%, transparent);
        }
        @media (max-width: 640px) {
          .trust-item + .trust-item { border-left: none; }
        }
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
            marginBottom: 0,
          }}
        >
          Heavyweight cotton, screen-printed graphics that don't crack, cut for the way you actually move. Every tee built different.
        </p>

        {/* Filter pills — left-aligned, tight rhythm under subhead */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 20,
            maxWidth: 560,
            justifyContent: "flex-start",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 600,
                padding: "9px 18px",
                borderRadius: "var(--radius-pill)",
                border: activeFilter === f ? "none" : "1px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                background: activeFilter === f ? "var(--primary)" : "transparent",
                color: activeFilter === f ? "var(--bg)" : "var(--text)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                minHeight: 40,
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

      {/* Masonry / bento product grid */}
      <section
        className="reveal"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px 48px",
        }}
      >
        <div className="shop-masonry">
          {PRODUCTS.map((p) => {
            const { colSpan, rowSpan } = getCardSpans(p);
            return (
              <article
                key={p.id}
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-xl)";
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
                <div style={{ position: "relative", overflow: "hidden", flex: "0 0 auto" }}>
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

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: colSpan === 2 ? "1.4rem" : "1.15rem",
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
                      marginTop: "auto",
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
            );
          })}
        </div>
      </section>

      {/* Trust band — its own weighted section */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "var(--space-section) 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
          }}
        >
          {[
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 21 12 17.27 5.8 21 7 14.14l-5-4.87 7.1-1.01L12 2z" strokeLinejoin="round" />
                </svg>
              ),
              label: "1,200+ five-star reviews",
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                  <path d="M4 21V4a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v10l-4-2-4 2-4-2-3 1.5V21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              label: "Made in India",
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                  <rect x="1" y="7" width="14" height="10" rx="1" strokeLinejoin="round" />
                  <path d="M15 10h3l3 3v4h-6" strokeLinejoin="round" />
                  <circle cx="6" cy="19" r="1.6" />
                  <circle cx="17" cy="19" r="1.6" />
                </svg>
              ),
              label: "Free delivery above ₹999",
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                  <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
                  <path d="M3 3v6h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              label: "7-day easy returns",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="trust-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                padding: "8px 40px",
                minWidth: 180,
              }}
            >
              {item.icon}
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--bg)",
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}