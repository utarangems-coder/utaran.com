import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../api/product.api";
import { addToCart } from "../../api/cart.api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line
  }, []);

  const loadProduct = async () => {
    try {
      const data = await fetchProductById(id);
      setProduct(data);
    } catch {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        productId: product._id,
        quantity,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14">
          {/* IMAGE */}
          <div className="bg-[#1c1c1c] rounded-lg overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-3xl font-light mb-4">{product.title}</h1>

            <p className="text-xl mb-6">₹{product.price}</p>

            <p className="text-gray-400 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* QUANTITY */}
            <div className="mb-6">
              <label className="block text-sm mb-2">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-[#0b0b0b] border border-[#2a2a2a] p-2 rounded"
              >
                {Array.from(
                  { length: Math.min(product.quantity, 10) },
                  (_, i) => i + 1,
                ).map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* BUY NOW */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 border border-white text-sm tracking-wide hover:bg-white hover:text-black transition"
            >
              Buy Now
            </button>

            <button
              onClick={async () => {
                await addToCart(product._id, quantity);
                navigate("/cart");
              }}
              className="w-full py-4 border border-white text-sm tracking-wide hover:bg-white hover:text-black transition"
            >
              Add to Cart
            </button>

            {product.quantity === 0 && (
              <p className="mt-4 text-red-500 text-sm">Out of stock</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
