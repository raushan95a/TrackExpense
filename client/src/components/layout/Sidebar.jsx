import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation.js';
import { ROUTES } from '../../constants/routes.js';
import Icon from '../common/Icon.jsx';
import Logo from '../common/Logo.jsx';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
  }`;

/** Fixed on desktop; slide-in drawer on mobile controlled by `isOpen`. */
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ label, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.HOME}
              className={linkClass}
              onClick={onClose}
            >
              <Icon name={icon} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
