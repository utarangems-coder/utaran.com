import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../api/cart.api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      console.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Loading cart…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-24">
      <div className="max-w-5xl mx-auto space-y-14">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-light tracking-wide">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Items saved for consideration
          </p>
        </header>

        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Your cart is currently empty.
          </p>
        ) : (
          <>
            {/* ITEMS */}
            <section className="space-y-10">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="
                    flex gap-8
                    border-b border-[#2a2a2a]
                    pb-10
                  "
                >
                  {/* IMAGE */}
                  <div className="w-32 h-40 bg-[#1c1c1c] overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-sm tracking-wide">
                      {item.product.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      ₹{item.product.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">
                        Quantity
                      </span>

                      <select
                        value={item.quantity}
                        onChange={async (e) => {
                          await updateCartItem(
                            item.product._id,
                            Number(e.target.value)
                          );
                          loadCart();
                        }}
                        className="
                          bg-[#0b0b0b]
                          border border-[#2a2a2a]
                          px-3 py-1
                          text-sm
                        "
                      >
                        {Array.from(
                          { length: Math.min(item.product.quantity, 10) },
                          (_, i) => i + 1
                        ).map((q) => (
                          <option key={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={async () => {
                      await removeCartItem(item.product._id);
                      loadCart();
                    }}
                    className="
                      text-xs uppercase tracking-widest
                      text-gray-500
                      hover:text-white
                      transition
                    "
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>

            {/* TOTAL */}
            <section className="pt-6 flex justify-between items-center">
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Total Value
              </span>
              <span className="text-xl">
                ₹{total}
              </span>
            </section>

            {/* INFO BOX */}
            <section
              className="
                mt-10
                border border-[#2a2a2a]
                p-6
                text-sm text-gray-400
              "
            >
              <p className="leading-relaxed">
                Each item is purchased individually to ensure
                accurate stock availability and a smoother checkout experience.
                <br />
                Please use{" "}
                <span className="text-white font-medium">
                  Buy Now
                </span>{" "}
                on a product page to proceed with purchase.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
