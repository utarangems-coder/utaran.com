import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./user/UserDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return nul
  
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}
