import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../api/cart.api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl mb-10">Shopping Cart</h1>

          {cart.length === 0 ? (
            <p className="text-gray-400">
              Your cart is empty.
            </p>
          ) : (
            <>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-6 border-b border-[#2a2a2a] pb-6"
                  >
                    <img
                      src={item.product.images[0]}
                      className="w-28 h-28 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-sm">
                        {item.product.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        ₹{item.product.price}
                      </p>

                      <select
                        value={item.quantity}
                        onChange={async (e) => {
                          await updateCartItem(
                            item.product._id,
                            Number(e.target.value)
                          );
                          loadCart();
                        }}
                        className="mt-3 bg-[#0b0b0b] border border-[#2a2a2a] p-1"
                      >
                        {Array.from(
                          { length: Math.min(item.product.quantity, 10) },
                          (_, i) => i + 1
                        ).map((q) => (
                          <option key={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={async () => {
                        await removeCartItem(item.product._id);
                        loadCart();
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-between items-center">
                <span>Total</span>
                <span className="text-xl">₹{total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-8 w-full py-4 border border-white hover:bg-white hover:text-black transition"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
