import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useState } from "react";
import UserOrders from "./UserOrders";

export default function UserDashboard() {
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8">
      <h1 className="text-2xl mb-6">My Dashboard</h1>

      {/* PROFILE */}
      <section className="bg-[#1c1c1c] p-6 rounded mb-8">
        <h2 className="text-lg mb-2">Profile</h2>
        <p className="text-gray-400">{user.name}</p>
        <p className="text-gray-400">{user.email}</p>
      </section>

      {/* ADDRESS */}
      <section className="bg-[#1c1c1c] p-6 rounded mb-8">
        <h2 className="text-lg mb-4">Delivery Address</h2>

        {["fullName", "phone", "line1", "city", "state", "postalCode"].map(
          (field) => (
            <input
              key={field}
              name={field}
              value={address[field] || ""}
              onChange={handleChange}
              placeholder={field}
              className="block w-full mb-3 p-2 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
            />
          )
        )}

        <button
          onClick={saveAddress}
          className="mt-3 px-6 py-2 border border-white hover:bg-white hover:text-black transition"
        >
          Save Address
        </button>

        {message && (
          <p className="mt-2 text-sm text-gray-400">{message}</p>
        )}
      </section>

      {/* ORDERS */}
      <section className="bg-[#1c1c1c] p-6 rounded mb-8">
        <h2 className="text-lg mb-4">My Orders</h2>
        <UserOrders />
      </section>

      <button
        onClick={logout}
        className="border border-red-500 px-6 py-2 text-red-500 hover:bg-red-500 hover:text-black transition"
      >
        Logout
      </button>
    </div>
  );
}
