import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/profile', label: 'Profile' },
];

export const Sidebar = () => {
  return (
    <aside className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl backdrop-blur lg:h-[calc(100vh-3rem)] lg:max-w-xs">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white">Expense Tracker</h2>
        <p className="mt-2 text-sm text-slate-400">Secure financial control with real-time analytics.</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
