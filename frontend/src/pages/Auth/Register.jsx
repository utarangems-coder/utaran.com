import { useState } from "react";
import { registerUser } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

const inputClass = `
  w-full p-3 bg-[#0b0b0b]
  border border-[#2a2a2a]
  text-white placeholder-gray-500
  focus:outline-none focus:border-white
  transition
`;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-[#1c1c1c] p-10 border border-[#2a2a2a]">
        <h1 className="text-2xl text-white tracking-wide text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-sm text-center mt-2">
          Join UTARAN for a refined shopping experience
        </p>

        {error && (
          <p className="mt-6 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* BASIC INFO */}
          <input
            name="name"
            placeholder="Full name"
            className={inputClass}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email address"
            className={inputClass}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={inputClass}
            onChange={handleChange}
            required
          />

          {/* ADDRESS */}
          <div className="pt-6 border-t border-[#2a2a2a]">
            <p className="text-sm text-gray-400 mb-4">
              Delivery Address <span className="opacity-60">(optional)</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className={inputClass}
                name="address.fullName"
                placeholder="Recipient name"
                onChange={handleChange}
              />

              <input
                className={inputClass}
                name="address.phone"
                placeholder="Phone"
                onChange={handleChange}
              />

              <input
                className={`${inputClass} sm:col-span-2`}
                name="address.line1"
                placeholder="Address line"
                onChange={handleChange}
              />

              <input
                className={inputClass}
                name="address.city"
                placeholder="City"
                onChange={handleChange}
              />

              <input
                className={inputClass}
                name="address.state"
                placeholder="State"
                onChange={handleChange}
              />

              <input
                className={inputClass}
                name="address.postalCode"
                placeholder="Postal code"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="
              w-full mt-6 py-3
              border border-white
              text-sm tracking-wide uppercase
              hover:bg-white hover:text-black
              transition disabled:opacity-50
            "
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
