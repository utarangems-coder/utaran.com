import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/product.api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadProducts(page);
    // eslint-disable-next-line
  }, [page]);

  const loadProducts = async (pageNumber) => {
    setLoading(true);
    try {
      const data = await fetchProducts(pageNumber);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) =>
          pageNumber === 1 ? data : [...prev, ...data]
        );
      }
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light mb-10">
            Our Collection
          </h1>

          {/* PRODUCTS GRID */}
          {products.length === 0 && !loading ? (
            <p className="text-gray-400">No products found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group"
                >
                  <div className="bg-[#1c1c1c] rounded-lg overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm tracking-wide">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* LOAD MORE */}
          {hasMore && (
            <div className="flex justify-center mt-16">
              <button
                disabled={loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-8 py-3 border border-white text-sm hover:bg-white hover:text-black transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
