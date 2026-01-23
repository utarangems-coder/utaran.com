import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <main className="bg-[#0b0b0b] text-white">
        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-8 py-32 grid md:grid-cols-2 gap-20 items-center">
          {/* TEXT */}
          <div className="z-10">
            <h1 className="font-[Playfair_Display] text-6xl leading-tight tracking-widest uppercase">
              Pieds de Fée
            </h1>

            <p className="mt-8 text-gray-400 max-w-md leading-relaxed">
              Luxury footwear designed for elegance, confidence, and timeless
              style.
            </p>

            <Link
              to="/products"
              className="inline-block mt-12 px-10 py-4 border border-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition"
            >
              Shop Collection
            </Link>
          </div>

          {/* HERO IMAGE */}
          <div className="relative h-[520px] bg-[#1c1c1c] rounded-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="w-full h-full flex items-center justify-center text-gray-500 tracking-widest">
              HERO IMAGE
            </div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-light">Best Sellers</h2>
            <Link
              to="/products"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              View all
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-[#1c1c1c] p-4 rounded-lg border border-transparent hover:border-white transition"
              >
                <div className="h-56 bg-[#2a2a2a] rounded mb-4 flex items-center justify-center text-gray-500">
                  Product Image
                </div>
                <h3 className="text-sm">Elegant Heels</h3>
                <p className="text-gray-400 text-sm mt-1">₹5,999</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-light mb-10">Categories</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {["Shoes", "Bags", "Accessories"].map((cat) => (
              <div
                key={cat}
                className="h-64 bg-[#1c1c1c] rounded-lg flex items-center justify-center text-lg uppercase tracking-widest hover:bg-[#2a2a2a] transition"
              >
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="h-80 bg-[#1c1c1c] rounded-lg flex items-center justify-center text-gray-500">
            Brand Image
          </div>

          <div>
            <h2 className="text-2xl font-light mb-6">About Us</h2>
            <p className="text-gray-400 leading-relaxed">
              At Pieds de Fée, we believe fashion is more than appearance — it
              is confidence. Each piece is carefully designed to reflect
              elegance, comfort, and timeless beauty.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 px-6 py-3 border border-white text-sm hover:bg-white hover:text-black transition"
            >
              Explore Collection
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#2a2a2a] py-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Pieds de Fée. All rights reserved.
        </footer>
      </main>
    </>
  );
}
