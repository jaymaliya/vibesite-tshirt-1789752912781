"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Checkout() {
  const { items = [], clearCart, removeItem, updateQuantity } = useCart() ?? {};
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);

  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  function validate() {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = "Valid email is required";
    if (!/^\d{10}$/.test(phone)) errs.phone = "10-digit phone number required";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!/^\d{6}$/.test(pin)) errs.pin = "6-digit PIN required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function payNow() {
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: "https://tez.google.com/pay", data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: "INR" } }],
          { total: { label: "Total", amount: { currency: "INR", value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handlePayViaUpi() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: fullName,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch (e) {
      setPaying(false);
    }
  }

  async function confirmOrder() {
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: fullName,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "Tshirt",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart && clearCart();
    } catch (e) {
      setConfirming(false);
    }
  }

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "14px 16px",
    borderRadius: "var(--radius-md)",
    border: hasError ? "1.5px solid #B23A3A" : "1.5px solid color-mix(in srgb, var(--muted) 40%, transparent)",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    outline: "none",
  });

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "6px",
  };

  if (items.length === 0 && !paid) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem,4vw,2.8rem)", color: "var(--text)", marginBottom: "16px" }}>
            Your cart is empty
          </h1>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "32px", maxWidth: "420px" }}>
            Looks like you haven't added anything yet. Browse the collection and find your fit.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{ padding: "16px 40px", borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", background: "var(--accent)", color: "#fff", fontWeight: 600, fontFamily: "var(--font-body)", boxShadow: "var(--shadow-sm)", transition: "transform 0.15s ease", whiteSpace: "nowrap" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem,4.5vw,3.2rem)", color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Checkout
        </h1>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "15px", marginBottom: "40px" }}>
          Free delivery on orders above ₹500 · Made in India
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "40px", alignItems: "start" }}>
          {/* FORM */}
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "var(--text)", marginBottom: "24px" }}>
              Delivery Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle(!!errors.fullName)} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Aditya Rao" />
                {errors.fullName && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.fullName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle(!!errors.email)} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                {errors.email && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>}
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle(!!errors.phone)} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" />
                {errors.phone && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.phone}</p>}
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <input style={inputStyle(!!errors.address)} value={address} onChange={e => setAddress(e.target.value)} placeholder="House no, street, area" />
                {errors.address && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.address}</p>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "18px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle(!!errors.city)} value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" />
                  {errors.city && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.city}</p>}
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input style={inputStyle(!!errors.state)} value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" />
                  {errors.state && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.state}</p>}
                </div>
                <div>
                  <label style={labelStyle}>PIN Code</label>
                  <input style={inputStyle(!!errors.pin)} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="400001" />
                  {errors.pin && <p style={{ color: "#B23A3A", fontSize: "12px", marginTop: "4px" }}>{errors.pin}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              boxShadow: "var(--shadow-md)",
              position: "sticky",
              top: "24px",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "var(--bg)", marginBottom: "24px" }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
              {items.map((item: any) => (
                <div key={item.id} style={{ display: "flex", gap: "14px", borderBottom: "1px solid color-mix(in srgb, #F7F4EF 15%, transparent)", paddingBottom: "18px" }}>
                  <div style={{ width: "64px", height: "64px", flexShrink: 0, overflow: "hidden", borderRadius: "var(--radius-sm)", background: "var(--primary)" }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "var(--bg)", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </p>
                    <p style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid color-mix(in srgb, #F7F4EF 25%, transparent)", borderRadius: "var(--radius-pill)", padding: "2px 10px" }}>
                        <button
                          onClick={() => updateQuantity && updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={{ background: "none", border: "none", color: "var(--bg)", cursor: "pointer", fontSize: "16px", width: "20px", height: "20px", lineHeight: 1 }}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span style={{ color: "var(--bg)", fontSize: "13px", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                          style={{ background: "none", border: "none", color: "var(--bg)", cursor: "pointer", fontSize: "16px", width: "20px", height: "20px", lineHeight: 1 }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem && removeItem(item.id)}
                        style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px", fontFamily: "var(--font-body)", fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--bg)", fontFamily: "var(--font-body)", fontSize: "14px" }}>
                <span style={{ color: "#C9C0B4" }}>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--bg)", fontFamily: "var(--font-body)", fontSize: "14px" }}>
                <span style={{ color: "#C9C0B4" }}>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "var(--bg)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  paddingTop: "14px",
                  borderTop: "1px solid color-mix(in srgb, #F7F4EF 20%, transparent)",
                }}
              >
                <span>Total</span>
                <span style={{ color: "var(--accent)" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={handlePayViaUpi}
              disabled={paying}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "16px 24px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: paying ? "default" : "pointer",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                whiteSpace: "normal",
                wordBreak: "break-word",
                opacity: paying ? 0.7 : 1,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => !paying && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {paying ? "Preparing Payment…" : `Pay via UPI — ₹${total.toLocaleString("en-IN")}`}
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT OVERLAY */}
      {payData && !paid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,15,15,0.75)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bg)",
              borderRadius: "20px",
              padding: "28px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--text)", fontWeight: 700 }}>Tshirt</span>
              <button
                onClick={() => { setPayData(null); setPaying(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text)", width: "32px", height: "32px" }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", fontWeight: 700, color: "var(--accent)" }}>
                ₹{payData.amount}
              </p>
            </div>

            {isMobile ? (
              <>
                <button
                  onClick={payNow}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    cursor: "pointer",
                    background: "var(--accent)",
                    color: "#fff",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    marginBottom: "10px",
                  }}
                >
                  Pay ₹{payData.amount} Now
                </button>
                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "13px", fontFamily: "var(--font-body)", marginBottom: "20px" }}>
                  Opens Google Pay · PhonePe · Paytm
                </p>
                {paymentLaunched && (
                  <p style={{ textAlign: "center", color: "#4B7A4B", fontSize: "13px", fontFamily: "var(--font-body)", marginBottom: "16px" }}>
                    Payment app opened — confirm below
                  </p>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                {payData.qrBase64 && (
                  <img
                    src={`data:image/png;base64,${payData.qrBase64}`}
                    width={200}
                    height={200}
                    alt="UPI QR Code"
                    style={{ margin: "0 auto 12px", borderRadius: "var(--radius-sm)" }}
                  />
                )}
                <p style={{ color: "var(--muted)", fontSize: "13px", fontFamily: "var(--font-body)" }}>Scan with any UPI app</p>
              </div>
            )}

            <div style={{ borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)", paddingTop: "20px" }}>
              <input
                placeholder="UPI Transaction ID (optional)"
                value={upiTxnId}
                onChange={e => setUpiTxnId(e.target.value)}
                style={{ ...inputStyle(false), marginBottom: "14px" }}
              />
              <button
                onClick={confirmOrder}
                disabled={confirming}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "2px solid var(--primary)",
                  cursor: confirming ? "default" : "pointer",
                  background: "transparent",
                  color: "var(--text)",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  opacity: confirming ? 0.6 : 1,
                }}
              >
                {confirming ? "Confirming…" : "I've Paid — Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {paid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,15,15,0.85)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bg)",
              borderRadius: "20px",
              padding: "40px 28px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto" }}>
                <circle cx="12" cy="12" r="11" fill="#4B7A4B" />
                <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--text)", marginBottom: "8px" }}>
              Order Confirmed!
            </h2>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "14px", marginBottom: "4px" }}>
              Order #{payData?.orderId?.slice(-8)}
            </p>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "14px", marginBottom: "28px" }}>
              We'll ship soon!
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "14px 32px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}