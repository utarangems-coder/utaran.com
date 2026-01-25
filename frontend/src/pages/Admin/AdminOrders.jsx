import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const PAGE_SIZE = 8;

const StatusBadge = ({ value }) => {
  const styles = {
    PAID: "border-green-500 text-green-500",
    PENDING: "border-yellow-500 text-yellow-500",
    REFUNDED: "border-red-500 text-red-500",
  };

  return (
    <span
      className={`text-xs px-2 py-1 border ${
        styles[value] || "border-gray-500 text-gray-400"
      }`}
    >
      {value}
    </span>
  );
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await api.get("/admin/orders");
    setOrders(res.data.data);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o._id.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-[#1c1c1c] animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search orders"
        className="mb-6 p-2 bg-[#0b0b0b] border border-[#2a2a2a] text-sm rounded"
      />

      {visible.map((order) => (
        <div
          key={order._id}
          className="bg-[#0b0b0b] border border-[#2a2a2a] rounded p-4 mb-4"
        >
          <div className="flex justify-between">
            <p className="text-sm text-gray-400">
              {order.user?.email}
            </p>
            <p>₹{order.totalAmount}</p>
          </div>

          <div className="flex justify-between items-center mt-3">
            <StatusBadge value={order.paymentStatus} />
            <span className="text-xs text-gray-500">
              {order._id}
            </span>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border px-4 py-2 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
