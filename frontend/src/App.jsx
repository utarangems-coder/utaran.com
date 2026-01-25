import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Product/Products"));
const ProductDetails = lazy(() => import("./pages/Product/ProductDetails"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/User/Cart")); 

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
