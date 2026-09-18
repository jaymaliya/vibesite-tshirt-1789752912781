"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    specs: [
      { label: "Fabric", value: "100% Cotton" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Care", value: "Machine wash cold, inside out" },
      { label: "Sizes", value: "S–XXL" },
      { label: "Print", value: "Screen print graphic" },
    ],
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Same Dreams Bigger Plans Graphic Tee",
    description: "Same dreams, bigger plans, quiet confidence",
    price: 200,
    specs: [
      { label: "Fabric", value: "100% Cotton" },
      { label: "Fit", value: "Relaxed Fit" },
      { label: "Care", value: "Machine wash cold, inside out" },
      { label: "Sizes", value: "S–XXL" },
      { label: "Print", value: "Screen print graphic" },
    ],
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Higher Than Yesterday Mountain Tee",
    description: "Rise higher than the day before",
    price: 300,
    specs: [
      { label: "Fabric", value: "100% Cotton" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Care", value: "Machine wash cold, inside out" },
      { label: "Sizes", value: "S–XXL" },
      { label: "Print", value: "Photographic screen print" },
    ],
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Discipline Builds Freedom Statue Tee",
    description: "Discipline sculpts the path to freedom",
    price: 400,
    specs: [
      { label: "Fabric", value: "100% Cotton" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Care", value: "Machine wash cold, inside out" },
      { label: "Sizes", value: "S–XXL" },
      { label: "Print", value: "Glitch-style photographic print" },
    ],
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const REVIEWS = [
  { name: "Tanmay Kulkarni", city: "Nashik", rating: 5, quote: "Screen print on the Good Things tee held up through two months of daily wear and washes. Fabric is thicker than I expected for the price." },
  { name: "Aaftab Rehman Shaikh", city: "Bhopal", rating: 4, quote: "Regular fit runs true to size on me at 5'9\". Would've liked a slightly longer hem but the print quality is genuinely premium." },
  { name: "Lianne D'Souza", city: "Panjim", rating: 5, quote: "Bought this as a birthday gift and the graphic print looked exactly like the photos — no cracking, no fading after first wash." },
];

function StarRow({ rating }: { rating: number }) {
const products = [
  { id: 1, img: "/product-1.jpg", name: "Good Things Take Time Graphic Tee", description: "Wear patience, walk the mountain path", price: 600, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Same Dreams Bigger Plans Graphic Tee", description: "Same dreams, bigger plans, quiet confidence", price: 200, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Higher Than Yesterday Mountain Tee", description: "Rise higher than the day before", price: 300, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Discipline Builds Freedom Statue Tee", description: "Discipline sculpts the path to freedom", price: 400, badge: "" }
];
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5">
          <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" />
        </svg>
      ))}
    </div>
  );
}

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;
  const displayImg = paramImg ?? "/product-1.jpg";
  const { addItem } = useCart() ?? { addItem: () => {} };

  const current = PRODUCTS.find((p) => p.name === paramName) ?? PRODUCTS[0];
  const displayName = paramName ?? current.name;
  const displayPrice = paramPrice ?? current.price;

  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const handleAddToCart = () => {
    addItem({ id: `product-${current.id}`, name: displayName, price: displayPrice, quantity: qty, image: displayImg });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${current.id}`, name: displayName, price: displayPrice, quantity: qty, image: displayImg });
    router.push("/checkout");
  };

  const related = PRODUCTS.filter((p) => p.name !== displayName).slice(0, 3);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <style>{`
        .will-reveal { opacity: 0; transform: translateY(24px); }
        .reveal { transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .masonry-col { column-gap: 24px; }
        @media (max-width: 767px) { .masonry-col { column-count: 1 !important; } }
      `}</style>
      <Navbar />

      {/* HERO / DETAIL */}
      <section className="reveal" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "0",
            maxWidth: "1440px",
            margin: "0 auto",
            alignItems: "stretch",
          }}
        >
          <div style={{ overflow: "hidden", background: "var(--surface)" }}>
            <img
              src={displayImg}
              alt={displayName}
              style={{ width: "100%", height: "100%", minHeight: "420px", maxHeight: "720px", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          <div style={{ padding: "40px clamp(20px,5vw,64px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
            <span
              style={{
                display: "inline-block",
                width: "fit-content",
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
                color: "var(--accent)",
              }}
            >
              Built Different
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem,4.5vw,3.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--text)",
                margin: 0,
              }}
            >
              {displayName}
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "480px" }}>{current.description}</p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <StarRow rating={5} />
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>128 reviews · Made in India</span>
            </div>

            <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", margin: "4px 0 0" }}>
              ₹{displayPrice.toLocaleString("en-IN")}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>Free shipping on orders above ₹999</p>

            {/* Size selector */}
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", fontWeight: 600 }}>Size</span>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      minWidth: "44px",
                      height: "44px",
                      padding: "0 14px",
                      borderRadius: "var(--radius-sm)",
                      border: size === s ? "2px solid var(--primary)" : "1px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                      background: size === s ? "var(--primary)" : "transparent",
                      color: size === s ? "#fff" : "var(--text)",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + CTAs */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid color-mix(in srgb, var(--muted) 40%, transparent)", borderRadius: "var(--radius-sm)" }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: "44px", height: "44px", background: "transparent", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--text)" }}
                >
                  −
                </button>
                <span style={{ width: "36px", textAlign: "center", fontWeight: 600 }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{ width: "44px", height: "44px", background: "transparent", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--text)" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  padding: "14px 28px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid var(--primary)",
                  background: "transparent",
                  color: "var(--primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {added ? "Added ✓" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                style={{
                  padding: "14px 28px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Buy Now
              </button>
            </div>

            {/* Specs */}
            {current.specs && current.specs.length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", fontWeight: 600 }}>
                  Specifications
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "12px", marginTop: "12px" }}>
                  {current.specs.map((s, i) => (
                    <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)" }}>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                      <div style={{ fontSize: "0.95rem", color: "var(--text)", fontWeight: 500, marginTop: "2px" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHT — SIGNATURE BENTO */}
      <section
        id="feature-highlight"
        className="reveal"
        style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--surface)" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              fontWeight: 700,
              color: "var(--bg)",
              letterSpacing: "-0.015em",
              marginBottom: "40px",
            }}
          >
            Why It Holds Up
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gridAutoRows: "180px",
              gap: "16px",
            }}
            className="bento-feature"
          >
            <div
              style={{
                gridColumn: "span 2",
                gridRow: "span 2",
                background: "color-mix(in srgb, var(--accent) 18%, var(--surface))",
                borderRadius: "0",
                border: "2px solid var(--accent)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", fontWeight: 700 }}>
                The Fabric
              </span>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontStyle: "italic", color: "var(--bg)", lineHeight: 1.3 }}>
                "100% combed cotton, heavier than a standard tee — it drapes instead of clinging."
              </p>
            </div>

            <div
              style={{
                background: "var(--bg)",
                borderRadius: "0",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", fontWeight: 700, color: "var(--primary)" }}>200 GSM</span>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Fabric Weight</span>
            </div>

            <div
              style={{
                background: "var(--bg)",
                borderRadius: "0",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", fontWeight: 700, color: "var(--primary)" }}>15+</span>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Washes, No Crack</span>
            </div>

            <div
              style={{
                gridColumn: "span 2",
                background: "var(--bg)",
                borderRadius: "0",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "0.95rem", color: "var(--text)", fontWeight: 500 }}>{current.specs?.find((s) => s.label === "Print")?.value ?? "Screen print graphic"}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Won't fade, won't peel
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* YOU MIGHT ALSO LIKE — masonry */}
      <section className="reveal" style={{ padding: "var(--space-section) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.015em",
              marginBottom: "32px",
            }}
          >
            You Might Also Like
          </h2>
          <div className="masonry-col" style={{ columnCount: 2, columnGap: "24px" }}>
            {related.map((p, idx) => (
              <article
                key={p.id}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{
                  breakInside: "avoid",
                  marginBottom: "24px",
                  cursor: "pointer",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
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
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 2,
                      background: "var(--primary)",
                      color: "var(--bg)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      padding: "5px 10px",
                      borderRadius: "var(--radius-sm)",
                      transform: "rotate(-3deg)",
                    }}
                  >
                    {idx === 0 ? "Bestseller" : "New"}
                  </span>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: idx % 2 === 0 ? "360px" : "260px",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--text)", margin: 0 }}>{p.name}</h3>
                  <p style={{ marginTop: "6px", color: "var(--accent)", fontWeight: 700 }}>₹{p.price.toLocaleString("en-IN")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS — bare editorial text, no card chrome */}
      <section className="reveal" style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.015em",
              marginBottom: "32px",
            }}
          >
            What Customers Say
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "0",
            }}
          >
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "0 28px",
                  borderLeft: i !== 0 ? "1px solid color-mix(in srgb, var(--muted) 30%, transparent)" : "none",
                  marginTop: i === 0 ? 0 : undefined,
                }}
              >
                <StarRow rating={r.rating} />
                <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--text)", margin: "14px 0" }}>"{r.quote}"</p>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600, margin: 0 }}>
                  {r.name} <span style={{ fontWeight: 400 }}>· {r.city}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile bar */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 20px",
            background: "var(--bg)",
            borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 50,
            boxShadow: "var(--shadow-md)",
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)" }}>
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          <button
            onClick={handleAddToCart}
            style={{
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              minHeight: "44px",
            }}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}