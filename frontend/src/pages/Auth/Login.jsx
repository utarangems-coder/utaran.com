import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#1c1c1c] p-8 rounded-lg"
      >
        <h2 className="text-xl mb-6 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 bg-[#0b0b0b] border border-[#2a2a2a] rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full py-3 border border-white hover:bg-white hover:text-black transition">
          Login
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-white underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
