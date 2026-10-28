import { useState } from 'react';
import { AlertTriangle, Moon, Sun, Trash2, UserRound } from 'lucide-react';

export default function Settings({ settings, onSave, onClear }) {
  const [name, setName] = useState(settings.name);
  const [message, setMessage] = useState('');

  function save(event) {
    event.preventDefault();
    onSave({ ...settings, name: name.trim() });
    setMessage('Your profile preferences have been updated.');
    window.setTimeout(() => setMessage(''), 3500);
  }

  function clear() {
    if (window.confirm('Clear all tasks, study sessions, and settings saved by StudySpace on this device? This cannot be undone.')) {
      if (onClear()) {
        setName('');
        setMessage('Your saved data has been cleared.');
      } else {
        setMessage('The saved data could not be cleared. Check browser storage permissions.');
      }
    }
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><div className="eyebrow">MAKE IT YOURS</div><h1>Settings</h1><p>Manage your profile and saved data.</p></div>
      </div>
      <div className="settings-layout">
        <section className="surface-card settings-card">
          <div className="settings-section-heading"><div className="settings-icon"><UserRound size={19} /></div><div><h2>Profile</h2><p>Choose the name shown in your dashboard welcome.</p></div></div>
          <form onSubmit={save}>
            <label className="form-label" htmlFor="student-name">Display name</label>
            <input id="student-name" className="form-control settings-name-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Your name (optional)" />
            <div className="settings-hint">This name is stored only in this browser.</div>
            <div className="settings-section-heading theme-heading"><div className="settings-icon"><Sun size={19} /></div><div><h2>Appearance</h2><p>Select a comfortable reading theme.</p></div></div>
            <div className="theme-options">
              <label className={`theme-option ${settings.theme === 'light' ? 'theme-selected' : ''}`}><input type="radio" name="theme" value="light" checked={settings.theme === 'light'} onChange={() => onSave({ ...settings, theme: 'light' })} /><Sun size={18} /><span>Light</span></label>
              <label className={`theme-option ${settings.theme === 'dark' ? 'theme-selected' : ''}`}><input type="radio" name="theme" value="dark" checked={settings.theme === 'dark'} onChange={() => onSave({ ...settings, theme: 'dark' })} /><Moon size={18} /><span>Dark</span></label>
            </div>
            {message && <div className="success-message" role="status">{message}</div>}
            <button type="submit" className="btn btn-primary mt-4">Save profile</button>
          </form>
        </section>
        <section className="surface-card settings-card data-card">
          <div className="settings-section-heading"><div className="settings-icon warning-icon"><AlertTriangle size={19} /></div><div><h2>Local data</h2><p>Your tasks, sessions, and preferences are stored in this browser’s localStorage. They are not synced to a server.</p></div></div>
          <div className="data-notice"><span className="status-dot" /> Data stays on this device and browser.</div>
          <button className="btn btn-outline-danger mt-4" onClick={clear}><Trash2 size={16} /> Clear all saved data</button>
          <p className="clear-hint">This permanently removes StudySpace data saved in this browser.</p>
        </section>
      </div>
    </div>
  );
}
