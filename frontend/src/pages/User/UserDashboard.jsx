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
      setMessage("Address updated successfully");
    } catch {
      setMessage("Failed to update address");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[#1f1f1f] p-6 flex flex-col">
        <h1 className="text-lg tracking-widest uppercase mb-10">
          My Account
        </h1>

        <nav className="flex flex-col gap-2 flex-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-left px-4 py-2 text-sm tracking-wide transition
                ${
                  tab === key
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-[#1c1c1c]"
                }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mt-10 text-sm tracking-wide text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          {/* PROFILE */}
          {tab === "profile" && (
            <section className="bg-[#1c1c1c] p-6 rounded max-w-3xl">
              <h2 className="text-lg mb-4">Profile</h2>

              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  <span className="text-white">Name:</span> {user.name}
                </p>
                <p>
                  <span className="text-white">Email:</span> {user.email}
                </p>
              </div>
            </section>
          )}

          {/* ADDRESS */}
          {tab === "address" && (
            <section className="bg-[#1c1c1c] p-6 rounded max-w-4xl">
              <h2 className="text-lg mb-6">Delivery Address</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={address.fullName || ""}
                  onChange={handleChange}
                  className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phone || ""}
                  onChange={handleChange}
                  className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
                />

                <input
                  name="line1"
                  placeholder="Street Address"
                  value={address.line1 || ""}
                  onChange={handleChange}
                  className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded sm:col-span-2"
                />

                <input
                  name="city"
                  placeholder="City"
                  value={address.city || ""}
                  onChange={handleChange}
                  className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
                />

                <input
                  name="state"
                  placeholder="State"
                  value={address.state || ""}
                  onChange={handleChange}
                  className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
                />

                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={address.postalCode || ""}
                  onChange={handleChange}
                  className="p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
                />
              </div>

              <button
                onClick={saveAddress}
                className="mt-6 px-6 py-2 border border-white hover:bg-white hover:text-black transition"
              >
                Save Address
              </button>

              {message && (
                <p className="mt-3 text-sm text-gray-400">{message}</p>
              )}
            </section>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <section className="bg-[#1c1c1c] p-6 rounded max-w-5xl">
              <h2 className="text-lg mb-6">Order History</h2>
              <UserOrders />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
