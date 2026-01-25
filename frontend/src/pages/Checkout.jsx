import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../api/payment.api";
import { fetchProductById } from "../api/product.api";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { productId, quantity } = state || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!productId) {
      navigate("/products");
      return;
    }

    fetchProductById(productId)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, []);

  const total = product ? product.price * quantity : 0;

  const handlePayment = async () => {
    if (!user.address || processing) return;

    setProcessing(true);

    try {
      const payment = await createPayment({ productId, quantity });

      const razorpay = new window.Razorpay({
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "Pieds de Fée",
        description: "Secure Checkout",
        order_id: payment.razorpayOrderId,
        handler: () => navigate("/dashboard"),
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.address?.phone,
        },
        theme: { color: "#000000" },
      });

      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-14">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-light tracking-wide">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Review your order and complete payment
          </p>
        </header>

        {/* ADDRESS */}
        <section className="bg-[#1c1c1c] p-8 border border-[#2a2a2a]">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6">
            Delivery Address
          </h2>

          {user.address ? (
            <p className="text-sm leading-relaxed text-gray-300">
              {user.address.fullName}
              <br />
              {user.address.line1}
              <br />
              {user.address.city}, {user.address.state}
            </p>
          ) : (
            <p className="text-sm text-red-500">
              Please add a delivery address in your dashboard
            </p>
          )}
        </section>

        {/* ORDER SUMMARY */}
        <section className="bg-[#1c1c1c] p-8 border border-[#2a2a2a]">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between text-sm text-gray-300 mb-4">
            <span>
              {product.title} × {quantity}
            </span>
            <span>
              ₹{total}
            </span>
          </div>

          <div className="border-t border-[#2a2a2a] pt-6 flex justify-between items-center">
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Total
            </span>
            <span className="text-xl">
              ₹{total}
            </span>
          </div>
        </section>

        {/* PAYMENT CTA */}
        <section className="pt-4">
          <button
            onClick={handlePayment}
            disabled={!user.address || processing}
            className="
              w-full py-5
              border border-white
              text-sm tracking-widest uppercase
              hover:bg-white hover:text-black
              transition
              disabled:opacity-40
            "
          >
            {processing ? "Processing…" : `Pay ₹${total}`}
          </button>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Secure payment powered by Razorpay
          </p>
        </section>
      </div>
    </main>
  );
}
