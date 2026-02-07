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

const statusBadgeColor = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("deliver")) return "text-green-400 border-green-400/40 bg-green-400/5";
  if (s.includes("ship") || s.includes("dispatch")) return "text-amber-300 border-amber-300/40 bg-amber-300/5";
  if (s.includes("confirm") || s.includes("process")) return "text-white border-white/40 bg-white/5";
  return "text-white/40 border-white/10 bg-white/5";
};

const paymentBadgeColor = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("paid")) return "text-green-400 border-green-400/40 bg-green-400/5";
  if (s.includes("pending")) return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5";
  return "text-white/40 border-white/10";
};

const OrderTimeline = ({ status }) => {
  const steps = [
    { key: "pending", label: "Manifested" },
    { key: "confirmed", label: "Curating" },
    { key: "shipped", label: "Transit" },
    { key: "delivered", label: "Arrived" },
  ];

  const normalize = (s = "") => {
    const t = String(s).toLowerCase();
    if (t.includes("pending")) return "pending";
    if (t.includes("confirm") || t.includes("process")) return "confirmed";
    if (t.includes("ship")) return "shipped";
    if (t.includes("deliver")) return "delivered";
    return "pending";
  };

  const currentKey = normalize(status);
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="relative flex justify-between items-center px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
        
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-[1s] ease-out ${
                  isCompleted ? "bg-white ring-[4px] ring-white/5" : "bg-[#1a1a1a] border border-white/10"
                } ${isCurrent ? "scale-125 shadow-[0_0_20px_rgba(255,255,255,0.9)] ring-white/20" : ""}`}
              />
              <span className={`absolute -bottom-8 md:-bottom-10 whitespace-nowrap text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-black transition-all duration-700 ${
                isCurrent ? "text-white opacity-100 translate-y-0" : "text-white/30 hidden sm:block"
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
      console.error("Archive Access Denied");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-32 border border-white/5 bg-white/[0.01]">
      <p className="text-white/40 uppercase tracking-[0.6em] text-[10px]">Your archive is currently empty</p>
    </div>
  );

  return (
    <div className="space-y-16 md:space-y-24 pb-32">
      <header className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-[10px] tracking-[0.6em] uppercase text-white/50 mb-2 font-bold">Record History</h3>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-white">Order Archive</h1>
        </div>
        <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-medium">Entries: {orders.length}</span>
      </header>

      {orders.map((order) => (
        <div 
          key={order._id} 
          className="group bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all duration-[0.6s] ease-out hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center px-8 md:px-12 py-6 md:py-8 border-b border-white/10 bg-white/[0.02] gap-6 md:gap-8">
            <div className="flex flex-wrap gap-8 md:gap-16">
              <div>
                <p className="text-[9px] text-white/50 uppercase tracking-[0.6em] mb-1 font-bold">Entry Ref</p>
                <p className="text-[11px] font-black text-white tracking-[0.2em] uppercase">ARK-{order._id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/50 uppercase tracking-[0.6em] mb-1 font-bold">Authenticated</p>
                <p className="text-[11px] font-black text-white tracking-[0.2em] uppercase">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 flex-wrap">
              <span className={`px-4 py-1.5 md:px-6 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] border rounded-full transition-all duration-500 ${statusBadgeColor(order.fulfillmentStatus)}`}>
                {order.fulfillmentStatus}
              </span>
              <span className={`px-4 py-1.5 md:px-6 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] border rounded-full transition-all duration-500 ${paymentBadgeColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-center">
            
            {/* Items List - Scrollable if too long */}
            <div className="lg:col-span-5 space-y-6 lg:pr-12 lg:border-r border-white/10 max-h-[300px] overflow-y-auto no-scrollbar">
              {order.items.map((item) => (
                <div key={item.product} className="group/item">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-sm md:text-base font-bold text-white/90 uppercase tracking-tight group-hover/item:text-white transition-colors truncate pr-4">{item.title}</h4>
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium whitespace-nowrap">Qty {item.quantity}</span>
                  </div>
                  <div className="h-px w-full bg-white/5 group-hover/item:bg-white/20 transition-colors duration-500" />
                </div>
              ))}
            </div>

            {/* Timeline - Centered */}
            <div className="lg:col-span-4 px-2 md:px-4 w-full">
              <OrderTimeline status={order.fulfillmentStatus} />
            </div>

            {/* Total - Right Aligned */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end w-full border-t lg:border-t-0 border-white/10 pt-6 lg:pt-0">
              <p className="text-[9px] text-white/50 uppercase tracking-[0.6em] mb-0 lg:mb-3 font-black">Manifest Total</p>
              <p className="text-3xl md:text-4xl font-serif italic text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}