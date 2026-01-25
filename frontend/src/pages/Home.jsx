import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/product.api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const categories = ["Clothing", "Footwear", "Accessories"];

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const res = await fetchProducts({ page: 1, limit: 6 });
      setFeatured(res.data);
    } catch {
      console.error("Failed to load featured products");
    }
  };

  return (
    <main className="bg-[#0b0b0b] text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-32 grid md:grid-cols-2 gap-24 items-center">
        <div>
          <h1 className="text-6xl font-light tracking-widest uppercase">
            UTARAN
          </h1>

          <p className="mt-8 text-gray-400 max-w-md leading-relaxed">
            Contemporary fashion rooted in confidence, craftsmanship,
            and understated elegance.
          </p>

          <Link
            to="/products"
            className="
              inline-block mt-12 px-12 py-4
              border border-white
              text-sm tracking-widest uppercase
              hover:bg-white hover:text-black transition
            "
          >
            Shop Collection
          </Link>
        </div>

        {/* HERO IMAGE */}
        <div className="relative h-[520px] bg-[#1c1c1c] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38"
            alt="UTARAN fashion"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-light">Featured Collection</h2>
          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            View all
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {featured.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="group"
            >
              <div className="bg-[#1c1c1c] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="
                    w-full h-80 object-cover
                    group-hover:scale-105 transition
                  "
                />
              </div>

              <div className="mt-4">
                <p className="text-sm tracking-wide">
                  {product.title}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-light mb-12">Shop by Category</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="
                h-64 bg-[#1c1c1c]
                flex items-center justify-center
                text-lg uppercase tracking-widest
                hover:bg-[#2a2a2a] transition
              "
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="h-96 bg-[#1c1c1c] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
            alt="UTARAN craftsmanship"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        <div>
          <h2 className="text-2xl font-light mb-6">
            Designed with Purpose
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-md">
            UTARAN represents a return to thoughtful design —
            timeless silhouettes, refined materials, and details
            that speak without excess.
          </p>

          <Link
            to="/products"
            className="
              inline-block mt-10 px-8 py-3
              border border-white
              text-sm tracking-wide
              hover:bg-white hover:text-black transition
            "
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2a2a2a] py-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} UTARAN. Crafted with intent.
      </footer>
    </main>
  );
}
