import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#141414] border border-[#2a2a2a] p-10">
        <h1 className="text-2xl font-light text-center tracking-wide text-white">
          Sign In
        </h1>

        <p className="text-sm text-gray-400 text-center mt-2">
          Continue to UTARAN
        </p>

        {error && (
          <p className="mt-6 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full px-4 py-3
              bg-[#0b0b0b]
              text-white
              border border-[#2a2a2a]
              placeholder-gray-500
              focus:border-white focus:outline-none
              transition
            "
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-4 py-3
              bg-[#0b0b0b]
              text-white
              border border-[#2a2a2a]
              placeholder-gray-500
              focus:border-white focus:outline-none
              transition
            "
            required
          />

          <button
            disabled={loading}
            className="
              w-full py-3 mt-2
              border border-white
              text-sm tracking-wide uppercase
              hover:bg-white hover:text-black
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-white underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
