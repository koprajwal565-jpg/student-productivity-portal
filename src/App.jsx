import { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Modal from './components/Modal.jsx';
import TaskForm from './components/TaskForm.jsx';
import SessionForm from './components/SessionForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Planner from './pages/Planner.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import { clearPortalData, loadPortalData, saveStoredValue, STORAGE_KEYS } from './utils/storage.js';
import { formatDate } from './utils/date.js';

const pageTitles = {
  dashboard: 'Dashboard',
  tasks: 'My tasks',
  planner: 'Study planner',
  analytics: 'Progress & analytics',
  settings: 'Settings',
};

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [initialData] = useState(loadPortalData);
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState('');
  const [hasCorruptData, setHasCorruptData] = useState(initialData.hadCorruptData);

  useEffect(() => {
    try {
      saveStoredValue(STORAGE_KEYS.tasks, data.tasks);
      saveStoredValue(STORAGE_KEYS.sessions, data.sessions);
      saveStoredValue(STORAGE_KEYS.settings, data.settings);
      setStorageError('');
    } catch {
      setStorageError('Your changes could not be saved to this browser. Check available storage and browser privacy settings.');
    }
  }, [data]);

  useEffect(() => {
    document.documentElement.dataset.theme = data.settings.theme;
  }, [data.settings.theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileNavOpen(false);
  }

  function saveTask(values) {
    const editing = modal?.type === 'task' && modal.task;
    const task = { ...values, id: editing ? modal.task.id : createId(), createdAt: editing ? modal.task.createdAt : new Date().toISOString() };
    setData((current) => ({
      ...current,
      tasks: editing ? current.tasks.map((item) => item.id === task.id ? task : item) : [task, ...current.tasks],
    }));
    setModal(null);
    setToast(editing ? 'Task updated.' : 'Task added.');
  }

  function saveSession(values) {
    const editing = modal?.type === 'session' && modal.session;
    const session = {
      ...values,
      id: editing ? modal.session.id : createId(),
      completed: editing ? modal.session.completed : false,
    };
    setData((current) => ({
      ...current,
      sessions: editing ? current.sessions.map((item) => item.id === session.id ? session : item) : [...current.sessions, session],
    }));
    setModal(null);
    setToast(editing ? 'Study session updated.' : 'Study session added.');
  }

  function updateSettings(settings) {
    setData((current) => ({ ...current, settings }));
  }

  function clearData() {
    try {
      clearPortalData();
      setData({ tasks: [], sessions: [], settings: { name: '', theme: 'light' } });
      setHasCorruptData(false);
      setStorageError('');
      setToast('All saved data has been cleared.');
    } catch {
      setStorageError('Saved data could not be cleared. Check your browser storage permissions and try again.');
      return false;
    }
    return true;
  }

  const content = {
    dashboard: <Dashboard
      tasks={data.tasks}
      sessions={data.sessions}
      name={data.settings.name}
      onAddTask={() => setModal({ type: 'task' })}
      onNavigate={navigate}
    />,
    tasks: <Tasks
      tasks={data.tasks}
      onAdd={() => setModal({ type: 'task' })}
      onEdit={(task) => setModal({ type: 'task', task })}
      onDelete={(id) => {
        setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }));
        setToast('Task deleted.');
      }}
      onToggle={(id) => setData((current) => ({
        ...current,
        tasks: current.tasks.map((task) => task.id === id
          ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
          : task),
      }))}
    />,
    planner: <Planner
      sessions={data.sessions}
      onAdd={() => setModal({ type: 'session' })}
      onEdit={(session) => setModal({ type: 'session', session })}
      onToggle={(id) => setData((current) => ({
        ...current,
        sessions: current.sessions.map((session) => session.id === id ? { ...session, completed: !session.completed } : session),
      }))}
    />,
    analytics: <Analytics tasks={data.tasks} sessions={data.sessions} />,
    settings: <Settings settings={data.settings} onSave={updateSettings} onClear={clearData} />,
  }[page];

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={navigate} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="topbar-page">{pageTitles[page]}</div>
          <div className="topbar-right">
            <span className="topbar-date">{formatDate(new Date().toISOString().slice(0, 10), { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span className="topbar-divider" />
            <span className="profile-avatar" aria-hidden="true">{data.settings.name.trim() ? data.settings.name.trim().charAt(0).toUpperCase() : 'S'}</span>
          </div>
        </header>
        <main className="page-container">
          {hasCorruptData && <div className="notice-banner" role="status">Some saved data was invalid and has been safely reset. Valid data in other sections is unchanged.<button onClick={() => setHasCorruptData(false)} aria-label="Dismiss notice">×</button></div>}
          {storageError && <div className="error-banner" role="alert">{storageError}</div>}
          {content}
        </main>
      </div>
      {toast && <div className="toast-message" role="status"><Bell size={16} />{toast}</div>}
      {modal?.type === 'task' && <Modal title={modal.task ? 'Edit task' : 'Add a task'} onClose={() => setModal(null)}><TaskForm task={modal.task} onSave={saveTask} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === 'session' && <Modal title={modal.session ? 'Edit study session' : 'Plan a study session'} onClose={() => setModal(null)}><SessionForm session={modal.session} onSave={saveSession} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}
