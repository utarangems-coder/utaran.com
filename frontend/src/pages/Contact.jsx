import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState("");

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black antialiased py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-20">
        <header className="text-center space-y-6">
          <span className="text-[10px] tracking-[0.8em] uppercase text-white/40 font-bold block">
            Studio
          </span>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter text-white">
            The Studio
          </h1>
          <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent mx-auto" />
        </header>

        <section className="bg-white/[0.02] border border-white/10 p-10 md:p-14 space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white">Contact</h2>
          <p className="text-sm text-white/60 leading-relaxed font-light">
            Whether you have a query about an order, want to learn more about our handpicked collection, or just want to say hi, we're here. We personally read and respond to every message.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div className="bg-white/[0.01] border border-white/[0.05] p-8 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between min-h-[160px]">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-3 font-bold group-hover:text-white/60 transition-colors">
                  Email
                </p>
                <p className="text-xl md:text-2xl font-serif italic text-white group-hover:text-white/90 transition-colors break-all">
                  utarangems@gmail.com
                </p>
              </div>
              <div className="flex items-center gap-4 mt-6 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => handleCopy("utarangems@gmail.com", "email")}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
                >
                  {copied === "email" ? (
                    <span className="text-white font-bold animate-pulse">Copied!</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12a1.5 1.5 0 01.44 1.06V14.5a1.5 1.5 0 01-1.5 1.5h-5.414A1.5 1.5 0 018.5 14.5v-11z" />
                        <path d="M5 5.5A1.5 1.5 0 003.5 7v9.5A1.5 1.5 0 005 18h6.5a1.5 1.5 0 001.5-1.5V16h-6.5a2.5 2.5 0 01-2.5-2.5V5.5H5z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <span className="text-white/10 text-xs">|</span>
                <a
                  href="mailto:utarangems@gmail.com"
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                  Mail
                </a>
              </div>
            </div>

            <div className="bg-white/[0.01] border border-white/[0.05] p-8 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between min-h-[160px]">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-3 font-bold group-hover:text-white/60 transition-colors">
                  Instagram
                </p>
                <p className="text-xl md:text-2xl font-serif italic text-white group-hover:text-white/90 transition-colors">
                  utaran.in
                </p>
              </div>
              <div className="flex items-center gap-4 mt-6 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => handleCopy("utaran.in", "instagram")}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
                >
                  {copied === "instagram" ? (
                    <span className="text-white font-bold animate-pulse">Copied!</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12a1.5 1.5 0 01.44 1.06V14.5a1.5 1.5 0 01-1.5 1.5h-5.414A1.5 1.5 0 018.5 14.5v-11z" />
                        <path d="M5 5.5A1.5 1.5 0 003.5 7v9.5A1.5 1.5 0 005 18h6.5a1.5 1.5 0 001.5-1.5V16h-6.5a2.5 2.5 0 01-2.5-2.5V5.5H5z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <span className="text-white/10 text-xs">|</span>
                <a
                  href="https://instagram.com/utaran.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Visit
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-12">
          <p className="text-[13px] text-white/50 leading-relaxed max-w-2xl font-light">
            Please note that we are a two-person student-run team. While we try to respond as quickly as possible, it may take up to 24–48 hours for us to get back to you during busy periods. We appreciate your patience.
          </p>
        </section>
      </div>
    </main>
  );
}
