import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  getPaymentLogsByOrder,
  initiateRefund,
} from "../../api/admin.payment.api";

export default function AdminRefunds() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [logs, setLogs] = useState([]);
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await api.get("/admin/orders");
    setOrders(res.data.data);
  };

  const loadLogs = async (orderId) => {
    const data = await getPaymentLogsByOrder(orderId);
    setLogs(data);
  };

  const openOrder = async (order) => {
    setExpanded(order._id);
    setLogs([]);
    await loadLogs(order._id);
  };

  const refund = async (order) => {
    try {
      // const payment = order.payment;
      // if (!payment) {
      //   alert("Payment not found");
      //   return;
      // }
      alert("Refunds require payment integration to be active.");
      return;

      await initiateRefund({
        paymentId: payment._id,
        amount: Number(refundAmount),
      });

      alert("Refund initiated");
      setRefundAmount("");
      loadLogs(order._id);
    } catch (err) {
      alert(err.response?.data?.message || "Refund failed");
    }
  };

  return (
    <div className="bg-[#1c1c1c] p-6 rounded">
      <h2 className="text-lg mb-6">Refunds & Payments</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-[#2a2a2a] p-4 rounded mb-4"
        >
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {order.user?.email} • ₹{order.totalAmount}
            </p>

            <button
              onClick={() => openOrder(order)}
              className="border px-3 py-1 text-sm"
            >
              View
            </button>
          </div>

          {expanded === order._id && (
            <div className="mt-4 space-y-4">
              {/* PAYMENT LOGS */}
              <div>
                <h3 className="text-sm mb-2">Payment Logs</h3>

                {logs.length === 0 && (
                  <p className="text-gray-400 text-sm">No logs found</p>
                )}

                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="text-xs text-gray-400 border-b border-[#2a2a2a] py-2"
                  >
                    <p>{log.eventType}</p>
                    <p>
                      Amount: ₹{log.amount || "-"} •{" "}
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* REFUND */}
              {order.paymentStatus === "PAID" ||
              order.paymentStatus === "PARTIALLY_REFUNDED" ? (
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    placeholder="Refund amount"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] text-sm"
                  />

                  <button
                    onClick={() => refund(order)}
                    className="border border-red-500 text-red-500 px-3 py-1 text-sm"
                  >
                    Refund
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Refund not available</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
