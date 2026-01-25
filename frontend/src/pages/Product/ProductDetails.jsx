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

  const increment = () => {
    if (quantity < product.quantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleBuyNow = () => {
    if (!product || product.quantity === 0) return;

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
        Loading…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        {error || "Product unavailable"}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        {/* IMAGE */}
        <div className="bg-[#1c1c1c] overflow-hidden aspect-[3/4] max-h-[480px] mx-auto group">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="
            w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-[1.04]
            "
            loading="lazy"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col">
          {/* CATEGORY */}
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              {product.category}
            </p>
          )}

          {/* TITLE */}
          <h1 className="text-3xl font-light tracking-wide mb-3">
            {product.title}
          </h1>

          {/* PRICE */}
          <p className="text-xl mb-8">₹{product.price}</p>

          {/* DESCRIPTION */}
          <p className="text-gray-400 leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="border-t border-[#2a2a2a] mb-8" />

          {/* QUANTITY STEPPER */}
          <div className="mb-10">
            <p className="text-sm text-gray-400 mb-3">Quantity</p>

            <div className="flex items-center gap-6">
              <button
                onClick={decrement}
                disabled={quantity === 1}
                className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center hover:border-white transition disabled:opacity-40"
              >
                −
              </button>

              <span className="text-lg w-6 text-center">{quantity}</span>

              <button
                onClick={increment}
                disabled={quantity === product.quantity}
                className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center hover:border-white transition disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-4">
            <button
              onClick={handleBuyNow}
              disabled={product.quantity === 0}
              className="w-full py-4 border border-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition disabled:opacity-40"
            >
              Buy Now
            </button>

            <button
              onClick={async () => {
                await addToCart(product._id, quantity);
                navigate("/cart");
              }}
              disabled={product.quantity === 0}
              className="w-full py-4 border border-[#2a2a2a] text-sm tracking-widest uppercase hover:border-white transition disabled:opacity-40"
            >
              Add to Cart
            </button>
          </div>

          {/* STOCK */}
          {product.quantity === 0 && (
            <p className="mt-6 text-sm text-gray-400">Currently out of stock</p>
          )}

          {/* TAGS */}
          {product.tags?.length > 0 && (
            <div className="mt-14">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                Product Details
              </p>

              <div className="flex flex-wrap gap-3">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs uppercase tracking-wide border border-[#2a2a2a] px-4 py-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
