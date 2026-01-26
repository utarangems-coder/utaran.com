import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/product.api";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const CATEGORIES = [
    {
      label: "Clothing",
      image:
        "https://res.cloudinary.com/dwp1yaelk/image/upload/v1769428087/photo-1523381210434-271e8be1f52b_efjya5.jpg",
    },
    {
      label: "Footwear",
      image:
        "https://res.cloudinary.com/dwp1yaelk/image/upload/v1769428092/photo-1525966222134-fcfa99b8ae77_jfanrx.jpg",
    },
    {
      label: "Accessories",
      image:
        "https://res.cloudinary.com/dwp1yaelk/image/upload/v1769428082/photo-1511556820780-d912e42b4980_lzrecf.jpg",
    },
  ];

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
            Contemporary fashion rooted in confidence, craftsmanship, and
            understated elegance.
          </p>

          <Link
            to="/products"
            onClick={scrollToTop}
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
            src="https://res.cloudinary.com/dwp1yaelk/image/upload/v1769428080/photo-1520975916090-3105956dac38_qnm2rd.jpg"
            alt="UTARAN fashion"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="
            absolute inset-0 w-full h-full object-cover
            transform-gpu will-change-transform
          "
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
            onClick={scrollToTop}
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
              <div className="bg-[#1c1c1c] overflow-hidden h-80">
                <img
                  src={product.images[0]}
                  loading="lazy"
                  decoding="async"
                  className="
                    w-full h-full object-cover
                    transform-gpu will-change-transform
                    group-hover:scale-[1.04]
                    transition duration-500
                  "
                />
              </div>

              <div className="mt-4">
                <p className="text-sm tracking-wide">{product.title}</p>
                <p className="text-gray-400 text-sm mt-1">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-light mb-12">Shop by Category</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={`/products?category=${cat.label}`}
              onClick={scrollToTop}
              className="group relative h-64 overflow-hidden bg-[#1c1c1c]"
            >
              {/* IMAGE */}
              <img
                src={cat.image.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_800,h_600,c_fill/",
                )}
                alt={cat.label}
                loading="lazy"
                decoding="async"
                className="
                  absolute inset-0 w-full h-full object-cover
                  scale-100 group-hover:scale-[1.04]
                  transition-transform duration-500 ease-out
                  transform-gpu will-change-transform
                "
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition" />

              {/* TEXT */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <span className="text-lg uppercase tracking-widest">
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="h-96 bg-[#1c1c1c] overflow-hidden">
          <img
            src="https://res.cloudinary.com/dwp1yaelk/image/upload/v1769428079/photo-1503341455253-b2e723bb3dbb_bo05pb.jpg"
            alt="UTARAN craftsmanship"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        <div>
          <h2 className="text-2xl font-light mb-6">Designed with Purpose</h2>

          <p className="text-gray-400 leading-relaxed max-w-md">
            UTARAN represents a return to thoughtful design — timeless
            silhouettes, refined materials, and details that speak without
            excess.
          </p>

          <Link
            to="/products"
            onClick={scrollToTop}
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
