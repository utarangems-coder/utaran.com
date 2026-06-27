import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-80 max-w-[calc(100vw-3rem)]">
        <style>{`
          @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .toast-item {
            animation: toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-item pointer-events-auto w-full bg-[#0b0b0c] border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group overflow-hidden flex flex-col gap-1 transition-all duration-300 hover:border-white/20"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/10 via-white/30 to-white/10" />
            
            <div className="flex justify-between items-start">
              <span className="text-[8px] tracking-[0.4em] uppercase text-white/40 font-black">
                {toast.type === "success" ? "Protocol Success" : toast.type === "error" ? "Protocol Alert" : "System Notification"}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[10px] text-white/25 hover:text-white transition-colors duration-200 leading-none focus:outline-none"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-white/90 font-serif italic tracking-wide leading-relaxed pr-4">
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
