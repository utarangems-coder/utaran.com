import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order.api";

const StatusPill = ({ label }) => (
  <span className="px-3 py-1 text-xs tracking-wide rounded-full border border-[#2a2a2a] text-gray-300">
    {label}
  </span>
);

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-400 text-sm">
        Loading your orders…
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        You haven’t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-[#0b0b0b] border border-[#2a2a2a] rounded p-5"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-500 tracking-wide">
                Order #{order._id.slice(-6).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-white">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="space-y-2 text-sm text-gray-400 mb-4">
            {order.items.map((item) => (
              <div
                key={item.product}
                className="flex justify-between"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* STATUS */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex gap-3">
              <StatusPill label={`Payment: ${order.paymentStatus}`} />
              <StatusPill
                label={`Status: ${order.fulfillmentStatus}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
