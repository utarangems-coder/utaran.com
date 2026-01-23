import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const PAGE_SIZE = 8;

export default function AdminOrders() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const summaryRes = await api.get("/admin/summary");
      const ordersRes = await api.get("/admin/orders");
      setSummary(summaryRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    await api.patch(`/admin/orders/${orderId}/status`, { status });
    loadData();
  };

  /* SEARCH */
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();

    return orders.filter((order) => {
      return (
        order._id.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (loading) {
    return <p className="text-gray-400">Loading orders...</p>;
  }

  return (
    <div className="space-y-8">
      {/* SUMMARY */}
      {summary && (
        <section className="grid md:grid-cols-3 gap-6">
          {[
            ["Orders", summary.totalOrders],
            ["Users", summary.totalUsers],
            ["Products", summary.totalProducts],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#1c1c1c] p-6 rounded text-center"
            >
              <p className="text-gray-400">{label}</p>
              <p className="text-2xl">{value}</p>
            </div>
          ))}
        </section>
      )}

      {/* SEARCH */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Orders</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or order id"
          className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] text-sm rounded w-72"
        />
      </div>

      {/* ORDERS LIST */}
      <section className="bg-[#1c1c1c] p-6 rounded">
        {paginatedOrders.length === 0 && (
          <p className="text-gray-400">No orders found.</p>
        )}

        {paginatedOrders.map((order) => (
          <div
            key={order._id}
            className="border-b border-[#2a2a2a] py-4"
          >
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">
                {order.user?.email || "Guest"}
              </p>
              <p className="text-sm">₹{order.totalAmount}</p>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Order ID: {order._id}
            </p>

            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm">Status:</span>

              <select
                value={order.fulfillmentStatus}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="bg-[#0b0b0b] border border-[#2a2a2a] p-1 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
              </select>

              <span className="text-xs text-gray-500">
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-white text-sm disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-white text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
