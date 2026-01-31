import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import UserOrders from "./UserOrders";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "address", label: "Address" },
  { key: "orders", label: "Orders" },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("profile");
  const [address, setAddress] = useState(user.address || {});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    try {
      await api.put("/users/me/address", address);
      setMessage("Update successful");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error updating records");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      {/* SIDEBAR - Fixed Width */}
      <aside className="w-64 border-r border-zinc-800 p-8 flex flex-col fixed h-full bg-[#080808]">
        <h1 className="text-xs tracking-[0.4em] uppercase mb-12 text-white font-medium">
          Account
        </h1>

        <nav className="flex flex-col gap-2 flex-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-left px-5 py-3 text-[11px] tracking-[0.2em] uppercase transition-all
                ${
                  tab === key
                    ? "bg-white text-black font-bold"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 hover:text-red-400 transition-colors pt-8 border-t border-zinc-900"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT AREA - Now set to Medium (max-w-3xl) */}
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-3xl mx-auto"> {/* Changed from 5xl to 3xl for Medium size */}
          
          {/* PROFILE SECTION */}
          {tab === "profile" && (
            <section className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-md shadow-lg">
              <h2 className="text-lg font-medium mb-8 tracking-tight border-b border-zinc-800 pb-4">Profile</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Name</span>
                  <span className="text-base text-zinc-200">{user.name}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Email</span>
                  <span className="text-base text-zinc-200">{user.email}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Phone</span>
                  <span className="text-base text-zinc-200">{address.phone || user.address?.phone || "—"}</span>
                </div>
              </div>
            </section>
          )}

          {/* ADDRESS SECTION */}
          {tab === "address" && (
            <section className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-md shadow-lg">
              <h2 className="text-lg font-medium mb-8 tracking-tight border-b border-zinc-800 pb-4">Shipping Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Full Name</label>
                  <input
                    name="fullName"
                    value={address.fullName || ""}
                    onChange={handleChange}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm text-sm text-white focus:border-zinc-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Phone</label>
                  <input
                    name="phone"
                    value={address.phone || ""}
                    onChange={handleChange}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm text-sm text-white focus:border-zinc-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Address Line 1</label>
                  <input
                    name="line1"
                    value={address.line1 || ""}
                    onChange={handleChange}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm text-sm text-white focus:border-zinc-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Address Line 2</label>
                  <input
                    name="line2"
                    value={address.line2 || ""}
                    onChange={handleChange}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm text-sm text-white focus:border-zinc-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">City</label>
                  <input
                    name="city"
                    value={address.city || ""}
                    onChange={handleChange}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm text-sm text-white focus:border-zinc-500 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500">Postal Code</label>
                  <input
                    name="postalCode"
                    value={address.postalCode || ""}
                    onChange={handleChange}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm text-sm text-white focus:border-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <button
                  onClick={saveAddress}
                  className="bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 hover:bg-zinc-200 transition-all active:scale-95"
                >
                  Save
                </button>
                {message && (
                  <p className="text-[10px] text-zinc-400 tracking-widest uppercase">{message}</p>
                )}
              </div>
            </section>
          )}

          {/* ORDERS SECTION - Can stay slightly wider if needed, but 3xl fits well */}
          {tab === "orders" && (
            <div className="max-w-4xl space-y-8">
              {/* Refund Policy Note */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <p className="text-sm text-blue-300 leading-relaxed tracking-wide">
                  <span className="font-semibold text-base">ℹ️ Important Note:</span> Refunds can only be requested and processed before your order is shipped. If your order hasn't shipped yet and you wish to request a refund, please contact our admin support team immediately.
                </p>
              </div>
              <UserOrders />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}