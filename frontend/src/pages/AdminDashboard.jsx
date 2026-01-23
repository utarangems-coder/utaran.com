import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminProducts from "./Admin/AdminProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminRefunds from "./Admin/AdminRefunds";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState("orders");

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8">
      <h1 className="text-2xl mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8">
        {[
          ["orders", "Orders"],
          ["products", "Products"],
          ["refunds", "Refunds"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 border ${
              tab === key
                ? "bg-white text-black"
                : "border-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "orders" && <AdminOrders />}
      {tab === "products" && <AdminProducts />}
      {tab === "refunds" && <AdminRefunds />}

      <button
        onClick={logout}
        className="mt-10 border border-red-500 px-6 py-2 text-red-500 hover:bg-red-500 hover:text-black transition"
      >
        Logout
      </button>
    </div>
  );
}
