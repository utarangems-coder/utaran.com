import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/product.api";
import useDebounce from "../../hooks/useDebounce";
import ProductSkeleton from "../../components/ProductSkeleton";
import { PRODUCT_CATEGORIES } from "../../../../backend/src/utils/categories.js";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const CATEGORIES = ["All", ...PRODUCT_CATEGORIES];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("All");

  const debouncedSearch = useDebounce(search, 400);

  // Reset on filters/search change
  useEffect(() => {
    setPage(1);
    loadProducts(1, true);
    // eslint-disable-next-line
  }, [debouncedSearch, sort, category]);

  // Load more
  useEffect(() => {
    if (page > 1) loadProducts(page);
    // eslint-disable-next-line
  }, [page]);

  const loadProducts = async (pageToLoad, replace = false) => {
    if (loading) return;

    setLoading(true);

    const res = await fetchProducts({
      page: pageToLoad,
      limit: 12,
      search: debouncedSearch,
      sort,
      category: category === "All" ? undefined : category,
    });

    setProducts((prev) =>
      replace ? res.data : [...prev, ...res.data]
    );
    setHasMore(res.hasMore);

    setLoading(false);
    setInitialLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-3xl font-light tracking-wide mb-4">
            Our Collection
          </h1>
          <p className="text-gray-400 max-w-xl">
            Curated designs crafted with elegance and precision.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent border-b border-[#2a2a2a] px-2 py-2 text-sm focus:outline-none focus:border-white transition w-64"
          />

          <div className="flex gap-6">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border border-[#2a2a2a] px-4 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0b0b0b]">
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border border-[#2a2a2a] px-4 py-2 text-sm"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#0b0b0b]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-16">
          {initialLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : products.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="group">
                  <div className="bg-[#1c1c1c] overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-80 w-full object-cover group-hover:scale-105 transition duration-700"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-sm tracking-wide group-hover:underline">
                      {p.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      ₹{p.price}
                    </p>
                  </div>
                </Link>
              ))}
        </div>

        {/* EMPTY */}
        {!initialLoading && products.length === 0 && (
          <p className="text-gray-400 mt-20 text-center">
            No products found.
          </p>
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="flex justify-center mt-20">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="px-10 py-3 border border-white text-sm tracking-widest hover:bg-white hover:text-black transition disabled:opacity-40"
            >
              {loading ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
