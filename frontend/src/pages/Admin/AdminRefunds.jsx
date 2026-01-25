import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminRowSkeleton from "../../components/AdminRowSkeleton";

export default function AdminRefunds() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const res = await api.get("/admin/orders");
    setOrders(res.data.data);
    setLoading(false);
  };

  return (
    <div className="bg-[#1c1c1c] p-6 rounded">
      <h2 className="text-lg mb-6">Refunds & Payments</h2>

      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <AdminRowSkeleton key={i} />
          ))
        : orders.map((order) => (
            <div
              key={order._id}
              className="border border-[#2a2a2a] p-4 rounded mb-4"
            >
              <p className="text-sm text-gray-400">
                {order.user?.email} • ₹{order.totalAmount}
              </p>
            </div>
          ))}
    </div>
  );
}
