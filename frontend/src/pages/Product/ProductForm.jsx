import { useState } from "react";
import { createProduct, updateProduct } from "../../api/admin.product.api";

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product._id;

  const [form, setForm] = useState({
    title: product.title || "",
    description: product.description || "",
    price: product.price || "",
    quantity: product.quantity || "",
    category: product.category || "",
    tags: product.tags?.join(", ") || "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    if (payload.tags) {
      payload.tags = payload.tags.split(",").map((t) => t.trim().toLowerCase());
    }

    const data = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => data.append(k, val));
      } else {
        data.append(k, v);
      }
    });

    images.forEach((img) => data.append("images", img));

    if (isEdit) {
      await updateProduct(product._id, data);
    } else {
      await createProduct(data);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0b0b] p-6 rounded w-full max-w-lg"
      >
        <h3 className="text-lg mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h3>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#1c1c1c] border border-[#2a2a2a]"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#1c1c1c] border border-[#2a2a2a]"
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#1c1c1c] border border-[#2a2a2a]"
        />

        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#1c1c1c] border border-[#2a2a2a]"
        />

        <input
          name="category"
          placeholder="Category (e.g. Shoes)"
          value={form.category || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#1c1c1c] border border-[#2a2a2a]"
        />

        <input
          placeholder="Tags (comma separated)"
          value={form.tags || ""}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full mb-3 p-2 bg-[#1c1c1c] border border-[#2a2a2a]"
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="border px-4 py-2">
            Cancel
          </button>
          <button
            type="submit"
            className="border border-white px-4 py-2 hover:bg-white hover:text-black"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
