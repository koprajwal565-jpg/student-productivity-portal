import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react';

const links = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'My tasks', icon: CheckSquare },
  { id: 'planner', label: 'Study planner', icon: CalendarDays },
  { id: 'analytics', label: 'Progress & analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate, open, onClose }) {
  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`app-sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Main navigation">
        <div className="brand-row">
          <div className="brand-mark"><BookOpenCheck size={20} /></div>
          <span className="brand-name">StudySpace</span>
          <button className="icon-button sidebar-close d-lg-none" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="nav flex-column gap-1">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`sidebar-link ${activePage === id ? 'active' : ''}`}
              aria-current={activePage === id ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon size={19} strokeWidth={1.9} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon"><BookOpenCheck size={17} /></div>
            <p className="mb-1 fw-semibold">Small steps, big progress.</p>
            <span>Plan a little study time each day.</span>
          </div>
          <div className="sidebar-local"><span className="status-dot" /> Data saved on this device</div>
        </div>
      </aside>
    </>
  );
}
