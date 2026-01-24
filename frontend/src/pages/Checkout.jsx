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

  useEffect(() => {
    if (!productId) {
      navigate("/products");
      return;
    }

    fetchProductById(productId)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, []);

  const handlePayment = async () => {
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
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl mb-8">Checkout</h1>

        {/* ADDRESS */}
        <section className="bg-[#1c1c1c] p-6 rounded mb-8">
          <h2 className="text-lg mb-2">Delivery Address</h2>
          {user.address ? (
            <p className="text-gray-400 text-sm">
              {user.address.fullName}<br />
              {user.address.line1}<br />
              {user.address.city}, {user.address.state}
            </p>
          ) : (
            <p className="text-red-500 text-sm">
              Please add address in dashboard
            </p>
          )}
        </section>

        {/* SUMMARY */}
        <section className="bg-[#1c1c1c] p-6 rounded mb-8">
          <h2 className="text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-400">
            <span>{product.title} × {quantity}</span>
            <span>₹{product.price * quantity}</span>
          </div>

          <div className="border-t border-[#2a2a2a] mt-4 pt-4 flex justify-between">
            <span>Total</span>
            <span>₹{product.price * quantity}</span>
          </div>
        </section>

        <button
          onClick={handlePayment}
          disabled={!user.address}
          className="w-full py-4 border border-white hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          Pay ₹{product.price * quantity}
        </button>
      </div>
    </main>
  );
}
