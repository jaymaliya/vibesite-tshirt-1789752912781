"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PRODUCTS = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Good Things Take Time Graphic Tee",
    description: "Wear patience, walk the mountain path",
    price: 600,
    badge: "Bestseller",
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Same Dreams Bigger Plans Graphic Tee",
    description: "Same dreams, bigger plans, quiet confidence",
    price: 200,
    badge: "New",
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Higher Than Yesterday Mountain Tee",
    description: "Rise higher than the day before",
    price: 300,
    badge: "New",
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Discipline Builds Freedom Statue Tee",
    description: "Discipline sculpts the path to freedom",
    price: 400,
    badge: "Limited",
  },
];

const REVIEWS = [
  { name: "Ishaan Bhattacharya", city: "Kolkata", rating: 5, quote: "The mountain print on the Good Things tee hasn't cracked after 15 washes. Fabric feels heavier than any ₹600 tee I've owned." },
  { name: "Meher Kaur Sidhu", city: "Amritsar", rating: 4, quote: "Relaxed fit on the Bigger Plans tee is exactly what I wanted — roomy but not baggy. Wish sizing ran one size smaller." },
  { name: "Devansh Poojary", city: "Udupi", rating: 5, quote: "Ordered the Statue tee for a friend's birthday, the glitch print looks even better in person. Delivery was quick too." },
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

export default function Home() {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "sending" | "done">("idle");

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

  const handleAdd = (p: typeof PRODUCTS[number]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, image: p.img, quantity: 1 });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const goToProduct = (p: typeof PRODUCTS[number]) =>
    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);

  const handleSubscribe = async () => {
    if (!email) return;
    setSubStatus("sending");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubStatus("done");
    setEmail("");
    setTimeout(() => setSubStatus("idle"), 2500);
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <style>{`
        .will-reveal { opacity: 0; transform: translateY(24px); }
        .reveal { transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        input::placeholder { color: var(--muted); }
      `}</style>

      <Navbar />

      {/* HERO — split, left image / right headline+CTA */}
      <section
        className="reveal"
        style={{ padding: "32px 20px 64px", maxWidth: "1360px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            alignItems: "center",
          }}
          className="lg:grid-cols-[55fr_45fr]"
        >
          <div style={{ order: 2 }} className="lg:order-1">
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                maxHeight: "560px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/product-1.jpg"
                alt="Good Things Take Time Graphic Tee, dark green cotton tee with mountain print"
                style={{ width: "100%", maxWidth: "460px", height: "auto", objectFit: "contain", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </div>

          <div style={{ order: 1 }} className="lg:order-2">
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              New Graphic Drop
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                margin: "16px 0",
                color: "var(--primary)",
              }}
            >
              Built Different.
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text)", maxWidth: "480px", marginBottom: "28px" }}>
              Heavyweight cotton tees carrying stories worth wearing — mountains, discipline, and dreams screen-printed to last.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                padding: "16px 40px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                whiteSpace: "nowrap",
                boxShadow: "var(--shadow-sm)",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Shop Now
            </button>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                alignItems: "center",
                marginTop: "32px",
                fontSize: "0.85rem",
                color: "var(--muted)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <StarRow rating={5} />
                <span>4.8 (612 reviews)</span>
              </div>
              <span>Made in India</span>
              <span>Free shipping above ₹999</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS ROW */}
      <section className="reveal" style={{ padding: "48px 20px", background: "var(--surface)" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "32px",
          }}
        >
          {[
            { label: "100% Cotton, Always", icon: "M4 4h16v16H4z" },
            { label: "Screen-Printed to Last", icon: "M3 12h18M12 3v18" },
            { label: "7-Day Easy Returns", icon: "M4 12a8 8 0 1 0 3-6.2M4 4v5h5" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  minWidth: "48px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d={b.icon} />
                </svg>
              </div>
              <span style={{ color: "var(--bg)", fontWeight: 600, fontSize: "0.95rem" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BESTSELLERS — BENTO MOSAIC */}
      <section className="reveal" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)" }}>
            Fan Favourites
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginTop: "8px",
              color: "var(--primary)",
            }}
          >
            Bestsellers
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gridAutoRows: "220px",
            gap: "16px",
          }}
          className="md:grid-cols-4"
        >
          {PRODUCTS.map((p, idx) => {
            const span = idx === 0 ? { gridColumn: "span 2", gridRow: "span 2" } : idx === 1 ? { gridColumn: "span 2" } : {};
            return (
              <article
                key={p.id}
                onClick={() => goToProduct(p)}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  ...span,
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
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 2,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {p.badge}
                </div>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "14px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem", maxWidth: "70%" }}>{p.name}</span>
                  <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap" }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "24px", marginTop: "32px" }}>
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(p);
              }}
              style={{
                padding: "12px 18px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: added === p.id ? "var(--primary)" : "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {added === p.id ? "✓ Added" : `Add "${p.name.split(" ").slice(0, 2).join(" ")}" — ₹${p.price.toLocaleString("en-IN")}`}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURE HIGHLIGHT — asymmetric split + overlap breakout signature element */}
      <section className="reveal" style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            alignItems: "center",
          }}
          className="lg:grid-cols-[40fr_60fr]"
        >
          <div>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)" }}>
              The Craft
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3vw, 3rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: "8px 0 20px",
                color: "var(--primary)",
              }}
            >
              Discipline builds every print.
            </h2>
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "1.35rem", lineHeight: 1.5, color: "var(--text)" }}>
              Each design is screen-printed in small batches, layer by layer, until the ink sits flush into the weave.
            </p>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                marginBottom: "-40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/product-4.jpg"
                alt="Discipline Builds Freedom Statue Tee close-up print detail"
                style={{ width: "100%", maxWidth: "420px", height: "auto", objectFit: "contain", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "-10px",
                transform: "rotate(-4deg)",
                background: "var(--primary)",
                color: "var(--bg)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "8px 16px",
                boxShadow: "var(--shadow-sm)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            >
              Screen Printed In-House
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS — bare text, vertical rule, no cards */}
      <section className="reveal" style={{ padding: "80px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)" }}>
          Worn & Reviewed
        </span>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 3vw, 3rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: "8px 0 40px",
            color: "var(--primary)",
          }}
        >
          What people are saying
        </h2>
        <div style={{ display: "flex", flexDirection: "column" }} className="md:flex-row">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "24px 28px",
                borderLeft: i !== 0 ? "1px solid color-mix(in srgb, var(--muted) 30%, transparent)" : "none",
                borderTop: i !== 0 ? "1px solid color-mix(in srgb, var(--muted) 30%, transparent)" : "none",
              }}
              className="md:border-t-0"
            >
              <StarRow rating={r.rating} />
              <p style={{ marginTop: "14px", fontSize: "0.98rem", lineHeight: 1.7, color: "var(--text)" }}>
                "{r.quote}"
              </p>
              <p style={{ marginTop: "16px", fontWeight: 600, fontSize: "0.9rem", color: "var(--primary)" }}>{r.name}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{r.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="reveal" style={{ padding: "80px 20px", background: "var(--surface)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "left" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--bg)",
              marginBottom: "12px",
            }}
          >
            Get first access to new drops.
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: "28px", fontSize: "0.98rem", lineHeight: 1.6 }}>
            No spam, just the tees worth waiting for.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: "var(--radius-md)",
                border: "1px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                padding: "14px 32px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              {subStatus === "sending" ? "Sending..." : subStatus === "done" ? "✓ Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}