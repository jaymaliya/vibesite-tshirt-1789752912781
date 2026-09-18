"use client";

import React from "react";
import { useRouter } from "next/navigation";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 4.01c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9 12.13 12.13 0 0 1-8.81-4.47 4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.2c-.6.16-1.24.19-1.9.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.19-6.53 12.19-12.19 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 22 4.01z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20l1-5.4A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8.5 9.5c0 3 2.5 5.5 5.5 5.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
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
    <footer style={{ backgroundColor: "var(--bg)" }} className="border-t" >
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          {Wordmark}
          <p
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            className="text-sm max-w-xs"
          >
            Built Different. Premium essentials, made in India, made to last.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-70 active:scale-90 focus-visible:outline-none focus-visible:ring-2"
              style={{ color: "var(--text)", transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)" }}
            >
              <InstagramIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:opacity-70 active:scale-90 focus-visible:outline-none focus-visible:ring-2"
              style={{ color: "var(--text)", transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)" }}
            >
              <TwitterIcon />
            </a>
            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:opacity-70 active:scale-90 focus-visible:outline-none focus-visible:ring-2"
              style={{ color: "var(--text)", transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)" }}
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3
            style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            className="text-sm font-semibold uppercase tracking-wide"
          >
            Quick Links
          </h3>
          <button
            onClick={() => router.push("/")}
            className="text-left text-sm hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-2 w-fit"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)", transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)" }}
          >
            Home
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="text-left text-sm hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-2 w-fit"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)", transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)" }}
          >
            Shop
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <h3
            style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            className="text-sm font-semibold uppercase tracking-wide"
          >
            Contact Us
          </h3>
          <a
            href="mailto:maliyajay77@gmail.com"
            className="text-sm hover:opacity-70 active:scale-95 focus-visible:outline-none focus-visible:ring-2 w-fit"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)", transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)" }}
          >
            maliyajay77@gmail.com
          </a>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }} className="text-sm">
            Free shipping over ₹1499
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3
            style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
            className="text-sm font-semibold uppercase tracking-wide"
          >
            Newsletter
          </h3>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }} className="text-sm">
            Get early access to drops.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
              style={{
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--muted)",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--bg)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-body)",
                transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
            {status === "success" && (
              <p style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }} className="text-xs">
                Thanks! We&apos;ll be in touch.
              </p>
            )}
            {status === "error" && (
              <p style={{ color: "#D64545", fontFamily: "var(--font-body)" }} className="text-xs">
                Something went wrong. Try again.
              </p>
            )}
          </form>
        </div>
      </div>

      <div
        className="border-t px-6 md:px-10 py-6 text-center text-xs"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        © {new Date().getFullYear()} Tshirt. All rights reserved.
      </div>
    </footer>
  );
}