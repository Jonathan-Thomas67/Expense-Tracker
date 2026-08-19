export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-moss-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-moss-600 text-paper hover:bg-moss-700",
    ghost: "bg-transparent text-moss-900 border border-moss-200 hover:bg-moss-50",
    danger: "bg-transparent text-clay border border-clay/40 hover:bg-clay hover:text-paper",
  };
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-moss-900/70 mb-1">{label}</span>}
      <input
        className={`w-full px-3 py-2 rounded-lg border ${
          error ? "border-clay" : "border-moss-200"
        } bg-white text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 ${className}`}
        {...props}
      />
      {error && <span className="block text-xs text-clay mt-1">{error}</span>}
    </label>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-moss-900/70 mb-1">{label}</span>}
      <select
        className={`w-full px-3 py-2 rounded-lg border ${
          error ? "border-clay" : "border-moss-200"
        } bg-white text-sm focus:outline-none focus:ring-2 focus:ring-moss-300 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="block text-xs text-clay mt-1">{error}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <div className="bg-paper rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-moss-900">{title}</h3>
          <button onClick={onClose} className="text-moss-900/50 hover:text-moss-900 text-xl leading-none">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="text-center py-14 text-moss-900/50">
      <p className="font-display font-semibold text-moss-900/70">{title}</p>
      {hint && <p className="text-sm mt-1">{hint}</p>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-14">
      <div className="w-8 h-8 border-2 border-moss-200 border-t-moss-600 rounded-full animate-spin" />
    </div>
  );
}

export function Banner({ children, tone = "error" }) {
  const styles = tone === "error" ? "bg-clay/10 text-clay border-clay/30" : "bg-moss-50 text-moss-700 border-moss-200";
  return <div className={`px-4 py-2 rounded-lg border text-sm mb-4 ${styles}`}>{children}</div>;
}
