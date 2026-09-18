"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [pulse, setPulse] = React.useState(false);
  const prevTotal = React.useRef(totalItems);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (totalItems !== prevTotal.current) {
      setPulse(true);
      prevTotal.current = totalItems;
      const t = setTimeout(() => setPulse(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  function goAbout() {
    setMenuOpen(false);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }

  function goShop() {
    setMenuOpen(false);
    router.push("/shop");
  }

  function goHome() {
    setMenuOpen(false);
    router.push("/");
  }

  function goCheckout() {
    setMenuOpen(false);
    router.push("/checkout");
  }

  const Wordmark = (
    <span
      style={{
        fontFamily: "var(--font-heading)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        fontSize: "1.5rem",
        color: "var(--text)",
      }}
    >
      Tshirt
      <span style={{ color: "var(--accent)" }}>.</span>
    </span>
  );

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "var(--bg)",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        transition: "box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <nav className="flex items-center justify-between px-6 py-4 md:px-10">
        <button
          onClick={goHome}
          className="focus-visible:outline-none focus-visible:ring-2"
          style={{
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label="Tshirt home"
        >
          {Wordmark}
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={goShop}
            className="text-sm font-medium focus-visible:outline-none focus-visible:ring-2 hover:opacity-70 active:scale-95"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            Shop
          </button>
          <button
            onClick={goAbout}
            className="text-sm font-medium focus-visible:outline-none focus-visible:ring-2 hover:opacity-70 active:scale-95"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            About
          </button>
          <a href="mailto:maliyajay77@gmail.com" style={{color:"inherit",textDecoration:"none",cursor:"pointer"}}>Contact</a>

          <button
            onClick={goCheckout}
            aria-label="Cart"
            className="relative focus-visible:outline-none focus-visible:ring-2 hover:opacity-70 active:scale-95"
            style={{
              color: "var(--text)",
              transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: "#D64545",
                  color: "#fff",
                  width: 16,
                  height: 16,
                  transform: pulse ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={goCheckout}
            aria-label="Cart"
            className="relative focus-visible:outline-none focus-visible:ring-2"
            style={{ color: "var(--text)" }}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: "#D64545",
                  color: "#fff",
                  width: 16,
                  height: 16,
                  transform: pulse ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 active:scale-90"
            style={{
              color: "var(--text)",
              transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: "var(--bg)", top: "64px" }}
        >
          <button
            onClick={goShop}
            className="text-xl font-medium focus-visible:outline-none focus-visible:ring-2 active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
          >
            Shop
          </button>
          <button
            onClick={goAbout}
            className="text-xl font-medium focus-visible:outline-none focus-visible:ring-2 active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}
          >
            About
          </button>
          <a href="mailto:maliyajay77@gmail.com" style={{color:"inherit",textDecoration:"none",cursor:"pointer"}}>Contact</a>
        </div>
      )}
    </header>
  );
}