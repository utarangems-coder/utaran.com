import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order.api";

const formatCurrency = (value) => {
  if (typeof value !== "number") value = Number(value) || 0;
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

// Status badge color mapping
const statusBadgeColor = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("deliver")) return "bg-green-500/10 text-green-400 border-green-500/30";
  if (s.includes("ship") || s.includes("dispatch")) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  if (s.includes("confirm") || s.includes("process")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
  return "bg-zinc-800 text-zinc-400 border-zinc-700";
};

// Payment badge color mapping
const paymentBadgeColor = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("paid")) return "bg-green-500/10 text-green-400 border-green-500/30";
  if (s.includes("partial") || s.includes("refund")) return "bg-orange-500/10 text-orange-400 border-orange-500/30";
  if (s.includes("pending")) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  return "bg-zinc-800 text-zinc-400 border-zinc-700";
};

// Refined Premium Pill
const StatusPill = ({ label, type = "default" }) => {
  const styles = {
    payment: "border border-zinc-800 text-zinc-500",
    success: "bg-white text-black font-medium",
    pending: "bg-zinc-900 text-zinc-400 border border-zinc-800",
  };

  return (
    <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] rounded-full ${styles[type] || styles.pending}`}>
      {label}
    </span>
  );
};

const OrderTimeline = ({ status }) => {
  const steps = [
    { key: "pending", label: "Ordered" },
    { key: "confirmed", label: "Processing" },
    { key: "shipped", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
  ];

  const normalize = (s = "") => {
    const t = String(s).toLowerCase();
    if (t.includes("pending")) return "pending";
    if (t.includes("confirm") || t.includes("process") || t.includes("pack")) return "confirmed";
    if (t.includes("ship") || t.includes("dispatch")) return "shipped";
    if (t.includes("deliver")) return "delivered";
    return "pending";
  };

  const currentKey = normalize(status);
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -translate-y-1/2" />
        
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              {/* Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-white ring-4 ring-white/10" : "bg-zinc-800"
                } ${isCurrent ? "scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""}`}
              />
              {/* Label */}
              <span className={`absolute -bottom-6 whitespace-nowrap text-[10px] uppercase tracking-widest transition-colors ${
                isCurrent ? "text-white font-bold" : "text-zinc-500"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
      <p className="text-zinc-500 uppercase tracking-widest text-xs">No orders found in your history</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="mb-12">
        <h1 className="text-3xl font-light tracking-tighter text-white uppercase">Order History</h1>
        <div className="h-px w-20 bg-white mt-4" />
      </header>

      {orders.map((order) => (
        <div 
          key={order._id} 
          className="group relative bg-[#080808] border border-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          {/* Top Bar: Order ID & Date */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-zinc-900 bg-zinc-900/20">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Reference</p>
                <p className="text-xs font-medium text-zinc-200">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Placed On</p>
                <p className="text-xs font-medium text-zinc-200">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] rounded-full border ${statusBadgeColor(order.fulfillmentStatus)}`}>
                {order.fulfillmentStatus}
              </span>
              <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] rounded-full border ${paymentBadgeColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Product List */}
            <div className="lg:col-span-6 space-y-6">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center gap-4 group/item">
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-zinc-200 truncate uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Middle: Timeline */}
            <div className="lg:col-span-4 flex flex-col justify-center px-4">
              <OrderTimeline status={order.fulfillmentStatus} />
            </div>

            {/* Right: Total */}
            <div className="lg:col-span-2 flex flex-col items-end justify-center border-l border-zinc-900 pl-8">
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1">Total Amount</p>
              <p className="text-2xl font-light text-white tracking-tighter">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}