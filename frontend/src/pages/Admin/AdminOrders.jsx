import { useEffect, useState } from "react";
import { fetchAdminOrders } from "../../api/admin.order.api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [page, search]);

  const loadOrders = async () => {
    setLoading(true);
    const res = await fetchAdminOrders({
      page,
      search,
    });
    setOrders(res.data);
    setPagination(res.pagination);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <input
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        placeholder="Search by email, name or order id"
        className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] w-80"
      />

      {loading ? (
        <p className="text-gray-400">Loading orders...</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border-b border-[#2a2a2a] py-4">
            <p className="text-sm">{order.user.email}</p>
            <p className="text-xs text-gray-500">{order._id}</p>
            <p className="text-sm">₹{order.totalAmount}</p>
          </div>
        ))
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border px-4 py-2"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} / {pagination.pages}
          </span>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage(page + 1)}
            className="border px-4 py-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
