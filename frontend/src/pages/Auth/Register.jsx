import { useState } from "react";
import { registerUser } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const inputClass =
  "w-full mb-3 p-3 bg-[#0b0b0b] border border-[#2a2a2a] rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      fullName: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        address: { ...form.address, [key]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#1c1c1c] p-8 rounded-lg"
      >
        <h2 className="text-xl mb-6 text-center">Create Account</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input name="name" className={inputClass} placeholder="Name" onChange={handleChange} required />
        <input name="email" className={inputClass} placeholder="Email" onChange={handleChange} required />
        <input
          type="password"
          name="password"
          className={inputClass}
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <h3 className="mt-6 mb-2 text-sm text-gray-400">
          Address (optional)
        </h3>

        <input className={inputClass} name="address.fullName" placeholder="Full Name" onChange={handleChange} />
        <input className={inputClass} name="address.phone" placeholder="Phone" onChange={handleChange} />
        <input className={inputClass} name="address.line1" placeholder="Address Line" onChange={handleChange} />
        <input className={inputClass} name="address.city" placeholder="City" onChange={handleChange} />
        <input className={inputClass} name="address.state" placeholder="State" onChange={handleChange} />
        <input className={inputClass} name="address.postalCode" placeholder="Postal Code" onChange={handleChange} />

        <button className="w-full mt-6 py-3 border border-white hover:bg-white hover:text-black transition">
          Register
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
