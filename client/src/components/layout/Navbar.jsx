import { useAuth } from '../../hooks/useAuth.js';
import Icon from '../common/Icon.jsx';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-slate-600 sm:inline">{user?.name}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {initial}
        </span>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <Icon name="logout" className="size-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
