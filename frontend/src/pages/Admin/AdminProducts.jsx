import { useEffect, useState } from "react";
import {
  fetchAllProducts,
  deleteProduct,
  restoreProduct,
} from "../../api/admin.product.api";
import ProductForm from "../Product/ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetchAllProducts();
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  const handleRestore = async (id) => {
    await restoreProduct(id);
    loadProducts();
  };

  return (
    <div className="bg-[#1c1c1c] p-6 rounded">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg">Products</h2>
        <button
          onClick={() => setSelected({})}
          className="border border-white px-4 py-2 hover:bg-white hover:text-black transition"
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
        {products.map((p) => (
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
                className="text-sm border border-white px-3 py-1"
              >
                Edit
              </button>

              {p.isActive ? (
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-sm border border-red-500 text-red-500 px-3 py-1"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => handleRestore(p._id)}
                  className="text-sm border border-green-500 text-green-500 px-3 py-1"
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
