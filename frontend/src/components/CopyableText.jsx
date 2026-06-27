import { useState } from "react";

export default function CopyableText({ text, label, isEmail = false, isInstagram = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const href = isEmail
    ? `mailto:${text}`
    : isInstagram
    ? `https://instagram.com/${text}`
    : undefined;

  return (
    <span className="inline-flex items-center gap-1.5 group/copy relative font-sans">
      {href ? (
        <a
          href={href}
          target={isInstagram ? "_blank" : undefined}
          rel={isInstagram ? "noopener noreferrer" : undefined}
          className="text-white hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white font-medium"
        >
          {text}
        </a>
      ) : (
        <span className="text-white font-medium">{text}</span>
      )}
      <button
        onClick={handleCopy}
        type="button"
        className="inline-flex items-center justify-center p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 focus:outline-none"
        title={`Copy ${label || "text"}`}
      >
        {copied ? (
          <span className="text-[10px] uppercase tracking-wider text-white/80 font-bold px-1 animate-pulse">
            Copied!
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/copy:scale-110"
          >
            <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12a1.5 1.5 0 0 1 .44 1.06V14.5a1.5 1.5 0 0 1-1.5 1.5h-5.414A1.5 1.5 0 0 1 8.5 14.5v-11z" />
            <path d="M5 5.5A1.5 1.5 0 0 0 3.5 7v9.5A1.5 1.5 0 0 0 5 18h6.5a1.5 1.5 0 0 0 1.5-1.5V16h-6.5a2.5 2.5 0 0 1-2.5-2.5V5.5H5z" />
          </svg>
        )}
      </button>
    </span>
  );
}
