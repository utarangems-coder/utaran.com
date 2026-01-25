import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getMyOrders } from "../../api/order.api";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.data);
    } catch {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-400">No orders yet.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-[#0b0b0b] border border-[#2a2a2a] p-4 rounded"
        >
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-400">
              Order ID: {order._id.slice(-6)}
            </span>
            <span className="text-sm">
              ₹{order.totalAmount}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-400">
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

          <div className="flex justify-between mt-4 text-sm">
            <span>
              Payment:{" "}
              <span className="text-white">
                {order.paymentStatus}
              </span>
            </span>
            <span>
              Status:{" "}
              <span className="text-white">
                {order.fulfillmentStatus}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
