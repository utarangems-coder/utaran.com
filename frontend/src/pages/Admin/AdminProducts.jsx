import { useEffect, useState } from "react";
import {
  fetchAllProducts,
  deleteProduct,
  restoreProduct,
} from "../../api/admin.product.api";
import ProductForm from "../Product/ProductForm";
import useDebounce from "../../hooks/useDebounce";
import AdminRowSkeleton from "../../components/AdminRowSkeleton";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch]);

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetchAllProducts({ search: debouncedSearch });
    setProducts(res.data);
    setLoading(false);
  };

  return (
    <div className="bg-[#1c1c1c] p-6 rounded">
      <div className="flex justify-between mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="bg-[#0b0b0b] border border-[#2a2a2a] p-2"
        />

        <button
          onClick={() => setSelected({})}
          className="border border-white px-4 py-2"
        >
          Add Product
        </button>
      </div>

      {selected && (
        <ProductForm
          product={selected}
          onClose={() => setSelected(null)}
          onSaved={loadProducts}
        />
      )}

      <div className="space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <AdminRowSkeleton key={i} />
            ))
          : products.map((p) => (
              <div
                key={p._id}
                className="flex justify-between items-center border border-[#2a2a2a] p-4 rounded"
              >
                <div>
                  <p className="text-sm">{p.title}</p>
                  <p className="text-xs text-gray-400">
                    ₹{p.price} • Stock: {p.quantity}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelected(p)}
                    className="border px-3 py-1"
                  >
                    Edit
                  </button>

                  {p.isActive ? (
                    <button
                      onClick={() => deleteProduct(p._id).then(loadProducts)}
                      className="border border-red-500 text-red-500 px-3 py-1"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreProduct(p._id).then(loadProducts)}
                      className="border border-green-500 text-green-500 px-3 py-1"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
