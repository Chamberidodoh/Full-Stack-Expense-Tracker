import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/profile', label: 'Profile' },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl backdrop-blur lg:flex lg:h-[calc(100vh-3rem)] lg:max-w-xs lg:flex-col lg:justify-between">
      <div className="flex-1">
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
      </div>

      <div className="mt-8 border-t border-slate-800 pt-6">
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full rounded-2xl border border-slate-700 bg-transparent px-4 py-3 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
