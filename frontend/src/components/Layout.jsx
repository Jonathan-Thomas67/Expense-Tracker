import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/expenses", label: "Expenses" },
  { to: "/income", label: "Income" },
  { to: "/categories", label: "Categories" },
  { to: "/budgets", label: "Budgets" },
  { to: "/reports", label: "Reports" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-moss-100 bg-paper/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-moss-600 text-paper flex items-center justify-center font-display font-bold text-sm">
              ₹
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-moss-900">Ledger</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-moss-600 text-paper"
                      : "text-moss-900/70 hover:bg-moss-50 hover:text-moss-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <NavLink
              to="/profile"
              className="hidden sm:block text-sm font-medium text-moss-900/80 hover:text-moss-900"
            >
              {user?.name || "Profile"}
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-full border border-clay/40 text-clay hover:bg-clay hover:text-paper transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-3 -mt-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  isActive ? "bg-moss-600 text-paper" : "bg-moss-50 text-moss-900/70"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">{children}</main>

      <footer className="text-center text-xs text-moss-900/40 py-6">
        Expense Tracker — built with React &amp; Django REST Framework
      </footer>
    </div>
  );
}
