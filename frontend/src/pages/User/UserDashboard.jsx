import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import UserOrders from "./UserOrders";

const TABS = [
  { key: "profile", label: "Profile Identity" },
  { key: "address", label: "Shipping Ledger" },
  { key: "orders", label: "Order Archive" },
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
      setMessage("Records Synchronized");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error Updating Ledger");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 p-8 md:p-10 flex flex-col bg-[#080808] relative z-20">
        <div className="mb-10 md:mb-20">
          <h1 className="text-[9px] tracking-[0.6em] uppercase text-white/50 mb-2 font-bold">Workspace</h1>
          <p className="font-serif italic text-3xl tracking-tighter text-white">Console</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-left px-4 py-3 md:px-6 md:py-5 text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase transition-all duration-500 whitespace-nowrap border-b-2 md:border-b-0 md:border-l-2 ${
                tab === key 
                  ? "border-white text-white bg-white/[0.03]" 
                  : "border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="hidden md:flex text-[9px] tracking-[0.5em] uppercase text-white/30 hover:text-red-500 transition-all duration-500 pt-8 border-t border-white/10 items-center justify-between group mt-auto"
        >
          <span>Terminate Session</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 md:p-16 bg-[#050505] overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          
          {/* PROFILE SECTION */}
          {tab === "profile" && (
            <section className="space-y-16 animate-fade-in">
              <header className="border-b border-white/20 pb-8">
                <h2 className="text-3xl md:text-4xl font-serif italic tracking-tight text-white">Identity Details</h2>
              </header>
              
              <div className="grid gap-12">
                {[
                  { label: "Client Name", value: user.name },
                  { label: "Authorized Email", value: user.email },
                  { label: "Registered Phone", value: address.phone || user.address?.phone || "Registry Empty" }
                ].map((item) => (
                  <div key={item.label} className="group border-b border-white/10 pb-6 hover:border-white/40 transition-colors duration-500">
                    <span className="text-[9px] uppercase tracking-[0.6em] text-white/50 block mb-3 font-bold">{item.label}</span>
                    <span className="text-xl text-white/90 font-light tracking-wide">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ADDRESS SECTION */}
          {tab === "address" && (
            <section className="space-y-16 animate-fade-in">
               <header className="border-b border-white/20 pb-8">
                <h2 className="text-3xl md:text-4xl font-serif italic tracking-tight text-white">Shipping Ledger</h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { label: "Full Name", name: "fullName" },
                  { label: "Contact Phone", name: "phone" },
                  { label: "Address Line 1", name: "line1", span: true },
                  { label: "Address Line 2", name: "line2", span: true },
                  { label: "City / District", name: "city" },
                  { label: "Postal Code", name: "postalCode" }
                ].map((field) => (
                  <div key={field.name} className={`flex flex-col gap-4 ${field.span ? 'md:col-span-2' : ''}`}>
                    <label className="text-[9px] uppercase tracking-[0.5em] text-white/50 font-bold">{field.label}</label>
                    <input
                      name={field.name}
                      value={address[field.name] || ""}
                      onChange={handleChange}
                      className="bg-transparent border-b border-white/10 py-3 text-base text-white focus:border-white outline-none transition-all duration-500 placeholder:text-white/10 hover:border-white/30 font-light tracking-wide w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-20 flex items-center gap-12">
                <button
                  onClick={saveAddress}
                  className="bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] px-16 py-5 hover:bg-gray-200 transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                >
                  Save Entry
                </button>
                {message && (
                  <p className="text-[9px] text-white font-bold tracking-[0.3em] uppercase italic animate-pulse border-b border-white/60 pb-1">{message}</p>
                )}
              </div>
            </section>
          )}

          {/* ORDERS SECTION */}
          {tab === "orders" && (
            <div className="space-y-16 animate-fade-in">
              {/* REFUND ALERT */}
              <div className="bg-[#0a0a0a] border-l-4 border-white p-8 md:p-10 relative overflow-hidden group shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-baseline gap-6 relative z-10">
                  <span className="flex-shrink-0 text-[9px] tracking-[0.5em] uppercase text-white font-black px-3 py-1 border border-white/30">
                    Protocol 07
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-serif italic text-white">Refund Policy Notice</h3>
                    <p className="text-xs md:text-[13px] text-white/70 leading-relaxed tracking-wide font-light max-w-2xl">
                      Refunds are processed for manifests <span className="text-white font-bold border-b border-white/40">prior to dispatch only</span>. Once the archive item enters transit, the manifest is locked. 
                      <br className="hidden md:block" />
                      For urgent signals, contact <span className="text-white font-bold cursor-pointer hover:text-white/80 transition-colors">Utaran Support</span> immediately.
                    </p>
                  </div>
                </div>
              </div>

              <UserOrders />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}