import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../api/payment.api";
import { getOrderById } from "../api/order.api";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const orderId = state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      navigate("/products");
      return;
    }

    loadOrder();
    // eslint-disable-next-line
  }, []);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch {
      setError("Unable to load order");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const payment = await createPayment(order._id);

      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "Pieds de Fée",
        description: "Order Payment",
        order_id: payment.razorpayOrderId,

        handler: function () {
          // IMPORTANT:
          // Do NOT mark payment success here.
          // Webhook will do that.
          navigate("/dashboard");
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.address?.phone,
        },

        theme: {
          color: "#000000",
        },
      };

      if (!window.Razorpay) {
        alert("Payment service not available yet");
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.message || "Payment initialization failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        {error || "Order not found"}
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl mb-8">Checkout</h1>

          {/* ADDRESS */}
          <section className="bg-[#1c1c1c] p-6 rounded mb-8">
            <h2 className="text-lg mb-2">Delivery Address</h2>

            {user.address ? (
              <p className="text-gray-400 text-sm leading-relaxed">
                {user.address.fullName}
                <br />
                {user.address.line1}
                <br />
                {user.address.city}, {user.address.state}{" "}
                {user.address.postalCode}
              </p>
            ) : (
              <p className="text-red-500 text-sm">
                Please add address in dashboard
              </p>
            )}
          </section>

          {/* ORDER SUMMARY */}
          <section className="bg-[#1c1c1c] p-6 rounded mb-8">
            <h2 className="text-lg mb-4">Order Summary</h2>

            {order.items.map((item) => (
              <div
                key={item.product}
                className="flex justify-between text-sm text-gray-400 mb-2"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="border-t border-[#2a2a2a] mt-4 pt-4 flex justify-between">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </section>

          {/* PAY BUTTON */}
          <button
            onClick={handlePayment}
            disabled={!user.address}
            className="w-full py-4 border border-white text-sm tracking-wide hover:bg-white hover:text-black transition disabled:opacity-50"
          >
            Pay ₹{order.totalAmount}
          </button>
        </div>
      </main>
    </>
  );
}
